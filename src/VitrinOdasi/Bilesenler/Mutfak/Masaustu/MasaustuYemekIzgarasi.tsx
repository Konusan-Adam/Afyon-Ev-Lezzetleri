import React from 'react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { MasaustuYemekKarti } from './MasaustuYemekKarti';
import { UtensilsCrossed } from 'lucide-react';

interface IzgaraOzellikleri {
  yemekler: Yemek[];
  yukleniyor: boolean;
}

export const MasaustuYemekIzgarasi: React.FC<IzgaraOzellikleri> = ({ yemekler, yukleniyor }) => {
  if (yukleniyor) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-[#240E2A]/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (yemekler.length === 0) {
    return (
      <div className="bg-[#240E2A]/60 rounded-2xl border border-purple-900/40 p-12 text-center text-purple-300">
        <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-amber-400/50" />
        <h4 className="text-sm font-bold text-white mb-1">Aradığınız Lezzet Bulunamadı</h4>
        <p className="text-xs text-purple-300/70">Arama kriterini veya kategoriyi değiştirerek yeniden deneyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {yemekler.map((yemek) => (
        <MasaustuYemekKarti key={yemek.id} yemek={yemek} />
      ))}
    </div>
  );
};
