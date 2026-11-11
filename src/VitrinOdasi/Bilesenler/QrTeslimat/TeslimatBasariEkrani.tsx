/**
 * 🦁 AFYON EV LEZZETLERİ - TESLİMAT BAŞARI EKRANI
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 * QR veya PIN başarılı olduğunda otomatik kapanış animasyonu sunar
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  siparisKodu: string;
  onKapat: () => void;
  primTutari?: number;
}

export const TeslimatBasariEkrani: React.FC<Props> = ({
  siparisKodu,
  onKapat,
  primTutari = 45
}) => {
  const [ilerleme, setIlerleme] = useState(100);

  useEffect(() => {
    // 800 milisaniyede prim görseliyle hızlı ve pürüzsüz otomatik kapanış
    const baslangic = Date.now();
    const sure = 800;

    const interval = setInterval(() => {
      const gecen = Date.now() - baslangic;
      const kalanYuzde = Math.max(0, 100 - (gecen / sure) * 100);
      setIlerleme(kalanYuzde);

      if (gecen >= sure) {
        clearInterval(interval);
        onKapat();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onKapat]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 animate-scaleUp">
      <div className="relative w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-white">Teslimat Başarıyla Onaylandı!</h3>
        <p className="text-xs text-emerald-300 font-mono">Sipariş #{siparisKodu}</p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-md">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>+{primTutari} ₺ Prim Hesabınıza Eklendi</span>
      </div>

      <p className="text-[11px] text-gray-400">Pencere otomatik kapatılıyor...</p>

      {/* Otomatik Kapanış Çubuğu */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-75"
          style={{ width: `${ilerleme}%` }}
        />
      </div>
    </div>
  );
};
