/**
 * 🦁 AFYON EV LEZZETLERİ - MÜŞTERİ TESLİMAT BAŞARI KARTI
 * Kurye teslimatı onayladığında müşteriye gösterilen otomatik kapanan onay kartı
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';

interface MusteriTeslimatBasariKartiProps {
  siparisKodu: string;
  onKapat: () => void;
}

export const MusteriTeslimatBasariKarti: React.FC<MusteriTeslimatBasariKartiProps> = ({
  siparisKodu,
  onKapat
}) => {
  const [kalanYuzde, setKalanYuzde] = useState(100);

  useEffect(() => {
    // 1500 milisaniyede pürüzsüz otomatik kapanış
    const baslangic = Date.now();
    const toplamSure = 1500;

    const zamanlayici = setInterval(() => {
      const gecenSure = Date.now() - baslangic;
      const yuzde = Math.max(0, 100 - (gecenSure / toplamSure) * 100);
      setKalanYuzde(yuzde);

      if (gecenSure >= toplamSure) {
        clearInterval(zamanlayici);
        onKapat();
      }
    }, 25);

    return () => clearInterval(zamanlayici);
  }, [onKapat]);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-4 animate-scaleUp">
      <div className="relative w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)]">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-pulse" />
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Teslimat Tamamlandı</span>
        </div>
        <h3 className="text-lg font-black text-white">Afiyet Olsun!</h3>
        <p className="text-xs text-gray-300">
          Kuryemiz siparişinizi (#<span className="font-mono text-amber-300">{siparisKodu}</span>) başarıyla teslim etti.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-500/20">
        <HeartHandshake className="w-4 h-4 text-amber-400" />
        <span>Bizi tercih ettiğiniz için teşekkür ederiz.</span>
      </div>

      <p className="text-[11px] text-gray-400">Pencere otomatik kapatılıyor...</p>

      {/* Geri sayım ilerleme çubuğu */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-75"
          style={{ width: `${kalanYuzde}%` }}
        />
      </div>
    </div>
  );
};
