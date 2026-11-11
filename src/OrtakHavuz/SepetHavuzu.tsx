import React, { createContext, useContext, useState, useMemo } from 'react';
import { SepetElemaniTipi, YemekTipi } from '@/src/veritabani/VeriTipleri';
import { SepetHavuzuTipi } from '@/src/OrtakHavuz/SepetTipleri';

const SepetBaglami = createContext<SepetHavuzuTipi | null>(null);

export const SepetSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elemanlar, setElemanlar] = useState<SepetElemaniTipi[]>([]);
  const [sepetAcikMi, setSepetAcikMi] = useState(false);

  const sepeteEkle = (yemek: YemekTipi) => {
    setElemanlar((oncekiler) => {
      const varOlan = oncekiler.find((e) => e.yemek.id === yemek.id);
      if (varOlan) {
        return oncekiler.map((e) =>
          e.yemek.id === yemek.id ? { ...e, adet: e.adet + 1 } : e
        );
      }
      return [...oncekiler, { id: 'sepet-' + Date.now(), yemek, adet: 1, birim_fiyat: yemek.fiyat }];
    });
  };

  const sepettenCikar = (yemekId: string) => {
    setElemanlar((oncekiler) => oncekiler.filter((e) => e.yemek.id !== yemekId));
  };

  const adetGuncelle = (yemekId: string, yeniAdet: number) => {
    if (yeniAdet <= 0) {
      sepettenCikar(yemekId);
      return;
    }
    setElemanlar((oncekiler) =>
      oncekiler.map((e) => (e.yemek.id === yemekId ? { ...e, adet: yeniAdet } : e))
    );
  };

  const sepetiTemizle = () => setElemanlar([]);

  const toplamTutar = useMemo(
    () => elemanlar.reduce((t, e) => t + e.birim_fiyat * e.adet, 0),
    [elemanlar]
  );

  const toplamUrunSayisi = useMemo(
    () => elemanlar.reduce((t, e) => t + e.adet, 0),
    [elemanlar]
  );

  return (
    <SepetBaglami.Provider
      value={{
        sepetElemanlari: elemanlar,
        sepeteEkle,
        sepettenCikar,
        adetGuncelle,
        sepetiTemizle,
        toplamTutar,
        toplamUrunSayisi,
        sepetAcikMi,
        sepetiAcKapat: setSepetAcikMi
      }}
    >
      {children}
    </SepetBaglami.Provider>
  );
};

const VARSAYILAN_SEPET_DEGERI: SepetHavuzuTipi = {
  sepetElemanlari: [],
  sepeteEkle: () => {},
  sepettenCikar: () => {},
  adetGuncelle: () => {},
  sepetiTemizle: () => {},
  toplamTutar: 0,
  toplamUrunSayisi: 0,
  sepetAcikMi: false,
  sepetiAcKapat: () => {},
};

export const useSepet = (): SepetHavuzuTipi => {
  const ctx = useContext(SepetBaglami);
  if (!ctx) {
    return VARSAYILAN_SEPET_DEGERI;
  }
  return ctx;
};
