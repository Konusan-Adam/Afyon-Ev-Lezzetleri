import React, { createContext, useContext, useState, useEffect } from 'react';

type TemaModu = 'acik' | 'koyu';

interface TemaHavuzuTipi {
  tema: TemaModu;
  temaDegistir: () => void;
}

const TemaBaglami = createContext<TemaHavuzuTipi | null>(null);

export const TemaSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<TemaModu>('koyu');

  useEffect(() => {
    // LocalStorage veya sistem tercihinden tema yükleme eklenebilir
  }, []);

  const temaDegistir = () => {
    setTema((onceki) => (onceki === 'acik' ? 'koyu' : 'acik'));
  };

  return (
    <TemaBaglami.Provider value={{ tema, temaDegistir }}>
      {children}
    </TemaBaglami.Provider>
  );
};

export const useTema = () => {
  const ctx = useContext(TemaBaglami);
  if (!ctx) throw new Error('useTema, TemaSaglayici icinde kullanilmalidir.');
  return ctx;
};

// Geriye dönük uyumluluk için alias
export const temaHafizasiKullan = useTema;
