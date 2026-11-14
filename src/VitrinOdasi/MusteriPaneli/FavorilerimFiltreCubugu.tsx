import React from 'react';
import { Store, ChefHat } from 'lucide-react';

interface FavorilerimFiltreCubuguOzellikleri {
  filtre: 'tumu' | 'mutfaklar' | 'subeler';
  onFiltreDegis: (yeni: 'tumu' | 'mutfaklar' | 'subeler') => void;
  toplamSayi: number;
  mutfakSayisi: number;
  subeSayisi: number;
}

export const FavorilerimFiltreCubugu: React.FC<FavorilerimFiltreCubuguOzellikleri> = ({
  filtre,
  onFiltreDegis,
  toplamSayi,
  mutfakSayisi,
  subeSayisi,
}) => {
  const butonSinif = (aktif: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
      aktif
        ? 'bg-purple-800 text-white shadow-md'
        : 'bg-[#180A1F] text-purple-300 hover:text-white border border-[#3E1646]'
    }`;

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onFiltreDegis('tumu')} className={butonSinif(filtre === 'tumu')}>
        <span>Tümü ({toplamSayi})</span>
      </button>
      <button type="button" onClick={() => onFiltreDegis('mutfaklar')} className={butonSinif(filtre === 'mutfaklar')}>
        <ChefHat className="w-3.5 h-3.5 text-amber-400" />
        <span>Mutfaklar ({mutfakSayisi})</span>
      </button>
      <button type="button" onClick={() => onFiltreDegis('subeler')} className={butonSinif(filtre === 'subeler')}>
        <Store className="w-3.5 h-3.5 text-amber-400" />
        <span>Şubeler ({subeSayisi})</span>
      </button>
    </div>
  );
};
