import React from 'react';
import { ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { useSepet } from '@/src/OrtakHavuz/SepetHavuzu';
import { useKullanici } from '@/src/OrtakHavuz/KullaniciHavuzu';

export const UstBaslik: React.FC = () => {
  const { toplamUrunSayisi, sepetiAcKapat } = useSepet();
  const { kullanici } = useKullanici();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            🦁
          </div>
          <div>
            <h1 className="font-bold text-stone-900 tracking-tight text-lg leading-tight">
              Afyon Ev Lezzetleri
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span className="truncate max-w-[180px] sm:max-w-xs">
                {kullanici?.seciliAdres || 'Afyonkarahisar / Merkez'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => sepetiAcKapat(true)}
            className="relative flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Sepetim</span>
            {toplamUrunSayisi > 0 && (
              <span className="bg-white text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {toplamUrunSayisi}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
