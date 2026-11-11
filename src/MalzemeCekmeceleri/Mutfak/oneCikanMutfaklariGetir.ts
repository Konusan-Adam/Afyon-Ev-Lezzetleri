import { useMemo } from 'react';
import { mutfaklariGetir } from './mutfaklariGetir';
import { Mutfak } from '@/src/veritabani/VeriTipleri';

/**
 * Akıllı Öne Çıkan Mutfak Çekmecesi:
 * En yüksek puanlı ve en popüler ev aşçılarını otomatik süzer ve vitrine sunar.
 */
export function oneCikanMutfaklariGetir() {
  const { mutfaklar, yukleniyor, hata } = mutfaklariGetir();

  const oneCikanMutfaklar = useMemo(() => {
    if (!mutfaklar || mutfaklar.length === 0) return [];
    // Akıllı sıralama: Puanı 4.8 ve üzeri olanları önce sırala
    return [...mutfaklar]
      .filter((m: Mutfak) => (m.puan ?? 0) >= 4.8)
      .sort((a, b) => (b.puan ?? 0) - (a.puan ?? 0));
  }, [mutfaklar]);

  return { oneCikanMutfaklar, yukleniyor, hata };
}
