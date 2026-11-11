import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';

interface MesajUrunKartiProps {
  yemek: YemekTipi;
}

export const MesajUrunKarti: React.FC<MesajUrunKartiProps> = ({ yemek }) => {
  const { sepeteEkle } = sepetHafizasiKullan();
  const [eklendi, setEklendi] = useState(false);

  const tiklandi = async () => {
    try {
      await sepeteEkle(
        yemek.mutfak_id || '',
        yemek.id,
        1,
        yemek.fiyat
      );
      setEklendi(true);
      setTimeout(() => setEklendi(false), 2000);
    } catch (hata) {
      console.error('Sepete eklenemedi:', hata);
    }
  };

  const azStokMu = typeof yemek.kalan_stok === 'number' && yemek.kalan_stok > 0 && yemek.kalan_stok <= 4;

  return (
    <div className="flex items-center gap-2.5 p-2 bg-amber-50/70 border border-amber-200/90 rounded-xl my-1.5 shadow-2xs hover:bg-amber-100/60 transition-all">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0 relative">
        <img
          src={yemek.gorsel_url || '/marka_logosu.jpg'}
          alt={yemek.baslik}
          className="w-full h-full object-cover"
        />
        {azStokMu && (
          <span className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[9px] font-bold text-center leading-tight py-0.5">
            Son {yemek.kalan_stok}!
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-900 truncate">{yemek.baslik}</h4>
        <p className="text-[11px] font-bold text-amber-900">{yemek.fiyat} ₺</p>
      </div>

      <button
        type="button"
        onClick={tiklandi}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 ${
          eklendi
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'bg-[#2c124a] hover:bg-[#3f1969] text-amber-200 shadow-xs'
        }`}
      >
        {eklendi ? (
          <>
            <Check className="w-3.5 h-3.5" /> Eklendi
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" /> Sepete At
          </>
        )}
      </button>
    </div>
  );
};
