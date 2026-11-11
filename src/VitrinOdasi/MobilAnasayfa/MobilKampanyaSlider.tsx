import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { AnaAfisOgesi } from '@/src/veritabani/GercekVeriYardimcisi';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface MobilKampanyaSliderOzellikleri {
  kampanyalar: AnaAfisOgesi[];
}

export const MobilKampanyaSlider: React.FC<MobilKampanyaSliderOzellikleri> = ({ kampanyalar }) => {
  const [aktifSira, setAktifSira] = useState<number>(0);
  const [dokunmaBaslangicX, setDokunmaBaslangicX] = useState<number | null>(null);

  const aktifListesi = kampanyalar.filter(k => k.aktif !== false && k.aktif_mi !== false);
  const toplamKampanya = aktifListesi.length;

  useEffect(() => {
    if (toplamKampanya <= 1) return;
    const zamanlayici = setInterval(() => {
      setAktifSira((onceki) => (onceki + 1) % toplamKampanya);
    }, 4500);

    return () => clearInterval(zamanlayici);
  }, [toplamKampanya]);

  if (!aktifListesi || toplamKampanya === 0) return null;

  const guvenliSira = aktifSira % toplamKampanya;
  const aktifKampanya = aktifListesi[guvenliSira] || aktifListesi[0];

  const dokunmaBasladi = (e: React.TouchEvent) => {
    setDokunmaBaslangicX(e.touches[0].clientX);
  };

  const dokunmaBitti = (e: React.TouchEvent) => {
    if (dokunmaBaslangicX === null) return;
    const fark = dokunmaBaslangicX - e.changedTouches[0].clientX;
    if (Math.abs(fark) > 40) {
      if (fark > 0) {
        setAktifSira((onceki) => (onceki + 1) % toplamKampanya);
      } else {
        setAktifSira((onceki) => (onceki - 1 + toplamKampanya) % toplamKampanya);
      }
    }
    setDokunmaBaslangicX(null);
  };

  const hamUrl = aktifKampanya.gorselVerisi || aktifKampanya.gorsel_url || aktifKampanya.gorselUrl || 'https://pngimg.com/uploads/pie/pie_PNG51.png';
  const gorselKaynagi = gorselUrlGuvenliYap(hamUrl);

  return (
    <div className="w-full px-4 select-none">
      <div 
        onTouchStart={dokunmaBasladi}
        onTouchEnd={dokunmaBitti}
        className="relative w-full max-w-2xl mx-auto flex items-center justify-between min-h-[145px] py-2 cursor-pointer transition-opacity duration-300 bg-transparent"
      >
        {/* Sol Taraf: Rozet, Başlık, Açıklama ve Buton */}
        <div className="flex-1 pr-3 z-10 flex flex-col justify-center">
          {aktifKampanya.rozet && (
            <div className="bg-[#431B47] text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-md w-fit mb-1.5 uppercase tracking-wider">
              {aktifKampanya.rozet}
            </div>
          )}

          <h2 className="text-white text-base sm:text-lg font-bold leading-tight mb-1 max-w-[280px] sm:max-w-md">
            {aktifKampanya.baslik}
          </h2>

          {aktifKampanya.aciklama && (
            <p className="text-purple-200/80 text-[11px] leading-snug mb-2.5 max-w-[260px] sm:max-w-md line-clamp-2">
              {aktifKampanya.aciklama}
            </p>
          )}

          <a 
            href={aktifKampanya.butonHedefi === 'kayit' ? '#' : aktifKampanya.link || '#'}
            className="inline-flex items-center gap-1.5 text-white font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <span>{aktifKampanya.butonMetni || 'Hemen Keşfet!'}</span>
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
              <ChevronRight size={11} className="text-[#1A0A1D] stroke-[3]" />
            </div>
          </a>
        </div>

        {/* Sağ Taraf: Şeffaf Transparan Görsel (Arka plansız) */}
        <div className="relative z-10 shrink-0 flex items-center justify-center">
          <img 
            src={gorselKaynagi} 
            alt={aktifKampanya.baslik}
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain select-none pointer-events-none drop-shadow-none bg-transparent"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Sayfalama Göstergesi */}
      {toplamKampanya > 1 && (
        <div className="flex justify-center mt-2 mb-2">
          <div className="bg-[#2D1233]/90 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            {aktifListesi.map((_, index) => {
              const aktif = index === guvenliSira;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAktifSira(index)}
                  className={`transition-all duration-300 cursor-pointer ${
                    aktif
                      ? 'w-5 h-2 rounded-full bg-[#E59B00]'
                      : 'w-2 h-2 rounded-full bg-white/25 hover:bg-white/40'
                  }`}
                  aria-label={`Kampanya ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
