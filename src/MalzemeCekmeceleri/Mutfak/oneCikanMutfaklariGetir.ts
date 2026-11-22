import { useMemo } from 'react';
import { mutfaklariGetir } from './mutfaklariGetir';
import { Mutfak } from '@/src/veritabani/VeriTipleri';

import { mutfakMolaDurumuGetir } from '../OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '../OnSiparisVePorsiyon/useCanliDakika';

/**
 * Akıllı Öne Çıkan Mutfak Çekmecesi:
 * En yüksek puanlı ve en popüler ev aşçılarını açık olma önceliğiyle vitrine sunar.
 */
export function oneCikanMutfaklariGetir() {
  const { mutfaklar, yukleniyor, hata } = mutfaklariGetir();
  const anlikDakika = useCanliDakika();

  const oneCikanMutfaklar = useMemo(() => {
    if (!mutfaklar || mutfaklar.length === 0) return [];
    return [...mutfaklar]
      .filter((m: Mutfak) => (m.puan ?? 0) >= 4.8)
      .sort((a, b) => {
        const aAcik = !mutfakMolaDurumuGetir(a, anlikDakika).siparisEngelliMi ? 1 : 0;
        const bAcik = !mutfakMolaDurumuGetir(b, anlikDakika).siparisEngelliMi ? 1 : 0;
        if (bAcik !== aAcik) return bAcik - aAcik;
        return (b.puan ?? 0) - (a.puan ?? 0);
      });
  }, [mutfaklar, anlikDakika]);

  return {
    oneCikanMutfaklar,
    toplamMutfakSayisi: mutfaklar?.length ?? 0,
    yukleniyor,
    hata,
  };
}
