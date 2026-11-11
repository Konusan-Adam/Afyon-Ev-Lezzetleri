import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { MasaustuSepetSatiri } from '../Bilesenler/Mutfak/Masaustu/MasaustuSepetSatiri';
import { MasaustuSepetOzeti } from '../Bilesenler/Mutfak/Masaustu/MasaustuSepetOzeti';
import { OdemeEkraniPenceresi } from '@/src/VitrinOdasi/Bilesenler';

interface SubeSabitSepetProps {
  sube: GelAlSubesi;
}

export const SubeSabitSepet: React.FC<SubeSabitSepetProps> = ({ sube }) => {
  const { mutfakGruplari } = sepetHafizasiKullan();
  const [odemeAcik, setOdemeAcik] = useState(false);

  const subeId = sube.id || sube.kimlik || 'sube-1';
  // Bu şubenin sepet grubunu bul
  const grup = mutfakGruplari.find((g) => g.mutfakId === subeId);
  const urunSayisi = grup ? grup.elemanlar.reduce((t, e) => t + e.adet, 0) : 0;

  return (
    <div className="w-full bg-[#240E2A]/95 backdrop-blur-md rounded-2xl border border-purple-800/60 p-4 shadow-2xl transition-all duration-300 space-y-3.5 sticky top-4">
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <h3 className="font-black text-sm text-white">{sube.ad} Sepeti</h3>
        </div>
        <span className="bg-purple-950 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300 border border-purple-800">
          {urunSayisi} Ürün
        </span>
      </div>

      {!grup || grup.elemanlar.length === 0 ? (
        <div className="py-12 text-center text-purple-300/60 text-xs">
          <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
          <p className="font-semibold text-white/80">Şube Sepetiniz Boş</p>
          <p className="text-[11px] mt-1 text-purple-300/60">Tezgahtan dilediğiniz taze ürünü ekleyin.</p>
        </div>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto pr-1 no-scrollbar space-y-1">
            {grup.elemanlar.map((item) => (
              <MasaustuSepetSatiri key={item.id} eleman={item} />
            ))}
          </div>

          <MasaustuSepetOzeti 
            grup={grup} 
            minUlasildi={true} 
            odemeTiklandi={() => setOdemeAcik(true)} 
          />
        </>
      )}

      {odemeAcik && grup && (
        <OdemeEkraniPenceresi grup={grup} onKapat={() => setOdemeAcik(false)} />
      )}
    </div>
  );
};
