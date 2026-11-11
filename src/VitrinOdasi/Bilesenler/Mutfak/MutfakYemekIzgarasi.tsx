import React from 'react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { MutfakYemekKarti } from '@/src/VitrinOdasi/Bilesenler/Mutfak/MutfakYemekKarti';
import { UtensilsCrossed } from 'lucide-react';

interface MutfakYemekIzgarasiOzellikleri {
  yemekler: Yemek[];
  yukleniyor: boolean;
}

export const MutfakYemekIzgarasi: React.FC<MutfakYemekIzgarasiOzellikleri> = ({
  yemekler,
  yukleniyor
}) => {
  if (yukleniyor) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-4xl mx-auto px-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[#240E2A]/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (yemekler.length === 0) {
    return (
      <div className="text-center py-16 px-4 text-purple-300">
        <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-40 text-amber-400" />
        <h3 className="text-sm font-bold text-white mb-1">Bu Kategoride Yemek Bulunamadı</h3>
        <p className="text-xs text-purple-300/70">Lütfen başka bir kategori seçiniz.</p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {yemekler.map((yemek) => (
          <MutfakYemekKarti key={yemek.id} yemek={yemek} />
        ))}
      </div>
    </section>
  );
};
