import React from 'react';
import { Bike, ChevronRight } from 'lucide-react';

interface MobilAktifSiparisSeridiOzellikleri {
  aktifSiparisSayisi: number;
  takipTiklandi: () => void;
  altMenuGorunur: boolean;
}

export const MobilAktifSiparisSeridi: React.FC<MobilAktifSiparisSeridiOzellikleri> = ({
  aktifSiparisSayisi,
  takipTiklandi,
  altMenuGorunur,
}) => {
  if (aktifSiparisSayisi <= 0) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${
        altMenuGorunur ? 'bottom-16' : 'bottom-0'
      }`}
    >
      <button
        type="button"
        onClick={takipTiklandi}
        className="w-full bg-[#260C2F]/95 hover:bg-[#331140] backdrop-blur-md border-t border-amber-500/40 px-4 py-2 shadow-lg transition-colors active:brightness-95 cursor-pointer"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-[#180A1F] shadow-sm">
              <Bike className="w-3.5 h-3.5 stroke-[2.4]" />
              <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-black text-white border border-[#180A1F]">
                {aktifSiparisSayisi}
              </span>
            </span>
            <span className="text-xs font-bold text-amber-200 truncate">
              {aktifSiparisSayisi} Aktif Siparişin Var
            </span>
          </div>

          <span className="inline-flex items-center gap-0.5 shrink-0 text-[11px] font-extrabold text-amber-400">
            Takip Et
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
          </span>
        </div>
      </button>
    </div>
  );
};
