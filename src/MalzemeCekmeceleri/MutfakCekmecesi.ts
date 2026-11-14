import { useState, useEffect } from 'react';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonGetir, koleksiyonuCanliDinle, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseKoleksiyonServisi';

let onbellekMutfaklar: MutfakTipi[] = [];

const onayliSuz = (liste: MutfakTipi[]): MutfakTipi[] => {
  return (liste || [])
    .filter((m: any) => {
      if (!m) return false;
      if (m.askida_mi === true) return false;
      if (m.onay_durumu === 'reddedildi') return false;
      if (m.onayli_mi === false) return false;
      return true;
    })
    .sort((a: any, b: any) => {
      const aAcik = a.acik_mi !== false ? 1 : 0;
      const bAcik = b.acik_mi !== false ? 1 : 0;
      return bAcik - aAcik;
    });
};

export const useMutfaklar = () => {
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>(onbellekMutfaklar);
  const [yukleniyor, setYukleniyor] = useState(onbellekMutfaklar.length === 0);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let iptalEdildi = false;
    let dinlemeDurdur = () => {};

    const guncelle = (liste: MutfakTipi[]) => {
      const suzulen = onayliSuz(liste);
      onbellekMutfaklar = suzulen;
      if (!iptalEdildi) {
        setMutfaklar(suzulen);
      }
    };

    const veriGetir = async () => {
      if (onbellekMutfaklar.length === 0) {
        setYukleniyor(true);
      }
      try {
        if (canliFirebaseAktifMi()) {
          const veriler = await koleksiyonGetir<MutfakTipi>('mutfaklar');
          guncelle(veriler || []);

          dinlemeDurdur = koleksiyonuCanliDinle<MutfakTipi>('mutfaklar', (guncelMutfaklar) => {
            guncelle(guncelMutfaklar || []);
          });
        } else {
          guncelle([]);
        }
      } catch (err: unknown) {
        if (!iptalEdildi) {
          setHata(err instanceof Error ? err.message : 'Mutfaklar alınamadı');
        }
      } finally {
        if (!iptalEdildi) {
          setYukleniyor(false);
        }
      }
    };

    veriGetir();

    return () => {
      iptalEdildi = true;
      dinlemeDurdur();
    };
  }, []);

  return { mutfaklar, yukleniyor, hata };
};
