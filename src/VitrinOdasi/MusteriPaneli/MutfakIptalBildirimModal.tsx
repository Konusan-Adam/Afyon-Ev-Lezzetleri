import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface MutfakIptalBildirimModalProps {
  siparisKodu: string;
  durumAciklamasi?: string;
  onKapat: () => void;
}

export const MutfakIptalBildirimModal: React.FC<MutfakIptalBildirimModalProps> = ({
  siparisKodu,
  durumAciklamasi,
  onKapat,
}) => {
  // Hafif ses çalma (Web Audio API ile kısa bip)
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1C0821] border border-rose-600/80 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl space-y-4 animate-scale-in">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-rose-300">Siparişiniz Mutfak Tarafından İptal Edildi!</h3>
              <p className="text-[11px] text-gray-400">Sipariş No: #{siparisKodu}</p>
            </div>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-white cursor-pointer p-1 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/50 space-y-2 text-xs leading-relaxed text-rose-100">
          <p className="font-semibold">
            ⚠️ #{siparisKodu} nolu siparişiniz mutfak yoğunluğu veya malzeme eksikliği nedeniyle iptal edilmiştir.
          </p>
          {durumAciklamasi && (
            <p className="text-amber-300 font-medium bg-black/30 p-2 rounded-xl border border-rose-900/40">
              Gerekçe: {durumAciklamasi}
            </p>
          )}
          <p className="text-[11px] text-purple-200/80">
            Online kart (PayTR) ile ödeme yaptıysanız iade talebiniz başlatılmıştır; tutar bankanıza bağlı olarak 1–7 iş günü içinde kartınıza yansır. Kapıda ödeme siparişlerinde ücret tahsil edilmemiştir.
          </p>
        </div>

        <button
          type="button"
          onClick={onKapat}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
        >
          Anladım, Kapat
        </button>
      </div>
    </div>
  );
};
