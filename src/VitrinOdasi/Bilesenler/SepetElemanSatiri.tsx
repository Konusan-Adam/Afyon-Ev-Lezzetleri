import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { SepetElemaniTipi } from '@/src/veritabani/VeriTipleri';

interface Props {
  eleman: SepetElemaniTipi;
  onAdetGuncelle: (yemekId: string, adet: number) => void;
}

export const SepetElemanSatiri: React.FC<Props> = ({ eleman, onAdetGuncelle }) => {
  return (
    <div className="py-3 flex items-center justify-between gap-3">
      <div className="flex-1">
        <div className="text-sm font-semibold text-stone-900">{eleman.yemek.baslik}</div>
        <div className="text-xs text-amber-700 font-bold">{eleman.birim_fiyat} ₺</div>
      </div>
      <div className="flex items-center gap-2 bg-stone-100 px-2 py-1 rounded-lg">
        <button
          onClick={() => onAdetGuncelle(eleman.yemek.id, eleman.adet - 1)}
          className="p-1 hover:text-amber-700 active:scale-95"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs font-bold w-4 text-center">{eleman.adet}</span>
        <button
          onClick={() => onAdetGuncelle(eleman.yemek.id, eleman.adet + 1)}
          className="p-1 hover:text-amber-700 active:scale-95"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
