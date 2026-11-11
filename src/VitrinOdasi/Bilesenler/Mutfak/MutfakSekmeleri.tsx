import React from 'react';
import { Utensils, MessageSquare } from 'lucide-react';

interface MutfakSekmeleriOzellikleri {
  aktifSekme: 'menu' | 'yorumlar';
  sekmeDegisti: (sekme: 'menu' | 'yorumlar') => void;
  kategoriler: string[];
  seciliKategori: string;
  kategoriSecildi: (kategori: string) => void;
}

export const MutfakSekmeleri: React.FC<MutfakSekmeleriOzellikleri> = ({
  aktifSekme,
  sekmeDegisti,
  kategoriler,
  seciliKategori,
  kategoriSecildi
}) => {
  return (
    <div className="sticky top-0 z-30 bg-[#1A0A1D]/95 backdrop-blur-md border-b border-purple-900/40">
      <div className="max-w-4xl mx-auto px-4">
        {/* Üst Sekmeler: Menü vs Aşçı & Yorumlar */}
        <div className="flex border-b border-purple-900/30">
          <button
            type="button"
            onClick={() => sekmeDegisti('menu')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              aktifSekme === 'menu'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-purple-300/70 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Yemek Menüsü</span>
          </button>

          <button
            type="button"
            onClick={() => sekmeDegisti('yorumlar')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              aktifSekme === 'yorumlar'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-purple-300/70 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Aşçı & Yorumlar</span>
          </button>
        </div>

        {/* Kategori Hapları (Sadece Menü Sekmesinde) */}
        {aktifSekme === 'menu' && (
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {kategoriler.map((kat) => {
              const aktif = kat === seciliKategori;
              return (
                <button
                  key={kat}
                  type="button"
                  onClick={() => kategoriSecildi(kat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    aktif
                      ? 'bg-amber-500 text-[#1A0A1D] shadow-md font-bold'
                      : 'bg-[#291030] text-purple-200 border border-purple-900/50 hover:border-amber-400/40'
                  }`}
                >
                  {kat}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
