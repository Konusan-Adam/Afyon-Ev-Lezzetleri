/**
 * 🦁 AFYON EV LEZZETLERİ - MANUEL PIN GİRİŞ KUTUSU
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 * Müşterinin 4 haneli PIN koduyla kapıda teslimat onayı
 */

import React from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';

interface Props {
  girilenPin: string;
  onPinDegisti: (yeniPin: string) => void;
  onPinOnayla: () => void;
  yukleniyor: boolean;
}

export const ManuelPinGirisKutusu: React.FC<Props> = ({
  girilenPin,
  onPinDegisti,
  onPinOnayla,
  yukleniyor
}) => {
  return (
    <div className="space-y-2 pt-2 border-t border-purple-900/60">
      <div className="text-[11px] text-gray-400 text-center font-semibold">
        VEYA MÜŞTERİNİN 4 HANELİ PIN'İNİ GİRİN
      </div>
      <div className="relative">
        <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
        <input
          type="text"
          maxLength={4}
          value={girilenPin}
          onChange={(e) => onPinDegisti(e.target.value.replace(/\D/g, ''))}
          placeholder="4 Haneli PIN (Örn: 4829)"
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#120414] border border-purple-900/70 text-white placeholder-gray-500 text-center font-mono font-bold tracking-widest text-base focus:outline-none focus:border-amber-400"
        />
      </div>

      <button
        type="button"
        onClick={onPinOnayla}
        disabled={yukleniyor || girilenPin.trim().length !== 4}
        className="w-full py-2.5 rounded-xl bg-[#4D1857] hover:bg-[#641F71] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>PIN ile Teslimatı Onayla (+45 ₺ Prim)</span>
      </button>
    </div>
  );
};
