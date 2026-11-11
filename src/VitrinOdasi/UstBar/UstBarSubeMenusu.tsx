import React, { useState, useRef, useEffect } from 'react';
import { Store, ChevronDown, MapPin, Clock, Sparkles } from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

interface UstBarSubeMenusuProps {
  tema?: 'koyu' | 'acik';
  onSubeSecildi?: (sube: GelAlSubesi) => void;
}

export const UstBarSubeMenusu: React.FC<UstBarSubeMenusuProps> = ({
  tema = 'koyu',
  onSubeSecildi,
}) => {
  const { gelAlSubeleri, seciliGelAlSubesi, gelAlSubesiSec, teslimatTipiDegistir } = teslimatHafizasiKullan();
  const [acik, setAcik] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const acikMi = tema === 'acik';

  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    };
    document.addEventListener('mousedown', disariTiklandi);
    return () => document.removeEventListener('mousedown', disariTiklandi);
  }, []);

  const subeTiklandi = (sube: GelAlSubesi) => {
    gelAlSubesiSec(sube);
    teslimatTipiDegistir('gel_al');
    setAcik(false);
    if (onSubeSecildi) {
      onSubeSecildi(sube);
    }
  };

  const gorunenAd = seciliGelAlSubesi
    ? seciliGelAlSubesi.ad.replace(/(Gel-Al.*|Dağıtım.*|Teslimat.*)/gi, '').trim()
    : 'Şubelerimiz';

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className={`h-11 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer max-w-[200px] ${
          acikMi
            ? 'bg-white hover:bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
            : 'bg-[#2A0E32] hover:bg-[#3E144A] border-purple-800/80 text-amber-300'
        }`}
        title="Şubelerimiz ve Gel-Al Noktaları"
      >
        <Store className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="truncate">{gorunenAd}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-purple-300 shrink-0 ml-auto transition-transform ${acik ? 'rotate-180' : ''}`} />
      </button>

      {acik && (
        <div
          className={`absolute left-0 top-full mt-2 w-80 rounded-2xl shadow-2xl p-2 z-50 space-y-1.5 border animate-in fade-in slide-in-from-top-2 ${
            acikMi
              ? 'bg-[#FAF4EB] border-amber-200 text-gray-900'
              : 'bg-[#180A1F] border-[#521E5C] text-white'
          }`}
        >
          <div className="p-2 border-b border-purple-900/50 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AFYON ŞUBELERİMİZ ({gelAlSubeleri.length})</span>
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {gelAlSubeleri.map((sube) => {
              const secili = (seciliGelAlSubesi?.id === sube.id || seciliGelAlSubesi?.kimlik === sube.kimlik);
              return (
                <button
                  key={sube.id || sube.kimlik}
                  type="button"
                  onClick={() => subeTiklandi(sube)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    secili
                      ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                      : acikMi
                      ? 'bg-white hover:bg-amber-100/70 border-amber-100 text-gray-800'
                      : 'bg-[#250D2D]/80 hover:bg-[#34113E] border-purple-900/40 text-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate">{sube.ad}</span>
                    {secili && <span className="text-[10px] text-amber-400 font-black">Seçili</span>}
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{sube.mahalle || sube.adres}</span>
                  </div>
                  <div className="text-[10px] text-purple-300/80 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{sube.calisma_saatleri || '09:00 - 22:00'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
