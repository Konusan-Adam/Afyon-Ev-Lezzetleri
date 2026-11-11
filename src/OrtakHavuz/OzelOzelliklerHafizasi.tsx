import React, { createContext, useContext, useState } from 'react';

type OzelPencereTipi = 'ihale' | 'hizli_kombin' | 'asistan' | 'abonelik' | null;

interface OzelOzelliklerHafizaTipi {
  aktifPencere: OzelPencereTipi;
  pencereAc: (tip: OzelPencereTipi) => void;
  pencereKapat: () => void;
}

const OzelOzelliklerContext = createContext<OzelOzelliklerHafizaTipi | undefined>(undefined);

export const OzelOzelliklerSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aktifPencere, setAktifPencere] = useState<OzelPencereTipi>(null);

  return (
    <OzelOzelliklerContext.Provider
      value={{
        aktifPencere,
        pencereAc: (tip) => setAktifPencere(tip),
        pencereKapat: () => setAktifPencere(null),
      }}
    >
      {children}
    </OzelOzelliklerContext.Provider>
  );
};

export const ozelOzelliklerHafizasiKullan = () => {
  const context = useContext(OzelOzelliklerContext);
  if (!context) {
    throw new Error('ozelOzelliklerHafizasiKullan, OzelOzelliklerSaglayici içinde kullanılmalıdır');
  }
  return context;
};
