import React from 'react';
import { ChefHat, Bike, Home, CheckCircle2 } from 'lucide-react';

interface SiparisDurumCizgisiProps {
  adimIndeksi: number;
  tamamlandiMi: boolean;
}

export const SiparisDurumCizgisi: React.FC<SiparisDurumCizgisiProps> = ({
  adimIndeksi,
  tamamlandiMi,
}) => {
  return (
    <div className="bg-[#1C0922] border border-[#521E5C] rounded-2xl p-3.5 space-y-2.5">
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="text-emerald-400 flex items-center gap-1">
          <ChefHat className="w-3.5 h-3.5" /> Hazırlandı
        </span>
        <span className={`${tamamlandiMi ? 'text-emerald-400' : 'text-amber-400 animate-pulse'} flex items-center gap-1`}>
          <Bike className="w-3.5 h-3.5" /> Kurye Yolda
        </span>
        <span className={`${tamamlandiMi ? 'text-emerald-400' : 'text-gray-500'} flex items-center gap-1`}>
          {tamamlandiMi ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />} Teslim Edildi
        </span>
      </div>

      <div className="w-full bg-[#120414] rounded-full h-2 overflow-hidden border border-purple-950">
        <div
          className="bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(15, (adimIndeksi / 9) * 100))}%` }}
        />
      </div>
    </div>
  );
};
