import { useEffect, useState } from 'react';
import { testKuryeKonumuGetir } from '@/src/veritabani/CanliVeriYardimcisi';

export interface KuryeCanliKonumVerisi {
  siparis_id: string;
  enlem: number;
  boylam: number;
  kurye_adi: string;
  kurye_telefon: string;
  tahmini_dakika: number;
  guncellenme_zamani: string;
}

export function useCanliKurye(siparisId: string) {
  const [konum, setKonum] = useState<KuryeCanliKonumVerisi | null>(() => {
    return (testKuryeKonumuGetir(siparisId) as unknown as KuryeCanliKonumVerisi) || null;
  });
  const [canliBaglantiAktif, setCanliBaglantiAktif] = useState(false);

  useEffect(() => {
    if (!siparisId) return;
    const testKonum = testKuryeKonumuGetir(siparisId);
    if (testKonum) {
      setKonum(testKonum as unknown as KuryeCanliKonumVerisi);
      setCanliBaglantiAktif(true);
    }
  }, [siparisId]);

  return { konum, canliBaglantiAktif };
}
