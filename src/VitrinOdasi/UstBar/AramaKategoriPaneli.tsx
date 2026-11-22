import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, TrendingUp, Store } from 'lucide-react';
import { kategorileriGetir, Kategori } from '@/src/MalzemeCekmeceleri/kategorileriGetir';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';
import { GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { AramaAltKategoriMegaAlani } from './AramaAltKategoriMegaAlani';

interface AramaKategoriPaneliProps {
  acik: boolean;
  kapat: () => void;
  seciliKategoriAd?: string;
  seciliAltKategoriAd?: string;
  kategoriSec: (kategoriAdi: string, altKategoriAdi?: string) => void;
  aramaSec: (metin: string) => void;
  subeSec?: (sube: GelAlSubesi) => void;
  tema?: 'koyu' | 'acik';
}

const POPULER_ARAMALAR = [
  'Haşhaşlı Bükme',
  'Manda Kaymaklı Kadayıf',
  'Şuhut Keşkeği',
  'İlibada Sarması',
  'Afyon Kasap Sucuğu',
  'Köy Tarhanası',
  'Arabaşı Çorbası',
  'Ağzıaçık Böreği',
  'Katmer',
];

const VARSAYILAN_TABAK = 'https://pngimg.com/uploads/plate/plate_PNG5337.png';

export const AramaKategoriPaneli: React.FC<AramaKategoriPaneliProps> = ({
  acik,
  kapat,
  seciliKategoriAd,
  seciliAltKategoriAd,
  kategoriSec,
  aramaSec,
  subeSec,
  tema = 'koyu',
}) => {
  const { kategoriler, altKategoriler } = kategorileriGetir();
  const { gelAlSubeleri } = teslimatHafizasiKullan();
  const anlikDakika = useCanliDakika();
  const listeRef = useRef<HTMLDivElement>(null);
  const kapatmaZamanlayiciRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [aktifSekme, setAktifSekme] = useState<string>('hepsi');
  const [hoverKategori, setHoverKategori] = useState<Kategori | null>(null);

  useEffect(() => {
    return () => {
      if (kapatmaZamanlayiciRef.current) clearTimeout(kapatmaZamanlayiciRef.current);
    };
  }, []);

  if (!acik) return null;

  const acikMi = tema === 'acik';

  const zamanlayiciTemizle = () => {
    if (kapatmaZamanlayiciRef.current) {
      clearTimeout(kapatmaZamanlayiciRef.current);
      kapatmaZamanlayiciRef.current = null;
    }
  };

  const hoverBaslat = (kat: Kategori | null) => {
    zamanlayiciTemizle();
    if (!kat) {
      setHoverKategori(null);
      return;
    }
    setAktifSekme(kat.id);
    const altVarMi = altKategoriler.some((a) => a.ust_kategori_id === kat.id);
    setHoverKategori(altVarMi ? kat : null);
  };

  const hoverBitirPlanla = () => {
    zamanlayiciTemizle();
    kapatmaZamanlayiciRef.current = setTimeout(() => {
      setHoverKategori(null);
    }, 180);
  };

  const sagaKaydir = () => {
    if (listeRef.current) {
      listeRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const gosterilenKategoriler = kategoriler.filter((k) => k.id !== 'hepsi');
  const aktifHoverAltKategoriler = hoverKategori
    ? altKategoriler.filter((a) => a.ust_kategori_id === hoverKategori.id)
    : [];

  return (
    <div
      className={`absolute top-full left-0 mt-2.5 w-[680px] max-w-[95vw] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl border ${
        acikMi
          ? 'bg-[#FAF4EB]/95 border-[#E2D2C0] text-gray-900 shadow-xl'
          : 'bg-[#180A1F]/98 border-amber-500/40 text-white'
      }`}
    >
      {/* Kategori Sekmeleri + Görsel Kartlar + Alt Kategori Mega Alanı */}
      <div onMouseLeave={hoverBitirPlanla} className="space-y-3">
        {/* 1. Üst Hızlı Sekmeler (Yemeksepeti Modeli — Hover ile alt menüyü tetikler) */}
        <div
          className={`flex items-center gap-4 pb-2.5 overflow-x-auto no-scrollbar text-xs font-bold border-b ${
            acikMi ? 'border-amber-200' : 'border-purple-900/40'
          }`}
        >
          <button
            type="button"
            onMouseEnter={() => {
              zamanlayiciTemizle();
              setAktifSekme('hepsi');
              setHoverKategori(null);
            }}
            onClick={() => {
              setAktifSekme('hepsi');
              kategoriSec('Tümü', undefined);
              kapat();
            }}
            className={`pb-1 cursor-pointer transition-all border-b-2 whitespace-nowrap shrink-0 ${
              aktifSekme === 'hepsi'
                ? 'text-amber-500 border-amber-500'
                : acikMi
                ? 'text-gray-600 border-transparent hover:text-black'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Hepsi
          </button>
          {gosterilenKategoriler.map((kat) => (
            <button
              key={kat.id}
              type="button"
              onMouseEnter={() => hoverBaslat(kat)}
              onClick={() => {
                setAktifSekme(kat.id);
                kategoriSec(kat.ad, undefined);
                kapat();
              }}
              className={`pb-1 cursor-pointer transition-all border-b-2 whitespace-nowrap shrink-0 ${
                aktifSekme === kat.id || hoverKategori?.id === kat.id
                  ? 'text-amber-500 border-amber-500'
                  : acikMi
                  ? 'text-gray-600 border-transparent hover:text-black'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {kat.ad}
            </button>
          ))}
        </div>

        {/* 2. Görsel Kategori Kartları (Üzerine gelince alt kategorileri açılır) */}
        <div className="relative group">
          <div
            ref={listeRef}
            className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {gosterilenKategoriler.map((kat) => {
              const altSayisi = altKategoriler.filter((a) => a.ust_kategori_id === kat.id).length;
              const vurguluMu = hoverKategori?.id === kat.id;
              const seciliMi = seciliKategoriAd === kat.ad;
              const gorselSrc = gorselUrlGuvenliYap(kat.resim_url) || VARSAYILAN_TABAK;

              return (
                <button
                  key={kat.id}
                  type="button"
                  onMouseEnter={() => hoverBaslat(kat)}
                  onClick={() => {
                    kategoriSec(kat.ad, undefined);
                    kapat();
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl cursor-pointer transition-all shrink-0 w-24 text-center group/card border ${
                    vurguluMu || seciliMi
                      ? acikMi
                        ? 'bg-amber-50 border-amber-400 shadow-sm'
                        : 'bg-[#381342] border-amber-400/70 shadow-sm'
                      : acikMi
                      ? 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-400 shadow-sm'
                      : 'bg-[#240C29] hover:bg-[#381342] border-purple-900/40 hover:border-amber-400/50'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl p-1.5 flex items-center justify-center border group-hover/card:scale-105 transition-transform overflow-hidden ${
                      acikMi ? 'bg-[#FAF4EB] border-amber-200' : 'bg-[#150618] border-purple-900/30'
                    }`}
                  >
                    <img
                      src={gorselSrc}
                      alt={kat.ad}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const hedef = e.target as HTMLImageElement;
                        if (!hedef.src.endsWith('/marka_logosu.jpg')) {
                          hedef.src = '/marka_logosu.jpg';
                        }
                      }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                      vurguluMu || seciliMi
                        ? acikMi
                          ? 'text-amber-800'
                          : 'text-amber-300'
                        : acikMi
                        ? 'text-gray-800 group-hover/card:text-amber-700'
                        : 'text-gray-200 group-hover/card:text-amber-300'
                    }`}
                  >
                    {kat.ad}
                  </span>
                  {altSayisi > 0 && (
                    <span
                      className={`text-[10px] tabular-nums ${
                        acikMi ? 'text-gray-500' : 'text-purple-300/75'
                      }`}
                    >
                      {altSayisi} çeşit
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sağa Kaydırma Oku */}
          <button
            type="button"
            onClick={sagaKaydir}
            className={`absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border shadow-lg flex items-center justify-center cursor-pointer transition-all ${
              acikMi
                ? 'bg-white border-amber-300 text-amber-700 hover:bg-amber-100'
                : 'bg-[#1A081E] border-amber-400/50 text-amber-300 hover:bg-amber-500 hover:text-black'
            }`}
            title="Sağa Kaydır"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2.1 Masaüstü Hover Mega Menü Alanı (Üzerine gelinen kategorinin alt çeşitleri) */}
        <AramaAltKategoriMegaAlani
          kategori={hoverKategori}
          altKategoriler={aktifHoverAltKategoriler}
          seciliKategoriAd={seciliKategoriAd}
          seciliAltKategoriAd={seciliAltKategoriAd}
          acikMi={acikMi}
          onMouseEnter={zamanlayiciTemizle}
          onMouseLeave={hoverBitirPlanla}
          onTumKategoriSec={(katAd) => {
            kategoriSec(katAd, undefined);
            kapat();
          }}
          onAltKategoriSec={(katAd, altAd) => {
            kategoriSec(katAd, altAd);
            kapat();
          }}
        />
      </div>

      {/* 3. Gel-Al Şubeleri */}
      {gelAlSubeleri.length > 0 && (
        <div className={`pt-3 border-t space-y-2.5 ${acikMi ? 'border-amber-200' : 'border-purple-900/40'}`}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
            <Store className="w-3.5 h-3.5 text-amber-500" />
            <span>Gel-Al Şubeleri</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...gelAlSubeleri]
              .sort((a, b) => {
                const aAcik = calismaSaatiDurumuHesapla(a, anlikDakika).acikMi ? 1 : 0;
                const bAcik = calismaSaatiDurumuHesapla(b, anlikDakika).acikMi ? 1 : 0;
                return bAcik - aAcik;
              })
              .map((sube) => {
                const subeAcik = calismaSaatiDurumuHesapla(sube, anlikDakika).acikMi;
                const kisaAd = sube.ad
                  .replace(' Gel-Al & Dağıtım Noktası', '')
                  .replace(' Gel-Al Teslimat Masası', '')
                  .replace(' Gel-Al Noktası', '')
                  .trim();
                return (
                  <button
                    key={sube.id || sube.kimlik}
                    type="button"
                    onClick={() => {
                      if (subeSec) {
                        subeSec(sube);
                      } else {
                        aramaSec(kisaAd);
                      }
                      kapat();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all flex items-center gap-1.5 ${
                      acikMi
                        ? 'bg-white hover:bg-amber-100 text-gray-700 hover:text-amber-900 border-amber-200 hover:border-amber-400'
                        : 'bg-[#240C29] hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border-purple-900/40 hover:border-amber-400/40'
                    }`}
                  >
                    <span>{kisaAd}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        subeAcik
                          ? acikMi ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-emerald-300'
                          : acikMi ? 'bg-rose-100 text-rose-700' : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {subeAcik ? 'Açık' : 'Kapalı'}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. Popüler Afyon Aramaları Çipleri */}
      <div className={`pt-3 border-t space-y-2.5 ${acikMi ? 'border-amber-200' : 'border-purple-900/40'}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
          <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          <span>Popüler aramalar</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULER_ARAMALAR.map((etiket) => (
            <button
              key={etiket}
              type="button"
              onClick={() => {
                aramaSec(etiket);
                kapat();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                acikMi
                  ? 'bg-white hover:bg-amber-100 text-gray-700 hover:text-amber-900 border-amber-200 hover:border-amber-400'
                  : 'bg-[#240C29] hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border-purple-900/40 hover:border-amber-400/40'
              }`}
            >
              {etiket}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
