import React from 'react';
import { Star, Clock, Bike, MapPin, Coffee } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';
import { mutfakMolaDurumuGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

interface DikeyMutfakKartiOzellikleri {
  mutfak: Mutfak;
  onSec?: (mutfak: Mutfak) => void;
}

export const MobilDikeyMutfakKarti: React.FC<DikeyMutfakKartiOzellikleri> = ({
  mutfak,
  onSec,
}) => {
  const { ayarlar } = useKuryeAyarlari();
  const molaBilgisi = mutfakMolaDurumuGetir(mutfak);

  const teslimatMetniGetir = () => {
    const ucret = Number(ayarlar.taban_ucret) || 0;
    return ucret === 0 ? 'Ücretsiz' : `${ucret} ₺`;
  };

  const mahalleMetni = mutfak.mahalle?.trim() || mutfak.adres?.trim() || 'Afyon Merkez';
  const hazirlanmaSuresi = mutfak.hazirlanma_suresi?.trim() || '25-35 dk';

  return (
    <article
      onClick={() => onSec?.(mutfak)}
      className={`w-full bg-[#240E2A] rounded-2xl overflow-hidden border transition-all duration-300 shadow-md cursor-pointer group active:scale-[0.99] flex flex-col justify-between h-full ${
        molaBilgisi.siparisEngelliMi ? 'border-amber-700/40 opacity-85' : 'border-purple-900/40 hover:border-amber-500/50'
      }`}
    >
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#290F30] shrink-0 flex items-center justify-center">
        <img
          src="/marka_logosu.jpg"
          alt={mutfak.ad}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-400/50 text-amber-300 text-xs font-bold shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{mutfak.puan?.toFixed(1) || '4.9'}</span>
        </div>

        <div className="absolute bottom-2.5 left-3 bg-purple-950/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-purple-700/50 text-[10px] text-amber-200 font-medium">
          Min. {typeof mutfak.min_siparis_tutari === 'number' ? mutfak.min_siparis_tutari : 100} ₺
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-white text-sm font-bold group-hover:text-amber-400 transition-colors line-clamp-1">
              {mutfak.ad}
            </h4>
            {molaBilgisi.moladaMi ? (
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/70 border border-amber-600/60 px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Dinlenmede
              </span>
            ) : molaBilgisi.kapaliMi ? (
              <span className="text-[10px] text-rose-400 font-semibold bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded-md shrink-0">
                Kapalı
              </span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md shrink-0">
                Açık
              </span>
            )}
          </div>

          {molaBilgisi.moladaMi && (
            <p className="text-[11px] text-amber-300 font-semibold mt-1">
              Mutfak Dinlenmede / Molada{molaBilgisi.molaBitisZamani ? ` • Açılış: ${molaBilgisi.molaBitisZamani}` : ''}
            </p>
          )}

          <p className="text-xs text-purple-200/70 mt-1 line-clamp-2">
            {mutfak.aciklama}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-purple-900/30 text-xs">
          <div className="flex items-center gap-1 text-purple-300/80 max-w-[40%] truncate" title={mahalleMetni}>
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{mahalleMetni}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1 text-purple-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{hazirlanmaSuresi}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-emerald-400 text-[11px]">
              <Bike className="w-3.5 h-3.5 shrink-0" />
              <span>{teslimatMetniGetir()}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
