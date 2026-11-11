import React, { createContext, useContext, useState } from 'react';

type PencereTipi = 'ihale' | 'abonelik' | 'hizli_kombin' | 'kvkk' | 'mesafeli_satis' | 'teslimat_politikasi' | 'gizlilik' | null;

interface OzellikHavuzuTipi {
  aktifPencere: PencereTipi;
  pencereAc: (pencere: PencereTipi) => void;
  pencereKapat: () => void;
}

const OzellikBaglami = createContext<OzellikHavuzuTipi | null>(null);

export const OzellikSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aktifPencere, setAktifPencere] = useState<PencereTipi>(null);

  const pencereAc = (pencere: PencereTipi) => setAktifPencere(pencere);
  const pencereKapat = () => setAktifPencere(null);

  return (
    <OzellikBaglami.Provider value={{ aktifPencere, pencereAc, pencereKapat }}>
      {children}
    </OzellikBaglami.Provider>
  );
};

export const useOzellikler = () => {
  const ctx = useContext(OzellikBaglami);
  if (!ctx) throw new Error('useOzellikler, OzellikSaglayici icinde kullanilmalidir.');
  return ctx;
};

// Geriye dönük uyumluluk için alias
export const ozelOzelliklerHafizasiKullan = useOzellikler;
