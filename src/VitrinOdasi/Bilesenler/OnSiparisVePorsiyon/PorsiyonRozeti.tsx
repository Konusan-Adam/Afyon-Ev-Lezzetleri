import React, { useState, useEffect } from 'react';
import { Flame, AlertCircle, CheckCircle2 } from 'lucide-react';
import { yemekPorsiyonGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonServisi';
import { PorsiyonBilgisi } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonTipleri';

interface Props {
  yemekId: string;
  birim?: string;
  sinirsizMi?: boolean;
}

export const PorsiyonRozeti: React.FC<Props> = ({ yemekId, birim, sinirsizMi }) => {
  const [bilgi, setBilgi] = useState<PorsiyonBilgisi>(() => 
    yemekPorsiyonGetir(yemekId, undefined, birim, sinirsizMi)
  );

  useEffect(() => {
    const guncelle = () => {
      setBilgi(yemekPorsiyonGetir(yemekId, undefined, birim, sinirsizMi));
    };
    window.addEventListener('afyon_porsiyon_guncellendi', guncelle);
    return () => window.removeEventListener('afyon_porsiyon_guncellendi', guncelle);
  }, [yemekId, birim, sinirsizMi]);

  const aktifBirim = bilgi.birim || birim || 'Porsiyon';

  if (bilgi.tukendiMi) {
    return (
      <div className="bg-rose-950/90 backdrop-blur-md border border-rose-500/60 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-extrabold text-rose-300 shadow-lg animate-pulse">
        <AlertCircle className="w-3 h-3 text-rose-400" />
        <span>Bugün Tükendi</span>
      </div>
    );
  }

  // Sınırsız stok ise veya stok takibi açık değilse rozet gösterme
  if (bilgi.sinirsizMi || bilgi.kalanPorsiyon > 6) {
    return null;
  }

  if (bilgi.kalanPorsiyon <= 3) {
    return (
      <div className="bg-amber-950/90 backdrop-blur-md border border-amber-500/70 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-black text-amber-300 shadow-lg">
        <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-bounce" />
        <span>Son {bilgi.kalanPorsiyon} {aktifBirim}!</span>
      </div>
    );
  }

  if (bilgi.kalanPorsiyon <= 6) {
    return (
      <div className="bg-[#1D0822]/85 backdrop-blur-md border border-purple-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-purple-200 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>Kalan: {bilgi.kalanPorsiyon} {aktifBirim}</span>
      </div>
    );
  }

  return null;
};
