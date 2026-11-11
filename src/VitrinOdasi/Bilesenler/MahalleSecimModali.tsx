import React from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { MahalleTipi } from '@/src/veritabani/AfyonMahalleleri';

interface Props {
  acikMi: boolean;
  mahalleler: MahalleTipi[];
  onSec: (ad: string) => void;
  onKapat: () => void;
}

export const MahalleSecimModali: React.FC<Props> = ({ acikMi, mahalleler, onSec, onKapat }) => {
  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
            <Navigation className="w-5 h-5 text-amber-600" />
            <span>Teslimat Bölgenizi Seçin</span>
          </div>
          <button onClick={onKapat} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Karahisar ev lezzetlerini taze ve sıcak ulaştırabilmemiz için lütfen sipariş vereceğiniz mahalleyi seçiniz.
        </p>

        <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
          {mahalleler.map((m) => (
            <button
              key={m.id}
              onClick={() => onSec(m.ad)}
              className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-amber-50 hover:text-amber-800 transition-colors flex items-center justify-between text-sm group"
            >
              <span className="font-medium text-stone-800 group-hover:text-amber-800">{m.ad}</span>
              <MapPin className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
            </button>
          ))}
        </div>

        <button
          onClick={onKapat}
          className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-medium transition-colors"
        >
          Şimdilik sadece menüyü incelemek istiyorum
        </button>
      </div>
    </div>
  );
};
