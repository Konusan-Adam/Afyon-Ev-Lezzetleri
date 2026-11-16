import { useState, useEffect } from 'react';
import { MutfakAfisi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonuCanliDinle, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export function useMutfakAfisleri() {
  const [afisler, setAfisler] = useState<MutfakAfisi[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  useEffect(() => {
    if (!canliFirebaseAktifMi()) {
      setAfisler([]);
      setYukleniyor(false);
      return;
    }

    const durdur = koleksiyonuCanliDinle<MutfakAfisi>('mutfak_afisleri', (gelenListe) => {
      const filtrelenmis = (gelenListe || []).filter(
        (afis) => afis.aktif_mi === true && afis.onayli_mi === true
      );
      setAfisler(filtrelenmis);
      setYukleniyor(false);
    });

    return () => {
      durdur();
    };
  }, []);

  return { afisler, yukleniyor };
}
