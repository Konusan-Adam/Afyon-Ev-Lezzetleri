import React from 'react';
import { DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

interface Props {
  toplamCiro: number;
  tedarikciMaliyeti: number;
  netKar: number;
  teslimatSayisi: number;
}

export const SubeKazancOzeti: React.FC<Props> = ({
  toplamCiro,
  tedarikciMaliyeti,
  netKar,
  teslimatSayisi,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
      <div className="bg-[#180A1F] border border-[#3E1646] rounded-xl p-3 sm:p-3.5 space-y-1">
        <div className="flex items-center justify-between text-stone-400 text-[11px] sm:text-xs">
          <span>Toplam Ciro</span>
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
        </div>
        <div className="text-lg sm:text-xl font-bold text-white">{toplamCiro} ₺</div>
        <div className="text-[9px] sm:text-[10px] text-emerald-400 font-medium truncate">{teslimatSayisi} Teslim Edilen</div>
      </div>

      <div className="bg-[#180A1F] border border-[#3E1646] rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-stone-400 text-xs">
          <span>Tedarikçi Payı</span>
          <Users className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-xl font-bold text-purple-300">{tedarikciMaliyeti} ₺</div>
        <div className="text-[10px] text-stone-400 font-medium">Ev mutfağı / üretici hakkı</div>
      </div>

      <div className="bg-[#180A1F] border border-amber-500/40 bg-amber-950/15 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-stone-400 text-xs">
          <span className="text-[#DDAF53] font-bold">Şube Net Kârı</span>
          <DollarSign className="w-4 h-4 text-[#DDAF53]" />
        </div>
        <div className="text-xl font-bold text-[#DDAF53]">{netKar} ₺</div>
        <div className="text-[10px] text-[#A872B5] font-medium">Tedarikçi maliyeti düşülmüş</div>
      </div>

      <div className="bg-[#180A1F] border border-[#3E1646] rounded-xl p-3.5 space-y-1">
        <div className="flex items-center justify-between text-stone-400 text-xs">
          <span>Tamamlanan</span>
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-xl font-bold text-sky-300">{teslimatSayisi} Adet</div>
        <div className="text-[10px] text-stone-400 font-medium">Bugünkü Gel-Al teslimatı</div>
      </div>
    </div>
  );
};
