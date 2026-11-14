import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  paytrSunucuHazirlikGetir,
  paytrTestBaglantisiYap,
  type PaytrHazirlikYaniti,
} from '@/src/MalzemeCekmeceleri/Paytr/paytrYonetimServisi';

export const PatronPaytrDurumKarti: React.FC = () => {
  const [hazirlik, setHazirlik] = useState<PaytrHazirlikYaniti | null>(null);
  const [testYukleniyor, setTestYukleniyor] = useState(false);
  const [testSonuc, setTestSonuc] = useState<{ basarili: boolean; metin: string } | null>(null);

  useEffect(() => {
    paytrSunucuHazirlikGetir().then(setHazirlik).catch(() => {});
  }, []);

  const baglantiTestiCalistir = async () => {
    setTestYukleniyor(true);
    setTestSonuc(null);
    try {
      const sonuc = await paytrTestBaglantisiYap();
      setTestSonuc({
        basarili: sonuc.basarili,
        metin: sonuc.mesaj || sonuc.hata || 'Test sonucu alındı.',
      });
    } catch {
      setTestSonuc({ basarili: false, metin: 'Sunucuya ulaşılamadı.' });
    } finally {
      setTestYukleniyor(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#180A1F] border border-[#3E1646] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sunucu PayTR Bağlantı Durumu</span>
        </div>
        <button
          type="button"
          disabled={testYukleniyor}
          onClick={baglantiTestiCalistir}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{testYukleniyor ? 'Test Ediliyor...' : '1,00 TL Canlı Bağlantı Testi'}</span>
        </button>
      </div>

      {hazirlik && (
        <div className="flex items-center gap-2 text-[11px]">
          {hazirlik.hazirMi ? (
            <span className="text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sunucu anahtarları tanımlı ve hazır.
            </span>
          ) : (
            <span className="text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Eksik sunucu ortam değişkenleri: {hazirlik.eksikler.join(', ')} (Demo simülasyon kullanılabilir)
            </span>
          )}
        </div>
      )}

      {testSonuc && (
        <div
          className={`p-2.5 rounded-lg text-[11px] border ${
            testSonuc.basarili
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
              : 'bg-rose-950/60 border-rose-700/60 text-rose-200'
          }`}
        >
          {testSonuc.metin}
        </div>
      )}
    </div>
  );
};
