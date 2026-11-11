import React from 'react';
import { Clock, Calendar, Zap, ChevronRight } from 'lucide-react';
import { useOnSiparis } from '@/src/OrtakHavuz/OnSiparisHafizasi';

export const TeslimatZamaniBari: React.FC = () => {
  const { tercih, seciciyiAc } = useOnSiparis();
  const hemenMi = tercih.tip === 'hemen';

  return (
    <div className="w-full px-4 mb-2">
      <div
        onClick={seciciyiAc}
        className="w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#1E0927] via-[#2D0F38] to-[#1E0927] border border-[#521E5C]/60 hover:border-amber-500/50 shadow-md flex items-center justify-between cursor-pointer group transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            hemenMi ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            {hemenMi ? <Zap className="w-4 h-4 fill-amber-400" /> : <Calendar className="w-4 h-4" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/80">
                Teslimat Zamanı:
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                hemenMi ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {hemenMi ? 'Hemen Servis' : 'Ön Sipariş'}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>{tercih.tarihEtiketi}</span>
              <span className="text-purple-400">•</span>
              <span className="text-amber-400">{tercih.saatAraligi}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-purple-300 group-hover:text-amber-400 transition-colors shrink-0">
          <span className="hidden sm:inline font-semibold">Değiştir</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
