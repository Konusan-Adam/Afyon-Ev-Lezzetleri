import React from 'react';
import { X, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface LezzetDanismaniBaslikProps {
  cevapBekleniyor: boolean;
  sesliOkumaAktif: boolean;
  sesliOkumaDegistir: () => void;
  kapatTiklandi: () => void;
  sifirlaTiklandi: () => void;
}

export const LezzetDanismaniBaslik: React.FC<LezzetDanismaniBaslikProps> = ({
  cevapBekleniyor,
  sesliOkumaAktif,
  sesliOkumaDegistir,
  kapatTiklandi,
  sifirlaTiklandi,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#1e0e33] via-[#2d124d] to-[#1a0c2e] text-white p-3.5 sm:p-4 rounded-t-2xl flex items-center justify-between shadow-lg border-b border-amber-500/25 select-none">
      <div className="flex items-center gap-3">
        {/* Kurumsal Canlı Marka Rozeti */}
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full border-2 border-amber-400/80 overflow-hidden shadow-md bg-stone-900 ${
              cevapBekleniyor ? 'animate-pulse ring-2 ring-amber-400' : ''
            }`}
          >
            <img
              src="/marka_logosu.jpg"
              alt="Afyon Ev Lezzetleri"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1e0e33] rounded-full shadow-xs" />
        </div>

        <div>
          <h3 className="font-bold text-sm sm:text-base text-amber-100 flex items-center gap-1.5 tracking-wide">
            Afyon Lezzet Danışmanı
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </h3>
          <p className="text-[11px] text-amber-300/80 font-medium">
            {cevapBekleniyor ? 'Özel lezzet hazırlanıyor...' : 'Kurumsal Rehber • Çevrimiçi'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Ses Aç / Kapat Butonu */}
        <button
          onClick={sesliOkumaDegistir}
          title={sesliOkumaAktif ? 'Sesli Yanıtı Kapat' : 'Sesli Yanıtı Aç'}
          className={`p-1.5 rounded-lg transition-colors ${
            sesliOkumaAktif
              ? 'text-amber-300 hover:text-white hover:bg-white/10'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          {sesliOkumaAktif ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Sohbeti Temizle Butonu */}
        <button
          onClick={sifirlaTiklandi}
          title="Sohbeti Temizle"
          className="p-1.5 text-amber-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Kapat Butonu */}
        <button
          onClick={kapatTiklandi}
          title="Kapat"
          className="p-1.5 text-amber-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
