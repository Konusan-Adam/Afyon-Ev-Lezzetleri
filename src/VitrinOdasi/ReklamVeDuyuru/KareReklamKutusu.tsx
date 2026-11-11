import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCanliReklamAyarlari } from '@/src/MalzemeCekmeceleri/useCanliReklamAyarlari';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';

interface KareReklamKutusuProps {
  aksiyonTiklandi?: () => void;
}

export const KareReklamKutusu: React.FC<KareReklamKutusuProps> = ({ aksiyonTiklandi }) => {
  const { kareReklamListesi } = useCanliReklamAyarlari();
  const [aktifIndex, setAktifIndex] = useState<number>(0);
  const [kapaliMi, setKapaliMi] = useState<boolean>(false);
  
  const { tema } = temaHafizasiKullan();
  const { pencereAc } = kullaniciHafizasiKullan();
  const acikMi = tema === 'acik';

  const aktifOgeler = kareReklamListesi.filter(o => o.aktif || o.aktif_mi !== false);

  // Otomatik Slider Döngüsü (5 saniyede bir)
  useEffect(() => {
    if (aktifOgeler.length <= 1) return;
    const zamanlayici = setInterval(() => {
      setAktifIndex(onceki => (onceki + 1) % aktifOgeler.length);
    }, 5000);
    return () => clearInterval(zamanlayici);
  }, [aktifOgeler.length]);

  if (aktifOgeler.length === 0 || kapaliMi) {
    return null;
  }

  const guvenliIndex = aktifIndex % aktifOgeler.length;
  const simdikiOge = aktifOgeler[guvenliIndex] || aktifOgeler[0];
  const gorselUrl = simdikiOge.gorselUrl || simdikiOge.gorsel_url || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80';

  const butonBasildi = () => {
    if (aksiyonTiklandi) {
      aksiyonTiklandi();
      return;
    }

    if (simdikiOge.butonHedefi === 'kayit') {
      pencereAc('kayit', 'musteri');
    } else {
      const hedef = document.getElementById('afyon-mutfaklari');
      hedef?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const oncekiOge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAktifIndex(onceki => (onceki - 1 + aktifOgeler.length) % aktifOgeler.length);
  };

  const sonrakiOge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAktifIndex(onceki => (onceki + 1) % aktifOgeler.length);
  };

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden border shadow-lg transition-all duration-200 relative mb-4 hidden lg:block ${
        acikMi
          ? 'bg-white border-amber-200 shadow-amber-900/5'
          : 'bg-[#230C28] border-purple-900/60 shadow-purple-950/40'
      }`}
    >
      {/* Kapatma Butonu (X) */}
      <button
        type="button"
        onClick={() => setKapaliMi(true)}
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        title="Reklamı Kapat"
        aria-label="Reklamı Kapat"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Görsel Alanı & Slider Okları */}
      <div className="relative w-full h-32 overflow-hidden bg-purple-950">
        <img
          src={gorselUrl}
          alt={simdikiOge.baslik}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Rozet */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-purple-950 text-[10px] font-black uppercase tracking-wider shadow-md">
            <Flame className="w-3 h-3 fill-current" />
            <span>{simdikiOge.rozet || 'GÜNÜN FIRSATI'}</span>
          </span>
        </div>

        {/* Çoklu Reklam Varsa Slider Okları */}
        {aktifOgeler.length > 1 && (
          <>
            <button
              type="button"
              onClick={oncekiOge}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              title="Önceki"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={sonrakiOge}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              title="Sonraki"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* İçerik & Aksiyon Butonu */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h4 className="font-black text-sm tracking-wide leading-tight line-clamp-1">
            {simdikiOge.baslik}
          </h4>
          <p className="text-xs text-purple-200/70 dark:text-purple-300/70 line-clamp-2 mt-1 leading-relaxed">
            {simdikiOge.aciklama}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Slider Noktaları */}
          {aktifOgeler.length > 1 && (
            <div className="flex items-center gap-1">
              {aktifOgeler.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAktifIndex(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === guvenliIndex ? 'w-4 bg-amber-500' : 'w-1.5 bg-purple-800'
                  }`}
                  aria-label={`Reklam ${i + 1}`}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={butonBasildi}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-purple-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>{simdikiOge.butonMetni || 'İncele'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
