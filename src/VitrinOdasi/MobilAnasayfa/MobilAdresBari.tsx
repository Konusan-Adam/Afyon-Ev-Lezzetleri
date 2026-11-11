import React from 'react';
import { MapPin } from 'lucide-react';

interface MobilAdresBariOzellikleri {
  adres?: string;
  adresDegistirTiklandi: () => void;
}

export const MobilAdresBari: React.FC<MobilAdresBariOzellikleri> = ({ 
  adres, 
  adresDegistirTiklandi 
}) => {
  const adresMetni = adres || "Lütfen teslimat adresi seçiniz";
  const adresSeciliMi = !!adres;

  return (
    <div className="bg-[#2D0D2D] py-1.5 px-3 rounded-full flex items-center justify-between mb-1 mx-4 mt-1.5 border border-white/5 shadow-lg">
      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2" onClick={adresDegistirTiklandi}>
        <div className="bg-white/10 p-1.5 rounded-full shrink-0">
          <MapPin size={18} className={adresSeciliMi ? "text-[#FFB800]" : "text-white/50"} />
        </div>
        <span className={`text-sm font-medium truncate ${adresSeciliMi ? "text-white" : "text-white/50"}`}>
          {adresMetni}
        </span>
      </div>
      <button 
        onClick={adresDegistirTiklandi}
        className="bg-white/10 hover:bg-white/20 text-[#FFB800] text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors shrink-0"
      >
        {adresSeciliMi ? "Değiştir" : "Seç"}
      </button>
    </div>
  );
};
