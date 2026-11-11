import { useState, useEffect } from 'react';
import { AFYON_MAHALLELERI } from '@/src/veritabani/AfyonMahalleleri';
import { useKullanici } from '@/src/OrtakHavuz/KullaniciHavuzu';

const YEREL_MAHALLE_ANAHTARI = 'afyon_secili_mahalle';

export const useAdresCekmecesi = () => {
  const { adresDegistir } = useKullanici();
  const [seciliMahalle, setSeciliMahalle] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(YEREL_MAHALLE_ANAHTARI) || '';
  });

  const [modalGorunsunMu, setModalGorunsunMu] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(YEREL_MAHALLE_ANAHTARI);
  });

  useEffect(() => {
    const kayitli = localStorage.getItem(YEREL_MAHALLE_ANAHTARI);
    if (kayitli) {
      adresDegistir(kayitli + ', Afyonkarahisar');
    }
  }, [adresDegistir]);

  const mahalleKaydet = (mahalleAdi: string) => {
    setSeciliMahalle(mahalleAdi);
    localStorage.setItem(YEREL_MAHALLE_ANAHTARI, mahalleAdi);
    adresDegistir(mahalleAdi + ', Merkez / Afyon');
    setModalGorunsunMu(false);
  };

  const sonraSec = () => setModalGorunsunMu(false);

  return {
    mahalleler: AFYON_MAHALLELERI,
    seciliMahalle,
    modalGorunsunMu,
    mahalleKaydet,
    sonraSec,
    modaliAc: () => setModalGorunsunMu(true)
  };
};
