import React, { useState } from 'react';
import { ArrowLeft, Info, Share2, Heart, Check, Sparkles, Star } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';

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
  const { mutfakFavoriMi, mutfakFavoriDegistir } = favoriHafizasiKullan();
  const favoride = mutfakFavoriMi(mutfak.id);
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
      {/* Kapak Görseli ve Zeminine Dayalı Bilgi Katmanı */}
      <div className="relative h-[240px] sm:h-[260px] w-full bg-[#2A0F33] overflow-hidden">
        {mutfak.gorsel_url ? (
          <img src={mutfak.gorsel_url} alt={mutfak.ad} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#3B1448] to-[#1D0823]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-[#120415]" />

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
              onClick={() => mutfakFavoriDegistir(mutfak.id)}
              className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/15 cursor-pointer active:scale-95 shadow-lg ${
                favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
              title={favoride ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              <Heart className={`w-5 h-5 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. Kapak Zeminine Oturtulan Mutfak Başlığı & Rozetler (Yukarıya Alınmış ve Ferah) */}
        <div className="absolute inset-x-0 bottom-9 sm:bottom-10 z-20 px-4 text-center space-y-1.5">
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
            {mutfak.ad}
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 bg-[#2C0E35]/90 backdrop-blur-sm text-purple-200 border border-purple-600/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Süper Mutfak</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-amber-500/40 text-amber-300 font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mutfak.puan?.toFixed(1) || '5.0'}</span>
            </span>
            {mutfak.acik_mi !== false ? (
              <span className="inline-flex items-center gap-1 bg-emerald-950/90 backdrop-blur-sm text-emerald-300 border border-emerald-500/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Açık</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-rose-950/90 backdrop-blur-sm text-rose-300 border border-rose-500/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm text-[11px]">
                <span>Kapalı</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
