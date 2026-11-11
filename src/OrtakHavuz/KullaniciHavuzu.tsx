import React, { createContext, useContext, useState } from 'react';
import { KullaniciProfili, KullaniciHavuzuTipi } from '@/src/OrtakHavuz/KullaniciTipleri';

const KullaniciBaglami = createContext<KullaniciHavuzuTipi | null>(null);

const VARSAYILAN_KULLANICI: KullaniciProfili = {
  kimlik: 'mus-001',
  adSoyad: 'Misafir Müşteri',
  telefon: '',
  rol: 'musteri',
  seciliAdres: ''
};

export const KullaniciSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kullanici, setKullanici] = useState<KullaniciProfili | null>(VARSAYILAN_KULLANICI);

  const oturumAc = (adSoyad: string, telefon: string) => {
    setKullanici({
      kimlik: 'mus-' + Date.now(),
      adSoyad,
      telefon,
      rol: 'musteri',
      seciliAdres: 'Afyonkarahisar Merkez'
    });
  };

  const cikisYap = () => setKullanici(null);

  const adresDegistir = (yeniAdres: string) => {
    setKullanici((onceki) => (onceki ? { ...onceki, seciliAdres: yeniAdres } : null));
  };

  return (
    <KullaniciBaglami.Provider
      value={{
        kullanici,
        oturumAcikMi: Boolean(kullanici),
        oturumAc,
        cikisYap,
        adresDegistir
      }}
    >
      {children}
    </KullaniciBaglami.Provider>
  );
};

export const useKullanici = (): KullaniciHavuzuTipi => {
  const ctx = useContext(KullaniciBaglami);
  if (!ctx) throw new Error('useKullanici, KullaniciSaglayici icinde kullanilmalidir.');
  return ctx;
};
