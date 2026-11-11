import { useState, useEffect } from 'react';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonGetir, koleksiyonuCanliDinle, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const useMutfaklar = () => {
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let dinlemeDurdur = () => {};

    const onayliSüz = (liste: MutfakTipi[]) => {
      return (liste || []).filter((m: any) => {
        if (!m) return false;
        if (m.askida_mi === true) return false;
        if (m.onay_durumu === 'reddedildi') return false;
        if (m.onayli_mi === false) return false;
        return true;
      });
    };

    const veriGetir = async () => {
      setYukleniyor(true);
      try {
        if (canliFirebaseAktifMi()) {
          const veriler = await koleksiyonGetir<MutfakTipi>('mutfaklar');
          setMutfaklar(onayliSüz(veriler || []));

          // Canlı değişiklikleri dinle
          dinlemeDurdur = koleksiyonuCanliDinle<MutfakTipi>('mutfaklar', (guncelMutfaklar) => {
            setMutfaklar(onayliSüz(guncelMutfaklar || []));
          });
        } else {
          setMutfaklar([]);
        }
      } catch (err: unknown) {
        setHata(err instanceof Error ? err.message : 'Mutfaklar alınamadı');
        setMutfaklar([]);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();

    return () => {
      dinlemeDurdur();
    };
  }, []);

  return { mutfaklar, yukleniyor, hata };
};
