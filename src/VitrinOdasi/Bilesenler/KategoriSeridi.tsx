import React from 'react';
import { useKategoriler } from '@/src/MalzemeCekmeceleri/KategoriCekmecesi';

interface Props {
  seciliKategori: string;
  onKategoriSec: (slug: string) => void;
}

export const KategoriSeridi: React.FC<Props> = ({ seciliKategori, onKategoriSec }) => {
  const { kategoriler } = useKategoriler();

  return (
    <div className="py-2 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 pb-1">
        {kategoriler.map((kat) => {
          const aktif = seciliKategori === kat.slug;
          return (
            <button
              key={kat.id}
              onClick={() => onKategoriSec(kat.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                aktif
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span>{kat.ikon}</span>
              <span>{kat.ad}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
