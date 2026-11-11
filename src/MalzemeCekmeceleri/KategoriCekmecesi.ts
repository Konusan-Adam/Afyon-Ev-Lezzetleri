import { useState, useEffect } from 'react';
import { KategoriTipi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const useKategoriler = () => {
  const [kategoriler, setKategoriler] = useState<KategoriTipi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let dinlemeDurdur = () => {};

    const veriSirala = (liste: KategoriTipi[]) => {
      const gorulen = new Set<string>();
      const tekiller: KategoriTipi[] = [];
      for (const k of liste) {
        if (!k) continue;
        const anahtar = (k.id === 'hepsi' || k.ad === 'Tümü') ? 'hepsi' : (k.id || k.ad);
        if (!gorulen.has(anahtar)) {
          gorulen.add(anahtar);
          tekiller.push(k);
        }
      }
      return tekiller.sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
    };

    const veriGetir = async () => {
      setYukleniyor(true);
      try {
        if (canliFirebaseAktifMi()) {
          const fb = await koleksiyonGetir<KategoriTipi>('kategoriler');
          setKategoriler(veriSirala(fb || []));

          dinlemeDurdur = koleksiyonuCanliDinle<KategoriTipi>('kategoriler', (guncelFb) => {
            setKategoriler(veriSirala(guncelFb || []));
          });
        } else {
          setKategoriler([]);
        }
      } catch (err) {
        console.warn('Kategori getirme uyarısı:', err);
        setKategoriler([]);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();

    return () => {
      dinlemeDurdur();
    };
  }, []);

  return { kategoriler, yukleniyor };
};
