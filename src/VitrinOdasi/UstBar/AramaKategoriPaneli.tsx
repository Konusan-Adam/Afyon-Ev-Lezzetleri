import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, TrendingUp } from 'lucide-react';
import { kategorileriGetir, Kategori } from '@/src/MalzemeCekmeceleri/kategorileriGetir';

interface AramaKategoriPaneliProps {
  acik: boolean;
  kapat: () => void;
  kategoriSec: (kategoriAdi: string) => void;
  aramaSec: (metin: string) => void;
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

export const AramaKategoriPaneli: React.FC<AramaKategoriPaneliProps> = ({
  acik,
  kapat,
  kategoriSec,
  aramaSec,
  tema = 'koyu',
}) => {
  const { kategoriler } = kategorileriGetir();
  const listeRef = useRef<HTMLDivElement>(null);
  const [aktifSekme, setAktifSekme] = useState<string>('hepsi');

  if (!acik) return null;

  const acikMi = tema === 'acik';

  const sagaKaydir = () => {
    if (listeRef.current) {
      listeRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const solaKaydir = () => {
    if (listeRef.current) {
      listeRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const gosterilenKategoriler = kategoriler.filter((k) => k.id !== 'hepsi');

  return (
    <div
      className={`absolute top-full left-0 mt-2.5 w-[680px] max-w-[95vw] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-50 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl border ${
        acikMi
          ? 'bg-[#FAF4EB]/95 border-[#E2D2C0] text-gray-900 shadow-xl'
          : 'bg-[#180A1F]/98 border-amber-500/40 text-white'
      }`}
    >
      {/* 1. Üst Hızlı Sekmeler (Yemeksepeti Modeli) */}
      <div className={`flex items-center gap-4 pb-2.5 overflow-x-auto no-scrollbar text-xs font-bold border-b ${
        acikMi ? 'border-amber-200' : 'border-purple-900/40'
      }`}>
        <button
          type="button"
          onClick={() => {
            setAktifSekme('hepsi');
            kategoriSec('Tümü');
            kapat();
          }}
          className={`pb-1 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
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
            onClick={() => {
              setAktifSekme(kat.id);
              kategoriSec(kat.ad);
              kapat();
            }}
            className={`pb-1 cursor-pointer transition-all border-b-2 whitespace-nowrap ${
              aktifSekme === kat.id
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

      {/* 2. Görsel Kategori Kartları (Yemeksepeti Stili Sere Serpe) */}
      <div className="relative group">
        <div
          ref={listeRef}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {gosterilenKategoriler.map((kat) => (
            <div
              key={kat.id}
              onClick={() => {
                kategoriSec(kat.ad);
                kapat();
              }}
              className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl cursor-pointer transition-all shrink-0 w-24 text-center group/card border ${
                acikMi
                  ? 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-400 shadow-sm'
                  : 'bg-[#240C29] hover:bg-[#381342] border-purple-900/40 hover:border-amber-400/50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl p-1.5 flex items-center justify-center border group-hover/card:scale-105 transition-transform overflow-hidden ${
                acikMi ? 'bg-[#FAF4EB] border-amber-200' : 'bg-[#150618] border-purple-900/30'
              }`}>
                <img
                  src={kat.resim_url || 'https://pngimg.com/uploads/plate/plate_PNG5337.png'}
                  alt={kat.ad}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className={`text-[11px] font-semibold leading-tight line-clamp-2 ${
                acikMi ? 'text-gray-800 group-hover/card:text-amber-700' : 'text-gray-200 group-hover/card:text-amber-300'
              }`}>
                {kat.ad}
              </span>
            </div>
          ))}
        </div>

        {/* Sağa Kaydırma Oku › */}
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

      {/* 3. Popüler Afyon Aramaları Çipleri */}
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
