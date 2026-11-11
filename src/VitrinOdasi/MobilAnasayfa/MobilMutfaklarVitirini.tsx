import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { oneCikanMutfaklariGetir } from '@/src/MalzemeCekmeceleri/Mutfak/oneCikanMutfaklariGetir';
import { MobilMutfakKarti } from './MobilMutfakKarti';
import { MobilDikeyMutfakKarti } from './MobilDikeyMutfakKarti';
import { Mutfak } from '@/src/veritabani/VeriTipleri';

interface MobilMutfaklarVitiriniOzellikleri {
  mutfakSecildi?: (mutfak: Mutfak) => void;
}

export const MobilMutfaklarVitirini: React.FC<MobilMutfaklarVitiriniOzellikleri> = ({
  mutfakSecildi
}) => {
  const { oneCikanMutfaklar, yukleniyor } = oneCikanMutfaklariGetir();

  if (yukleniyor && oneCikanMutfaklar.length === 0) {
    return (
      <section className="w-full py-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse hidden sm:block" />
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse hidden lg:block" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-4 px-4">
      {/* Akıllı Vitrin Başlık Satırı */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide">
            Öne Çıkan Yıldız Ev Aşçıları
          </h3>
        </div>
        <button
          type="button"
          className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
        >
          <span>En İyiler</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* SADECE MOBİL & TABLET: Yatay Kaydırılabilir Podyum Kartları */}
      <div className="flex lg:hidden items-center gap-3.5 overflow-x-auto -mx-4 px-4 no-scrollbar scroll-smooth">
        {oneCikanMutfaklar.map((mutfak) => (
          <MobilMutfakKarti
            key={mutfak.id}
            mutfak={mutfak}
            onSec={mutfakSecildi}
          />
        ))}
      </div>

      {/* SADECE MASAÜSTÜ: Yukarıdakiyle Birebir Aynı Kalıp ve Boyutta 4'lü Izgara */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {oneCikanMutfaklar.map((mutfak) => (
          <MobilDikeyMutfakKarti
            key={mutfak.id}
            mutfak={mutfak}
            onSec={mutfakSecildi}
          />
        ))}
      </div>
    </section>
  );
};
