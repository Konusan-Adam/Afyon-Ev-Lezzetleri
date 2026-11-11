import React from 'react';
import { Bike, Store, ShieldCheck, Info } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

interface MobilTeslimatKartiOzellikleri {
  mutfak: Mutfak;
}

export const MobilTeslimatKarti: React.FC<MobilTeslimatKartiOzellikleri> = ({ mutfak }) => {
  const {
    teslimatTipi,
    adresSecimPenceresiAc,
    gelAlPenceresiAc,
  } = teslimatHafizasiKullan();
  
  const { ayarlar } = useKuryeAyarlari();

  const gelAlMi = teslimatTipi === 'gel_al';
  const teslimatUcreti = gelAlMi ? 0 : ayarlar.taban_ucret;
  const minTutar = ayarlar.ucretsiz_teslimat_esigi;

  const degistirTiklandi = () => {
    if (gelAlMi) {
      gelAlPenceresiAc();
    } else {
      adresSecimPenceresiAc();
    }
  };

  return (
    <div className="mx-4 bg-[#1C0722] border border-purple-900/60 rounded-2xl p-3.5 space-y-2.5 shadow-lg select-none">
      {/* Üst Kısım: Teslimat Süresi & Ücret */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-[#2D0F35] p-2 rounded-xl text-purple-200 border border-purple-800/40 flex items-center gap-1 shrink-0">
            <Bike className="w-4 h-4 text-purple-300" />
            <Store className="w-4 h-4 text-amber-400" />
          </div>

          <div className="min-w-0">
            <h4 className="font-extrabold text-sm text-white truncate">
              {gelAlMi ? 'Gel Al' : 'Teslimat'}
            </h4>
            <div className="text-xs text-purple-200/70 truncate">
              <span className="text-emerald-400 font-semibold">
                {teslimatUcreti === 0 ? 'Ücretsiz Teslimat' : `${teslimatUcreti} ₺ Teslimat`}
              </span>
              <span className="mx-1">•</span>
              <span>Min. sepet {(minTutar ?? 0).toFixed(2)} TL</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={degistirTiklandi}
          className="text-xs font-bold text-white hover:text-amber-400 transition-colors cursor-pointer shrink-0 px-2 py-1"
        >
          Değiştir
        </button>
      </div>

      {/* Güvenlik Çizgisi & OTP Bilgisi */}
      <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-gray-300 text-[11px] truncate">
            Canlı GPS kurye takibi ve 4 haneli OTP güvenli teslimat
          </span>
        </div>
        <Info className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      </div>
    </div>
  );
};
