import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusteriAdresi, GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { gelAlSubeleriGetir } from '@/src/MalzemeCekmeceleri/gelAlSubeleriGetir';
import {
  veritabanindanAdresleriGetir,
  veritabaninaYeniAdresEkle,
  veritabanindaVarsayilanAdresYap,
  veritabanindanAdresSil,
} from '@/src/MalzemeCekmeceleri/AdresVeKonum/adresIslemleri';

const SABIT_MUSTERI_KIMLIGI = '00000000-0000-0000-0000-000000000001';

interface TeslimatHafizaTipi {
  teslimatTipi: 'teslimat' | 'gel_al';
  teslimatTipiDegistir: (tip: 'teslimat' | 'gel_al') => void;
  seciliAdres: MusteriAdresi | null;
  adresListesi: MusteriAdresi[];
  seciliGelAlSubesi: GelAlSubesi | null;
  gelAlSubeleri: GelAlSubesi[];
  gelAlSubesiSec: (sube: GelAlSubesi) => void;
  yukleniyor: boolean;
  adresSecimPenceresiAcik: boolean;
  haritaPenceresiAcik: boolean;
  gelAlPenceresiAcik: boolean;
  adresSecimPenceresiAc: () => void;
  adresSecimPenceresiKapat: () => void;
  haritaPenceresiAc: () => void;
  haritaPenceresiKapat: () => void;
  gelAlPenceresiAc: () => void;
  gelAlPenceresiKapat: () => void;
  seciliAdresAyarla: (adres: MusteriAdresi) => Promise<void>;
  yeniAdresEkle: (adres: Omit<MusteriAdresi, 'kimlik' | 'musteri_kimligi' | 'olusturma_tarihi'>) => Promise<boolean>;
  adresSil: (adresKimligi: string) => Promise<boolean>;
}

const TeslimatContext = createContext<TeslimatHafizaTipi | undefined>(undefined);

