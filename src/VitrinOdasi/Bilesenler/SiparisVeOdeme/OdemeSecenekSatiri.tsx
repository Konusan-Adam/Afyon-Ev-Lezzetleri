import React from 'react';

interface OdemeSecenekSatiriOzellikleri {
  baslik: string;
  aciklama: string;
  seciliMi: boolean;
  ikon: React.ReactNode;
  onSec: () => void;
}

export const OdemeSecenekSatiri: React.FC<OdemeSecenekSatiriOzellikleri> = ({
  baslik,
  aciklama,
  seciliMi,
  ikon,
  onSec,
}) => {
  return (
    <label
      onClick={onSec}
      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
        seciliMi
          ? 'bg-[#3A1440] border-[#CFA353] text-white shadow-sm'
          : 'bg-[#1A081D] border-[#3E1646] text-gray-300 hover:border-[#521E5C]'
      }`}
    >
      <div className="flex items-center gap-3">
        {ikon}
        <div className="text-xs">
          <p className="font-bold">{baslik}</p>
          <p className="text-[10px] text-gray-400">{aciklama}</p>
        </div>
      </div>
      <input
        type="radio"
        name="odeme_yontemi"
        checked={seciliMi}
        onChange={onSec}
        className="accent-[#CFA353]"
      />
    </label>
  );
};
