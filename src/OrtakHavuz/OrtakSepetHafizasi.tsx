import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OrtakSepet,
  OrtakSepetKatilimci,
  OrtakSepetElemani,
  Yemek,
} from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import {
  yeniOrtakSepetOlustur,
  kodaGoreOrtakSepeteKatil,
  ortakSepetDetaylariniGetir,
  ortakSepeteYemekEklemeIslemi,
  ortakSepettenYemekSilmeIslemi,
} from '@/src/MalzemeCekmeceleri/Sepet/ortakSepetIslemleri';

interface OrtakSepetHafizaTipi {
  aktifOrtakSepet: OrtakSepet | null;
  mevcutKatilimci: OrtakSepetKatilimci | null;
  katilimciListesi: OrtakSepetKatilimci[];
  ortakSepetElemanlari: OrtakSepetElemani[];
  pencereAcik: boolean;
  yukleniyor: boolean;
  pencereAc: () => void;
  pencereKapat: () => void;
  sepetOlustur: (olusturanAd: string) => Promise<boolean>;
  sepeteKatil: (sepetKodu: string, katilimciAd: string) => Promise<boolean>;
  ortakSepeteYemekEkle: (yemek: Yemek, adet?: number) => Promise<boolean>;
  ortakSepettenYemekSil: (elemanKimligi: string) => Promise<boolean>;
  ortakSepettenCik: () => void;
}

const OrtakSepetContext = createContext<OrtakSepetHafizaTipi | undefined>(undefined);

export const OrtakSepetSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aktifOrtakSepet, setAktifOrtakSepet] = useState<OrtakSepet | null>(null);
  const [mevcutKatilimci, setMevcutKatilimci] = useState<OrtakSepetKatilimci | null>(null);
  const [katilimciListesi, setKatilimciListesi] = useState<OrtakSepetKatilimci[]>([]);
  const [ortakSepetElemanlari, setOrtakSepetElemanlari] = useState<OrtakSepetElemani[]>([]);
  const [pencereAcik, setPencereAcik] = useState<boolean>(false);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);

  // Canlı Verileri Yenile
  const detaylariYenile = async (sepetKimligi: string) => {
    const { katilimcilar, elemanlar } = await ortakSepetDetaylariniGetir(sepetKimligi);
    setKatilimciListesi(katilimcilar);
    setOrtakSepetElemanlari(elemanlar);
  };

  // Canlı Sepet Değişiklikleri Dinleme
  useEffect(() => {
    if (!aktifOrtakSepet) return;

    detaylariYenile(aktifOrtakSepet.kimlik);

    let dinleme1 = () => {};
    let dinleme2 = () => {};

    if (canliFirebaseAktifMi()) {
      dinleme1 = koleksiyonuCanliDinle('ortak_sepet_elemanlari', () => {
        detaylariYenile(aktifOrtakSepet.kimlik);
      });
      dinleme2 = koleksiyonuCanliDinle('ortak_sepet_katilimcilari', () => {
        detaylariYenile(aktifOrtakSepet.kimlik);
      });
    }

    return () => {
      dinleme1();
      dinleme2();
    };
  }, [aktifOrtakSepet?.kimlik]);

  const sepetOlustur = async (olusturanAd: string): Promise<boolean> => {
    setYukleniyor(true);
    const sonuc = await yeniOrtakSepetOlustur(olusturanAd);
    setYukleniyor(false);

    if (sonuc) {
      setAktifOrtakSepet(sonuc.sepet);
      setMevcutKatilimci(sonuc.katilimci);
      await detaylariYenile(sonuc.sepet.kimlik);
      return true;
    }
    return false;
  };

  const sepeteKatil = async (sepetKodu: string, katilimciAd: string): Promise<boolean> => {
    setYukleniyor(true);
    const sonuc = await kodaGoreOrtakSepeteKatil(sepetKodu, katilimciAd);
    setYukleniyor(false);

    if (sonuc) {
      setAktifOrtakSepet(sonuc.sepet);
      setMevcutKatilimci(sonuc.katilimci);
      await detaylariYenile(sonuc.sepet.kimlik);
      return true;
    }
    return false;
  };

  const ortakSepeteYemekEkle = async (yemek: Yemek, adet: number = 1): Promise<boolean> => {
    if (!aktifOrtakSepet || !mevcutKatilimci) {
      setPencereAcik(true);
      return false;
    }

    const basarili = await ortakSepeteYemekEklemeIslemi(
      aktifOrtakSepet.kimlik,
      mevcutKatilimci.kimlik,
      mevcutKatilimci.katilimci_adi,
      yemek,
      adet
    );

    if (basarili) {
      await detaylariYenile(aktifOrtakSepet.kimlik);
    }
    return basarili;
  };

  const ortakSepettenYemekSil = async (elemanKimligi: string): Promise<boolean> => {
    if (!aktifOrtakSepet) return false;
    const basarili = await ortakSepettenYemekSilmeIslemi(elemanKimligi);
    if (basarili) {
      await detaylariYenile(aktifOrtakSepet.kimlik);
    }
    return basarili;
  };

  const ortakSepettenCik = () => {
    setAktifOrtakSepet(null);
    setMevcutKatilimci(null);
    setKatilimciListesi([]);
    setOrtakSepetElemanlari([]);
  };

  return (
    <OrtakSepetContext.Provider
      value={{
        aktifOrtakSepet,
        mevcutKatilimci,
        katilimciListesi,
        ortakSepetElemanlari,
        pencereAcik,
        yukleniyor,
        pencereAc: () => setPencereAcik(true),
        pencereKapat: () => setPencereAcik(false),
        sepetOlustur,
        sepeteKatil,
        ortakSepeteYemekEkle,
        ortakSepettenYemekSil,
        ortakSepettenCik,
      }}
    >
      {children}
    </OrtakSepetContext.Provider>
  );
};

export const ortakSepetHafizasiKullan = () => {
  const context = useContext(OrtakSepetContext);
  if (!context) {
    throw new Error('ortakSepetHafizasiKullan, OrtakSepetSaglayici içinde kullanılmalıdır');
  }
  return context;
};
