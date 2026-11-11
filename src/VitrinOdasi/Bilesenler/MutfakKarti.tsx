import React from 'react';
import { Star, Clock, ShieldCheck } from 'lucide-react';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';

interface Props {
  mutfak: MutfakTipi;
}

export const MutfakKarti: React.FC<Props> = ({ mutfak }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-40 w-full relative overflow-hidden bg-stone-100">
        <img
          src={mutfak.gorsel_url}
          alt={mutfak.ad}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {mutfak.hijyen_onayli_mi && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hijyen Onaylı</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-stone-900 text-base">{mutfak.ad}</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{mutfak.puan.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{mutfak.aciklama}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{mutfak.calisma_saatleri}</span>
          </div>
          <span className="font-medium text-stone-800">Min. {mutfak.min_siparis_tutari || 100} ₺</span>
        </div>
      </div>
    </div>
  );
};
