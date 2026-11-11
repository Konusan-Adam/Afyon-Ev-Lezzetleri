import React from 'react';
import { Home } from 'lucide-react';

interface Props {
  mahalle: string;
  caddeSokak: string;
  binaNo: string;
  daireNo: string;
  onChange: (alan: string, deger: string) => void;
}

export const TamAdresFormu: React.FC<Props> = ({
  mahalle,
  caddeSokak,
  binaNo,
  daireNo,
  onChange
}) => {
  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-amber-900 pb-1 border-b border-amber-200/60">
        <Home className="w-3.5 h-3.5 text-amber-700" />
        <span>Teslimat Adresi (Zorunlu)</span>
      </div>

      <div className="text-[11px] font-semibold text-stone-700">
        Bölge: <span className="text-amber-800">{mahalle || 'Afyonkarahisar / Merkez'}</span>
      </div>

      <input
        type="text"
        placeholder="Cadde / Sokak adı *"
        value={caddeSokak}
        onChange={(e) => onChange('caddeSokak', e.target.value)}
        className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Bina No *"
          value={binaNo}
          onChange={(e) => onChange('binaNo', e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
        />
        <input
          type="text"
          placeholder="Daire / Kat *"
          value={daireNo}
          onChange={(e) => onChange('daireNo', e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
        />
      </div>
    </div>
  );
};
