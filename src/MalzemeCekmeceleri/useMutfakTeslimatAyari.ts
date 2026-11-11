import { useState, useEffect } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface MutfakTeslimatAyarTipi {
  minSiparisTutari: number;
  teslimatUcreti: number;
  ucretsizTeslimatLimiti: number;
}

const VARSAYILAN_TESLIMAT: MutfakTeslimatAyarTipi = {
  minSiparisTutari: 150,
  teslimatUcreti: 20,
  ucretsizTeslimatLimiti: 0
};

export const useMutfakTeslimatAyari = (mutfakId: string) => {
  const anahtar = `afyon_mutfak_teslimat_${mutfakId}`;
  const belgeId = `mutfak_teslimat_${mutfakId}`;

  const [ayar, setAyar] = useState<MutfakTeslimatAyarTipi>(() => {
    try {
      const kayitli = localStorage.getItem(anahtar);
      return kayitli ? JSON.parse(kayitli) : VARSAYILAN_TESLIMAT;
    } catch {
      return VARSAYILAN_TESLIMAT;
    }
  });

  useEffect(() => {
    const yukle = async () => {
      if (canliFirebaseAktifMi()) {
        try {
          const ayarlar = await koleksiyonGetir<any>('genel_ayarlar');
          const fbAyar = ayarlar.find((a) => a.id === belgeId);
          if (fbAyar && fbAyar.minSiparisTutari) {
            setAyar(fbAyar);
            localStorage.setItem(anahtar, JSON.stringify(fbAyar));
          }
        } catch (err) {
          console.warn('Firebase mutfak teslimat ayarı okuma hatası:', err);
        }
      }
    };
    yukle();
  }, [belgeId, anahtar]);

  const ayarGuncelle = async (yeni: MutfakTeslimatAyarTipi) => {
    setAyar(yeni);
    localStorage.setItem(anahtar, JSON.stringify(yeni));
    window.dispatchEvent(new Event(`mutfak_teslimat_guncellendi_${mutfakId}`));

    if (canliFirebaseAktifMi()) {
      try {
        await belgeKaydet('genel_ayarlar', belgeId, yeni);
      } catch (err) {
        console.warn('Firebase mutfak teslimat ayarı kaydetme hatası:', err);
      }
    }
  };

  return { ayar, ayarGuncelle };
};
