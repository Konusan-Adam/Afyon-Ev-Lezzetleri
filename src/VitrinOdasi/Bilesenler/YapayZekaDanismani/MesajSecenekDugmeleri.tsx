import React from 'react';
import { OneriSecenek } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/LezzetDanismaniTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';

interface MesajSecenekDugmeleriProps {
  secenekler?: OneriSecenek[];
  onSecim: (secim: string) => void;
}

export const MesajSecenekDugmeleri: React.FC<MesajSecenekDugmeleriProps> = ({
  secenekler,
  onSecim,
}) => {
  const { sepeteEkle } = sepetHafizasiKullan();

  if (!secenekler || secenekler.length === 0) return null;

  const secenekTiklandi = async (secenek: OneriSecenek) => {
    if (secenek.aksiyonTipi === 'sepete_ekle' && secenek.yemek) {
      try {
        await sepeteEkle(
          secenek.yemek.mutfak_id || '',
          secenek.yemek.id,
          1,
          secenek.yemek.fiyat
        );
      } catch (hata) {
        console.error('Sepete eklenemedi:', hata);
      }
    }
    onSecim(secenek.secimMetni || secenek.etiket);
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-amber-200/60">
      {secenekler.map((secenek) => (
        <button
          key={secenek.id}
          type="button"
          onClick={() => secenekTiklandi(secenek)}
          className="text-[11px] font-medium bg-amber-100/80 hover:bg-amber-200/90 text-[#2c124a] px-2.5 py-1 rounded-full border border-amber-300/80 transition-all shadow-2xs hover:scale-105 active:scale-95"
        >
          {secenek.etiket}
        </button>
      ))}
    </div>
  );
};
