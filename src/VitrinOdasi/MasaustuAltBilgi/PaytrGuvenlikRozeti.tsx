import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PaytrGuvenlikRozeti: React.FC = () => {
  return (
    <div className="mt-6 py-3 px-4 rounded-2xl bg-[#180A1F] border border-[#3E1649] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-emerald-300 font-bold text-center sm:text-left">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>PayTR Güvencesiyle 256-Bit SSL Güvenli Ödeme (Visa / Mastercard / Troy)</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-black tracking-wide text-purple-200">
        <span className="px-2 py-0.5 rounded bg-[#270E30] border border-purple-800/60 flex items-center gap-1">
          <Lock className="w-3 h-3 text-amber-400" />
          256-BIT SSL
        </span>
        <span className="px-2 py-0.5 rounded bg-[#270E30] border border-purple-800/60">VISA</span>
        <span className="px-2 py-0.5 rounded bg-[#270E30] border border-purple-800/60">MASTERCARD</span>
        <span className="px-2 py-0.5 rounded bg-[#270E30] border border-purple-800/60">TROY</span>
      </div>
    </div>
  );
};
