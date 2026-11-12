import React from 'react';
import { Store, Star, ArrowRight, Heart } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { mutfakVitriniAc } from '@/src/MalzemeCekmeceleri/Mutfak/mutfakVitrinYonlendirici';

interface FavoriMutfakKartiProps {
  mutfak: Mutfak;
  onFavoridenCikar: (id: string) => void;
}

export const FavoriMutfakKarti: React.FC<FavoriMutfakKartiProps> = ({
  mutfak,
  onFavoridenCikar,
}) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1C0922] border border-purple-900/50 hover:border-amber-500/50 transition-all shadow-lg flex items-center justify-between gap-3">
      <div 
        onClick={() => mutfakVitriniAc(mutfak.id)}
        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 group"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#2C0E35] shrink-0 border border-purple-800/40">
          <img
            src={mutfak.gorsel_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80'}
            alt={mutfak.ad}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition-colors">
              {mutfak.ad}
            </h3>
            {mutfak.acik_mi !== false ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                Açık
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-600/40">
                Kapalı
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-purple-300">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mutfak.puan?.toFixed(1) || '5.0'}</span>
            </span>
            <span>•</span>
            <span className="truncate">{mutfak.aciklama || 'Afyon Ev Mutfağı'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onFavoridenCikar(mutfak.id)}
          className="p-2.5 rounded-xl bg-black/40 hover:bg-rose-950/60 text-rose-500 border border-rose-900/40 cursor-pointer active:scale-95 transition-all"
          title="Favorilerden Çıkar"
        >
          <Heart className="w-4 h-4 fill-rose-500" />
        </button>
        <button
          type="button"
          onClick={() => mutfakVitriniAc(mutfak.id)}
          className="px-3 py-2 rounded-xl bg-[#6D237A] hover:bg-[#852C94] text-white text-xs font-bold flex items-center gap-1 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <span>Lezzetler</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
