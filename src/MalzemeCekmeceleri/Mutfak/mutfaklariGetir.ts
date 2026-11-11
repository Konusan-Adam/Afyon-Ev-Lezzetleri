import { useState, useEffect } from 'react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { koleksiyonGetir, koleksiyonuCanliDinle, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export function mutfakOnayliMi(m: any): boolean {
  if (!m) return false;
  if (m.askida_mi === true) return false;
  if (m.onay_durumu === 'reddedildi') return false;
  if (m.onayli_mi === false) return false;
  // 🚪 Kapalı mutfakları vitrinde gizle
  if (m.acik_mi === false) return false;
  return true;
}

export function mutfaklariGetir() {
  const [mutfaklar, setMutfaklar] = useState<Mutfak[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let iptal = false;
    let dinlemeDurdur = () => {};

    async function getir() {
      setYukleniyor(true);
      try {
        if (canliFirebaseAktifMi()) {
          const fbMutfaklar = await koleksiyonGetir<Mutfak>('mutfaklar');
          if (!iptal) {
            setMutfaklar(fbMutfaklar.filter(mutfakOnayliMi));
            setYukleniyor(false);
          }

          dinlemeDurdur = koleksiyonuCanliDinle<Mutfak>('mutfaklar', (guncelMutfaklar) => {
            if (!iptal && guncelMutfaklar) {
              setMutfaklar(guncelMutfaklar.filter(mutfakOnayliMi));
            }
          });
        }
      } catch (err: any) {
        if (!iptal) {
          console.error('Firebase mutfak çekme hatası:', err);
          setHata('Mutfaklar getirilirken hata oluştu');
          setYukleniyor(false);
        }
      }
    }

    getir();
    return () => {
      iptal = true;
      dinlemeDurdur();
    };
  }, []);

  return { mutfaklar, yukleniyor, hata };
}
