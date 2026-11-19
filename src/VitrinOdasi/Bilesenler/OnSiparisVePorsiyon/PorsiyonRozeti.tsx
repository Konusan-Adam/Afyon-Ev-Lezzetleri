import React from 'react';
import { Flame, AlertCircle } from 'lucide-react';

interface Props {
  yemekId?: string;
  birim?: string;
  sinirsizMi?: boolean;
  kalanStok?: number;
  stoktaVarMi?: boolean;
  tukendiMiProp?: boolean;
}

export const PorsiyonRozeti: React.FC<Props> = ({
  birim,
  sinirsizMi,
  kalanStok,
  stoktaVarMi,
  tukendiMiProp,
}) => {
  const aktifBirim = birim?.trim() || 'Porsiyon';
  const stokTakibiVar = sinirsizMi !== true && typeof kalanStok === 'number' && !Number.isNaN(kalanStok);
  const tukendiMi =
    stoktaVarMi === false ||
    tukendiMiProp === true ||
    (stokTakibiVar && Number(kalanStok) <= 0);

  if (tukendiMi) {
    return (
      <div className="bg-rose-950/90 backdrop-blur-md border border-rose-500/60 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-extrabold text-rose-300 shadow-lg">
        <AlertCircle className="w-3 h-3 text-rose-400" />
        <span>Tükendi</span>
      </div>
    );
  }

  if (!stokTakibiVar || kalanStok === undefined || kalanStok > 5) {
    return null;
  }

  return (
    <div className="bg-amber-950/90 backdrop-blur-md border border-amber-500/70 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-black text-amber-300 shadow-lg">
      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
      <span>Son {kalanStok} {aktifBirim} Kaldı</span>
    </div>
  );
};
