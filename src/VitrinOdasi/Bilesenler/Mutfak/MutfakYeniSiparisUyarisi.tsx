import React from 'react';
import { Bell, Flame, X, Utensils } from 'lucide-react';
import { YeniSiparisBildirimi } from '@/src/MalzemeCekmeceleri/Mutfak/useMutfakBildirimleri';

interface Props {
  uyari: YeniSiparisBildirimi | null;
  onKapat: () => void;
  onSipariseGit?: () => void;
}

export const MutfakYeniSiparisUyarisi: React.FC<Props> = ({ uyari, onKapat, onSipariseGit }) => {
  if (!uyari) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Bell className="w-6 h-6 text-yellow-200 fill-yellow-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide">YENİ SİPARİŞ DÜŞTÜ!</span>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold">
                {uyari.zaman}
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium mt-0.5">
              #{uyari.siparisKodu} • <strong className="text-white font-bold">{uyari.musteriAdi}</strong> ({uyari.toplamTutar} ₺)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onSipariseGit && (
            <button
              type="button"
              onClick={() => {
                onSipariseGit();
                onKapat();
              }}
              className="px-3 py-1.5 bg-white text-orange-900 font-black rounded-xl text-xs hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1 shadow-md"
            >
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Ocağa Al</span>
            </button>
          )}
          <button
            type="button"
            onClick={onKapat}
            className="p-1.5 rounded-xl hover:bg-black/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
