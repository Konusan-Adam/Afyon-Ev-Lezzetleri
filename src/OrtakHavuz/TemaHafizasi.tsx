import React, { createContext, useContext, useState, useEffect } from 'react';

type TemaTuru = 'koyu' | 'acik';

interface TemaHafizasiTip {
  tema: TemaTuru;
  temaDegistir: () => void;
}

const TemaHafizasiContext = createContext<TemaHafizasiTip>({
  tema: 'koyu',
  temaDegistir: () => {},
});

export const TemaSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<TemaTuru>(() => {
    try {
      const kayitliTema = localStorage.getItem('afyon_ev_lezzetleri_tema');
      return (kayitliTema === 'acik' || kayitliTema === 'koyu') ? kayitliTema : 'koyu';
    } catch {
      return 'koyu';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('afyon_ev_lezzetleri_tema', tema);
    } catch {
      // localStorage erişim engeli durumu
    }

    if (tema === 'acik') {
      document.documentElement.classList.add('acik-tema');
      document.documentElement.classList.remove('koyu-tema');
    } else {
      document.documentElement.classList.add('koyu-tema');
      document.documentElement.classList.remove('acik-tema');
    }
  }, [tema]);

  const temaDegistir = () => {
    setTema((onceki) => (onceki === 'koyu' ? 'acik' : 'koyu'));
  };

  return (
    <TemaHafizasiContext.Provider value={{ tema, temaDegistir }}>
      {children}
    </TemaHafizasiContext.Provider>
  );
};

export const temaHafizasiKullan = () => useContext(TemaHafizasiContext);
