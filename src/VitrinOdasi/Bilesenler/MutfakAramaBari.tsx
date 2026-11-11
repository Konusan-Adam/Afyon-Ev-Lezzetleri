import React from 'react';
import { Search, X } from 'lucide-react';

interface MutfakAramaBariOzellikleri {
  aramaMetni: string;
  aramaMetniDegisti: (metin: string) => void;
  toplamSayi: number;
}

export const MutfakAramaBari: React.FC<MutfakAramaBariOzellikleri> = ({
  aramaMetni,
  aramaMetniDegisti,
  toplamSayi,
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
        <input
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaMetniDegisti(e.target.value)}
          placeholder="Mutfak adı, şube veya mahalle ara..."
          className="w-full bg-[#240E2A] text-white placeholder-purple-300/60 text-xs sm:text-sm pl-10 pr-24 py-3 rounded-2xl border border-purple-800/60 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {aramaMetni && (
            <button
              type="button"
              onClick={() => aramaMetniDegisti('')}
              className="p-1 rounded-full bg-purple-900/60 text-purple-300 hover:text-white transition-colors cursor-pointer"
              title="Aramayı Temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-bold text-amber-300 bg-purple-950/90 border border-purple-700/50 px-2 py-0.5 rounded-lg shrink-0">
            {toplamSayi} Mutfak
          </span>
        </div>
      </div>
    </div>
  );
};
