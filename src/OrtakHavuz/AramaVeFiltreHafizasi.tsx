import React, { createContext, useContext, useState } from 'react';
import { FiltreKriterleri } from '@/src/veritabani/VeriTipleri';

interface AramaVeFiltreHafizasiTip {
  aramaMetni: string;
  aramaMetniniDegistir: (metin: string) => void;
  filtrePaneliAcik: boolean;
  filtrePaneliniAc: () => void;
  filtrePaneliniKapat: () => void;
  aktifFiltreler: FiltreKriterleri;
  filtreler: FiltreKriterleri;
  aktifFiltreSayisi: number;
  filtreleriUygula: (yeniFiltreler: FiltreKriterleri) => void;
  filtreleriGuncelle: (yeniFiltreler: Partial<FiltreKriterleri>) => void;
  filtreleriSifirla: () => void;
  kategoriFiltresiniTemizle: () => void;
  altKategoriFiltresiniTemizle: () => void;
  fiyatFiltresiniTemizle: () => void;
  puanFiltresiniTemizle: () => void;
  siralamaFiltresiniTemizle: () => void;
  tumFiltreleriTemizle: () => void;
  sifirla: () => void;
}

const varsayilanFiltreler: FiltreKriterleri = {
  kategori: 'Tümü',
  altKategori: undefined,
  siralama: 'varsayilan',
};

const AramaVeFiltreContext = createContext<AramaVeFiltreHafizasiTip>({
  aramaMetni: '',
  aramaMetniniDegistir: () => {},
  filtrePaneliAcik: false,
  filtrePaneliniAc: () => {},
  filtrePaneliniKapat: () => {},
  aktifFiltreler: varsayilanFiltreler,
  filtreler: varsayilanFiltreler,
  aktifFiltreSayisi: 0,
  filtreleriUygula: () => {},
  filtreleriGuncelle: () => {},
  filtreleriSifirla: () => {},
  kategoriFiltresiniTemizle: () => {},
  altKategoriFiltresiniTemizle: () => {},
  fiyatFiltresiniTemizle: () => {},
  puanFiltresiniTemizle: () => {},
  siralamaFiltresiniTemizle: () => {},
  tumFiltreleriTemizle: () => {},
  sifirla: () => {},
});

export const AramaVeFiltreSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aramaMetni, setAramaMetnini] = useState<string>('');
  const [filtrePaneliAcik, setFiltrePaneliAcik] = useState<boolean>(false);
  const [aktifFiltreler, setAktifFiltreler] = useState<FiltreKriterleri>(varsayilanFiltreler);

  const filtrePaneliniAc = () => setFiltrePaneliAcik(true);
  const filtrePaneliniKapat = () => setFiltrePaneliAcik(false);

  const filtreleriUygula = (yeniFiltreler: FiltreKriterleri) => {
    setAktifFiltreler(yeniFiltreler || varsayilanFiltreler);
  };

  const filtreleriGuncelle = (yeniFiltreler: Partial<FiltreKriterleri>) => {
    setAktifFiltreler((onceki) => ({ ...(onceki || varsayilanFiltreler), ...yeniFiltreler }));
  };

  let aktifFiltreSayisi = 0;
  if (aktifFiltreler?.kategori && aktifFiltreler.kategori !== 'Tümü') aktifFiltreSayisi++;
  if (aktifFiltreler?.minFiyat !== undefined || aktifFiltreler?.maxFiyat !== undefined) aktifFiltreSayisi++;
  if (aktifFiltreler?.minPuan !== undefined && (aktifFiltreler.minPuan || 0) > 0) aktifFiltreSayisi++;
  if (aktifFiltreler?.siralama && aktifFiltreler.siralama !== 'varsayilan') aktifFiltreSayisi++;

  const kategoriFiltresiniTemizle = () => {
    setAktifFiltreler((onceki) => ({ ...(onceki || varsayilanFiltreler), kategori: 'Tümü', altKategori: undefined }));
  };

  const altKategoriFiltresiniTemizle = () => {
    setAktifFiltreler((onceki) => {
      const yeni = { ...(onceki || varsayilanFiltreler) };
      delete yeni.altKategori;
      return yeni;
    });
  };

  const fiyatFiltresiniTemizle = () => {
    setAktifFiltreler((onceki) => {
      const yeni = { ...(onceki || varsayilanFiltreler) };
      delete yeni.minFiyat;
      delete yeni.maxFiyat;
      return yeni;
    });
  };

  const puanFiltresiniTemizle = () => {
    setAktifFiltreler((onceki) => {
      const yeni = { ...(onceki || varsayilanFiltreler) };
      delete yeni.minPuan;
      return yeni;
    });
  };

  const siralamaFiltresiniTemizle = () => {
    setAktifFiltreler((onceki) => ({ ...(onceki || varsayilanFiltreler), siralama: 'varsayilan' }));
  };

  const tumFiltreleriTemizle = () => {
    setAktifFiltreler(varsayilanFiltreler);
  };

  const filtreleriSifirla = () => {
    setAktifFiltreler(varsayilanFiltreler);
  };

  const sifirla = () => {
    setAramaMetnini('');
    setAktifFiltreler(varsayilanFiltreler);
  };

  const guvenliAktifFiltreler = aktifFiltreler || varsayilanFiltreler;

  return (
    <AramaVeFiltreContext.Provider
      value={{
        aramaMetni,
        aramaMetniniDegistir: setAramaMetnini,
        filtrePaneliAcik,
        filtrePaneliniAc,
        filtrePaneliniKapat,
        aktifFiltreler: guvenliAktifFiltreler,
        filtreler: guvenliAktifFiltreler,
        aktifFiltreSayisi,
        filtreleriUygula,
        filtreleriGuncelle,
        filtreleriSifirla,
        kategoriFiltresiniTemizle,
        altKategoriFiltresiniTemizle,
        fiyatFiltresiniTemizle,
        puanFiltresiniTemizle,
        siralamaFiltresiniTemizle,
        tumFiltreleriTemizle,
        sifirla,
      }}
    >
      {children}
    </AramaVeFiltreContext.Provider>
  );
};

export const aramaVeFiltreKullan = () => {
  const baglam = useContext(AramaVeFiltreContext);
  return baglam || {
    aramaMetni: '',
    aramaMetniniDegistir: () => {},
    filtrePaneliAcik: false,
    filtrePaneliniAc: () => {},
    filtrePaneliniKapat: () => {},
    aktifFiltreler: varsayilanFiltreler,
    filtreler: varsayilanFiltreler,
    aktifFiltreSayisi: 0,
    filtreleriUygula: () => {},
    filtreleriGuncelle: () => {},
    filtreleriSifirla: () => {},
    kategoriFiltresiniTemizle: () => {},
    fiyatFiltresiniTemizle: () => {},
    puanFiltresiniTemizle: () => {},
    siralamaFiltresiniTemizle: () => {},
    tumFiltreleriTemizle: () => {},
    sifirla: () => {},
  };
};
