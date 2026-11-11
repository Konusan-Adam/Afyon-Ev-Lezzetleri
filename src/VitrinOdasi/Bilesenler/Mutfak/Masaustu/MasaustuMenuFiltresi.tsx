import React from 'react';
import { Search } from 'lucide-react';

interface MenuFiltresiOzellikleri {
  aramaMetni: string;
  aramaDegisti: (metin: string) => void;
  kategoriler: string[];
  seciliKategori: string;
  kategoriSecildi: (kategori: string) => void;
}

export const MasaustuMenuFiltresi: React.FC<MenuFiltresiOzellikleri> = ({
  aramaMetni,
  aramaDegisti,
  kategoriler,
  seciliKategori,
  kategoriSecildi
}) => {
  return (
    <div className="bg-[#240E2A] rounded-2xl p-4 border border-purple-900/50 mb-5 shadow-lg space-y-3.5">
      {/* Arama Girişi */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
        <input
          type="text"
          value={aramaMetni}
          onChange={(e) => aramaDegisti(e.target.value)}
          placeholder="Bu mutfağın menüsünde lezzet ara (ör. bükme, keşkek, güveç)..."
          className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-purple-800/60 rounded-xl text-xs text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Kategori Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {kategoriler.map((kat) => {
          const aktif = kat === seciliKategori;
          return (
            <button
              key={kat}
              type="button"
              onClick={() => kategoriSecildi(kat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                aktif
                  ? 'bg-amber-500 text-[#1A0A1D] shadow-md shadow-amber-500/20'
                  : 'bg-black/30 text-purple-200 border border-purple-900/60 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              {kat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
