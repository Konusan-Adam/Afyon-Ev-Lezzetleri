import React from 'react';
import { X, BatteryCharging, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  acikMi: boolean;
  onKapat: () => void;
}

export const PilAyarRehberiModali: React.FC<Props> = ({ acikMi, onKapat }) => {
  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#1A0B22] border border-amber-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/60 pb-3">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Android Arka Plan & Pil Ayarı</h3>
          </div>
          <button type="button" onClick={onKapat} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Telefonunuzun uygulamayı arka planda uyutup kapatmaması için aşağıdaki 2 adımı yapmanız gerekir:</span>
          </p>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
              <div>
                <strong className="text-white block">Uygulama Bilgisine Girin:</strong>
                Telefon ana ekranındaki uygulama simgesine basılı tutun ve <strong>"Uygulama Bilgisi (i)"</strong> butonuna basın.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
              <div>
                <strong className="text-white block">Pili "Kısıtlamasız" Yapın:</strong>
                <strong>Pil</strong> sekmesine tıklayın ve <strong>"Kısıtlamasız" (Arka Planda Çalışmaya İzin Ver)</strong> seçin.
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onKapat}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Anladım, Tamam</span>
        </button>
      </div>
    </div>
  );
};