export const TeslimatSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teslimatTipi, setTeslimatTipi] = useState<'teslimat' | 'gel_al'>('teslimat');
  const [seciliAdres, setSeciliAdres] = useState<MusteriAdresi | null>(null);
  const [adresListesi, setAdresListesi] = useState<MusteriAdresi[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [adresSecimPenceresiAcik, setAdresSecimPenceresiAcik] = useState<boolean>(false);
  const [haritaPenceresiAcik, setHaritaPenceresiAcik] = useState<boolean>(false);
  const [gelAlPenceresiAcik, setGelAlPenceresiAcik] = useState<boolean>(false);

  const { subeler: gelAlSubeleri } = gelAlSubeleriGetir();
  const [seciliGelAlSubesi, setSeciliGelAlSubesi] = useState<GelAlSubesi | null>(() => {
    return gelAlSubeleri.length > 0 ? gelAlSubeleri[0] : null;
  });

  const aktifMusteriKimligiAl = (): string => {
    try {
      const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');
      if (kayitliOturum) {
        const parsed = JSON.parse(kayitliOturum);
        if (parsed?.kimlik) return parsed.kimlik;
      }
    } catch {}
    return SABIT_MUSTERI_KIMLIGI;
  };

  const adresleriYukle = async () => {
    setYukleniyor(true);
    const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');

    if (kayitliOturum) {
      try {
        const musteriKimligi = aktifMusteriKimligiAl();
        const adresler = await veritabanindanAdresleriGetir(musteriKimligi);
        setAdresListesi(adresler);
        if (adresler.length > 0) {
          const varsayilan = adresler.find((a: MusteriAdresi) => a.varsayilan_mi) || adresler[0];
          setSeciliAdres(varsayilan);
        } else {
          setSeciliAdres(null);
        }
      } catch {
        setAdresListesi([]);
        setSeciliAdres(null);
      }
    } else {
      // Misafir Durumu: Misafirin yerel olarak seçtiği adres var mı?
      try {
        const misafirAdresiHam = localStorage.getItem('afyon_misafir_secili_adres');
        if (misafirAdresiHam) {
          const misafirAdresi: MusteriAdresi = JSON.parse(misafirAdresiHam);
          setSeciliAdres(misafirAdresi);
          setAdresListesi([misafirAdresi]);
        } else {
          setSeciliAdres(null);
          setAdresListesi([]);
        }
      } catch {
        setSeciliAdres(null);
        setAdresListesi([]);
      }
    }
    setYukleniyor(false);
  };

  useEffect(() => {
    adresleriYukle();
    const oturumDegistiDinleyicisi = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail?.aktifKullanici) {
        // Çıkış yapıldı: Tüm adres seçimlerini derhal sıfırla
        setSeciliAdres(null);
        setAdresListesi([]);
        try {
          localStorage.removeItem('afyon_misafir_secili_adres');
        } catch {}
      } else {
        adresleriYukle();
      }
    };
    window.addEventListener('afyon_oturum_degisti', oturumDegistiDinleyicisi);
    return () => window.removeEventListener('afyon_oturum_degisti', oturumDegistiDinleyicisi);
  }, []);

  const seciliAdresAyarla = async (adres: MusteriAdresi) => {
    setSeciliAdres(adres);
    try {
      if (adres.mahalle) {
        localStorage.setItem('afyon_aktif_secili_mahalle', adres.mahalle);
      }
      window.dispatchEvent(new Event('afyon_adres_guncellendi'));
    } catch {}

    const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');

    if (kayitliOturum) {
      const musteriKimligi = aktifMusteriKimligiAl();
      await veritabanindaVarsayilanAdresYap(musteriKimligi, adres.kimlik || adres.id || '');
      await adresleriYukle();
    } else {
      // Misafir için yerel depoda tut ve listeyi güncelle
      try {
        localStorage.setItem('afyon_misafir_secili_adres', JSON.stringify(adres));
      } catch {}
      setAdresListesi([adres]);
    }
  };

  const gelAlSubesiSec = (sube: GelAlSubesi) => {
    setSeciliGelAlSubesi(sube);
    setGelAlPenceresiAcik(false);
  };

  const yeniAdresEkle = async (
    yeni: Omit<MusteriAdresi, 'kimlik' | 'musteri_kimligi' | 'olusturma_tarihi'>
  ): Promise<boolean> => {
    const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');
    const musteriKimligi = kayitliOturum ? aktifMusteriKimligiAl() : 'misafir';

    const eklenen = await veritabaninaYeniAdresEkle({
      ...yeni,
      musteri_kimligi: musteriKimligi,
    });

    if (eklenen) {
      await seciliAdresAyarla(eklenen);
      return true;
    }
    return false;
  };

  const adresSil = async (adresKimligi: string): Promise<boolean> => {
    console.log('adresSil çağrıldı, adresKimligi:', adresKimligi);
    // UI'dan hemen düşür
    setAdresListesi((onceki) => onceki.filter((a) => (a.kimlik || a.id) !== adresKimligi));
    if (seciliAdres?.kimlik === adresKimligi || seciliAdres?.id === adresKimligi) {
      setSeciliAdres(null);
    }

    const basarili = await veritabanindanAdresSil(adresKimligi);

    const kayitliOturum = localStorage.getItem('afyon_oturum_kullanici');
    if (kayitliOturum) {
      await adresleriYukle();
    } else {
      try {
        localStorage.removeItem('afyon_misafir_secili_adres');
      } catch {}
    }

    return basarili;
  };

  return (
    <TeslimatContext.Provider
      value={{
        teslimatTipi,
        teslimatTipiDegistir: setTeslimatTipi,
        seciliAdres,
        adresListesi,
        seciliGelAlSubesi,
        gelAlSubeleri,
        gelAlSubesiSec,
        yukleniyor,
        adresSecimPenceresiAcik,
        haritaPenceresiAcik,
        gelAlPenceresiAcik,
        adresSecimPenceresiAc: () => setAdresSecimPenceresiAcik(true),
        adresSecimPenceresiKapat: () => setAdresSecimPenceresiAcik(false),
        haritaPenceresiAc: () => setHaritaPenceresiAcik(true),
        haritaPenceresiKapat: () => setHaritaPenceresiAcik(false),
        gelAlPenceresiAc: () => setGelAlPenceresiAcik(true),
        gelAlPenceresiKapat: () => setGelAlPenceresiAcik(false),
        seciliAdresAyarla,
        yeniAdresEkle,
        adresSil,
      }}
    >
      {children}
    </TeslimatContext.Provider>
  );
};

export const teslimatHafizasiKullan = () => {
  const context = useContext(TeslimatContext);
  if (!context) {
    throw new Error('teslimatHafizasiKullan, TeslimatSaglayici içinde kullanılmalıdır');
  }
  return context;
};
