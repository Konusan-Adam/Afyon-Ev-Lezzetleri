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

  return (
    <div className="bg-[#240E2A] rounded-2xl border border-purple-900/50 shadow-xl p-4 mb-4 flex items-center justify-between gap-4">
      {/* Sol: Küçük Marka Logosu & Mutfak Künyesi */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-md bg-purple-950">
          <img src={mutfak.gorsel_url} alt={mutfak.ad} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              Onaylı Afyon Ev Mutfağı
            </span>
            {mutfak.acik_mi !== false ? (
              <span className="text-[11px] text-emerald-400 font-semibold">● Sipariş Alıyor (Açık)</span>
            ) : (
              <span className="text-[11px] text-rose-400 font-semibold">● Şu An Kapalı</span>
            )}
          </div>

          <h1 className="text-xl font-black text-white tracking-tight truncate">{mutfak.ad}</h1>
          <p className="text-xs text-purple-200/75 truncate max-w-lg mt-0.5">{mutfak.aciklama || 'Günlük pişen taze anne yemekleri ve yöresel Afyon lezzetleri.'}</p>
        </div>
      </div>

      {/* Sağ: İstatistikler ve Aksiyon Butonları */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{mutfak.puan?.toFixed(1) || '4.9'}</span>
        </div>

        <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1.5 rounded-xl border border-purple-800/40 text-purple-200 text-xs">
          <Bike className="w-3.5 h-3.5 text-purple-300" />
          <span>{ayarlar.taban_ucret > 0 ? `${ayarlar.taban_ucret} ₺` : 'Ücretsiz'}</span>
        </div>

        <button
          type="button"
          onClick={paylasTiklandi}
          className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-purple-200 hover:text-amber-400 transition-colors cursor-pointer"
          title="Paylaş"
        >
          {kopyalandi ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setFavoride(!favoride)}
          className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-purple-200 hover:text-rose-400 transition-colors cursor-pointer"
          title="Favorilere Ekle"
        >
          <Heart className={`w-4 h-4 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
