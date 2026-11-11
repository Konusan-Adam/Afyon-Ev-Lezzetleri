import React, { useState, useRef, useEffect } from 'react';
import { Utensils, ChevronDown, Check } from 'lucide-react';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { kategorileriGetir } from '@/src/MalzemeCekmeceleri/kategorileriGetir';

export const KategoriAcilirMenu: React.FC = () => {
  const [acik, setAcik] = useState<boolean>(false);
  const { aktifFiltreler, filtreleriUygula } = aramaVeFiltreKullan();
  const { kategoriler } = kategorileriGetir();
  const menuKutusuRef = useRef<HTMLDivElement>(null);

  const seciliKategoriId = aktifFiltreler?.kategori || 'Tümü';

  // Dışarı tıklanınca kapanma
  useEffect(() => {
    const disariTiklamaKontrol = (e: MouseEvent) => {
      if (menuKutusuRef.current && !menuKutusuRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    };
    document.addEventListener('mousedown', disariTiklamaKontrol);
    return () => document.removeEventListener('mousedown', disariTiklamaKontrol);
  }, []);

  const kategoriSec = (kategoriAdi: string) => {
    filtreleriUygula({ ...(aktifFiltreler || {}), kategori: kategoriAdi === 'hepsi' ? 'Tümü' : kategoriAdi });
    setAcik(false);
  };

  return (
    <div className="relative w-full" ref={menuKutusuRef}>
      {/* Kategori Butonu */}
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className="w-full bg-[#210D27] hover:bg-[#33143C] border border-[#FFB703]/50 hover:border-[#FFB703] p-2.5 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-md group"
      >
        <div className="w-8 h-8 rounded-xl bg-[#3D1843] flex items-center justify-center border border-[#FFB703]/30 group-hover:scale-105 transition-transform shrink-0">
          <Utensils className="w-4 h-4 text-[#FFB703]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-between">
            <span className="truncate">Kategoriler</span>
            <span className="bg-[#FFB703] text-black font-extrabold text-[8px] px-1.5 py-0.2 rounded-md uppercase tracking-wider shrink-0 flex items-center gap-0.5">
              LEZZETLER
              <ChevronDown className={`w-3 h-3 transition-transform ${acik ? 'rotate-180' : ''}`} />
            </span>
          </div>
          <div className="text-[10px] text-[#A872B5] font-medium truncate">
            {seciliKategoriId === 'Tümü' ? 'Tüm Kategoriler ▾' : seciliKategoriId}
          </div>
        </div>
      </button>

      {/* Açılır Popover Menü */}
      {acik && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#180A1F] border border-[#521E5C] rounded-2xl shadow-2xl z-50 p-2 text-xs space-y-1 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#FFB703] border-b border-[#3E1646] uppercase tracking-wider">
            Afyon Mutfak Kategorileri
          </div>
          {kategoriler.map((kat) => {
            const kategoriDegeri = kat.id === 'hepsi' ? 'Tümü' : kat.ad;
            const seciliMi = seciliKategoriId === kategoriDegeri;
            return (
              <button
                key={kat.id}
                type="button"
                onClick={() => kategoriSec(kat.ad)}
                className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  seciliMi
                    ? 'bg-[#3D1843] text-white border border-[#FFB703]/40'
                    : 'text-gray-200 hover:bg-[#2A102E]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{kat.ikon}</span>
                  <div>
                    <div className="font-bold text-xs leading-none text-white">{kat.ad}</div>
                  </div>
                </div>
                {seciliMi && <Check className="w-4 h-4 text-[#FFB703]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
