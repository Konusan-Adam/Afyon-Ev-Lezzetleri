import React from 'react';
import { ChevronRight, ArrowLeft, Home } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

interface SubeYolHaritasiProps {
  sube: GelAlSubesi;
  geriDonTiklandi: () => void;
}

export const SubeYolHaritasi: React.FC<SubeYolHaritasiProps> = ({
  sube,
  geriDonTiklandi,
}) => {
  return (
    <nav className="w-full bg-[#200A25]/90 border-b border-purple-900/30 text-xs text-purple-200">
      <div className="anasayfa-genislik px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={geriDonTiklandi}
            className="flex items-center gap-1 text-purple-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ana Sayfa</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-purple-300">Gel-Al Noktaları & Şubeler</span>
          <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
          <span className="font-bold text-amber-300">{sube.ad}</span>
        </div>

        <button
          type="button"
          onClick={geriDonTiklandi}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 hover:text-white border border-purple-800/40 transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Geri Dön</span>
        </button>
      </div>
    </nav>
  );
};
