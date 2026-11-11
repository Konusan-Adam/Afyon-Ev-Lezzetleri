import { useState, useEffect } from 'react';
import { Yemek, FiltreKriterleri } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const varsayilanKriter: FiltreKriterleri = {
  kategori: 'Tümü',
  siralama: 'varsayilan',
};

export function filtreliYemekleriGetir(aramaMetni: string = '', filtreler?: FiltreKriterleri) {
  const [yemekler, setYemekler] = useState<Yemek[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  const guvenliFiltre = filtreler || varsayilanKriter;
  const guvenliArama = aramaMetni || '';

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);
    setHata(null);

    async function yemekleriGetir() {
      let hamYemekler: Yemek[] = [];

      if (canliFirebaseAktifMi()) {
        try {
          const fbYemekleri = await koleksiyonGetir<Yemek>('yemekler');
          if (fbYemekleri && fbYemekleri.length > 0) {
            hamYemekler = fbYemekleri;
          }
        } catch (err) {
          console.warn('Firebase yemek çekme uyarısı:', err);
        }
      }

      if (iptal) return;

      // Sadece onaylı ve yayındaki yemekler vitrine çıkabilir
      let filtrelenmis = hamYemekler.filter((y: any) => {
        if (y.stokta_var_mi === false) return false;
        if (y.tukendi_mi === true) return false;
        if (y.onay_durumu === 'beklemede' || y.onay_durumu === 'reddedildi') return false;
        if (y.onayli_mi === false) return false;
        return true;
      });
      if (guvenliArama.trim()) {
        filtrelenmis = filtrelenmis.filter(y => 
          y.baslik.toLowerCase().includes(guvenliArama.toLowerCase()) ||
          (y.aciklama && y.aciklama.toLowerCase().includes(guvenliArama.toLowerCase()))
        );
      }
      if (guvenliFiltre?.kategori && guvenliFiltre.kategori !== 'Tümü') {
        const aranan = guvenliFiltre.kategori.toLowerCase().trim();
        filtrelenmis = filtrelenmis.filter(y => {
          const yKat = (y.kategori || '').toLowerCase().trim();
          return yKat === aranan ||
            (aranan === 'bükme & hamur işi' && (yKat === 'bukme' || yKat === 'hamur')) ||
            (aranan === 'afyon mantısı' && (yKat === 'manti' || yKat === 'afyon mantısı')) ||
            (aranan === 'geleneksel keşkek' && (yKat === 'keskek' || yKat === 'keşkek')) ||
            (aranan === 'ekmek kadayıfı & tatlı' && (yKat === 'tatli' || yKat === 'tatlı')) ||
            (aranan === 'sucuklu lezzetler' && (yKat === 'sucuk' || yKat === 'et'));
        });
      }
      if (guvenliFiltre?.altKategori) {
        filtrelenmis = filtrelenmis.filter(y => y.alt_kategori === guvenliFiltre.altKategori);
      }
      if (guvenliFiltre?.minFiyat !== undefined) {
        filtrelenmis = filtrelenmis.filter(y => y.fiyat >= (guvenliFiltre.minFiyat ?? 0));
      }
      const ustLimit = guvenliFiltre?.maxFiyat ?? guvenliFiltre?.maksFiyat;
      if (ustLimit !== undefined) {
        filtrelenmis = filtrelenmis.filter(y => y.fiyat <= ustLimit);
      }
      if (guvenliFiltre?.minPuan !== undefined && guvenliFiltre.minPuan > 0) {
        filtrelenmis = filtrelenmis.filter(y => (y.puan ?? 0) >= (guvenliFiltre.minPuan ?? 0));
      }
      if (guvenliFiltre?.siralama === 'fiyat_artan') {
        filtrelenmis.sort((a, b) => a.fiyat - b.fiyat);
      } else if (guvenliFiltre?.siralama === 'fiyat_azalan') {
        filtrelenmis.sort((a, b) => b.fiyat - a.fiyat);
      } else if (guvenliFiltre?.siralama === 'puan_azalan') {
        filtrelenmis.sort((a, b) => (b.puan ?? 0) - (a.puan ?? 0));
      }

      setYemekler(filtrelenmis);
      setYukleniyor(false);
    }

    yemekleriGetir();

    return () => {
      iptal = true;
    };
  }, [guvenliArama, JSON.stringify(guvenliFiltre)]);

  return { yemekler, yukleniyor, hata };
}
