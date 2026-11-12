import React, { useState } from 'react';
import { ArrowLeft, Info, Share2, Heart, Check, Sparkles, MapPin, CheckCircle2, ShoppingBag, Radio } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';

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
  const { subeFavoriMi, subeFavoriDegistir } = favoriHafizasiKullan();
  const favoride = subeFavoriMi(sube.id || sube.kimlik || '');
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
    <header className="w-full">
      {/* 1. SADECE MOBİL & TABLET: Tam Ekran, Çizgisiz, Doğal Gradyan Akışı (Mutfak Mobili ile Birebir Aynı) */}
      <div className="lg:hidden relative min-h-[240px] sm:min-h-[260px] w-full bg-[#2A0F33] overflow-hidden">
        <img 
          src={gorselUrl} 
          alt={sube.ad} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-[#14061A]" />

        {/* Üst Butonlar Barı */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
          <button
            type="button"
            onClick={geriDonTiklandi}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 cursor-pointer active:scale-95 shadow-xl transition-all"
            aria-label="Ana Sayfaya Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={sepetPaneliAc}
              className="relative w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 cursor-pointer active:scale-95 shadow-xl transition-all"
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
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/80 cursor-pointer active:scale-95 shadow-xl transition-all"
              title="Şubeyi Paylaş"
            >
              {kopyalandi ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => subeFavoriDegistir(sube.id || sube.kimlik || '')}
              className={`w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/80 cursor-pointer active:scale-95 shadow-xl transition-all ${
                favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
              title={favoride ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              <Heart className={`w-5 h-5 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Kapak Zeminine Oturtulan Şube Başlığı & Rozetler (Yukarı Alınmış ve Ferah) */}
        <div className="absolute inset-x-0 bottom-9 sm:bottom-10 z-20 px-4 text-center space-y-2">
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
            {sube.ad}
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 bg-[#2C0E35]/90 backdrop-blur-sm text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Resmi Şube & Tezgah</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-950/90 backdrop-blur-sm text-emerald-300 border border-emerald-500/50 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{urunSayisi} Taze Ürün Hazır</span>
            </span>
          </div>
          <div className="pt-0.5 flex justify-center">
            <button
              type="button"
              onClick={onCanliYayinAc}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/60 border border-rose-400/50 transition-all cursor-pointer active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <Radio className="w-3.5 h-3.5 text-white" />
              <span>Şubeyi Canlı İzle (Şeffaf Mutfak)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SADECE MASAÜSTÜ: anasayfa-genislik 1300px Sınırında, Kavisli (rounded-3xl), Çerçeveli Kart (Mutfak Masaüstü ile Birebir Aynı) */}
      <div className="hidden lg:block anasayfa-genislik px-4 pt-6">
        <div className="relative rounded-3xl overflow-hidden mb-6 border border-purple-900/50 shadow-2xl min-h-[250px] lg:min-h-[280px] flex flex-col justify-between bg-[#2A0F33]">
          <img 
            src={gorselUrl} 
            alt={sube.ad} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#14061A]" />

          {/* Üst Sıra: Rozetler ve Sağ Butonlar */}
          <div className="relative z-20 p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#2C0E35]/90 backdrop-blur-md text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Resmi Şube & Tezgah</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/50 px-3 py-1.5 rounded-xl shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{urunSayisi} Taze Ürün Hazır</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCanliYayinAc}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/60 border border-rose-400/50 transition-all cursor-pointer active:scale-95"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <Radio className="w-3.5 h-3.5 text-white" />
                <span>Şubeyi Canlı İzle (Şeffaf Mutfak)</span>
              </button>
              <button
                type="button"
                onClick={paylasTiklandi}
                className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-lg"
                title="Şubeyi Paylaş"
              >
                {kopyalandi ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => subeFavoriDegistir(sube.id || sube.kimlik || '')}
                className={`w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg ${
                  favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
                }`}
                title={favoride ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              >
                <Heart className={`w-4 h-4 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Alt Sıra: Sola Dayalı Şube Başlığı & Adresi */}
          <div className="relative z-20 p-6 space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {sube.ad}
            </h1>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-purple-200/90 drop-shadow-sm flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{sube.adres}</span>
              </span>
              <span className="text-purple-400">•</span>
              <span className="text-amber-300 font-semibold">{sube.calisma_saatleri || '09:00 - 22:00'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
