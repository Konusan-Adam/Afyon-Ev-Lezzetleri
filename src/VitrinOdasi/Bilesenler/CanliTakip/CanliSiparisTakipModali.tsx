import React, { useState } from 'react';
import { X, Navigation, QrCode } from 'lucide-react';
import { useCanliKuryeTakip } from '@/src/MalzemeCekmeceleri/useCanliKuryeTakip';
import { CanliKuryeHaritasi } from '@/src/VitrinOdasi/Bilesenler';
import { KuryeKarti } from '@/src/VitrinOdasi/Bilesenler';
import { SiparisDurumCizgisi } from '@/src/VitrinOdasi/Bilesenler';
import { MusteriQrKoduModali } from '@/src/VitrinOdasi/Bilesenler';

interface CanliSiparisTakipModaliProps {
  siparisKodu: string;
  onKapat: () => void;
}

export const CanliSiparisTakipModali: React.FC<CanliSiparisTakipModaliProps> = ({
  siparisKodu,
  onKapat,
}) => {
  const { bilgi, adim } = useCanliKuryeTakip(siparisKodu);
  const [qrModaliAcik, setQrModaliAcik] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#140616] border border-[#521E5C] w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Üst Başlık */}
        <div className="px-5 py-4 border-b border-[#3E1646] flex items-center justify-between bg-[#1C0821]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Navigation className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#F5D28A]">Canlı Kurye & Sipariş Takibi</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${bilgi.gps_aktif_mi ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-amber-950 text-amber-300 border border-amber-700/50'}`}>
                  {bilgi.gps_aktif_mi ? 'Canlı GPS' : 'GPS Aranıyor'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Sipariş No: #{siparisKodu}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQrModaliAcik(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#2D1233] hover:bg-[#3E1646] border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
              title="Teslimat Doğrulama QR Kodu"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">QR Kodum</span>
            </button>

            <button
              type="button"
              onClick={onKapat}
              className="w-8 h-8 bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-gray-300 hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <SiparisDurumCizgisi adimIndeksi={adim} tamamlandiMi={bilgi.tamamlandi_mi} />
          <CanliKuryeHaritasi bilgi={bilgi} />
          <KuryeKarti bilgi={bilgi} />
        </div>
      </div>

      {/* Teslimat Doğrulama QR Kod Modali */}
      {qrModaliAcik && (
        <MusteriQrKoduModali
          siparisKodu={siparisKodu}
          onKapat={() => setQrModaliAcik(false)}
        />
      )}
    </div>
  );
};
