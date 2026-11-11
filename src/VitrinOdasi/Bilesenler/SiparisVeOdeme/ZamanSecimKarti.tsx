import React from 'react';
import { Clock, Zap, Calendar } from 'lucide-react';

interface ZamanSecimKartiOzellikleri {
  seciliZamanTipi: 'hemen' | 'ileri_saat';
  onZamanTipiSec: (tip: 'hemen' | 'ileri_saat') => void;
  seciliSaat: string;
  onSaatSec: (saat: string) => void;
}

const AFYON_ILERI_SAATLER = [
  'Bugün 18:30 - 19:30',
  'Yarın 12:00 - 13:00',
  'Yarın 18:30 - 19:30',
];


export const ZamanSecimKarti: React.FC<ZamanSecimKartiOzellikleri> = ({
  seciliZamanTipi,
  onZamanTipiSec,
  seciliSaat,
  onSaatSec,
}) => {
  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-[#F5D28A] font-bold text-sm border-b border-[#3E1646] pb-2">
        <Clock className="w-4 h-4 text-[#CFA353]" />
        <span>Teslimat Zamanı</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onZamanTipiSec('hemen')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
            seciliZamanTipi === 'hemen'
              ? 'bg-[#CFA353] text-[#1D0A20] border-[#F5D28A] shadow-md font-bold'
              : 'bg-[#1A081D] text-gray-300 border-[#3E1646] hover:border-[#521E5C]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Hemen Gelsin (30-45 dk)</span>
        </button>

        <button
          type="button"
          onClick={() => onZamanTipiSec('ileri_saat')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
            seciliZamanTipi === 'ileri_saat'
              ? 'bg-[#CFA353] text-[#1D0A20] border-[#F5D28A] shadow-md font-bold'
              : 'bg-[#1A081D] text-gray-300 border-[#3E1646] hover:border-[#521E5C]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sıcak Çıksın (Randevulu)</span>
        </button>
      </div>

      {seciliZamanTipi === 'ileri_saat' && (
        <div className="space-y-3 pt-1 animate-in slide-in-from-top-2 duration-200">
          {/* Hazır Zaman Dilimleri */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {AFYON_ILERI_SAATLER.map((saat) => (
              <button
                key={saat}
                type="button"
                onClick={() => onSaatSec(saat)}
                className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${
                  seciliSaat === saat
                    ? 'bg-amber-500 text-stone-900 border-amber-400 shadow-sm'
                    : 'bg-[#130713] text-stone-400 border-[#3E1646] hover:border-[#521E5C]'
                }`}
              >
                {saat}
              </button>
            ))}
          </div>

          {/* Manuel Giriş Bölümü */}
          <div className="bg-[#1A081D] border border-[#3E1646] rounded-xl p-3 space-y-2">
            <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Veya Kendin Belirle</div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Örn: Yarın 19:00"
                value={AFYON_ILERI_SAATLER.includes(seciliSaat) ? '' : seciliSaat}
                onChange={(e) => onSaatSec(e.target.value)}
                className="flex-1 bg-[#130713] border border-[#521E5C] rounded-lg px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
              />
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center text-purple-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>


  );
};
