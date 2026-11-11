import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { yemekArama } from '@/src/MalzemeCekmeceleri/yemekArama';
import { AramaSonuclariKutusu } from '../AramaFiltre/AramaSonuclariKutusu';
import { Yemek, Mutfak } from '@/src/veritabani/VeriTipleri';

interface MobilAramaBariOzellikleri {
  aramaMetni: string;
  aramaMetniDegisti: (metin: string) => void;
  filtreleTiklandi: () => void;
  yemekSecildi?: (yemek: Yemek) => void;
  mutfakSecildi?: (mutfak: Mutfak) => void;
  kategoriSecildi?: (kategori: string) => void;
}

export const MobilAramaBari: React.FC<MobilAramaBariOzellikleri> = ({
  aramaMetni,
  aramaMetniDegisti,
  filtreleTiklandi,
  yemekSecildi,
  mutfakSecildi,
  kategoriSecildi,
}) => {
  const [odaklandi, setOdaklandi] = useState<boolean>(false);
  const konteynerRef = useRef<HTMLDivElement>(null);
  const { sonuclar, mutfakSonuclar, kategoriSonuclar, yukleniyor, hata } = yemekArama(aramaMetni);

  useEffect(() => {
    function disinaTiklandi(event: MouseEvent) {
      if (konteynerRef.current && !konteynerRef.current.contains(event.target as Node)) {
        setOdaklandi(false);
      }
    }
    document.addEventListener('mousedown', disinaTiklandi);
    return () => document.removeEventListener('mousedown', disinaTiklandi);
  }, []);

  return (
    <div ref={konteynerRef} className="w-full bg-[#1A0A1D]/95 backdrop-blur-md pt-1 pb-3 px-4 shadow-md relative z-40">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={aramaMetni}
          onFocus={() => setOdaklandi(true)}
          onChange={(e) => {
            aramaMetniDegisti(e.target.value);
            setOdaklandi(true);
          }}
          placeholder="Bugün ne yemek istersiniz...?"
          className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-10 pr-24 text-xs focus:outline-none shadow-inner"
        />
        <button
          onClick={filtreleTiklandi}
          className="absolute right-0.5 top-0.5 bottom-0.5 bg-[#800080] hover:bg-[#600060] text-white flex items-center gap-1 px-3 rounded-full transition-colors font-bold text-[10px] shadow-sm cursor-pointer"
        >
          <SlidersHorizontal size={12} />
          Filtrele
        </button>
      </div>

      {/* Mobil & Tablet İçin Aşağı Açılan Canlı Arama Sonuçları Modalı */}
      {odaklandi && aramaMetni.trim() && (
        <AramaSonuclariKutusu
          aramaMetni={aramaMetni}
          sonuclar={sonuclar}
          mutfakSonuclar={mutfakSonuclar}
          kategoriSonuclar={kategoriSonuclar}
          yukleniyor={yukleniyor}
          hata={hata}
          secildi={(yemek: Yemek) => {
            if (yemekSecildi) yemekSecildi(yemek);
            setOdaklandi(false);
          }}
          mutfakSecildi={(mutfak) => {
            if (mutfakSecildi) mutfakSecildi(mutfak as unknown as Mutfak);
            aramaMetniDegisti('');
            setOdaklandi(false);
          }}
          kategoriSecildi={(kat) => {
            if (kategoriSecildi) {
              kategoriSecildi(kat.ad);
            } else {
              aramaMetniDegisti(kat.ad);
            }
            setOdaklandi(false);
          }}
          etiketSecildi={(etiket: string) => {
            aramaMetniDegisti(etiket);
            setOdaklandi(true);
          }}
          kapandi={() => setOdaklandi(false)}
        />
      )}
    </div>
  );
};
