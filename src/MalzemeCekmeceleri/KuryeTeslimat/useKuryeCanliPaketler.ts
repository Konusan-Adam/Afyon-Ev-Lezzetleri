import { useState, useEffect, useCallback } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { yerelSiparisleriGetir } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { kuryePaketiUzerineAl, kuryePaketiTeslimAldi, kuryePinDogrulaVeTeslimEt, kuryeZamanAsimiKontrolEt } from './KuryePinServisi';

export const useKuryeCanliPaketler = (kuryeId: string, kuryeAdi: string) => {
  const [paketler, setPaketler] = useState<any[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  const yenile = useCallback(async () => {
    // ⏱️ Önce 5 dakika kuralı zaman aşımı kontrolünü çalıştır
    await kuryeZamanAsimiKontrolEt();

    const harita = new Map<string, any>();

    // 1. Önce yerel hafızadaki siparişleri yükle
    const yerelListe = yerelSiparisleriGetir();
    yerelListe.forEach((s) => {
      const kod = s.siparis_kodu || s.siparisKodu || s.id;
      if (kod) harita.set(kod, s);
    });

    // 2. Canlı Firebase aktifse verileri üstüne merge et
    if (canliFirebaseAktifMi()) {
      try {
        const tum = await koleksiyonGetir<any>('siparisler');
        if (tum && Array.isArray(tum)) {
          tum.forEach((fbSip) => {
            const kod = fbSip.siparis_kodu || fbSip.siparisKodu || fbSip.id;
            if (kod) {
              const onceki = harita.get(kod) || {};
              harita.set(kod, { ...onceki, ...fbSip });
            }
          });
        }
      } catch (err) {
        console.warn('Kurye paketleri çekilirken hata:', err);
      }
    }

    setPaketler(Array.from(harita.values()));
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    yenile();

    // Periyodik olarak 5 dakika kuralı kontrolü (her 30 saniyede bir)
    const zamanAsimiInterval = setInterval(() => {
      kuryeZamanAsimiKontrolEt().then(() => yenile());
    }, 30000);

    let abonelikBitir = () => {};
    if (canliFirebaseAktifMi()) {
      abonelikBitir = koleksiyonuCanliDinle<any>('siparisler', () => {
        yenile();
      });
    }

    const durumDinle = () => {
      yenile();
    };

    window.addEventListener('afyon_siparis_durum_degisti', durumDinle);
    window.addEventListener('afyon_siparis_eklendi', durumDinle);

    return () => {
      clearInterval(zamanAsimiInterval);
      abonelikBitir();
      window.removeEventListener('afyon_siparis_durum_degisti', durumDinle);
      window.removeEventListener('afyon_siparis_eklendi', durumDinle);
    };
  }, [yenile]);

  const paketiAl = async (siparisId: string) => {
    const sonuc = await kuryePaketiUzerineAl(siparisId, kuryeId, kuryeAdi);
    await yenile();
    return sonuc;
  };

  const paketiTeslimAldiBildir = async (siparisId: string) => {
    const sonuc = await kuryePaketiTeslimAldi(siparisId, kuryeId);
    await yenile();
    return sonuc;
  };

  const teslimEt = async (siparisKodu: string, pin: string) => {
    const sonuc = await kuryePinDogrulaVeTeslimEt(siparisKodu, pin);
    await yenile();
    return sonuc;
  };

  // 1. Mutfakta paketlenmiş VEYA kuryenin üzerine aldığı aktif paketler
  const aktifPaketler = paketler.filter((p) => {
    const durum = (p.durum || '').toLowerCase();
    const asama = (p.asama || '').toLowerCase();

    const hazirMi = 
      durum === 'paketlendi' || 
      durum === 'yolda' || 
      asama === 'paketlendi' || 
      asama === 'kurye_geliyor' || 
      asama === 'kuryede';

    const tamamlandiMi = 
      durum === 'teslim_edildi' || 
      durum === 'iptal' || 
      asama === 'teslim_edildi';
    
    if (!hazirMi || tamamlandiMi) return false;
    
    const sahipsiz = !p.kurye_id || p.kurye_id === '';
    const benimUzerimde = p.kurye_id === kuryeId;
    return sahipsiz || benimUzerimde;
  });

  // 2. SADECE bu kuryenin teslim ettiği paketler
  const teslimEdilenler = paketler.filter((p) => {
    const tamamlandi = p.asama === 'teslim_edildi' || p.durum === 'teslim_edildi';
    return tamamlandi && p.kurye_id === kuryeId;
  });

  return { paketler, aktifPaketler, teslimEdilenler, yukleniyor, paketiAl, paketiTeslimAldiBildir, teslimEt };
};
