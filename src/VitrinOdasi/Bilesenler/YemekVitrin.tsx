import React from 'react';
import { Utensils } from 'lucide-react';
import { useYemekler } from '@/src/MalzemeCekmeceleri/YemekCekmecesi';
import { YemekKarti } from './YemekKarti';

interface Props {
  seciliKategoriSlug: string;
}

export const YemekVitrin: React.FC<Props> = ({ seciliKategoriSlug }) => {
  const { yemekler, yukleniyor } = useYemekler(seciliKategoriSlug);

  if (yukleniyor) {
    return <div className="text-center py-8 text-stone-500 text-sm">Lezzetler hazırlanıyor...</div>;
  }

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-bold text-stone-900">Günün Taze Ev Lezzetleri</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {yemekler.map((yemek) => (
          <YemekKarti key={yemek.id} yemek={yemek} />
        ))}
      </div>
    </section>
  );
};
