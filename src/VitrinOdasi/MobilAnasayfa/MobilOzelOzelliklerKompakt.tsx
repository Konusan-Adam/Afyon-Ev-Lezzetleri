import React from 'react';
import { FileText, Zap, Sparkles, Calendar } from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';

export const MobilOzelOzelliklerKompakt: React.FC = () => {
  const { pencereAc } = ozelOzelliklerHafizasiKullan();

  return (
    <section aria-label="Özel Lezzet Servisleri" className="w-full py-2">
      <div className="flex items-center gap-3 overflow-x-auto px-4 no-scrollbar scroll-smooth">
        
        {/* 1. Özel Menü (İhale) */}
        <button
          type="button"
          onClick={() => pencereAc('ihale')}
          className="shrink-0 bg-[#210D27] hover:bg-[#2D1236] active:scale-95 border border-[#FFB703]/50 p-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#3D1843] flex items-center justify-center border border-[#FFB703]/30 shrink-0">
            <FileText className="w-4 h-4 text-[#FFB703]" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
              <span>Özel Menü</span>
              <span className="bg-[#FFB703] text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                İHALE
              </span>
            </div>
            <div className="text-[10px] text-[#A872B5] font-medium whitespace-nowrap">Kapalı Teklif İhalesi</div>
          </div>
        </button>

        {/* 2. Hızlı Yemek (AI Akıllı Kombin) */}
        <button
          type="button"
          onClick={() => pencereAc('hizli_kombin')}
          className="shrink-0 bg-[#210D27] hover:bg-[#2D1236] active:scale-95 border border-[#521E5C] hover:border-[#852C94] p-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#3D1843] flex items-center justify-center border border-[#521E5C] shrink-0">
            <Zap className="w-4 h-4 text-[#FFB703]" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1 whitespace-nowrap">
              <span>Hızlı Yemek</span>
              <Sparkles className="w-3 h-3 text-[#DDAF53] shrink-0" />
            </div>
            <div className="text-[10px] text-[#A872B5] font-medium whitespace-nowrap">AI Akıllı Kombin</div>
          </div>
        </button>

        {/* 3. Akıllı Asistan (Rehber) */}
        <button
          type="button"
          onClick={() => pencereAc('asistan')}
          className="shrink-0 bg-[#210D27] hover:bg-[#2D1236] active:scale-95 border border-[#8C1D9C]/60 hover:border-[#8C1D9C] p-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#3D1843] flex items-center justify-center border border-[#8C1D9C]/40 shrink-0">
            <Sparkles className="w-4 h-4 text-[#C138D6]" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
              <span>Akıllı Asistan</span>
              <span className="bg-[#8C1D9C] text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                REHBER
              </span>
            </div>
            <div className="text-[10px] text-[#A872B5] font-medium whitespace-nowrap">Sesli & Yazılı Rehber</div>
          </div>
        </button>

        {/* 4. Yemek Aboneliği */}
        <button
          type="button"
          onClick={() => pencereAc('abonelik')}
          className="shrink-0 bg-[#210D27] hover:bg-[#2D1236] active:scale-95 border border-[#FFB703]/50 p-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#3D1843] flex items-center justify-center border border-[#FFB703]/30 shrink-0">
            <Calendar className="w-4 h-4 text-[#FFB703]" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
              <span>Yemek Aboneliği</span>
              <span className="bg-[#FFB703] text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                %25 İNDİRİM
              </span>
            </div>
            <div className="text-[10px] text-[#A872B5] font-medium whitespace-nowrap">Aylık & Haftalık Paket</div>
          </div>
        </button>

      </div>
    </section>
  );
};
