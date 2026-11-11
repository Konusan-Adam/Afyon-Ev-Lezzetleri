import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan, MutfakSepetGrubu } from '@/src/OrtakHavuz';
import { MasaustuSepetSatiri } from './MasaustuSepetSatiri';
import { MasaustuSepetOzeti } from './MasaustuSepetOzeti';
import { OdemeEkraniPenceresi } from '@/src/VitrinOdasi/Bilesenler';

export const MasaustuSabitSepet: React.FC<{ mutfak: Mutfak }> = ({ mutfak }) => {
  const { mutfakGruplari } = sepetHafizasiKullan();
  const [odemeAcik, setOdemeAcik] = useState(false);

  const grup = mutfakGruplari.find((g) => g.mutfakId === mutfak.id);
  const sonGrupRef = useRef<MutfakSepetGrubu | null>(null);

  useEffect(() => {
    if (grup) {
      sonGrupRef.current = grup;
    }
  }, [grup]);

  const urunSayisi = grup ? grup.elemanlar.reduce((t, e) => t + e.adet, 0) : 0;
  const minTutar = mutfak.min_siparis_tutari || 100;
  const araToplam = grup?.araToplam || 0;
  const minUlasildi = araToplam >= minTutar;
  const yuzde = Math.min(100, Math.round((araToplam / minTutar) * 100));

  const aktifGrup = grup || sonGrupRef.current;

  return (
    <div className="w-full bg-[#240E2A]/95 backdrop-blur-md rounded-2xl border border-purple-800/60 p-4 shadow-2xl shadow-purple-950/80 transition-all duration-300 space-y-3.5">
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-sm text-white">Sipariş Sepeti</h3>
        </div>
        <span className="bg-purple-950 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300 border border-purple-800">
          {urunSayisi} Ürün
        </span>
      </div>

      {!grup || grup.elemanlar.length === 0 ? (
        <div className="py-10 text-center text-purple-300/60 text-xs">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
          <p className="font-semibold text-white/80">Sepetiniz Boş</p>
          <p className="text-[11px] mt-1 text-purple-300/60">Menüden beğendiğiniz lezzetleri ekleyin.</p>
        </div>
      ) : (
        <>
          <div className="bg-black/30 p-2.5 rounded-xl border border-purple-900/50 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-purple-200">Min. Sipariş Tutarı: {minTutar} ₺</span>
              <span className="font-bold text-amber-300">%{yuzde}</span>
            </div>
            <div className="w-full bg-purple-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all" style={{ width: `${yuzde}%` }} />
            </div>
            <p className="flex items-center gap-1 text-[10px] font-semibold text-purple-200">
              {minUlasildi ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-amber-400" />}
              <span>{minUlasildi ? 'Min. tutara ulaşıldı!' : `Sipariş için ${minTutar - araToplam} ₺ daha ekleyin.`}</span>
            </p>
          </div>

          <div className="max-h-56 overflow-y-auto pr-1 no-scrollbar space-y-1">
            {grup.elemanlar.map((item) => (
              <MasaustuSepetSatiri key={item.id} eleman={item} />
            ))}
          </div>

          <MasaustuSepetOzeti grup={grup} minUlasildi={minUlasildi} odemeTiklandi={() => setOdemeAcik(true)} />
        </>
      )}

      {odemeAcik && aktifGrup && (
        <OdemeEkraniPenceresi grup={aktifGrup} onKapat={() => setOdemeAcik(false)} />
      )}
    </div>
  );
};
