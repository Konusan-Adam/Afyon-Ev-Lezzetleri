import React, { useState } from 'react';
import { Star, Clock, Bike, ShieldCheck, Heart, Share2, Check } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

export const MasaustuMutfakBasligi: React.FC<{ mutfak: Mutfak }> = ({ mutfak }) => {
  const [favoride, setFavoride] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);
  const { ayarlar } = useKuryeAyarlari();

  const paylasTiklandi = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      // sessizce geç
    }
  };

  const gorselUrl = mutfak.gorsel_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-6 border border-purple-900/50 shadow-2xl min-h-[230px] sm:min-h-[260px] lg:min-h-[280px] flex flex-col justify-between bg-[#2A0F33]">
      {/* Geniş Kapak Arka Plan Görseli */}
      <img
        src={gorselUrl}
        alt={mutfak.ad}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Karartma Gradyanı: Üstte ve altta mükemmel kontrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#14061A]" />

      {/* 1. Üst Sıra: Rozetler & Aksiyon Butonları */}
      <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#2C0E35]/90 backdrop-blur-md text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Onaylı Afyon Ev Mutfağı</span>
          </span>
          {mutfak.acik_mi !== false ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/50 px-3 py-1.5 rounded-xl shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sipariş Alıyor (Açık)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-950/90 backdrop-blur-md text-rose-300 border border-rose-500/50 px-3 py-1.5 rounded-xl shadow-md">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Şu An Kapalı</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-bold shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{mutfak.puan?.toFixed(1) || '5.0'}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-800/40 text-purple-200 text-xs font-semibold shadow-lg">
            <Bike className="w-3.5 h-3.5 text-[#DDAF53]" />
            <span>{ayarlar.taban_ucret > 0 ? `${ayarlar.taban_ucret} ₺ Kurye` : 'Ücretsiz Kurye'}</span>
          </div>

          <button
            type="button"
            onClick={paylasTiklandi}
            className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-lg"
            title="Mutfağı Paylaş"
          >
            {kopyalandi ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setFavoride(!favoride)}
            className={`w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg ${
              favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
            }`}
            title="Favorilere Ekle"
          >
            <Heart className={`w-4 h-4 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Alt Sıra: Mutfak Başlığı & Açıklaması */}
      <div className="relative z-20 p-4 sm:p-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
          {mutfak.ad}
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/90 drop-shadow-sm max-w-2xl line-clamp-2">
          {mutfak.aciklama || 'Afyonkarahisar anne eliyle taze pişirilen sıcak ev lezzetleri.'}
        </p>
      </div>
    </div>
  );
};
