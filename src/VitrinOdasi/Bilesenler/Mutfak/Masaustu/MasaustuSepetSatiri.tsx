import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';

export const MasaustuSepetSatiri: React.FC<{ eleman: SepetElemani }> = ({ eleman }) => {
  const { adetGuncelle, sepettenSil } = sepetHafizasiKullan();

  return (
    <div className="flex items-center justify-between py-2 border-b border-purple-900/30 text-xs">
      <div className="flex-1 min-w-0 pr-2">
        <p className="font-semibold text-white truncate">{eleman.yemek?.baslik || 'Lezzet'}</p>
        <span className="text-[11px] text-amber-400 font-bold">{eleman.birim_fiyat} ₺</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-black/50 border border-purple-800/60 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => {
              if (eleman.adet > 1) {
                adetGuncelle(eleman.id, eleman.adet - 1);
              } else {
                sepettenSil(eleman.id);
              }
            }}
            className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/50 cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-6 text-center font-bold text-white text-xs">{eleman.adet}</span>

          <button
            type="button"
            onClick={() => adetGuncelle(eleman.id, eleman.adet + 1)}
            className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/50 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => sepettenSil(eleman.id)}
          className="text-purple-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
          title="Sil"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
