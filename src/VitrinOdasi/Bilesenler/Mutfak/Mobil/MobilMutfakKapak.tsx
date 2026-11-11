import React, { useState } from 'react';
import { ArrowLeft, Info, Share2, Heart, Check, Sparkles, Star } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';

interface MobilMutfakKapakOzellikleri {
  mutfak: Mutfak;
  geriDonTiklandi: () => void;
  bilgiTiklandi: () => void;
}

export const MobilMutfakKapak: React.FC<MobilMutfakKapakOzellikleri> = ({
  mutfak,
  geriDonTiklandi,
  bilgiTiklandi,
}) => {
  const [favoride, setFavoride] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const paylasTiklandi = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${mutfak.ad} - Afyon Ev Lezzetleri`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setKopyalandi(true);
        setTimeout(() => setKopyalandi(false), 2000);
      }
    } catch {
      // Sessiz kal
    }
  };

  return (
    <header className="relative w-full">
      {/* Kapak Görseli */}
      <div className="relative h-44 w-full bg-[#2A0F33] overflow-visible">
        {mutfak.gorsel_url ? (
          <img src={mutfak.gorsel_url} alt={mutfak.ad} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#3B1448] to-[#1D0823]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#120415]" />

        {/* Üst Butonlar Barı */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={geriDonTiklandi}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/15 cursor-pointer active:scale-95 shadow-lg"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={bilgiTiklandi}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/15 cursor-pointer active:scale-95 shadow-lg"
              title="Mutfak Bilgileri"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={paylasTiklandi}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/15 cursor-pointer active:scale-95 shadow-lg"
              title="Paylaş"
            >
              {kopyalandi ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setFavoride(!favoride)}
              className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/15 cursor-pointer active:scale-95 shadow-lg ${
                favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
              title="Favori"
            >
              <Heart className={`w-5 h-5 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Ortalanmış Logo / Avatar */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="w-20 h-20 rounded-2xl bg-[#2D0F35] border-2 border-purple-500/50 shadow-2xl overflow-hidden flex items-center justify-center">
            {mutfak.gorsel_url ? (
              <img src={mutfak.gorsel_url} alt={mutfak.ad} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-black text-amber-400">{mutfak.ad?.substring(0, 2).toUpperCase() || '??'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Mutfak Başlığı & Rozetler */}
      <div className="pt-12 pb-3 px-4 text-center">
        <h1 className="text-white text-xl font-extrabold tracking-tight mb-2">{mutfak.ad}</h1>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 bg-[#2C0E35] text-purple-200 border border-purple-600/50 px-3 py-1 rounded-full font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Süper Mutfak</span>
          </span>
          <span className="inline-flex items-center gap-1 text-white font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{mutfak.puan?.toFixed(1) || '5'}</span>
            <span className="text-purple-300/70 font-normal">(0+ değerlendirme)</span>
          </span>
        </div>
      </div>
    </header>
  );
};
