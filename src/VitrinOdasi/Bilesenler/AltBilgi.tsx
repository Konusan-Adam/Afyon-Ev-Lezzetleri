import React from 'react';
import { Heart } from 'lucide-react';

export const AltBilgi: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50 py-8 text-center text-xs text-stone-500">
      <div className="max-w-7xl mx-auto px-4 space-y-2">
        <div className="flex items-center justify-center gap-1 font-medium text-stone-700">
          <span>Afyonkarahisar Ev Lezzetleri</span>
          <span>·</span>
          <span>Gastronomi Şehri Afyon</span>
        </div>
        <p className="flex items-center justify-center gap-1">
          <span>Ev hanımlarının el emeğiyle</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>özenle hazırlanır.</span>
        </p>
        <p className="text-stone-400">© 2026 Afyon Ev Lezzetleri — Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};
