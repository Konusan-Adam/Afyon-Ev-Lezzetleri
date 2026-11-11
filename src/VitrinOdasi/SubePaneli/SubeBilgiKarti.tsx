import React from 'react';
import { Store, Clock, ShieldCheck, Video, Phone, MapPin } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

interface Props {
  sube: GelAlSubesi;
  onCanliYayinToggle?: () => void;
}

export const SubeBilgiKarti: React.FC<Props> = ({ sube, onCanliYayinToggle }) => {
  return (
    <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-3.5 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#3E1646] border border-[#6D237A] flex items-center justify-center text-[#DDAF53] shrink-0">
          <Store className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 inline-block">
            Şube Yönetim Merkezi
          </span>
          <h2 className="text-sm sm:text-lg font-bold text-white mt-0.5 truncate">{sube.ad}</h2>
          <p className="text-[11px] sm:text-xs text-stone-300 flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#DDAF53] shrink-0" />
            <span className="truncate">{sube.adres}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <div className="bg-[#180A1F] border border-[#3E1646] rounded-xl px-3 py-2 text-xs flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#DDAF53]" />
          <span>{sube.calisma_saatleri || '09:00 - 22:00'}</span>
        </div>

        <div className="bg-[#180A1F] border border-[#3E1646] rounded-xl px-3 py-2 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Hijyen: %{sube.hijyen_puani || 98}</span>
        </div>

        <button
          onClick={onCanliYayinToggle}
          type="button"
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border ${
            sube.canli_yayin_aktif_mi
              ? 'bg-rose-950/80 border-rose-500 text-rose-200'
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
          }`}
        >
          <Video className="w-4 h-4" />
          {sube.canli_yayin_aktif_mi ? 'Canlı Yayını Kapat' : 'Canlı Yayını Aç'}
        </button>
      </div>
    </div>
  );
};
