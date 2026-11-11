import React from 'react';
import { ShoppingBag, ChevronRight, Store, Bike } from 'lucide-react';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';

export const YuzenSepetBari: React.FC = () => {
  const { 
    toplamUrunSayisi, 
    mutfakGruplari, 
    sepetPaneliAc 
  } = sepetHafizasiKullan();
  const { teslimatTipi } = teslimatHafizasiKullan();

  if (toplamUrunSayisi === 0) return null;

  const gelAlMi = teslimatTipi === 'gel_al';
  const toplamTutar = mutfakGruplari.reduce((toplam, grup) => toplam + grup.araToplam, 0);

  return (
    <aside 
      aria-label="Yüzen Sepet Çubuğu"
      className="fixed bottom-16 lg:hidden inset-x-0 z-30 max-w-md mx-auto px-4 pointer-events-none"
    >
      <div 
        onClick={sepetPaneliAc}
        className="pointer-events-auto bg-[#2D1035] hover:bg-[#3D1447] text-white rounded-2xl p-3 shadow-2xl border border-amber-500/50 flex items-center justify-between cursor-pointer transition-all duration-300 transform active:scale-95 group"
      >
        {/* Sol Taraf: Çanta İkonu ve Tutar Bilgisi */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-[#1A0A1D] shadow-md group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1A0A1D]">
              {toplamUrunSayisi}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-300 font-semibold">Sepetim</span>
              <span className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                gelAlMi 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-purple-900/80 text-purple-200'
              }`}>
                {gelAlMi ? <Store className="w-2.5 h-2.5" /> : <Bike className="w-2.5 h-2.5" />}
                {gelAlMi ? 'Gel-Al' : 'Kurye'}
              </span>
              {mutfakGruplari.length > 1 && (
                <span className="inline-flex items-center gap-0.5 text-[9px] bg-purple-900/80 text-purple-200 px-1.5 py-0.5 rounded-md font-bold">
                  <Store className="w-2.5 h-2.5" />
                  {mutfakGruplari.length} Mutfak
                </span>
              )}
            </div>
            <div className="text-sm font-extrabold text-white tracking-wide">
              {toplamTutar.toFixed(2)} ₺
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Buton */}
        <div className="flex items-center gap-1 text-xs font-bold bg-amber-500 text-[#1A0A1D] px-3.5 py-2 rounded-xl group-hover:bg-amber-400 transition-colors shadow-sm">
          <span>Sepeti Gör</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </aside>
  );
};
