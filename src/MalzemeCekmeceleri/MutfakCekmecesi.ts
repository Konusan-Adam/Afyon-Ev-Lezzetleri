import { useState, useEffect } from 'react';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import {
  mutfakAboneligiEkle,
  anlikOnbellekMutfaklariAl,
} from './Mutfak/mutfakAbonelikServisi';

export const useMutfaklar = () => {
  const baslangic = anlikOnbellekMutfaklariAl();
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>(baslangic.mutfaklar);
  const [yukleniyor, setYukleniyor] = useState<boolean>(baslangic.yukleniyor);
  const [hata, setHata] = useState<string | null>(baslangic.hata);

  useEffect(() => {
    return mutfakAboneligiEkle((liste, yukleniyorMu, yeniHata) => {
      setMutfaklar(liste);
      setYukleniyor(yukleniyorMu);
      setHata(yeniHata);
    });
  }, []);

  return { mutfaklar, yukleniyor, hata };
};
