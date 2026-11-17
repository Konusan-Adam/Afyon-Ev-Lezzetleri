import React, { useState } from 'react';
import { Clock, Store, Layers, ChevronRight } from 'lucide-react';
import { CokluMenuTipi } from '@/src/veritabani/VeriTipleri';
import { CokluMenuKolajGorseli } from './CokluMenuKolajGorseli';

interface CokluMenuKartiProps {
  menu: CokluMenuTipi;
  onSec: (menu: CokluMenuTipi) => void;
}

export const CokluMenuKarti: React.FC<CokluMenuKartiProps> = ({ menu, onSec }) => {
  const [hover, setHover] = useState(false);
  const cesitSayisi = menu.kalemler?.length || 0;
  const hazirlanma = menu.hazirlanma_suresi?.trim() || '35-45 dk';
  const kalemToplam = (menu.kalemler || []).reduce((t, k) => t + (Number(k.fiyat) || 0), 0);
  const etkinFiyat = Number(menu.fiyat) > 0 ? Number(menu.fiyat) : kalemToplam;

  return (
    <article
      onClick={() => onSec(menu)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-[#240E2A] rounded-2xl border border-purple-900/50 hover:border-amber-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-950/60 overflow-hidden flex flex-col justify-between cursor-pointer group active:scale-[0.99] h-full"
    >
      {/* Üst: Bölünmüş Görsel Kolajı */}
      <div className="relative">
        <CokluMenuKolajGorseli
          kalemler={menu.kalemler || []}
          kapakGorselleri={menu.kapak_gorselleri || []}
          baslik={menu.baslik}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-black/35 pointer-events-none" />

        {/* Çeşit Sayısı Rozeti */}
        <div className="absolute top-2.5 left-2.5 bg-amber-500 text-[#1A0A1D] text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>{cesitSayisi} Çeşit</span>
        </div>

        {/* Hazırlık Süresi */}
        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md border border-purple-700/50 text-purple-100 text-[11px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{hazirlanma}</span>
        </div>
      </div>

      {/* Alt: Başlık, Mutfak ve Fiyat */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {menu.mutfak_adi && (
            <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-semibold mb-1 truncate">
              <Store className="w-3 h-3 shrink-0" />
              <span className="truncate">{menu.mutfak_adi}</span>
            </div>
          )}
          <h4 className="text-white text-sm sm:text-base font-extrabold line-clamp-1 group-hover:text-amber-300 transition-colors">
            {menu.baslik}
          </h4>
          {menu.aciklama && (
            <p className="text-xs text-purple-200/75 line-clamp-2 mt-1 leading-relaxed">
              {menu.aciklama}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-purple-900/40">
          <div>
            <span className="text-[10px] text-purple-300/70 block -mb-0.5">
              {menu.fiyat_tipi === 'kalem_toplam' ? 'Menü Toplamı' : 'Paket Fiyatı'}
            </span>
            <span className="text-amber-400 font-black text-base sm:text-lg tracking-tight">
              {etkinFiyat} ₺
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 font-black px-3.5 py-2 rounded-xl text-xs shadow-md transition-all ${
              hover
                ? 'bg-amber-400 text-[#1A0A1D]'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950'
            }`}
          >
            <span>İncele</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
        </div>
      </div>
    </article>
  );
};
