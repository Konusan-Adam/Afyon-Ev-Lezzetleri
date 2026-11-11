import React from 'react';
import { Store } from 'lucide-react';
import { mutfaklariGetir } from '@/src/MalzemeCekmeceleri/Mutfak/mutfaklariGetir';
import { MobilDikeyMutfakKarti } from './MobilDikeyMutfakKarti';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { Mutfak } from '@/src/veritabani/VeriTipleri';

interface MobilTumMutfaklarListesiOzellikleri {
  mutfakSecildi?: (mutfak: Mutfak) => void;
}

export const MobilTumMutfaklarListesi: React.FC<MobilTumMutfaklarListesiOzellikleri> = ({
  mutfakSecildi
}) => {
  const { mutfaklar, yukleniyor } = mutfaklariGetir();
  const { aramaMetni } = aramaVeFiltreKullan();

  const filtrelenmisMutfaklar = React.useMemo(() => {
    if (!aramaMetni) return mutfaklar;
    const aranan = aramaMetni.toLowerCase();
    return mutfaklar.filter(m => 
      m.ad.toLowerCase().includes(aranan) || 
      m.aciklama?.toLowerCase().includes(aranan)
    );
  }, [mutfaklar, aramaMetni]);

  if (yukleniyor && mutfaklar.length === 0) {
    return (
      <section className="w-full py-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-64 bg-purple-950/20 rounded-2xl animate-pulse hidden sm:block" />
        </div>
      </section>
    );
  }

  return (
    <section id="afyon-mutfaklari" className="w-full py-4 px-4">
      {/* Liste Başlığı */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-400" />
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide">
            Afyon Ev Mutfakları & Aşçıları
          </h3>
        </div>
        <span className="text-[11px] text-purple-300/80 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-800/40">
          {filtrelenmisMutfaklar.length} Mutfak
        </span>
      </div>

      {/* Responsive Izgara: Mobilde 1, Tablette 2, Masaüstünde 3 Sıra */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrelenmisMutfaklar.map((mutfak) => (
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
