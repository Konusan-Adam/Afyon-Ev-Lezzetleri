import { useMemo } from 'react';
import { useMutfaklar } from '../MutfakCekmecesi';
import { onayliMutfakMi } from './mutfakFiltrelemeYardimcisi';

export function mutfakOnayliMi(m: any): boolean {
  return onayliMutfakMi(m) && m?.acik_mi !== false;
}

export function mutfaklariGetir() {
  const { mutfaklar: tumOnayliMutfaklar, yukleniyor, hata } = useMutfaklar();

  const mutfaklar = useMemo(
    () => tumOnayliMutfaklar.filter((m) => m.acik_mi !== false),
    [tumOnayliMutfaklar]
  );

  return { mutfaklar, yukleniyor, hata };
}
