import React from 'react';
import { Store, MapPin, Clock, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

interface SubeBaslikKartiProps {
  sube: GelAlSubesi;
  urunSayisi: number;
}

export const SubeBaslikKarti: React.FC<SubeBaslikKartiProps> = ({ sube, urunSayisi }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#200A26] via-[#2D0F34] to-[#18061F] border border-[#521E5C] p-4 sm:p-6 shadow-2xl text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#3D1446] border border-[#DDAF53]/60 flex items-center justify-center shrink-0 shadow-lg text-[#DDAF53]">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Resmi Şube & Tezgah
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Canlı Stok Aktif
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1 leading-snug">
              {sube.ad}
            </h2>
            <p className="text-xs text-purple-200/80 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{sube.adres}</span>
            </p>
          </div>
        </div>

        {/* Sağ Bilgi Kutucukları */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#16061B]/80 border border-purple-800/50 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{sube.calisma_saatleri || '09:00 - 22:00'}</span>
          </div>
          {sube.telefon && (
            <div className="px-3 py-1.5 rounded-xl bg-[#16061B]/80 border border-purple-800/50 flex items-center gap-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{sube.telefon}</span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tezgahta {urunSayisi} Çeşit Taze Stok</span>
          </div>
        </div>
      </div>
    </div>
  );
};
