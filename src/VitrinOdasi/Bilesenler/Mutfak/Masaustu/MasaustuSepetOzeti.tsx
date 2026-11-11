import React from 'react';
import { ArrowRight, Store } from 'lucide-react';
import { type MutfakSepetGrubu, teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { TeslimatTipiSecici } from '@/src/VitrinOdasi/Bilesenler';

interface SepetOzetiOzellikleri {
  grup: MutfakSepetGrubu;
  minUlasildi: boolean;
  odemeTiklandi: () => void;
}

export const MasaustuSepetOzeti: React.FC<SepetOzetiOzellikleri> = ({
  grup,
  minUlasildi,
  odemeTiklandi
}) => {
  const { teslimatTipi, seciliGelAlSubesi, gelAlPenceresiAc } = teslimatHafizasiKullan();
  const gelAlMi = teslimatTipi === 'gel_al';
  const teslimatTutari = gelAlMi ? 0 : grup.teslimatUcreti;
  const nihaiToplam = grup.araToplam + teslimatTutari;

  return (
    <div className="space-y-2.5 pt-2">
      {/* Teslimat Tercihi (Kurye / Gel Al) */}
      <TeslimatTipiSecici kompaktMi />

      {gelAlMi && (
        <button
          type="button"
          onClick={gelAlPenceresiAc}
          className="w-full text-left bg-purple-900/40 hover:bg-purple-900/60 p-2 rounded-lg border border-purple-700/50 flex items-center justify-between text-[11px] text-amber-300 transition-colors"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{seciliGelAlSubesi?.ad || 'Şube Seçin'}</span>
          </span>
          <span className="text-[10px] text-purple-300 underline shrink-0">Değiştir</span>
        </button>
      )}

      <div className="border-t border-purple-900/40 pt-2 space-y-1.5 text-xs">
        <div className="flex justify-between text-purple-300">
          <span>Ara Toplam</span>
          <span>{grup.araToplam} ₺</span>
        </div>
        <div className="flex justify-between text-purple-300">
          <span>Teslimat</span>
          <span className={gelAlMi ? 'text-emerald-400 font-semibold' : ''}>
            {gelAlMi ? 'Gel Al (Ücretsiz)' : (teslimatTutari ? `${teslimatTutari} ₺` : 'Ücretsiz')}
          </span>
        </div>
        <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-purple-900/30">
          <span>Toplam</span>
          <span className="text-amber-400 font-black">{nihaiToplam} ₺</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!minUlasildi}
        onClick={odemeTiklandi}
        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
          minUlasildi
            ? 'bg-amber-500 hover:bg-amber-400 text-[#1A0A1D] shadow-amber-500/20 active:scale-98'
            : 'bg-purple-950/60 text-purple-400/50 cursor-not-allowed border border-purple-900/50'
        }`}
      >
        <span>{gelAlMi ? 'Gel-Al Siparişini Tamamla' : 'Siparişi Tamamla'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

