import React from 'react';
import { Star, Clock, Bike } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useMutfakTeslimatAyari } from '@/src/MalzemeCekmeceleri/useMutfakTeslimatAyari';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface MutfakKartiOzellikleri {
  mutfak: Mutfak;
  onSec?: (mutfak: Mutfak) => void;
}

export const MobilMutfakKarti: React.FC<MutfakKartiOzellikleri> = ({
  mutfak,
  onSec
}) => {
  const { ayar } = useMutfakTeslimatAyari(mutfak.id);

  const teslimatMetniGetir = () => {
    if (ayar.teslimatUcreti === 0) {
      return 'Ücretsiz';
    }
    return `${ayar.teslimatUcreti} ₺`;
  };

  return (
    <article
      onClick={() => onSec?.(mutfak)}
      className="shrink-0 w-[240px] bg-[#240E2A] rounded-2xl overflow-hidden border border-purple-900/40 hover:border-amber-500/40 transition-all duration-300 shadow-lg cursor-pointer group active:scale-[0.98]"
    >
      {/* Mutfak Kapak Görseli ve Puan Rozeti */}
      <div className="relative h-28 w-full overflow-hidden bg-purple-950/50">
        <img
          src={gorselUrlGuvenliYap(mutfak.gorsel_url)}
          alt={mutfak.ad}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-transparent" />
        
        {/* Puan Rozeti */}
        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-400/40 text-amber-300 text-xs font-bold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{mutfak.puan?.toFixed(1) || '4.9'}</span>
        </div>
      </div>

      {/* Mutfak Bilgileri */}
      <div className="p-3">
        <h4 className="text-white text-xs font-bold truncate group-hover:text-amber-400 transition-colors">
          {mutfak.ad}
        </h4>
        <p className="text-[10px] text-purple-300/70 truncate mt-0.5">
          {mutfak.aciklama || mutfak.adres || 'Afyon Merkez'}
        </p>

        {/* Alt Detaylar (Teslimat & Süre) */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-900/30 text-[10px]">
          <div className="flex items-center gap-1 text-purple-300/80">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span>25-40 dk</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-emerald-400 truncate ml-2">
            <Bike className="w-3 h-3 shrink-0" />
            <span className="truncate">{teslimatMetniGetir()}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
