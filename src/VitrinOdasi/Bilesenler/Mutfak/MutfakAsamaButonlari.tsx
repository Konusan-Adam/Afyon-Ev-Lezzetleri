import React from 'react';
import { Flame, PackageCheck, Bike, Check, Ban } from 'lucide-react';

interface Props {
  durum: string;
  dakika: number;
  onDurumGuncelle: (yeniDurum: 'hazirlaniyor' | 'paketlendi' | 'yolda' | 'teslim_edildi') => void;
  onIptal: () => void;
}

export const MutfakAsamaButonlari: React.FC<Props> = ({
  durum,
  dakika,
  onDurumGuncelle,
  onIptal
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {durum === 'hazirlaniyor' && (
        <>
          <button
            type="button"
            onClick={onIptal}
            className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>İptal</span>
          </button>
          <button
            type="button"
            onClick={() => onDurumGuncelle('paketlendi')}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Paketlendi ({dakika} Dk Sonra Hazır)</span>
          </button>
        </>
      )}

      {durum === 'paketlendi' && (
        <button
          type="button"
          onClick={() => onDurumGuncelle('yolda')}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Kuryeye Teslim Et ➔ Yola Çıkar</span>
        </button>
      )}

      {durum === 'yolda' && (
        <button
          type="button"
          onClick={() => onDurumGuncelle('teslim_edildi')}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Teslim Edildi Olarak Kapat</span>
        </button>
      )}
    </div>
  );
};
