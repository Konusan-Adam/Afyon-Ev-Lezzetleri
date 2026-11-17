import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { CokluMenuKalemiTipi } from '@/src/veritabani/VeriTipleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface CokluMenuKalemSatiriProps {
  kalem: CokluMenuKalemiTipi;
  siraNumarasi: number;
  notDegeri: string;
  onNotDegistir: (kalemId: string, yeniNot: string) => void;
}

export const CokluMenuKalemSatiri: React.FC<CokluMenuKalemSatiriProps> = ({
  kalem,
  siraNumarasi,
  notDegeri,
  onNotDegistir,
}) => {
  const guvenliGorsel = gorselUrlGuvenliYap(kalem.gorsel_url?.trim()) || '/marka_logosu.jpg';
  const [gorselHatali, setGorselHatali] = useState(!kalem.gorsel_url?.trim());
  const [notAcik, setNotAcik] = useState(Boolean(notDegeri));
  const notIzniVar = kalem.not_izinli_mi !== false;

  return (
    <div className="bg-[#240E2A] border border-purple-900/50 rounded-2xl p-3 space-y-2.5">
      <div className="flex items-start gap-3">
        {/* Sıralı Görsel */}
        <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#290F30] border border-purple-800/40">
          <img
            src={gorselHatali ? '/marka_logosu.jpg' : guvenliGorsel}
            alt={kalem.ad}
            className={`w-full h-full ${gorselHatali ? 'object-contain p-1' : 'object-cover'}`}
            loading="lazy"
            onError={() => {
              if (!gorselHatali) setGorselHatali(true);
            }}
          />
          <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/80 text-amber-300 text-[10px] font-black flex items-center justify-center border border-amber-500/40">
            {siraNumarasi}
          </span>
        </div>

        {/* Yemek Bilgisi */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-white leading-snug">
              {siraNumarasi}. {kalem.ad}
            </h4>
            {Number(kalem.fiyat) > 0 && (
              <span className="text-xs font-extrabold text-amber-400 shrink-0">
                {kalem.fiyat} ₺
              </span>
            )}
          </div>
          {kalem.aciklama && (
            <p className="text-xs text-purple-200/75 mt-1 leading-relaxed">
              {kalem.aciklama}
            </p>
          )}
        </div>
      </div>

      {/* İsteğe Bağlı Müşteri Notu */}
      {notIzniVar && (
        <div className="pt-1 border-t border-purple-900/30">
          {!notAcik ? (
            <button
              type="button"
              onClick={() => setNotAcik(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-300/90 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Bu yemek için özel not ekle</span>
            </button>
          ) : (
            <input
              type="text"
              value={notDegeri}
              onChange={(e) => onNotDegistir(kalem.id, e.target.value)}
              placeholder="Örn: Soğan olmasın, acısız olsun..."
              maxLength={140}
              className="w-full bg-[#16061A] border border-purple-800/60 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-400/50 outline-none transition-colors"
            />
          )}
        </div>
      )}
    </div>
  );
};
