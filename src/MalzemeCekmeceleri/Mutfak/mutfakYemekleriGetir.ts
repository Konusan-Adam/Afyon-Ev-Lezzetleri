import { useState, useEffect } from 'react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

function mutfakIdEslesiyorMu(yemekMutfakId?: string, hedefMutfakId?: string): boolean {
  if (!yemekMutfakId || !hedefMutfakId) return false;
  if (yemekMutfakId === hedefMutfakId) return true;
  const fatmaIdleri = ['m1', 'asci_fatma_01', 'mutfak-fatma-teyze', 'mutfak-1'];
  return fatmaIdleri.includes(hedefMutfakId) && fatmaIdleri.includes(yemekMutfakId);
}

export function mutfakYemekleriGetir(mutfakId?: string) {
  const [yemekler, setYemekler] = useState<Yemek[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!mutfakId) {
      setYemekler([]);
      setYukleniyor(false);
      return;
    }

    let iptal = false;

    async function getir() {
      setYukleniyor(true);
      let tumYemekler: Yemek[] = [];

      if (canliFirebaseAktifMi()) {
        try {
          const fbYemekler = await koleksiyonGetir<Yemek>('yemekler');
          if (fbYemekler && fbYemekler.length > 0) {
            tumYemekler = fbYemekler;
          }
        } catch (err: any) {
          console.warn('Firebase mutfak yemekleri getirme uyarısı:', err);
          if (!iptal) setHata(err?.message || 'Yemekler alınamadı');
        }
      }

      if (!iptal) {
        const filtrelenmis = tumYemekler.filter((y: any) => {
          if (!mutfakIdEslesiyorMu(y.mutfak_id, mutfakId)) return false;
          // Müşteri vitrininde sadece onaylı ve stoktaki yemekler görünür
          if (y.stokta_var_mi === false) return false;
          if (y.tukendi_mi === true) return false;
          if (y.onay_durumu === 'beklemede' || y.onay_durumu === 'reddedildi') return false;
          if (y.onayli_mi === false) return false;
          return true;
        });
        setYemekler(filtrelenmis);
        setYukleniyor(false);
      }
    }

    getir();

    const guncellemeDinle = () => getir();
    window.addEventListener('afyon_yemekler_guncellendi', guncellemeDinle);

    return () => {
      iptal = true;
      window.removeEventListener('afyon_yemekler_guncellendi', guncellemeDinle);
    };
  }, [mutfakId]);

  return { yemekler, yukleniyor, hata };
}
