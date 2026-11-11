import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export type OdemeTipi = 'kapida_nakit' | 'kapida_kart' | 'online_cuzdan';

interface OdemeYontemiKartiOzellikleri {
  seciliYontem: OdemeTipi;
  onYontemSec: (yontem: OdemeTipi) => void;
}

export const OdemeYontemiKarti: React.FC<OdemeYontemiKartiOzellikleri> = ({
  seciliYontem,
  onYontemSec,
}) => {
  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-[#F5D28A] font-bold text-sm border-b border-[#3E1646] pb-2">
        <CreditCard className="w-4 h-4 text-[#CFA353]" />
        <span>Ödeme Yöntemi</span>
      </div>

      <div className="space-y-2">
        <label
          onClick={() => onYontemSec('kapida_nakit')}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
            seciliYontem === 'kapida_nakit'
              ? 'bg-[#3A1440] border-[#CFA353] text-white shadow-sm'
              : 'bg-[#1A081D] border-[#3E1646] text-gray-300 hover:border-[#521E5C]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <p className="font-bold">Kapıda Nakit Ödeme</p>
              <p className="text-[10px] text-gray-400">Sipariş tesliminde kapıda nakit ödeyin</p>
            </div>
          </div>
          <input
            type="radio"
            name="odeme_yontemi"
            checked={seciliYontem === 'kapida_nakit'}
            onChange={() => onYontemSec('kapida_nakit')}
            className="accent-[#CFA353]"
          />
        </label>

        <label
          onClick={() => onYontemSec('kapida_kart')}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
            seciliYontem === 'kapida_kart'
              ? 'bg-[#3A1440] border-[#CFA353] text-white shadow-sm'
              : 'bg-[#1A081D] border-[#3E1646] text-gray-300 hover:border-[#521E5C]'
          }`}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <div className="text-xs">
              <p className="font-bold">Kapıda Kredi / Banka Kartı</p>
              <p className="text-[10px] text-gray-400">Kuryemizin getireceği POS cihazıyla ödeyin</p>
            </div>
          </div>
          <input
            type="radio"
            name="odeme_yontemi"
            checked={seciliYontem === 'kapida_kart'}
            onChange={() => onYontemSec('kapida_kart')}
            className="accent-[#CFA353]"
          />
        </label>

        <label
          onClick={() => onYontemSec('online_cuzdan')}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
            seciliYontem === 'online_cuzdan'
              ? 'bg-[#3A1440] border-[#CFA353] text-white shadow-sm'
              : 'bg-[#1A081D] border-[#3E1646] text-gray-300 hover:border-[#521E5C]'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <p className="font-bold">Online Kredi Kartı / Cüzdan</p>
              <p className="text-[10px] text-gray-400">3D Güvenli ve anında temassız ödeme</p>
            </div>
          </div>
          <input
            type="radio"
            name="odeme_yontemi"
            checked={seciliYontem === 'online_cuzdan'}
            onChange={() => onYontemSec('online_cuzdan')}
            className="accent-[#CFA353]"
          />
        </label>
      </div>
    </div>
  );
};
