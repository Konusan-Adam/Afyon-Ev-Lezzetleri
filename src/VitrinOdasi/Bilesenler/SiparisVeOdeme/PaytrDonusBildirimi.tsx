import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const PaytrDonusBildirimi: React.FC = () => {
  const [durum, setDurum] = useState<'basarili' | 'hata' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const arama = new URLSearchParams(window.location.search);
    const paytrParam = arama.get('paytr');

    if (paytrParam === 'basarili' || paytrParam === 'hata') {
      setDurum(paytrParam);
      arama.delete('paytr');
      arama.delete('oid');
      const kalanSorgu = arama.toString();
      const yeniUrl = `${window.location.pathname}${kalanSorgu ? `?${kalanSorgu}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', yeniUrl);
    }
  }, []);

  if (!durum) return null;

  const basariliMi = durum === 'basarili';

  return (
    <div className="fixed top-4 right-4 z-[80] max-w-sm w-[calc(100%-2rem)] animate-in fade-in slide-in-from-top-3">
      <div
        className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 text-xs ${
          basariliMi
            ? 'bg-emerald-950/95 border-emerald-500/70 text-emerald-100'
            : 'bg-rose-950/95 border-rose-500/70 text-rose-100'
        }`}
      >
        {basariliMi ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 space-y-1">
          <p className="font-black text-sm">
            {basariliMi ? 'Ödemeniz Başarıyla Alındı' : 'Ödeme Tamamlanamadı'}
          </p>
          <p className="text-[11px] opacity-90">
            {basariliMi
              ? 'PayTR online kart ödemeniz onaylandı. Siparişinizi Siparişlerim ekranından takip edebilirsiniz.'
              : 'PayTR ödeme işlemi tamamlanamadı veya iptal edildi. Dilerseniz ödeme adımını tekrar deneyebilirsiniz.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDurum(null)}
          className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
