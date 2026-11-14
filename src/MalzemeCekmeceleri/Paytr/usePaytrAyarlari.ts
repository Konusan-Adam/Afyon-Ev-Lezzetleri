import { useState, useEffect } from 'react';
import { PaytrCanliAyarlari } from './paytrAyarTipleri';
import {
  paytrAyarAboneligiEkle,
  anlikPaytrAyarlariniAl,
} from './paytrAyarAbonelikServisi';

export function usePaytrAyarlari() {
  const baslangic = anlikPaytrAyarlariniAl();
  const [ayarlar, setAyarlar] = useState<PaytrCanliAyarlari>(baslangic.ayarlar);
  const [yukleniyor, setYukleniyor] = useState<boolean>(baslangic.yukleniyor);

  useEffect(() => {
    return paytrAyarAboneligiEkle((yeniAyar, yukleniyorMu) => {
      setAyarlar(yeniAyar);
      setYukleniyor(yukleniyorMu);
    });
  }, []);

  return { ayarlar, yukleniyor };
}
