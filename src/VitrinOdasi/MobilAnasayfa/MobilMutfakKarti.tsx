import React from 'react';
import { Star, Clock, Bike, Coffee } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';
import { mutfakMolaDurumuGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';

interface MutfakKartiOzellikleri {
  mutfak: Mutfak;
  onSec?: (mutfak: Mutfak) => void;
}

export const MobilMutfakKarti: React.FC<MutfakKartiOzellikleri> = ({
  mutfak,
  onSec,
}) => {
  const { ayarlar } = useKuryeAyarlari();
  const anlikDakika = useCanliDakika();
  const molaBilgisi = mutfakMolaDurumuGetir(mutfak, anlikDakika);

  const teslimatMetniGetir = () => {
    const ucret = Number(ayarlar.taban_ucret) || 0;
    return ucret === 0 ? 'Ücretsiz' : `${ucret} ₺`;
  };

  const hazirlanmaSuresi = mutfak.hazirlanma_suresi?.trim() || '25-35 dk';
  const altBilgi = mutfak.mahalle?.trim() || mutfak.aciklama || mutfak.adres || 'Afyon Merkez';

  return (
    <article
      onClick={() => onSec?.(mutfak)}
      className={`shrink-0 w-[240px] bg-[#240E2A] rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg cursor-pointer group active:scale-[0.98] ${
        molaBilgisi.siparisEngelliMi ? 'border-amber-700/40 opacity-85' : 'border-purple-900/40 hover:border-amber-500/40'
      }`}
    >
      <div className="relative h-28 w-full overflow-hidden bg-[#290F30] flex items-center justify-center">
        <img
          src="/marka_logosu.jpg"
          alt={mutfak.ad}
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-transparent pointer-events-none" />

        {molaBilgisi.siparisEngelliMi && (
          <div className="absolute top-2.5 left-2.5 bg-amber-950/90 border border-amber-500/60 px-2 py-0.5 rounded-full flex items-center gap-1 text-amber-200 text-[10px] font-bold">
            <Coffee className="w-3 h-3 text-amber-400" />
            <span>{molaBilgisi.moladaMi ? 'Molada' : molaBilgisi.kapaliEtiketi}</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-400/40 text-amber-300 text-xs font-bold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{mutfak.puan?.toFixed(1) || '4.9'}</span>
        </div>
      </div>

      <div className="p-3">
        <h4 className="text-white text-xs font-bold truncate group-hover:text-amber-400 transition-colors">
          {mutfak.ad}
        </h4>
        <p className="text-[10px] text-purple-300/70 truncate mt-0.5">
          {molaBilgisi.moladaMi
            ? `Dinlenmede${molaBilgisi.molaBitisZamani ? ` • Açılış: ${molaBilgisi.molaBitisZamani}` : ''}`
            : altBilgi}
        </p>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-900/30 text-[10px]">
          <div className="flex items-center gap-1 text-purple-300/80">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{hazirlanmaSuresi}</span>
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
