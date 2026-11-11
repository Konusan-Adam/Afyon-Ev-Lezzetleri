import React from 'react';
import { Tag, Check, X, AlertCircle } from 'lucide-react';
import { KuponHesaplamaSonucu } from '@/src/MalzemeCekmeceleri/useKuponHesaplayici';

interface Props {
  girilenKod: string;
  onKodDegis: (kod: string) => void;
  onUygula: () => void;
  onKaldir: () => void;
  kuponBilgisi: KuponHesaplamaSonucu | null;
  hataMesaji: string | null;
}

export const KuponUygulamaAlani: React.FC<Props> = ({
  girilenKod,
  onKodDegis,
  onUygula,
  onKaldir,
  kuponBilgisi,
  hataMesaji,
}) => {
  if (kuponBilgisi?.gecerli) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-emerald-300 truncate">
              {kuponBilgisi.kod} uygulandı (-{kuponBilgisi.indirimTutari} ₺)
            </p>
            <p className="text-[10px] text-emerald-400/80 truncate">{kuponBilgisi.baslik}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onKaldir}
          className="text-gray-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
          title="Kuponu Kaldır"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={girilenKod}
            onChange={(e) => onKodDegis(e.target.value.toUpperCase())}
            placeholder="İndirim kupon kodu"
            className="w-full bg-[#1A081D] border border-purple-900/60 rounded-xl pl-8 pr-2 py-1.5 text-xs text-white uppercase font-mono placeholder:text-purple-400/50 focus:outline-none focus:border-amber-400"
          />
        </div>
        <button
          type="button"
          onClick={onUygula}
          className="bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-sm shrink-0"
        >
          Uygula
        </button>
      </div>

      {hataMesaji && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 px-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{hataMesaji}</span>
        </p>
      )}
    </div>
  );
};
