import React from 'react';
import { Bike, Store } from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';

interface TeslimatTipiSeciciOzellikleri {
  kompaktMi?: boolean;
}

export const TeslimatTipiSecici: React.FC<TeslimatTipiSeciciOzellikleri> = ({ kompaktMi = false }) => {
  const { teslimatTipi, teslimatTipiDegistir } = teslimatHafizasiKullan();
  const gelAlMi = teslimatTipi === 'gel_al';

  return (
    <div className="bg-[#150717] p-1 rounded-xl border border-[#3E1646] flex items-center gap-1">
      <button
        type="button"
        onClick={() => teslimatTipiDegistir('teslimat')}
        className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          !gelAlMi
            ? 'bg-[#6D237A] text-white shadow-sm'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${kompaktMi ? 'text-[11px]' : 'text-xs'}`}
      >
        <Bike className={kompaktMi ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Kurye Teslimatı</span>
      </button>

      <button
        type="button"
        onClick={() => teslimatTipiDegistir('gel_al')}
        className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          gelAlMi
            ? 'bg-[#DDAF53] text-[#130713] shadow-sm font-black'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        } ${kompaktMi ? 'text-[11px]' : 'text-xs'}`}
      >
        <Store className={kompaktMi ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Şubeden Gel Al</span>
      </button>
    </div>
  );
};
