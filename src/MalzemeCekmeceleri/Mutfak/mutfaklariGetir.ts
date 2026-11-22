import { useMemo } from 'react';
import { useMutfaklar } from '../MutfakCekmecesi';
import { onayliMutfakMi } from './mutfakFiltrelemeYardimcisi';
import { mutfakMolaDurumuGetir } from '../OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '../OnSiparisVePorsiyon/useCanliDakika';

export const MIN_VITRIN_MUTFAK_SAYISI = 10;

export function mutfakOnayliMi(m: any): boolean {
  return onayliMutfakMi(m);
}

export function mutfaklariGetir() {
  const { mutfaklar: tumOnayliMutfaklar, yukleniyor, hata } = useMutfaklar();
  const anlikDakika = useCanliDakika();

  const mutfaklar = useMemo(() => {
    return [...tumOnayliMutfaklar].sort((a, b) => {
      const aDurum = mutfakMolaDurumuGetir(a, anlikDakika);
      const bDurum = mutfakMolaDurumuGetir(b, anlikDakika);
      const aPuan = aDurum.siparisEngelliMi ? (aDurum.moladaMi ? 1 : 0) : 2;
      const bPuan = bDurum.siparisEngelliMi ? (bDurum.moladaMi ? 1 : 0) : 2;
      return bPuan - aPuan;
    });
  }, [tumOnayliMutfaklar, anlikDakika]);

  return { mutfaklar, yukleniyor, hata };
}
