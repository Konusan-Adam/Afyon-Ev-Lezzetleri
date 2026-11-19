import React, { useState } from 'react';
import { Star, Clock, Bike, ShieldCheck, Heart, Share2, Check, MapPin, ShoppingBag } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';
import { useMutfakAfisleri } from '@/src/MalzemeCekmeceleri/Mutfak/useMutfakAfisleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

export const MasaustuMutfakBasligi: React.FC<{ mutfak: Mutfak }> = ({ mutfak }) => {
  const { mutfakFavoriMi, mutfakFavoriDegistir } = favoriHafizasiKullan();
  const { afisler } = useMutfakAfisleri();
  const favoride = mutfakFavoriMi(mutfak.id);
  const [kopyalandi, setKopyalandi] = useState(false);
  const { ayarlar } = useKuryeAyarlari();

  const mutfakAfisi = afisler.find(
    (a) => a.mutfak_id === mutfak.id || (mutfak.kimlik && a.mutfak_id === mutfak.kimlik)
  );
  const afisGorseli = mutfakAfisi?.gorsel_url || mutfak.gorsel_url;

  const teslimatUcreti = Number(ayarlar.taban_ucret) || 0;
  const minTutar = typeof mutfak.min_siparis_tutari === 'number' ? mutfak.min_siparis_tutari : 100;
  const hazirlanmaSuresi = mutfak.hazirlanma_suresi?.trim() || '25-35 dk';
  const calismaSaatleri = mutfak.calisma_saatleri?.trim() || '09:00 - 21:00';
  const mahalleBilgisi = mutfak.mahalle?.trim() || mutfak.adres?.trim() || 'Afyon Merkez';

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
    <div className="relative rounded-3xl overflow-hidden mb-6 border border-purple-900/50 shadow-2xl min-h-[210px] sm:min-h-[230px] flex flex-col justify-between bg-gradient-to-br from-[#2E1036] via-[#200A25] to-[#14061A]">
      {mutfak.mola_durumu && (
        <div className="relative z-30 bg-amber-500 text-stone-950 px-4 py-2.5 text-xs font-black text-center flex items-center justify-center gap-2 shadow-lg">
          <span>
            ☕ Mutfak Dinlenmede / Molada
            {(mutfak.mola_bitis_zamani || mutfak.mola_bitis_saati)
              ? ` • Tahmini Açılış: ${mutfak.mola_bitis_zamani || mutfak.mola_bitis_saati}`
              : ' • Geçici olarak sipariş alınmamaktadır'}
          </span>
        </div>
      )}
      {/* Mutfak Özel Afişi Arka Planı */}
      {afisGorseli && (
        <div className="absolute inset-0 z-0">
          <img
            src={gorselUrlGuvenliYap(afisGorseli)}
            alt={mutfakAfisi?.baslik || mutfak.ad}
            className="w-full h-full object-cover"
            style={{ objectPosition: `center ${mutfakAfisi?.konum_y ?? 32}%` }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14061A]/95 via-[#14061A]/75 to-[#14061A]/30" />
        </div>
      )}

      {/* 1. Üst Sıra: Sadeleştirilmiş Rozetler & Aksiyonlar */}
      <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {mutfakAfisi?.rozet ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black bg-amber-500 text-stone-950 px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
              {mutfakAfisi.rozet}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/50 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Onaylı Ev Mutfağı</span>
            </span>
          )}
          {mutfak.mola_durumu ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-950/90 backdrop-blur-md text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Dinlenmede / Molada</span>
            </span>
          ) : mutfak.acik_mi !== false ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Açık</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-950/85 backdrop-blur-md text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Kapalı</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/35 text-amber-300 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{mutfak.puan?.toFixed(1) || '5.0'}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-purple-800/40 text-purple-200 text-xs font-semibold">
            <Bike className="w-3.5 h-3.5 text-[#DDAF53]" />
            <span>{teslimatUcreti > 0 ? `${teslimatUcreti} ₺ Kurye` : 'Ücretsiz Kurye'}</span>
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
            onClick={() => mutfakFavoriDegistir(mutfak.id)}
            className={`w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg ${
              favoride ? 'text-rose-500 fill-rose-500' : 'text-white'
            }`}
            title={favoride ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart className={`w-4 h-4 ${favoride ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Alt Sıra: Mutfak Başlığı & Sade Operasyon Bilgileri */}
      <div className="relative z-20 p-4 sm:p-6 flex flex-col gap-2.5">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md truncate">
            {mutfak.ad}
          </h1>
          {mutfakAfisi?.baslik && mutfakAfisi.baslik !== mutfak.ad && (
            <p className="text-xs sm:text-sm text-amber-300/90 font-semibold drop-shadow">
              {mutfakAfisi.baslik}
            </p>
          )}
          <p className="text-xs sm:text-sm text-purple-200/90 drop-shadow-sm max-w-2xl line-clamp-2">
            {mutfak.aciklama || 'Afyonkarahisar anne eliyle taze pişirilen sıcak ev lezzetleri.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-200/90 pt-1">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{hazirlanmaSuresi} • {calismaSaatleri}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Min. {minTutar} ₺</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{mahalleBilgisi}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
