import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCanliReklamAyarlari } from '@/src/MalzemeCekmeceleri/useCanliReklamAyarlari';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';

export const TepeReklamBari: React.FC = () => {
  const { tepeBantListesi } = useCanliReklamAyarlari();
  const [aktifIndex, setAktifIndex] = useState<number>(0);
  const [kapaliMi, setKapaliMi] = useState<boolean>(false);
  const [animasyonSuresi, setAnimasyonSuresi] = useState<number>(12); // saniye cinsinden dinamik süre
  const metinRef = useRef<HTMLDivElement>(null);
  const konteynerRef = useRef<HTMLDivElement>(null);

  const { tema } = temaHafizasiKullan();
  const { pencereAc } = kullaniciHafizasiKullan();
  const acikMi = tema === 'acik';

  const aktifOgeler = tepeBantListesi.filter((o) => o.aktif || o.aktif_mi !== false);

  if (aktifOgeler.length === 0 || kapaliMi) {
    return null;
  }

  const guvenliIndex = aktifIndex % aktifOgeler.length;
  const simdikiOge = aktifOgeler[guvenliIndex] || aktifOgeler[0];

  // Yazı uzunluğuna ve konteyner boyutuna göre kusursuz, pürüzsüz dinamik süre hesaplama
  useEffect(() => {
    if (metinRef.current && konteynerRef.current) {
      const metinGenisligi = metinRef.current.offsetWidth || 300;
      const konteynerGenisligi = konteynerRef.current.offsetWidth || 300;
      // Piksel başına hız (yaklaşık 35-45 piksel / saniye akıcı okunabilir hız)
      const toplamMesafe = metinGenisligi + konteynerGenisligi;
      const hesaplananSure = Math.max(8, Math.round(toplamMesafe / 40));
      setAnimasyonSuresi(hesaplananSure);
    }
  }, [simdikiOge.metin, aktifIndex]);

  // Yazı tamamen akıp bittiği an otomatik olarak bir sonraki duyuruya geçiş (animationend)
  const animasyonBitti = () => {
    setAktifIndex((onceki) => (onceki + 1) % aktifOgeler.length);
  };

  const aksiyonTiklandi = () => {
    if (simdikiOge.butonHedefi === 'kayit') {
      pencereAc('kayit', 'musteri');
    } else {
      const hedef = document.getElementById('afyon-mutfaklari');
      hedef?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const oncekiOge = () => {
    setAktifIndex((onceki) => (onceki - 1 + aktifOgeler.length) % aktifOgeler.length);
  };

  const sonrakiOge = () => {
    setAktifIndex((onceki) => (onceki + 1) % aktifOgeler.length);
  };

  return (
    <aside
      aria-label="Duyuru ve Reklam Barı"
      className={`w-full py-2 px-3 sm:px-6 transition-colors duration-200 border-b relative z-30 overflow-hidden ${
        acikMi
          ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white border-amber-600 shadow-xs'
          : 'bg-gradient-to-r from-[#2B0E33] via-[#3E1646] to-[#200A26] text-amber-200 border-purple-900/60 shadow-inner'
      }`}
    >
      <div className="anasayfa-genislik flex items-center justify-between gap-2 text-xs">
        
        {/* Sol: Slider Kontrolleri ve İkon + Dinamik Kayan Metin Şeridi */}
        <div className="flex items-center gap-2 flex-1 justify-start overflow-hidden relative">
          {aktifOgeler.length > 1 && (
            <div className="flex items-center gap-0.5 shrink-0 z-20 bg-inherit pr-1">
              <button
                type="button"
                onClick={oncekiOge}
                className="p-1 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Önceki Duyuru"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={sonrakiOge}
                className="p-1 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Sonraki Duyuru"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <span className="p-1 rounded-full bg-white/20 text-white shrink-0 animate-pulse z-20 bg-inherit pr-1">
            <ChefHat className="w-3.5 h-3.5" />
          </span>

          {/* Dinamik Karakter Uzunluğuna Duyarlı Kayan Metin Şeridi */}
          <div ref={konteynerRef} className="flex-1 overflow-hidden relative whitespace-nowrap">
            <div
              key={`${aktifIndex}-${simdikiOge.metin}`}
              onAnimationEnd={animasyonBitti}
              style={{ animationDuration: `${animasyonSuresi}s` }}
              className="inline-block animate-dinamik-kayma font-bold tracking-wide leading-tight cursor-default"
            >
              <span ref={metinRef}>{simdikiOge.metin}</span>
            </div>
          </div>
        </div>

        {/* Sağ: Aksiyon Butonu + Kapat Çarpısı */}
        <div className="flex items-center gap-2 shrink-0 z-20 bg-inherit pl-2">
          <button
            type="button"
            onClick={aksiyonTiklandi}
            className={`px-3 py-1 rounded-lg font-black text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95 ${
              acikMi
                ? 'bg-white text-amber-800 hover:bg-amber-50'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-purple-950'
            }`}
          >
            <span>{simdikiOge.butonMetni || 'İncele'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setKapaliMi(true)}
            title="Duyuruyu Kapat"
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Dinamik Karakter Hesaplamalı Akış ve Animasyon Tanımı */}
      <style>{`
        @keyframes dinamikKayma {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-dinamik-kayma {
          display: inline-block;
          animation-name: dinamikKayma;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        .animate-dinamik-kayma:hover {
          animation-play-state: paused;
        }
      `}</style>
    </aside>
  );
};
