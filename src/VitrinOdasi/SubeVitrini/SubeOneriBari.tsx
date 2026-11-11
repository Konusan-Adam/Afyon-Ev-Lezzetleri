import React from 'react';
import { Store, Flame, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { SubeUrunKarti } from './SubeUrunKarti';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';

interface SubeOneriBariProps {
  sube: GelAlSubesi;
  mahalleAdi?: string;
  onSubeVitriniAc: (sube: GelAlSubesi) => void;
}

export const SubeOneriBari: React.FC<SubeOneriBariProps> = ({
  sube,
  mahalleAdi,
  onSubeVitriniAc,
}) => {
  const subeId = sube.id || sube.kimlik || 'sube-1';
  const { urunler } = useSubeUrunleri(subeId);

  if (urunler.length === 0) return null;

  return (
    <section className="w-full my-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#2A0E32] via-[#1E0926] to-[#2D0F34] border border-[#521E5C] shadow-xl text-white">
      {/* Üst Vurgu Barı */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-purple-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-md">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{mahalleAdi ? `${mahalleAdi} Bölgesine En Yakın Şubeniz` : 'En Yakın Dağıtım & Gel-Al Şubeniz'}</span>
            </div>
            <h3 className="text-base font-black text-white">{sube.ad}</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSubeVitriniAc(sube)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
        >
          <span>Tüm Şube Tezgahını Gör ({urunler.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* İlk 4 Hazır Sıcak Ürün */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {urunler.slice(0, 4).map((urun) => (
          <SubeUrunKarti 
            key={urun.id} 
            urun={urun} 
            detayAc={() => onSubeVitriniAc(sube)}
          />
        ))}
      </div>
    </section>
  );
};
