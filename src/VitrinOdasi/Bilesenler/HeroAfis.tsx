import React from 'react';
import { Flame, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HeroAfis: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-8 my-6 relative overflow-hidden shadow-lg border border-amber-800/30">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Flame className="w-4 h-4" />
          <span>AFYONKARAHİSAR GELENEKSEL MUTFAĞI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
          Usta Ev Hanımlarından Sıcak Bükme, Mantı & Keşkek
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          Karahisar’ın asırlık el emeği lezzetleri taptaze hazırlanıp kapınıza geliyor. 
          Garantili hijyen, esnaf muafiyeti ve güvenli teslimat.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-300">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>%100 Hijyen Onaylı</span>
          </div>
          <div className="flex items-center gap-1">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Ev Ekonomisine Destek</span>
          </div>
        </div>
      </div>
    </div>
  );
};
