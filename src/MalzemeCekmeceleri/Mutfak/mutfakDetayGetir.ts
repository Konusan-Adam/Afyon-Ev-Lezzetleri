import { useState, useEffect } from 'react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export function mutfakDetayGetir(mutfakId?: string) {
  const [mutfak, setMutfak] = useState<Mutfak | null>(null);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!mutfakId) {
      setMutfak(null);
      setYukleniyor(false);
      return;
    }

    let iptal = false;

    async function getir() {
      setYukleniyor(true);
      try {
        const tumMutfaklar = await koleksiyonGetir<Mutfak>('mutfaklar');
        const bulunan = tumMutfaklar.find((m) => m.id === mutfakId);
        if (!iptal) {
          setMutfak(bulunan || null);
          setYukleniyor(false);
        }
      } catch (err) {
        if (!iptal) {
          console.error('Firebase mutfak detay hatası:', err);
          setHata('Mutfak detayları getirilirken hata oluştu');
          setYukleniyor(false);
        }
      }
    }

    getir();
    return () => {
      iptal = true;
    };
  }, [mutfakId]);

  return { mutfak, yukleniyor, hata };
}
