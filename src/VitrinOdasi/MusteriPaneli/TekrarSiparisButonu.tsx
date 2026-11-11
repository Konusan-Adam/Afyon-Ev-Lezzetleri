import React, { useState } from 'react';
import { RotateCw, Check } from 'lucide-react';
import { TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';
import { siparisiTekrarSepeteEkle } from './tekrarSiparisIslemi';

interface TekrarSiparisButonuProps {
  mutfakId: string;
  elemanlar: TestSiparisElemani[];
  sepeteEkleFonksiyonu: (
    mutfakId: string,
    yemekId: string,
    adet: number,
    birimFiyat: number
  ) => Promise<void>;
  sepetPaneliAc: () => void;
}

export const TekrarSiparisButonu: React.FC<TekrarSiparisButonuProps> = ({
  mutfakId,
  elemanlar,
  sepeteEkleFonksiyonu,
  sepetPaneliAc
}) => {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [eklendi, setEklendi] = useState(false);

  const tiklandi = async () => {
    if (yukleniyor || elemanlar.length === 0) return;
    setYukleniyor(true);
    const basarili = await siparisiTekrarSepeteEkle({
      mutfakId,
      elemanlar,
      sepeteEkleFonksiyonu,
      sepetPaneliAc
    });
    setYukleniyor(false);

    if (basarili) {
      setEklendi(true);
      setTimeout(() => setEklendi(false), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={tiklandi}
      disabled={yukleniyor}
      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer select-none active:scale-95 ${
        eklendi
          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
          : 'bg-[#2E1035] hover:bg-[#3E1647] border-[#6A2573] hover:border-[#DDAF53] text-[#F3E8FF] shadow-sm'
      }`}
      title="Bu siparişteki yemekleri sepete ekler"
    >
      {eklendi ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sepete Eklendi!</span>
        </>
      ) : (
        <>
          <RotateCw className={`w-3.5 h-3.5 text-[#DDAF53] ${yukleniyor ? 'animate-spin' : ''}`} />
          <span>{yukleniyor ? 'Ekleniyor...' : 'Tekrar Sipariş Ver'}</span>
        </>
      )}
    </button>
  );
};
