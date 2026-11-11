import React from 'react';
import { Bike, ChevronRight } from 'lucide-react';
import { TakipVerisiTipi } from '@/src/MalzemeCekmeceleri';

interface Props {
  siparis: TakipVerisiTipi | null;
  onTikla: () => void;
}

export const TakipButonu: React.FC<Props> = ({ siparis, onTikla }) => {
  if (!siparis || siparis.asama === 'teslim_edildi') return null;

  return (
    <aside aria-label="Canlı Sipariş Takibi" className="fixed bottom-5 right-5 z-40">
      <button
        onClick={onTikla}
        className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-4 py-3 rounded-2xl shadow-xl transition-all border border-amber-500/40"
      >
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Bike className="w-4 h-4 animate-bounce" />
        </div>
        <div className="text-left text-xs">
          <div className="font-bold">Siparişim Nerede?</div>
          <div className="text-[10px] text-amber-200">#{siparis.siparisKodu} • PIN: {siparis.pinKodu}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-200" />
      </button>
    </aside>
  );
};
