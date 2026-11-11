import React, { useState } from 'react';
import { X, AlertTriangle, Check, Ban } from 'lucide-react';
import { HAZIR_IPTAL_GEREKCELERI, IptalGerekcesi } from '@/src/MalzemeCekmeceleri';
import { siparisIptalEt } from '@/src/MalzemeCekmeceleri';

interface SiparisIptalPenceresiOzellikleri {
  siparisKimligi: string;
  siparisNo: string;
  onKapat: () => void;
  onBasarili: () => void;
}

export const SiparisIptalPenceresi: React.FC<SiparisIptalPenceresiOzellikleri> = ({
  siparisKimligi,
  siparisNo,
  onKapat,
  onBasarili,
}) => {
  const [seciliGerekce, setSeciliGerekce] = useState<IptalGerekcesi>(HAZIR_IPTAL_GEREKCELERI[0]);
  const [aciklamaNotu, setAciklamaNotu] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const iptaliOnayla = () => {
    setYukleniyor(true);
    setTimeout(() => {
      siparisIptalEt(siparisKimligi, seciliGerekce.baslik, aciklamaNotu);
      setYukleniyor(false);
      onBasarili();
      onKapat();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1C0821] border border-red-900/60 w-full max-w-md rounded-3xl p-5 text-white shadow-2xl relative">
        
        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onKapat}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-600/60 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-300">Siparişi İptal Et / Reddet</h3>
            <p className="text-[11px] text-gray-400">Sipariş No: #{siparisNo}</p>
          </div>
        </div>

        {/* Gerekçe Seçimi */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-[#F5D28A] block">
            İptal Gerekçesi Seçiniz:
          </label>
          <div className="space-y-1.5">
            {HAZIR_IPTAL_GEREKCELERI.map((g) => {
              const seciliMi = seciliGerekce.kimlik === g.kimlik;
              return (
                <button
                  key={g.kimlik}
                  type="button"
                  onClick={() => setSeciliGerekce(g)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    seciliMi
                      ? 'bg-red-950/40 border-red-500 text-white'
                      : 'bg-[#140616] border-[#3E1646] text-gray-300 hover:border-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      seciliMi ? 'border-red-400 bg-red-500' : 'border-gray-500'
                    }`}>
                      {seciliMi && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                    <div>
                      <span className="font-semibold block text-[11px]">{g.baslik}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ek Açıklama */}
        <div className="space-y-1.5 mb-5">
          <label className="text-xs font-bold text-gray-300 block">
            Müşteriye Ekstra Bilgi Notu (İsteğe Bağlı)
          </label>
          <input
            type="text"
            value={aciklamaNotu}
            onChange={(e) => setAciklamaNotu(e.target.value)}
            placeholder="Örn: Saat 19:00 fırınımızda yeni parti çıkacaktır..."
            className="w-full bg-[#140616] border border-[#3E1646] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Butonlar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onKapat}
            className="flex-1 bg-[#240C2A] hover:bg-[#321138] border border-[#3E1646] text-gray-300 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={yukleniyor}
            onClick={iptaliOnayla}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-colors"
          >
            <Ban className="w-4 h-4" />
            <span>{yukleniyor ? 'İptal Ediliyor...' : 'İptali Onayla'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
