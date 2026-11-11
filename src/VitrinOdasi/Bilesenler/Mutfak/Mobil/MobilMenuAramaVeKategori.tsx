import React from 'react';
import { Search, Utensils, Flame } from 'lucide-react';

interface MobilMenuAramaVeKategoriOzellikleri {
  aramaMetni: string;
  onAramaDegisti: (metin: string) => void;
  kategoriler: string[];
  seciliKategori: string;
  onKategoriSecildi: (kat: string) => void;
}

export const MobilMenuAramaVeKategori: React.FC<MobilMenuAramaVeKategoriOzellikleri> = ({
  aramaMetni,
  onAramaDegisti,
  kategoriler,
  seciliKategori,
  onKategoriSecildi,
}) => {
  return (
    <div className="mt-4 px-4 space-y-3 sticky top-0 z-30 bg-[#120415]/95 backdrop-blur-md pt-2 pb-1 border-b border-purple-900/30">
      {/* Menü İçi Arama Kutusu */}
      <div className="relative">
        <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={aramaMetni}
          onChange={(e) => onAramaDegisti(e.target.value)}
          placeholder="Menüde ara (Örn: Bükme, Haşhaşlı, Baklava)..."
          className="w-full bg-[#18051D] border border-purple-900/60 rounded-full pl-9 pr-4 py-2.5 text-xs text-white placeholder-purple-300/40 outline-none focus:border-fuchsia-500 transition-colors"
        />
      </div>

      {/* Yatay Kaydırılabilir Kategori Sekmeleri */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-1">
        {/* Tümü Sekmesi */}
        <button
          type="button"
          onClick={() => onKategoriSecildi('Tümü')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold shrink-0 transition-colors cursor-pointer border-b-2 ${
            seciliKategori === 'Tümü'
              ? 'border-fuchsia-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Tümü</span>
        </button>

        {/* Popüler Sekmesi */}
        <button
          type="button"
          onClick={() => onKategoriSecildi('Popüler')}
          className={`flex items-center gap-1.5 pb-2 text-xs font-bold shrink-0 transition-colors cursor-pointer border-b-2 ${
            seciliKategori === 'Popüler'
              ? 'border-fuchsia-500 text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Popüler</span>
        </button>

        {/* Mutfak Kategorileri */}
        {kategoriler
          .filter((k) => k !== 'Tümü' && k !== 'Popüler')
          .map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => onKategoriSecildi(kat)}
              className={`pb-2 text-xs font-semibold shrink-0 transition-colors cursor-pointer border-b-2 ${
                seciliKategori === kat
                  ? 'border-fuchsia-500 text-white font-bold'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {kat}
            </button>
          ))}
      </div>
    </div>
  );
};
