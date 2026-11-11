import React from 'react';
import { CheckCircle2, QrCode, KeyRound, X } from 'lucide-react';

interface Props {
  acikMi: boolean;
  kapat: () => void;
  siparisKodu: string;
  pinKodu: string;
  tutar: number;
}

export const SiparisBasariModali: React.FC<Props> = ({ acikMi, kapat, siparisKodu, pinKodu, tutar }) => {
  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-xl border border-stone-200 space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-900">Siparişiniz Alındı!</h3>
        <p className="text-xs text-stone-500">
          Usta mutfağımız yemeğinizi hazırlamaya başladı. Kurye teslimatı için PIN kodunuzu kuryeye iletiniz:
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-800 font-medium">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>4 Haneli Güvenlik PIN Kodu</span>
          </div>
          <div className="text-3xl font-black tracking-widest text-amber-900">{pinKodu}</div>
          <div className="text-[11px] text-amber-700 font-mono">Sipariş No: #{siparisKodu}</div>
        </div>

        <div className="text-xs text-stone-600">Toplam Ödenecek Tutar: <strong className="text-stone-900">{tutar} ₺</strong></div>

        <button
          onClick={kapat}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm"
        >
          Tamamdır, Teşekkürler
        </button>
      </div>
    </div>
  );
};
