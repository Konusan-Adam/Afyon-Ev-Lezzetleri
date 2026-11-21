import React, { createContext, useContext, useState, useEffect } from 'react';
import { Kullanici, KullaniciRolu } from '@/src/veritabani/VeriTipleri';
import {
  veritabaninaKullaniciKaydet,
  veritabanindanKullaniciGirisYaptir,
  googleIleOturumAc,
  googleKaydiniTamamla,
  type GoogleKullaniciTaslagi,
  type GoogleGirisSonucu,
} from '@/src/MalzemeCekmeceleri/kullaniciIslemleri';
import { mevcutUrlPaneliniBul, urlVeBasligiGuncelle } from '@/src/GirisKapisi/RotaYardimcisi';

export type PanelTipi = 'vitrin' | 'patron' | 'musteri' | 'mutfak' | 'kurye' | 'sube';

interface KullaniciHafizaTipi {
  aktifKullanici: Kullanici | null;
  pencereAcik: boolean;
  baslangicSekmesi: 'giris' | 'kayit';
  baslangicRolu: KullaniciRolu;
  yukleniyor: boolean;
  goruntulenenPanel: PanelTipi;
  panelDegistir: (panel: PanelTipi) => void;
  yonetimModuAcik: boolean;
  yonetimModunuAyarla: (acik: boolean) => void;
  pencereAc: (baslangicSekmesi?: 'giris' | 'kayit' | any, baslangicRolu?: KullaniciRolu) => void;
  pencereKapat: () => void;
  girisYap: (telefon: string, sifre: string) => Promise<boolean>;
  googleIleGirisYap: () => Promise<GoogleGirisSonucu>;
  googleKayitTamamla: (bilgiler: {
    uid: string;
    adSoyad: string;
    eposta: string;
    telefon: string;
    guvenlikSorusu?: string;
    guvenlikCevabi?: string;
  }) => Promise<boolean>;
  kayitOl: (bilgiler: {
    ad_soyad: string;
    telefon: string;
    eposta?: string;
    rol: KullaniciRolu;
    isletme_adi?: string;
    arac_tipi?: string;
    ilce?: string;
    sifre?: string;
    guvenlik_sorusu?: string;
    guvenlik_cevabi?: string;
    hijyen_onayli_mi?: boolean;
    esnaf_muafiyet_onayli_mi?: boolean;
    belgeler?: any;
  }) => Promise<boolean>;
  cikisYap: () => void;
  testRoluneGec: (rol: KullaniciRolu) => void;
}

const KullaniciContext = createContext<KullaniciHafizaTipi | undefined>(undefined);

