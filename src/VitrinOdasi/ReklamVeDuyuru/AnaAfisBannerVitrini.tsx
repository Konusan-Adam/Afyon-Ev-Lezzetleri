import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, X, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import { useCanliReklamAyarlari } from '@/src/MalzemeCekmeceleri/useCanliReklamAyarlari';
import { useMutfakAfisleri } from '@/src/MalzemeCekmeceleri/Mutfak/useMutfakAfisleri';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { AnaAfisOgesi } from '@/src/veritabani/GercekVeriYardimcisi';

export const AnaAfisBannerVitrini: React.FC = () => {
  const { anaAfisListesi } = useCanliReklamAyarlari();
  const { afisler: mutfakAfisleri } = useMutfakAfisleri();
  const { pencereAc } = kullaniciHafizasiKullan();
  const [aktifIndex, setAktifIndex] = useState<number>(0);
  const [kapali, setKapali] = useState<boolean>(false);

  const aktifAfisler = useMemo<AnaAfisOgesi[]>(() => {
    const mutfakSlaytları: AnaAfisOgesi[] = mutfakAfisleri.map((afis) => ({
      id: `mutfak-afis-${afis.id}`,
      baslik: afis.baslik,
      aciklama: afis.aciklama,
      gorsel_url: afis.gorsel_url,
      rozet: afis.rozet || 'MUTFAK AFİŞİ',
      mutfak_id: afis.mutfak_id,
      mutfak_adi: afis.mutfak_adi,
      konum_y: afis.konum_y,
      butonMetni: `${afis.mutfak_adi || 'Mutfağı'} İncele`,
      gorselTipi: 'arka_plan',
      aktif: true,
      aktif_mi: true,
    }));

    const genelAfisler = anaAfisListesi.filter((a) => a.aktif || a.aktif_mi !== false);
    return [...mutfakSlaytları, ...genelAfisler];
  }, [mutfakAfisleri, anaAfisListesi]);

  useEffect(() => {
    if (aktifAfisler.length <= 1) return;
    const zamanlayici = setInterval(() => {
      setAktifIndex((onceki) => (onceki + 1) % aktifAfisler.length);
    }, 5000);
    return () => clearInterval(zamanlayici);
  }, [aktifAfisler.length]);

  if (aktifAfisler.length === 0 || kapali) return null;

  const guvenliIndex = aktifIndex % aktifAfisler.length;
  const simdikiAfis = aktifAfisler[guvenliIndex] || aktifAfisler[0];

  const hamUrl = simdikiAfis.gorselVerisi || simdikiAfis.gorselUrl || simdikiAfis.gorsel_url || 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&auto=format&fit=crop&q=80';
  const gorselUrl = gorselUrlGuvenliYap(hamUrl) || hamUrl;
  const aciklamaMetni = simdikiAfis.aciklama || simdikiAfis.altBaslik || '';
  const gorselTipi = simdikiAfis.gorselTipi || 'arka_plan';

  const mutfakVitriniAc = (mutfakId: string) => {
    if (typeof window === 'undefined' || !mutfakId) return;
    window.dispatchEvent(
      new CustomEvent('afyon_mutfak_vitrini_ac', { detail: { mutfakId } })
    );
  };

  const butonaTiklandi = () => {
    if (simdikiAfis.mutfak_id) {
      mutfakVitriniAc(simdikiAfis.mutfak_id);
      return;
    }
    if (simdikiAfis.butonHedefi === 'kayit') {
      pencereAc('kayit', 'musteri');
    } else if (simdikiAfis.butonHedefi === 'mutfaklar') {
      const hedef = document.getElementById('afyon-mutfaklari');
      hedef?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const hedef = document.getElementById('kampanyalar');
      hedef?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const oncekiAfis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAktifIndex((onceki) => (onceki - 1 + aktifAfisler.length) % aktifAfisler.length);
  };
  const sonrakiAfis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAktifIndex((onceki) => (onceki + 1) % aktifAfisler.length);
  };

  return (
    <div className="hidden lg:block w-full px-4 pt-1 pb-3">
      <div
        onClick={simdikiAfis.mutfak_id ? butonaTiklandi : undefined}
        className={`relative w-full rounded-2xl overflow-hidden shadow-xl border border-amber-500/30 group bg-purple-950 ${
          simdikiAfis.mutfak_id ? 'cursor-pointer' : ''
        }`}
      >
        {/* Arka Plan Görseli */}
        {gorselTipi === 'arka_plan' && (
          <div className="absolute inset-0 z-0">
            <img
              key={gorselUrl}
              src={gorselUrl}
              alt={simdikiAfis.baslik}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              style={{ objectPosition: `center ${simdikiAfis.konum_y ?? 50}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/80 to-purple-950/40" />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setKapali(true);
          }}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Afişi Kapat"
        >
          <X className="w-4 h-4" />
        </button>

        {aktifAfisler.length > 1 && (
          <>
            <button type="button" onClick={oncekiAfis} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer opacity-70 group-hover:opacity-100" title="Önceki Afiş"><ChevronLeft className="w-5 h-5" /></button>
            <button type="button" onClick={sonrakiAfis} className="absolute right-12 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer opacity-70 group-hover:opacity-100" title="Sonraki Afiş"><ChevronRight className="w-5 h-5" /></button>
          </>
        )}

        <div className={`relative z-10 p-8 md:p-12 flex ${gorselTipi === 'sag_taraf' ? 'flex-row items-center justify-between' : 'flex-col items-start max-w-xl'}`}>
          <div className="flex flex-col items-start max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-black text-[11px] tracking-wider uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{simdikiAfis.rozet || 'ÖZEL LEZZET'}</span>
              </div>
              {simdikiAfis.mutfak_adi && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/40 text-amber-200 font-bold text-[11px]">
                  <Store className="w-3 h-3 text-amber-400" />
                  <span>{simdikiAfis.mutfak_adi}</span>
                </div>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">
              {simdikiAfis.baslik}
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed mb-5 max-w-md drop-shadow">
              {aciklamaMetni}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  butonaTiklandi();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-[#F5D28A] text-purple-950 font-black text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                <span>{simdikiAfis.butonMetni || 'İncele'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {aktifAfisler.length > 1 && (
                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full" onClick={(e) => e.stopPropagation()}>
                  {aktifAfisler.map((afis, index) => (
                    <button key={`${afis.id || index}`} type="button" onClick={() => setAktifIndex(index)} className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === guvenliIndex ? 'bg-amber-400 w-4' : 'bg-white/50 hover:bg-white'}`} title={`Afiş ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {gorselTipi === 'sag_taraf' && (
            <div className="hidden md:block w-1/3 p-4">
              <img
                src={gorselUrl}
                alt={simdikiAfis.baslik}
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
