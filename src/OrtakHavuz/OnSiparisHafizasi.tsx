import React, { createContext, useContext, useState, useEffect } from 'react';
import { type OnSiparisTercihi } from '@/src/MalzemeCekmeceleri';

const ON_SIPARIS_DEPO_KEY = 'afyon_on_siparis_tercihi_v1';

export const VARSAYILAN_TESLIMAT_TERCIHI: OnSiparisTercihi = {
  tip: 'hemen',
  tarihEtiketi: 'Hemen Şimdi',
  saatAraligi: '25-35 dk Sıcak Teslimat',
};

interface OnSiparisHafizaTipi {
  tercih: OnSiparisTercihi;
  seciciAcik: boolean;
  seciciyiAc: () => void;
  seciciyiKapat: () => void;
  tercihGuncelle: (yeni: OnSiparisTercihi) => void;
}

const OnSiparisContext = createContext<OnSiparisHafizaTipi | undefined>(undefined);

export const OnSiparisSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tercih, setTercih] = useState<OnSiparisTercihi>(() => {
    try {
      const kayitli = localStorage.getItem(ON_SIPARIS_DEPO_KEY);
      if (kayitli) return JSON.parse(kayitli);
    } catch {}
    return VARSAYILAN_TESLIMAT_TERCIHI;
  });

  const [seciciAcik, setSeciciAcik] = useState(false);

  const tercihGuncelle = (yeni: OnSiparisTercihi) => {
    setTercih(yeni);
    try {
      localStorage.setItem(ON_SIPARIS_DEPO_KEY, JSON.stringify(yeni));
      window.dispatchEvent(new CustomEvent('afyon_on_siparis_guncellendi', { detail: yeni }));
    } catch {}
  };

  return (
    <OnSiparisContext.Provider
      value={{
        tercih,
        seciciAcik,
        seciciyiAc: () => setSeciciAcik(true),
        seciciyiKapat: () => setSeciciAcik(false),
        tercihGuncelle,
      }}
    >
      {children}
    </OnSiparisContext.Provider>
  );
};

export const useOnSiparis = () => {
  const ctx = useContext(OnSiparisContext);
  if (!ctx) {
    throw new Error('useOnSiparis, OnSiparisSaglayici içinde kullanılmalıdır');
  }
  return ctx;
};
