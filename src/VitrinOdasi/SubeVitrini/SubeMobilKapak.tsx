import React, { useState } from 'react';
import { ArrowLeft, Info, Share2, Heart, Check, Sparkles, MapPin, CheckCircle2, ShoppingBag, Radio } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';

interface SubeMobilKapakProps {
  sube: GelAlSubesi;
  urunSayisi: number;
  geriDonTiklandi: () => void;
  onCanliYayinAc?: () => void;
}

export const SubeMobilKapak: React.FC<SubeMobilKapakProps> = ({
  sube,
  urunSayisi,
  geriDonTiklandi,
  onCanliYayinAc,
}) => {
  const [favoride, setFavoride] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);
  const { toplamUrunSayisi, sepetPaneliAc } = sepetHafizasiKullan();

  const paylasTiklandi = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${sube.ad} - Afyon Ev Lezzetleri`,
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

  const gorselUrl = sube.gorsel || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=80';

  return (
    <header className="relative w-full">
      {/* Kapak Görseli ve Üzerine Oturtulmuş Bilgi Katmanı */}
      <div className="relative min-h-[220px] sm:min-h-[250px] lg:min-h-[270px] w-full bg-[#2A0F33] overflow-hidden flex flex-col justify-between">
        <img 
          src={gorselUrl} 
          alt={sube.ad} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        {/* Karartma gradyanı: üstte butonlar için yumuşak gölge, altta yazılar için koyu zemin */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#14061A]" />

        {/* 1. Üst Butonlar Barı */}
        <div className="relative z-20 pt-4 px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={geriDonTiklandi}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all cursor-pointer active:scale-95 shadow-xl"
            aria-label="Ana Sayfaya Dön"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={sepetPaneliAc}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all cursor-pointer active:scale-95 shadow-xl"
              title="Sepetim"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {toplamUrunSayisi > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {toplamUrunSayisi > 99 ? '99+' : toplamUrunSayisi}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={paylasTiklandi}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all cursor-pointer active:scale-95 shadow-xl"
              title="Şubeyi Paylaş"
            >
              {kopyalandi ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setFavoride(!favoride)}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/80 transition-all cursor-pointer active:scale-95 shadow-xl ${
                favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
              title="Favorilere Ekle"
            >
              <Heart className={`w-5 h-5 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. Tepeye / Görsele Dayalı Şube Başlığı, Rozetler & Canlı İzle */}
        <div className="relative z-20 pb-4 pt-2 px-4 sm:px-6 text-center space-y-2">
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
            {sube.ad}
          </h1>
          
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 bg-[#2C0E35]/90 backdrop-blur-sm text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Resmi Şube & Tezgah</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-950/90 backdrop-blur-sm text-emerald-300 border border-emerald-500/50 px-3 py-1 rounded-full font-bold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{urunSayisi} Taze Ürün Hazır</span>
            </span>
          </div>

          <p className="text-xs text-purple-200/90 flex items-center justify-center gap-1 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-sm">{sube.adres}</span>
          </p>

          {/* 🎥 Şubeyi Canlı İzle Butonu */}
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={onCanliYayinAc}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/60 border border-rose-400/50 transition-all cursor-pointer active:scale-95 group"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Radio className="w-3.5 h-3.5 text-white" />
              <span>Şubeyi Canlı İzle (Şeffaf Mutfak)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
