import { useState, useEffect } from 'react';
import { KuryeAyarlari } from '@/src/veritabani/VeriTipleri';
import {
  VARSAYILAN_KURYE_AYARLARI,
  kuryeAyarlariniGetir,
  kuryeAyarAboneligiEkle,
  kuryeAyariniKaydet,
  onbellekKuryeAyariAl,
} from './KuryeTeslimat/kuryeAyarAbonelikServisi';

export { VARSAYILAN_KURYE_AYARLARI, kuryeAyarlariniGetir };

export function useKuryeAyarlari() {
  const [ayarlar, setAyarlar] = useState<KuryeAyarlari>(onbellekKuryeAyariAl);

  useEffect(() => {
    return kuryeAyarAboneligiEkle(setAyarlar);
  }, []);

  return { ayarlar, ayarKaydet: kuryeAyariniKaydet };
}
