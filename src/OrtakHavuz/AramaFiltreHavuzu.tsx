import React, { createContext, useContext, useState } from 'react';

interface Filtreler {
  kategori: string;
  aramaMetni: string;
  altKategori?: string;
  siralama?: 'varsayilan' | 'puan_azalan' | 'fiyat_artan' | 'fiyat_azalan';
  minPuan?: number;
  minFiyat?: number;
  maxFiyat?: number;
}

interface AramaFiltreTipi {
  filtreler: Filtreler;
  aramaMetni: string;
  aramaMetniniDegistir: (metin: string) => void;
  filtreleriUygula: (yeniFiltreler: Partial<Filtreler>) => void;
  filtreleriGuncelle: (yeniFiltreler: Partial<Filtreler>) => void;
  filtrePaneliniAc: () => void;
  filtrePaneliniKapat: () => void;
  filtrePaneliAcik: boolean;
  temizle: () => void;
  tumFiltreleriTemizle: () => void;
  aktifFiltreler: Filtreler;
  aktifFiltreSayisi: number;
}

const AramaFiltreBaglami = createContext<AramaFiltreTipi | null>(null);

export const AramaFiltreSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filtreler, setFiltreler] = useState<Filtreler>({
    kategori: 'Tümü',
    aramaMetni: ''
  });
  const [filtrePaneliAcik, setFiltrePaneliAcik] = useState(false);

  const aramaMetniniDegistir = (metin: string) => {
    setFiltreler((onceki) => ({ ...onceki, aramaMetni: metin }));
  };

  const filtreleriUygula = (yeniFiltreler: Partial<Filtreler>) => {
    setFiltreler((onceki) => ({ ...onceki, ...yeniFiltreler }));
  };

  const filtrePaneliniAc = () => setFiltrePaneliAcik(true);
  const filtrePaneliniKapat = () => setFiltrePaneliAcik(false);

  const temizle = () => {
    setFiltreler({ kategori: 'Tümü', aramaMetni: '' });
  };

  const aktifFiltreSayisi = Object.entries(filtreler).filter(([key, value]) => {
    if (key === 'aramaMetni') return false;
    if (key === 'kategori' && (value === '' || value === 'Tümü')) return false;
    return Boolean(value);
  }).length;

  return (
    <AramaFiltreBaglami.Provider
      value={{
        filtreler,
        aramaMetni: filtreler.aramaMetni,
        aramaMetniniDegistir,
        filtreleriUygula,
        filtreleriGuncelle: filtreleriUygula,
        filtrePaneliniAc,
        filtrePaneliniKapat,
        filtrePaneliAcik,
        temizle,
        tumFiltreleriTemizle: temizle,
        aktifFiltreler: filtreler,
        aktifFiltreSayisi
      }}
    >
      {children}
    </AramaFiltreBaglami.Provider>
  );
};

export const useAramaFiltre = () => {
  const ctx = useContext(AramaFiltreBaglami);
  if (!ctx) throw new Error('useAramaFiltre, AramaFiltreSaglayici icinde kullanilmalidir.');
  return ctx;
};

export const aramaVeFiltreKullan = useAramaFiltre;
