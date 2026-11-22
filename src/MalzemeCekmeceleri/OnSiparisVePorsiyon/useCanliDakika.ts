import { useState, useEffect } from 'react';
import { turkiyeDakikaGetir } from './calismaSaatiKontrolu';

export function useCanliDakika(aralikMs: number = 30000): number {
  const [dakika, setDakika] = useState<number>(() => turkiyeDakikaGetir());

  useEffect(() => {
    const guncelle = () => setDakika(turkiyeDakikaGetir());
    guncelle();
    const zamanlayici = window.setInterval(guncelle, aralikMs);
    return () => window.clearInterval(zamanlayici);
  }, [aralikMs]);

  return dakika;
}
