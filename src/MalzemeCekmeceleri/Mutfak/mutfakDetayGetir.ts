import { useState, useEffect } from 'react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { mutfakAboneligiEkle } from './mutfakAbonelikServisi';

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

    setYukleniyor(true);
    const aboneliktenCik = mutfakAboneligiEkle((mutfaklar, _yuk, abonelikHatasi) => {
      if (abonelikHatasi) {
        setHata(abonelikHatasi);
      } else {
        setHata(null);
      }
      const bulunan = mutfaklar.find((m) => m.id === mutfakId || m.kimlik === mutfakId);
      setMutfak(bulunan || null);
      if (mutfaklar.length > 0 || !_yuk) {
        setYukleniyor(false);
      }
    });

    return () => {
      aboneliktenCik();
    };
  }, [mutfakId]);

  return { mutfak, yukleniyor, hata };
}
