import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Bike, ShieldCheck, Heart, Share2, ShoppingBag, Check } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { useMutfakTeslimatAyari } from '@/src/MalzemeCekmeceleri/useMutfakTeslimatAyari';

interface MutfakUstBaslikOzellikleri {
  mutfak: Mutfak;
  geriDonTiklandi: () => void;
}

export const MutfakUstBaslik: React.FC<MutfakUstBaslikOzellikleri> = ({
  mutfak,
  geriDonTiklandi
}) => {
  const { toplamUrunSayisi, sepetPaneliAc } = sepetHafizasiKullan();
  const { ayar } = useMutfakTeslimatAyari(mutfak.id);
  const [favoride, setFavoride] = useState<boolean>(false);
  const [kopyalandi, setKopyalandi] = useState<boolean>(false);

  const paylasTiklandi = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${mutfak.ad} - Afyon Ev Lezzetleri`,
          text: `${mutfak.ad} leziz ev yemekleri seni bekliyor!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setKopyalandi(true);
        setTimeout(() => setKopyalandi(false), 2000);
      }
    } catch {
      // Kullanıcı paylaşımı iptal ettiyse sessiz kal
    }
  };

  return (
    <header className="relative w-full bg-[#200A25] pb-4 border-b border-purple-900/40">
      {/* Kapak Görseli */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-purple-950/60">
        <img
          src={mutfak.gorsel_url}
          alt={mutfak.ad}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#200A25] via-black/40 to-black/60" />

        {/* Üst Butonlar (Geri Dön & Paylaş, Favori, Sepet Üçlüsü) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={geriDonTiklandi}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer border border-white/20 shadow-md active:scale-95"
            aria-label="Geri Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Sağ Üst Esnaf Takımı: Paylaş + Favori + Sepet */}
          <div className="flex items-center gap-2">
            {/* Paylaş Butonu */}
            <button
              type="button"
              onClick={paylasTiklandi}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md active:scale-95 relative"
              aria-label="Mutfağı Paylaş"
              title="Paylaş"
            >
              {kopyalandi ? (
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Favori Butonu */}
            <button
              type="button"
              onClick={() => setFavoride(!favoride)}
              className={`w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md active:scale-95 ${
                favoride ? 'text-rose-500 fill-rose-500' : 'text-white/90 hover:text-rose-400'
              }`}
              aria-label="Favorilere Ekle"
              title={favoride ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              <Heart className={`w-4 h-4 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Sepet Butonu (Canlı Sayaç Rozetiyle) */}
            <button
              type="button"
              onClick={sepetPaneliAc}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md active:scale-95 relative"
              aria-label="Sepeti Aç"
              title="Sepetim"
            >
              <ShoppingBag className="w-4 h-4" />
              {toplamUrunSayisi > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-[#1A0A1D] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-black animate-scale-in">
                  {toplamUrunSayisi}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mutfak Künyesi & Rozetler */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-[#291030] rounded-2xl p-4 border border-purple-900/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Onaylı Ev Mutfağı
              </span>

              {mutfak.hijyen_onayli_mi && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-md" title="MEB onaylı Hijyen Eğitimi Belgesi mevcuttur">
                  ✓ MEB Hijyen Onaylı
                </span>
              )}

              {mutfak.esnaf_muafiyet_onayli_mi && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-950/80 text-purple-200 border border-purple-600 px-2 py-0.5 rounded-md" title="GVK 9/10 Esnaf Muafiyeti Kapsamında Yasal Üretim">
                  ✓ GVK 9/10 Vergi Muafiyetli
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                Sipariş Alıyor
              </span>
            </div>

            <h1 className="text-white text-lg sm:text-2xl font-extrabold tracking-tight">
              {mutfak.ad}
            </h1>
            <p className="text-xs text-purple-200/80 mt-1 max-w-lg">
              {mutfak.aciklama || 'Günlük pişen taze anne yemekleri ve yöresel Afyon lezzetleri.'}
            </p>
          </div>

          {/* İstatistik Rozetleri */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-purple-900/40 pt-2 sm:pt-0">
            <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-xl border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mutfak.puan?.toFixed(1) || '4.9'}</span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-xl border border-purple-800/40 text-purple-200 text-xs font-medium">
              <Bike className="w-3.5 h-3.5 text-purple-300" />
              <span>{ayar.teslimatUcreti > 0 ? `${ayar.teslimatUcreti} ₺` : 'Ücretsiz'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
