import React from 'react';
import { ChefHat, Bike, Home, CheckCircle2 } from 'lucide-react';
import { SiparisAsamaTipi } from '@/src/MalzemeCekmeceleri';

export const SiparisDurumCubugu: React.FC<{ asama: SiparisAsamaTipi }> = ({ asama }) => {
  const adimlar: { kod: SiparisAsamaTipi; baslik: string; ikon: React.ElementType }[] = [
    { kod: 'ocakta', baslik: 'Ocakta Pişiyor', ikon: ChefHat },
    { kod: 'kuryede', baslik: 'Kurye Yolda', ikon: Bike },
    { kod: 'kapida', baslik: 'Kapıda', ikon: Home },
    { kod: 'teslim_edildi', baslik: 'Afiyet Olsun', ikon: CheckCircle2 }
  ];

  const siraNo = adimlar.findIndex((a) => a.kod === asama);

  return (
    <div className="grid grid-cols-4 gap-2 pt-2">
      {adimlar.map((adim, index) => {
        const aktifMi = index <= siraNo;
        const Ikon = adim.ikon;
        return (
          <div key={adim.kod} className="flex flex-col items-center text-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                aktifMi
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              <Ikon className="w-4 h-4" />
            </div>
            <span
              className={`text-[10px] leading-tight ${
                aktifMi ? 'font-bold text-amber-900' : 'text-stone-400'
              }`}
            >
              {adim.baslik}
            </span>
          </div>
        );
      })}
    </div>
  );
};
