import React from 'react';
import { Search, X } from 'lucide-react';

interface SubeAramaVeFiltreProps {
  aramaMetni: string;
  onAramaDegisti: (metin: string) => void;
  kategoriler: string[];
  seciliKategori: string;
  onKategoriSecildi: (kat: string) => void;
}

export const SubeAramaVeFiltre: React.FC<SubeAramaVeFiltreProps> = ({
  aramaMetni,
  onAramaDegisti,
  kategoriler,
  seciliKategori,
  onKategoriSecildi,
}) => {
  return (
    <div className="space-y-3.5">
      {/* 1. Canlı Arama Çubuğu */}
      <div className="relative w-full">
        <div className="w-full h-11 bg-[#200A28] border border-purple-800/60 rounded-xl px-3.5 flex items-center gap-2.5 text-xs focus-within:border-amber-400 transition-colors shadow-inner">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            value={aramaMetni}
            onChange={(e) => onAramaDegisti(e.target.value)}
            placeholder="Şube tezgahında arayın... (Örn: mercimekli bükme, ağzıaçık, kadayıf)"
            className="w-full bg-transparent text-white placeholder-purple-300/50 outline-none text-xs"
          />
          {aramaMetni && (
            <button
              type="button"
              onClick={() => onAramaDegisti('')}
              className="text-purple-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Kategori Butonları */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {kategoriler.map((kat) => (
          <button
            key={kat}
            type="button"
            onClick={() => onKategoriSecildi(kat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize shrink-0 ${
              seciliKategori === kat
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#210927] hover:bg-[#34113E] text-purple-200 border border-purple-900/40'
            }`}
          >
            {kat === 'hepsi' ? 'Tüm Tezgah Ürünleri' : kat}
          </button>
        ))}
      </div>
    </div>
  );
};
