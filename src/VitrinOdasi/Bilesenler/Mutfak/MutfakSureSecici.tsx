import React from 'react';
import { Timer } from 'lucide-react';

interface Props {
  seciliDakika: number;
  onSureDegisti: (dakika: number) => void;
}

export const MutfakSureSecici: React.FC<Props> = ({ seciliDakika, onSureDegisti }) => {
  const hizliSecenekler = [10, 20, 30, 45];

  return (
    <div className="flex items-center gap-2 flex-wrap text-xs">
      <span className="text-purple-300 flex items-center gap-1 font-medium">
        <Timer className="w-3.5 h-3.5 text-amber-400" />
        <span>Süre (Dk):</span>
      </span>

      {hizliSecenekler.map((dk) => (
        <button
          key={dk}
          type="button"
          onClick={() => onSureDegisti(dk)}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
            seciliDakika === dk
              ? 'bg-amber-500 text-purple-950 shadow-xs'
              : 'bg-purple-950/80 text-purple-200 border border-purple-800/60 hover:bg-purple-900'
          }`}
        >
          {dk} Dk
        </button>
      ))}

      <div className="flex items-center gap-1 ml-1">
        <input
          type="number"
          min="1"
          max="180"
          value={seciliDakika || ''}
          onChange={(e) => onSureDegisti(Math.max(1, Number(e.target.value) || 0))}
          className="w-14 bg-purple-950 border border-purple-700 rounded-lg px-2 py-0.5 text-amber-300 text-xs font-bold text-center focus:outline-none focus:border-amber-400"
          placeholder="Dk"
        />
        <span className="text-[10px] text-purple-400">dk</span>
      </div>
    </div>
  );
};
