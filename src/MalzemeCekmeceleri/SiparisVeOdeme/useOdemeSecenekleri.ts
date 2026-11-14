import { useState, useEffect, useMemo } from 'react';
import { usePaytrAyarlari } from '../Paytr/usePaytrAyarlari';
import {
  OdemeSecenekleriAyari,
  OdemeTipi,
  aktifVarsayilanYontemiBul,
  yontemAktifMi,
} from './odemeSecenekTipleri';
import {
  odemeSecenekAboneligiEkle,
  anlikOdemeSecenekleriniAl,
} from './odemeSecenekAbonelikServisi';

export function useOdemeSecenekleri() {
  const baslangic = anlikOdemeSecenekleriniAl();
  const [secenekler, setSecenekler] = useState<OdemeSecenekleriAyari>(baslangic.secenekler);
  const [secenekYukleniyor, setSecenekYukleniyor] = useState<boolean>(baslangic.yukleniyor);
  const { ayarlar: paytrAyarlari, yukleniyor: paytrYukleniyor } = usePaytrAyarlari();

  useEffect(() => {
    return odemeSecenekAboneligiEkle((yeniAyar, yukleniyorMu) => {
      setSecenekler(yeniAyar);
      setSecenekYukleniyor(yukleniyorMu);
    });
  }, []);

  const gecerliVarsayilanYontem = useMemo(
    () => aktifVarsayilanYontemiBul(secenekler, paytrAyarlari.onlineOdemeAktif),
    [secenekler, paytrAyarlari.onlineOdemeAktif]
  );

  const secenekAktifMi = (yontem: OdemeTipi) =>
    yontemAktifMi(yontem, secenekler, paytrAyarlari.onlineOdemeAktif);

  return {
    secenekler,
    paytrAyarlari,
    yukleniyor: secenekYukleniyor || paytrYukleniyor,
    gecerliVarsayilanYontem,
    secenekAktifMi,
  };
}
