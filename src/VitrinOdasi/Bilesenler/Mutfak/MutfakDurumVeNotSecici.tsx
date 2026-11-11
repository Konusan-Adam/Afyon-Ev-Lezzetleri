import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { icerikGuvenlikKontrolu } from '@/src/MalzemeCekmeceleri';

interface Props {
  seciliDurum: string;
  ozelNot: string;
  onDurumSec: (durum: string, varsayilanNot: string) => void;
  onNotDegisti: (not: string) => void;
}

export const MutfakDurumVeNotSecici: React.FC<Props> = ({
  seciliDurum,
  ozelNot,
  onDurumSec,
  onNotDegisti
}) => {
  const sablonlar = [
    { kod: 'hazirlaniyor', baslik: '🔥 Pişiyor', varsayilan: 'Mutfakta özenle pişiriliyor.' },
    { kod: 'paketlendi', baslik: '📦 Paketlendi', varsayilan: 'Sıcak paketlendi, kurye bekleniyor.' },
    { kod: 'yolda', baslik: '🛵 Kuryede', varsayilan: 'Kuryeye teslim edildi, sıcak yolda!' }
  ];

  const guvenlik = icerikGuvenlikKontrolu(ozelNot);

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-1.5 flex-wrap">
        {sablonlar.map((s) => (
          <button
            key={s.kod}
            type="button"
            onClick={() => onDurumSec(s.kod, s.varsayilan)}
            className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              seciliDurum === s.kod
                ? 'bg-amber-500 text-purple-950 shadow-sm'
                : 'bg-purple-950/70 text-purple-200 border border-purple-800/60 hover:bg-purple-900'
            }`}
          >
            {s.baslik}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={ozelNot}
        onChange={(e) => onNotDegisti(e.target.value)}
        placeholder="Müşteriye özel durum notu (Örn: Bükmeler fırından nar gibi çıkıyor...)"
        className={`w-full bg-purple-950/80 border rounded-xl px-3 py-1.5 text-white placeholder-purple-400/60 text-xs focus:outline-none ${
          guvenlik.guvenliMi ? 'border-purple-800 focus:border-amber-400' : 'border-rose-500'
        }`}
      />

      {!guvenlik.guvenliMi && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-bold bg-rose-950/80 border border-rose-500/50 p-2 rounded-lg">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{guvenlik.uyari}</span>
        </div>
      )}
    </div>
  );
};
