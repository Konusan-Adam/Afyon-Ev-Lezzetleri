import React from 'react';
import { Bike, MapPin, X, ArrowRight } from 'lucide-react';
import { YeniPaketBildirimi } from '@/src/MalzemeCekmeceleri/KuryeTeslimat/useKuryeBildirimleri';

interface Props {
  uyari: YeniPaketBildirimi | null;
  onKapat: () => void;
  onPaketAl?: (id: string) => void;
}

export const KuryeYeniPaketUyarisi: React.FC<Props> = ({ uyari, onKapat, onPaketAl }) => {
  if (!uyari) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wide">YENİ PAKET HAZIR! 📦</span>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-bold">
                {uyari.zaman}
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium truncate mt-0.5">
              #{uyari.siparisKodu} • <span className="text-amber-300 font-bold">{uyari.tutar} ₺</span>
            </p>
            <p className="text-[11px] text-emerald-200 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{uyari.adres}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onPaketAl && (
            <button
              type="button"
              onClick={() => {
                onPaketAl(uyari.id);
                onKapat();
              }}
              className="px-3 py-1.5 bg-white text-emerald-900 font-black rounded-xl text-xs hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 shadow-md"
            >
              <span>Al</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
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
