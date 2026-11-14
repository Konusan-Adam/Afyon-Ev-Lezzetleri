import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Kullanici } from '@/src/veritabani/VeriTipleri';

interface MusteriPanelUstBaslikOzellikleri {
  aktifKullanici: Kullanici | null;
  sonMisafirAd: string;
  sonMisafirTelefon: string;
  yukleniyor: boolean;
  onVitrineDon: () => void;
  onYenile: () => void;
  onCikisYap: () => void;
}

export const MusteriPanelUstBaslik: React.FC<MusteriPanelUstBaslikOzellikleri> = ({
  aktifKullanici,
  sonMisafirAd,
  sonMisafirTelefon,
  yukleniyor,
  onVitrineDon,
  onYenile,
  onCikisYap,
}) => {
  return (
    <header className="bg-[#180A1F] border-b border-[#3E1646] px-4 py-4">
      <div className="anasayfa-genislik flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVitrineDon}
            className="p-2 rounded-xl bg-[#2D1233] text-purple-300 hover:text-white border border-purple-800/40 cursor-pointer"
            title="Vitrini Aç"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-white font-black text-sm sm:text-base">
              {aktifKullanici ? 'Müşteri Hesabım & Siparişlerim' : 'Misafir Sipariş Takibi'}
            </h1>
            <p className="text-xs text-purple-300">
              {aktifKullanici
                ? `${aktifKullanici.ad_soyad} • ${aktifKullanici.telefon}`
                : sonMisafirAd
                ? `${sonMisafirAd} • ${sonMisafirTelefon || 'Bu Cihazdaki Siparişler'}`
                : 'Bu Cihazdan Verilen Siparişler'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onYenile}
            className="p-2 rounded-xl bg-[#2D1233] text-amber-400 hover:text-amber-300 border border-purple-800/40 cursor-pointer transition-transform active:scale-95"
            title="Siparişleri Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onVitrineDon}
            className="px-3.5 py-1.5 rounded-xl bg-[#6D237A] text-white text-xs font-bold hover:bg-[#852C94] cursor-pointer shadow-md"
          >
            Lezzet Keşfet
          </button>
          {aktifKullanici && (
            <button
              type="button"
              onClick={onCikisYap}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