export const KullaniciSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aktifKullanici, setAktifKullanici] = useState<Kullanici | null>(() => {
    try {
      const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');
      return kayitliOturum ? JSON.parse(kayitliOturum) : null;
    } catch {
      return null;
    }
  });

  const [pencereAcik, setPencereAcik] = useState<boolean>(false);
  const [baslangicSekmesi, setBaslangicSekmesi] = useState<'giris' | 'kayit'>('giris');
  const [baslangicRolu, setBaslangicRolu] = useState<KullaniciRolu>('musteri');
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);
  const [goruntulenenPanel, setGoruntulenenPanel] = useState<PanelTipi>(() => {
    const urlPaneli = mevcutUrlPaneliniBul();
    if (urlPaneli !== 'vitrin') return urlPaneli;
    try {
      const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');
      if (kayitliOturum) {
        const parsed = JSON.parse(kayitliOturum);
        if (parsed?.rol === 'yonetici') return 'patron';
        if (parsed?.rol === 'sube_admin') return 'sube';
        if (parsed?.rol === 'asci' || parsed?.rol === 'ev_mutfagi') return 'mutfak';
        if (parsed?.rol === 'kurye') return 'kurye';
      }
    } catch {}
    return 'vitrin';
  });

  const [yonetimModuAcik, setYonetimModuAcik] = useState<boolean>(false);

  useEffect(() => {
    if (aktifKullanici) {
      localStorage.setItem('afyon_oturum_kullanici', JSON.stringify(aktifKullanici));
    } else {
      localStorage.removeItem('afyon_oturum_kullanici');
    }
  }, [aktifKullanici]);

  const panelDegistir = (yeniPanel: PanelTipi) => {
    setGoruntulenenPanel(yeniPanel);
    urlVeBasligiGuncelle(yeniPanel);
  };

  const roleGorePaneleYonlendir = (kullanici: Kullanici) => {
    if (kullanici.rol === 'yonetici') {
      setGoruntulenenPanel('patron');
      urlVeBasligiGuncelle('patron');
    } else if (kullanici.rol === 'sube_admin') {
      setGoruntulenenPanel('sube');
      urlVeBasligiGuncelle('sube');
    } else if (kullanici.rol === 'asci' || kullanici.rol === 'ev_mutfagi') {
      setGoruntulenenPanel('mutfak');
      urlVeBasligiGuncelle('mutfak');
    } else if (kullanici.rol === 'kurye') {
      setGoruntulenenPanel('kurye');
      urlVeBasligiGuncelle('kurye');
    } else {
      setGoruntulenenPanel('musteri');
      urlVeBasligiGuncelle('musteri');
    }
  };

  const oturumAcVeYonlendir = (kullanici: Kullanici) => {
    setAktifKullanici(kullanici);
    setPencereAcik(false);
    roleGorePaneleYonlendir(kullanici);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_oturum_degisti', { detail: { aktifKullanici: kullanici } }));
    }
  };

  const girisYap = async (telefon: string, sifre: string): Promise<boolean> => {
    setYukleniyor(true);
    const kullanici = await veritabanindanKullaniciGirisYaptir(telefon, sifre);
    setYukleniyor(false);

    if (kullanici) {
      oturumAcVeYonlendir(kullanici);
      return true;
    }
    return false;
  };

  const googleIleGirisYap = async (): Promise<GoogleGirisSonucu> => {
    setYukleniyor(true);
    const sonuc = await googleIleOturumAc();
    setYukleniyor(false);

    if (sonuc.durum === 'giris_basarili') {
      oturumAcVeYonlendir(sonuc.kullanici);
    }
    return sonuc;
  };

  const googleKayitTamamla = async (bilgiler: {
    uid: string;
    adSoyad: string;
    eposta: string;
    telefon: string;
    guvenlikSorusu?: string;
    guvenlikCevabi?: string;
  }): Promise<boolean> => {
    setYukleniyor(true);
    const kaydolunan = await googleKaydiniTamamla(bilgiler);
    setYukleniyor(false);

    if (kaydolunan) {
      oturumAcVeYonlendir(kaydolunan);
      return true;
    }
    return false;
  };

  const kayitOl = async (bilgiler: {
    ad_soyad: string;
    telefon: string;
    eposta?: string;
    rol: KullaniciRolu;
    isletme_adi?: string;
    arac_tipi?: string;
    ilce?: string;
    sifre?: string;
    guvenlik_sorusu?: string;
    guvenlik_cevabi?: string;
  }): Promise<boolean> => {
    setYukleniyor(true);
    const kaydolunankullanici = await veritabaninaKullaniciKaydet(bilgiler);
    setYukleniyor(false);

    if (kaydolunankullanici) {
      oturumAcVeYonlendir(kaydolunankullanici);
      return true;
    }
    return false;
  };

  const cikisYap = () => {
    setAktifKullanici(null);
    setGoruntulenenPanel('vitrin');
    urlVeBasligiGuncelle('vitrin');
    localStorage.removeItem('afyon_oturum_kullanici');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_oturum_degisti', { detail: { aktifKullanici: null } }));
    }
  };

  const testRoluneGec = (_rol: KullaniciRolu) => {};

  return (
    <KullaniciContext.Provider
      value={{
        aktifKullanici,
        pencereAcik,
        baslangicSekmesi,
        baslangicRolu,
        yukleniyor,
        goruntulenenPanel,
        panelDegistir,
        yonetimModuAcik,
        yonetimModunuAyarla: setYonetimModuAcik,
        pencereAc: (sekme?: 'giris' | 'kayit', rol?: KullaniciRolu) => {
          if (sekme) setBaslangicSekmesi(sekme);
          if (rol) setBaslangicRolu(rol);
          setPencereAcik(true);
        },
        pencereKapat: () => setPencereAcik(false),
        girisYap,
        googleIleGirisYap,
        googleKayitTamamla,
        kayitOl,
        cikisYap,
        testRoluneGec,
      }}
    >
      {children}
    </KullaniciContext.Provider>
  );
};

export const kullaniciHafizasiKullan = (): KullaniciHafizaTipi => {
  const context = useContext(KullaniciContext);
  if (!context) {
    throw new Error('kullaniciHafizasiKullan, KullaniciSaglayici içinde kullanılmalıdır');
  }
  return context;
};

export type { GoogleKullaniciTaslagi };
