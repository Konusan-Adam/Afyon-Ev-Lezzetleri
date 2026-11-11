import React from 'react';
import { X, Store, Clock, MapPin, Check, Phone } from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { GelAlSubesi } from '@/src/veritabani/VeriTipleri';

export const GelAlSubesiSecimPenceresi: React.FC = () => {
  const {
    gelAlPenceresiAcik,
    gelAlPenceresiKapat,
    gelAlSubeleri,
    seciliGelAlSubesi,
    gelAlSubesiSec,
  } = teslimatHafizasiKullan();

  if (!gelAlPenceresiAcik) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Üst Başlık */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#DDAF53]" />
            <div>
              <h3 className="font-bold text-base text-white">Gel-Al Teslimat Noktası</h3>
              <p className="text-[11px] text-purple-300/70">Siparişinizi elden teslim alacağınız noktayı seçin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={gelAlPenceresiKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Şube Listesi */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {gelAlSubeleri.map((sube: GelAlSubesi, sira: number) => {
            const subeKimligi = sube.id || sube.kimlik || `sube-${sira}`;
            const seciliMi = Boolean(
              (seciliGelAlSubesi?.id && (seciliGelAlSubesi.id === sube.id || seciliGelAlSubesi.id === sube.kimlik)) ||
              (seciliGelAlSubesi?.kimlik && (seciliGelAlSubesi.kimlik === sube.kimlik || seciliGelAlSubesi.kimlik === sube.id))
            );
            return (
              <button
                key={subeKimligi}
                type="button"
                onClick={() => gelAlSubesiSec(sube)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  seciliMi
                    ? 'border-[#DDAF53] bg-[#2E1235] ring-1 ring-[#DDAF53]'
                    : 'border-[#3E1646] bg-[#220B27]/70 hover:bg-[#2A102E] hover:border-purple-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Store className={`w-4 h-4 ${seciliMi ? 'text-[#DDAF53]' : 'text-purple-400'}`} />
                    <span className="font-bold text-sm text-white">{sube.ad}</span>
                  </div>
                  {seciliMi && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#DDAF53] bg-amber-950/60 px-2 py-0.5 rounded-full border border-[#DDAF53]/40">
                      <Check className="w-3 h-3" /> Seçili
                    </span>
                  )}
                </div>

                <p className="text-xs text-purple-200/80 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{sube.adres}</span>
                </p>

                <div className="flex items-center gap-3 pt-1 border-t border-purple-900/30 text-[11px] text-purple-300/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {sube.calisma_saatleri}
                  </span>
                  <span className="text-purple-600">•</span>
                  <span className="text-emerald-400 font-medium">⚡ {sube.hazirlanma_suresi}</span>
                  <span className="text-purple-600">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-purple-400" />
                    {sube.telefon}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
