import { useState, useCallback, useEffect } from 'react';
import { DanismanMesaji, LezzetDanismaniAyarlari } from './LezzetDanismaniTipleri';
import { useSesliAsistan } from './SesliAsistanKancasi';
import { dinamikEsnafCevabiUret } from './DinamikEsnafMantigi';
import { suAnkiZamanDilimi } from '@/src/MalzemeCekmeceleri';
import { useYemekler } from '@/src/MalzemeCekmeceleri/YemekCekmecesi';

export function useLezzetDanismani(ayarlar: LezzetDanismaniAyarlari) {
  const [pencereAcik, setPencereAcik] = useState<boolean>(false);
  const [cevapBekleniyor, setCevapBekleniyor] = useState<boolean>(false);
  const sesliAsistan = useSesliAsistan();
  const { yemekler } = useYemekler();

  const zaman = suAnkiZamanDilimi();
  const baslangicKarsilama = `${zaman.karsilama}`;

  const [mesajlar, setMesajlar] = useState<DanismanMesaji[]>([
    {
      id: 'ilk-karsilama',
      rol: 'asistan',
      icerik: 'Hoş geldiniz, size nasıl yardımcı olabilirim?',
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Yemekler veya zaman güncellendiğinde ilk karşılama içeriğini zenginleştir
  useEffect(() => {
    if (yemekler && yemekler.length > 0) {
      const dinamikBaslangic = dinamikEsnafCevabiUret('', yemekler);
      setMesajlar((onceki) => {
        if (onceki.length === 1 && onceki[0].id === 'ilk-karsilama') {
          return [
            {
              id: 'ilk-karsilama',
              rol: 'asistan',
              icerik: dinamikBaslangic.cevapMetni,
              zaman: onceki[0].zaman,
              onerilenYemekler: dinamikBaslangic.onerilenYemekler,
              hizliSecenekler: dinamikBaslangic.hizliSecenekler,
            },
          ];
        }
        return onceki;
      });
    }
  }, [yemekler]);

  const pencereyiAc = useCallback(() => setPencereAcik(true), []);
  const pencereyiKapat = useCallback(() => {
    sesliAsistan.sesiDurdur();
    sesliAsistan.mikrofonuDurdur();
    setPencereAcik(false);
  }, [sesliAsistan]);

  const pencereDurumuDegistir = useCallback(() => {
    setPencereAcik((onceki) => {
      if (onceki) {
        sesliAsistan.sesiDurdur();
        sesliAsistan.mikrofonuDurdur();
      }
      return !onceki;
    });
  }, [sesliAsistan]);

  const mesajGonder = async (metin: string) => {
    const temizMetin = metin.trim();
    if (!temizMetin || cevapBekleniyor) return;

    sesliAsistan.sesiDurdur();
    const simdi = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const yeniKullaniciMesaji: DanismanMesaji = {
      id: `kullanici-${Date.now()}`,
      rol: 'kullanici',
      icerik: temizMetin,
      zaman: simdi,
    };

    setMesajlar((onceki) => [...onceki, yeniKullaniciMesaji]);
    setCevapBekleniyor(true);

    try {
      let asistanCevabi = '';

      // Sunucu yapay zekasına mevcut yemekleri de göndererek zenginleştir
      const kontrolcu = new AbortController();
      const zamanAsimi = setTimeout(() => kontrolcu.abort(), 3500);

      try {
        const ozetYemekler = yemekler.slice(0, 15).map((y) => ({
          baslik: y.baslik,
          kategori: y.kategori,
          fiyat: y.fiyat,
          kalan_stok: y.kalan_stok,
        }));

        const sunucuYaniti = await fetch('/api/lezzet-danismani', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mesaj: temizMetin,
            gecmis: mesajlar.map((m) => ({ rol: m.rol, icerik: m.icerik })),
            mevcutYemekler: ozetYemekler,
          }),
          signal: kontrolcu.signal,
        });

        clearTimeout(zamanAsimi);
        if (sunucuYaniti.ok) {
          const veri = await sunucuYaniti.json();
          if (veri?.cevap) {
            asistanCevabi = veri.cevap.trim();
          }
        }
      } catch (istekHatasi) {
        clearTimeout(zamanAsimi);
      }

      const yeniAsistanMesaji: DanismanMesaji = {
        id: `asistan-${Date.now()}`,
        rol: 'asistan',
        icerik: asistanCevabi || 'Değerli Misafirimiz, şu an size yardımcı olamıyorum, lütfen tekrar deneyin.',
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        onerilenYemekler: [], 
        hizliSecenekler: [],
      };

      setMesajlar((onceki) => [...onceki, yeniAsistanMesaji]);
      sesliAsistan.metniSeslendir(yeniAsistanMesaji.icerik);
    } catch (hata) {
      setMesajlar((onceki) => [
        ...onceki,
        {
          id: `asistan-${Date.now()}`,
          rol: 'asistan',
          icerik: 'Değerli Misafirimiz, sistemde bir aksaklık oluştu, lütfen tekrar deneyin.',
          zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setCevapBekleniyor(false);
    }
  };

  const sohbetiSifirla = useCallback(() => {
    sesliAsistan.sesiDurdur();
    const dinamik = dinamikEsnafCevabiUret('', yemekler);
    setMesajlar([
      {
        id: `sifirlandi-${Date.now()}`,
        rol: 'asistan',
        icerik: dinamik.cevapMetni,
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        onerilenYemekler: dinamik.onerilenYemekler,
        hizliSecenekler: dinamik.hizliSecenekler,
      },
    ]);
  }, [yemekler, sesliAsistan]);

  return {
    pencereAcik,
    cevapBekleniyor,
    mesajlar,
    sesliAsistan,
    pencereyiAc,
    pencereyiKapat,
    pencereDurumuDegistir,
    mesajGonder,
    sohbetiSifirla,
  };
}
