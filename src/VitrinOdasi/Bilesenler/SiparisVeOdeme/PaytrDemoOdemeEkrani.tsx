import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { paytrDemoSonucGonder } from '@/src/MalzemeCekmeceleri/Paytr/paytrApiIstemcisi';

interface PaytrDemoOdemeEkraniOzellikleri {
  merchantOid: string;
  tutar: number;
  taksitBilgisi?: string;
}

export const PaytrDemoOdemeEkrani: React.FC<PaytrDemoOdemeEkraniOzellikleri> = ({
  merchantOid,
  tutar,
  taksitBilgisi,
}) => {
  const [kartSahibi, setKartSahibi] = useState('AFYON TEST MÜŞTERİ');
  const [kartNo, setKartNo] = useState('4543 6000 0000 0000');
  const [skt, setSkt] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [isleniyor, setIsleniyor] = useState(false);

  const sonucuTetikle = async (sonuc: 'odendi' | 'hata') => {
    setIsleniyor(true);
    try {
      await paytrDemoSonucGonder(
        merchantOid,
        sonuc,
        sonuc === 'hata' ? 'Demo ödemesi kullanıcı tarafından iptal edildi.' : undefined
      );
    } finally {
      setIsleniyor(false);
    }
  };

  return (
    <div className="space-y-4 text-xs text-gray-200">
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>PayTR Demo 3D Secure Simülasyonu</span>
        </div>
        <span className="font-black text-white">{tutar.toFixed(2)} ₺</span>
      </div>

      {taksitBilgisi && (
        <p className="text-[11px] text-purple-300 font-medium">{taksitBilgisi}</p>
      )}

      <div className="space-y-3 bg-[#120616] p-4 rounded-2xl border border-purple-900/50">
        <div>
          <label className="block text-[11px] text-purple-300 mb-1">Kart Üzerindeki İsim</label>
          <input
            type="text"
            value={kartSahibi}
            onChange={(e) => setKartSahibi(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1F0B26] border border-[#4D1857] text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="block text-[11px] text-purple-300 mb-1">Test Kart Numarası</label>
          <input
            type="text"
            value={kartNo}
            onChange={(e) => setKartNo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1F0B26] border border-[#4D1857] text-white font-mono outline-none focus:border-amber-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-purple-300 mb-1">Son Kullanma</label>
            <input
              type="text"
              value={skt}
              onChange={(e) => setSkt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1F0B26] border border-[#4D1857] text-white font-mono outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-[11px] text-purple-300 mb-1">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1F0B26] border border-[#4D1857] text-white font-mono outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          disabled={isleniyor}
          onClick={() => sonucuTetikle('odendi')}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isleniyor ? 'Doğrulanıyor...' : '3D Onayla ve Öde'}</span>
        </button>
        <button
          type="button"
          disabled={isleniyor}
          onClick={() => sonucuTetikle('hata')}
          className="py-3 px-4 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-rose-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <XCircle className="w-4 h-4" />
          <span>İptal / Hata Testi</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
        <Lock className="w-3 h-3 text-emerald-400" />
        <span>Oturum Kodu: {merchantOid} • 256-Bit SSL Simülasyonu</span>
      </div>
    </div>
  );
};
