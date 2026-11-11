import { useState, useEffect } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface AdminKuponAyarTipi {
  kod: string;
  baslik: string;
  indirimTipi: 'yuzde' | 'tutar';
  indirimOrani: number;
  minSepetTutari: number;
  maksimumIndirim: number;
  aktif: boolean;
  tekKullanimlikMi: boolean;
}

const VARSAYILAN_KUPON: AdminKuponAyarTipi = {
  kod: 'AFYONLEZZET',
  baslik: 'İlk Siparişe Özel %20 İndirim',
  indirimTipi: 'yuzde',
  indirimOrani: 20,
  minSepetTutari: 150,
  maksimumIndirim: 100,
  aktif: true,
  tekKullanimlikMi: true,
};

const KUPON_ANAHTARI = 'afyon_admin_kupon_ayari';

export const useAdminKuponu = () => {
  const [kupon, setKupon] = useState<AdminKuponAyarTipi>(() => {
    try {
      const kayitli = localStorage.getItem(KUPON_ANAHTARI);
      return kayitli ? { ...VARSAYILAN_KUPON, ...JSON.parse(kayitli) } : VARSAYILAN_KUPON;
    } catch {
      return VARSAYILAN_KUPON;
    }
  });

  useEffect(() => {
    let dinlemeDurdur = () => {};

    const yukle = async () => {
      if (canliFirebaseAktifMi()) {
        try {
          const ayarlar = await koleksiyonGetir<any>('genel_ayarlar');
          const fbKupon = ayarlar.find((a) => a.id === 'kupon_ayari');
          if (fbKupon && fbKupon.kod) {
            const birlestirilmis = { ...VARSAYILAN_KUPON, ...fbKupon };
            setKupon(birlestirilmis);
            localStorage.setItem(KUPON_ANAHTARI, JSON.stringify(birlestirilmis));
          }

          dinlemeDurdur = koleksiyonuCanliDinle<any>('genel_ayarlar', (list) => {
            const guncel = list.find((a) => a.id === 'kupon_ayari');
            if (guncel && guncel.kod) {
              const birlestirilmis = { ...VARSAYILAN_KUPON, ...guncel };
              setKupon(birlestirilmis);
              localStorage.setItem(KUPON_ANAHTARI, JSON.stringify(birlestirilmis));
            }
          });
        } catch (err) {
          console.warn('Firebase kupon okuma hatası:', err);
        }
      }
    };

    yukle();

    return () => {
      dinlemeDurdur();
    };
  }, []);

  const kuponGuncelle = async (yeni: AdminKuponAyarTipi) => {
    setKupon(yeni);
    localStorage.setItem(KUPON_ANAHTARI, JSON.stringify(yeni));
    window.dispatchEvent(new Event('afyon_admin_kupon_guncellendi'));

    if (canliFirebaseAktifMi()) {
      try {
        await belgeKaydet('genel_ayarlar', 'kupon_ayari', yeni);
      } catch (err) {
        console.warn('Firebase kupon kaydetme hatası:', err);
      }
    }
  };

  return { kupon, kuponGuncelle };
};
