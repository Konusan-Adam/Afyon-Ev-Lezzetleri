import { useState } from 'react';
import { KorlemeSiparisTipi, KuryeAsamaTipi } from './ZirhTipleri';

export const useKorlemeKancasi = (baslangicSiparisi: KorlemeSiparisTipi) => {
  const [siparis, setSiparis] = useState<KorlemeSiparisTipi>(baslangicSiparisi);
  const [girilenPin, setGirilenPin] = useState('');
  const [hata, setHata] = useState('');

  const paketiTeslimAl = () => {
    setSiparis((onceki) => ({ ...onceki, asama: 'paket_alindi' }));
    setHata('');
  };

  const teslimatiTamamla = () => {
    if (girilenPin.trim() !== siparis.pinKodu) {
      setHata('Hatalı 4 haneli PIN kodu girdiniz.');
      return false;
    }
    setSiparis((onceki) => ({ ...onceki, asama: 'teslim_edildi' }));
    setHata('');
    return true;
  };

  return {
    siparis,
    asama: siparis.asama,
    girilenPin,
    setGirilenPin,
    hata,
    paketiTeslimAl,
    teslimatiTamamla
  };
};
