import React from 'react';
import { useMutfakAfisleri } from '@/src/MalzemeCekmeceleri/Mutfak/useMutfakAfisleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { Sparkles, ArrowRight } from 'lucide-react';

export const MutfakAfisleriBileseni: React.FC = () => {
  const { afisler, yukleniyor } = useMutfakAfisleri();
  const { tema } = temaHafizasiKullan();
  const acikMi = tema === 'acik';

  if (yukleniyor || afisler.length === 0) return null;

  const mutfakAc = (mutfakId: string) => {
    if (typeof window === 'undefined' || !mutfakId) return;
    window.dispatchEvent(
      new CustomEvent('afyon_mutfak_vitrini_ac', { detail: { mutfakId } })
    );
  };

  return (
    <section className="w-full py-2 space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        <h2 className={`font-extrabold text-sm sm:text-base tracking-tight ${acikMi ? 'text-stone-800' : 'text-white'}`}>
          Mutfakların Özel Afişleri & Duyuruları
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {afisler.map((afis) => (
          <article
            key={afis.id || afis.mutfak_id}
            onClick={() => mutfakAc(afis.mutfak_id)}
            className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-52 sm:h-56 border ${
              acikMi
                ? 'border-stone-300 bg-[#240E2A]'
                : 'border-purple-800/60 hover:border-amber-500/60 bg-[#240E2A]'
            }`}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={gorselUrlGuvenliYap(afis.gorsel_url) || '/marka_logosu.jpg'}
                alt={afis.baslik}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                style={{ objectPosition: `center ${afis.konum_y ?? 50}%` }}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/marka_logosu.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140718] via-[#140718]/45 to-black/30" />
            </div>

            <div className="relative z-10 p-3 flex justify-between items-start gap-2">
              <span className="bg-amber-500 text-stone-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-lg shadow">
                {afis.rozet || 'ÖZEL LEZZET'}
              </span>
              <span className="bg-[#1A0A1D]/85 backdrop-blur-sm text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-purple-700/60 truncate max-w-[55%]">
                {afis.mutfak_adi || 'Ev Mutfağı'}
              </span>
            </div>

            <div className="relative z-10 p-4 space-y-1.5">
              <h3 className="font-black text-white text-base sm:text-lg line-clamp-1 group-hover:text-amber-400 transition-colors">
                {afis.baslik}
              </h3>
              {afis.aciklama && (
                <p className="text-xs text-purple-100/85 line-clamp-2">
                  {afis.aciklama}
                </p>
              )}
              <div className="pt-1 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Mutfağın Menüsünü Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
