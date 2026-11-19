import React from 'react';
import { ArrowRight, Check, Layers } from 'lucide-react';
import { Kategori, AltKategori } from '@/src/MalzemeCekmeceleri/kategorileriGetir';

interface AramaAltKategoriMegaAlaniOzellikleri {
  kategori: Kategori | null;
  altKategoriler: AltKategori[];
  seciliKategoriAd?: string;
  seciliAltKategoriAd?: string;
  acikMi: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onTumKategoriSec: (kategoriAd: string) => void;
  onAltKategoriSec: (kategoriAd: string, altKategoriAd: string) => void;
}

export const AramaAltKategoriMegaAlani: React.FC<AramaAltKategoriMegaAlaniOzellikleri> = ({
  kategori,
  altKategoriler,
  seciliKategoriAd,
  seciliAltKategoriAd,
  acikMi,
  onMouseEnter,
  onMouseLeave,
  onTumKategoriSec,
  onAltKategoriSec,
}) => {
  if (!kategori || altKategoriler.length === 0) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`rounded-2xl border p-3.5 space-y-2.5 transition-all duration-150 ${
        acikMi
          ? 'bg-white border-amber-200 shadow-sm'
          : 'bg-[#220B29] border-purple-800/60 shadow-inner'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className={`text-xs font-bold truncate ${acikMi ? 'text-gray-900' : 'text-white'}`}>
            {kategori.ad}
          </span>
          <span className={`text-[11px] tabular-nums shrink-0 ${acikMi ? 'text-gray-500' : 'text-purple-300/80'}`}>
            · {altKategoriler.length} alt çeşit
          </span>
        </div>

        <button
          type="button"
          onClick={() => onTumKategoriSec(kategori.ad)}
          className={`text-[11px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            acikMi ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {altKategoriler.map((alt) => {
          const seciliMi = seciliKategoriAd === kategori.ad && seciliAltKategoriAd === alt.ad;
          return (
            <button
              key={alt.id}
              type="button"
              onClick={() => onAltKategoriSec(kategori.ad, alt.ad)}
              className={`px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all ${
                seciliMi
                  ? 'bg-amber-400 text-purple-950 border-amber-300 font-bold shadow-xs'
                  : acikMi
                  ? 'bg-[#FAF4EB]/80 hover:bg-amber-100 text-gray-800 border-amber-200/80 hover:border-amber-400'
                  : 'bg-[#17061C] hover:bg-[#33103D] text-gray-200 hover:text-white border-purple-900/50 hover:border-amber-400/50'
              }`}
            >
              <span className="text-xs font-medium truncate">{alt.ad}</span>
              {seciliMi ? (
                <Check className="w-3.5 h-3.5 shrink-0 text-purple-950" />
              ) : (
                <ArrowRight className="w-3 h-3 shrink-0 text-amber-500 opacity-75" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
