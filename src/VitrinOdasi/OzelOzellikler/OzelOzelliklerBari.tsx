import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { KategoriMegaMenu } from '../UstBar/KategoriMegaMenu';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { kategorileriGetir } from '@/src/MalzemeCekmeceleri/kategorileriGetir';

export const OzelOzelliklerBari: React.FC = () => {
  const { aktifFiltreler, filtreleriUygula, altKategoriFiltresiniTemizle } = aramaVeFiltreKullan();
  const { kategoriler } = kategorileriGetir();
  const listeRef = useRef<HTMLDivElement>(null);

  const [solOkGorunur, setSolOkGorunur] = useState(false);
  const [sagOkGorunur, setSagOkGorunur] = useState(false);

  const seciliKategoriAd = aktifFiltreler?.kategori || 'Tümü';
  const seciliAltKategoriAd = aktifFiltreler?.altKategori;

  const kaydirmaKontrol = () => {
    if (!listeRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = listeRef.current;
    setSolOkGorunur(scrollLeft > 10);
    setSagOkGorunur(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    kaydirmaKontrol();
    window.addEventListener('resize', kaydirmaKontrol);
    return () => window.removeEventListener('resize', kaydirmaKontrol);
  }, [kategoriler]);

  const solaKaydir = () => {
    if (listeRef.current) {
      listeRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const sagaKaydir = () => {
    if (listeRef.current) {
      listeRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const anaKategoriSec = (kategoriAdi: string) => {
    if (seciliKategoriAd === kategoriAdi) {
      filtreleriUygula({ ...(aktifFiltreler || {}), kategori: 'Tümü', altKategori: undefined });
    } else {
      filtreleriUygula({ ...(aktifFiltreler || {}), kategori: kategoriAdi, altKategori: undefined });
    }
  };

  return (
    <div className="w-full bg-[#130713] border-b border-[#2D1233] select-none py-1.5">
      <div className="anasayfa-genislik px-4 flex items-center gap-3">
        
        {/* Sol: 🌟 MEGA MENÜ AÇILIR BUTONU */}
        <div className="w-56 shrink-0">
          <KategoriMegaMenu />
        </div>

        {/* Orta: Ok Butonlu ve Pürüzsüz Kategori Kaydırıcı */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 relative">
          
          {/* Sol Kaydırma Oku ‹ */}
          {solOkGorunur && (
            <button
              type="button"
              onClick={solaKaydir}
              className="w-8 h-8 rounded-full bg-[#260C2B] hover:bg-[#4D1857] border border-amber-400/50 text-amber-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all z-10"
              title="Önceki Kategoriler"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Kategori Çipleri Listesi */}
          <div
            ref={listeRef}
            onScroll={kaydirmaKontrol}
            className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
          >
            {kategoriler.filter(k => k.id !== 'hepsi').map((kat) => {
              const aktifMi = seciliKategoriAd === kat.ad;
              return (
                <button
                  key={kat.id}
                  type="button"
                  onClick={() => anaKategoriSec(kat.ad)}
                  className={`h-11 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                    aktifMi
                      ? 'bg-[#5A1966] text-white border-amber-400 shadow-sm ring-1 ring-amber-400/30 font-bold'
                      : 'bg-[#210D27]/80 text-purple-200/90 hover:text-white border-purple-900/50 hover:border-purple-600/60'
                  }`}
                >
                  <span className="text-sm shrink-0">{kat.ikon}</span>
                  <span className="whitespace-nowrap">{kat.ad}</span>
                </button>
              );
            })}
          </div>

          {/* Sağ Kaydırma Oku › */}
          {sagOkGorunur && (
            <button
              type="button"
              onClick={sagaKaydir}
              className="w-8 h-8 rounded-full bg-[#260C2B] hover:bg-[#4D1857] border border-amber-400/50 text-amber-300 shadow-lg flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all z-10"
              title="Sonraki Kategoriler"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sağ: Yalnızca Alt Kategori Seçiliyse Çıkan Temizleme Rozeti */}
        {seciliAltKategoriAd && (
          <div className="hidden lg:flex items-center gap-2 shrink-0 pl-2 border-l border-purple-900/30">
            <div className="h-11 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-extrabold text-xs px-3 rounded-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{seciliKategoriAd} › {seciliAltKategoriAd}</span>
              <button
                type="button"
                onClick={() => altKategoriFiltresiniTemizle()}
                className="hover:opacity-75 cursor-pointer ml-1"
                title="Alt Kategori Filtresini Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
