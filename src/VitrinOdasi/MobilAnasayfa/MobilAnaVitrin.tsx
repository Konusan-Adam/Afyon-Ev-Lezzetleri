import React from 'react';
import { MobilAdresBari } from './MobilAdresBari';
import { MobilAramaBari } from './MobilAramaBari';
import { MobilKampanyaSlider } from './MobilKampanyaSlider';
import { MobilKategoriler } from './MobilKategoriler';
import { MobilMutfaklarVitirini } from './MobilMutfaklarVitirini';
import { MobilPopulerYemekler } from './MobilPopulerYemekler';
import { MobilTumMutfaklarListesi } from './MobilTumMutfaklarListesi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { useKampanyalar } from '@/src/MalzemeCekmeceleri/KampanyaCekmecesi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { SagFiltreSutunu } from '../AramaFiltre/SagFiltreSutunu';
import { AnaAfisBannerVitrini } from '../ReklamVeDuyuru/AnaAfisBannerVitrini';
import { TeslimatZamaniBari } from '../Bilesenler/OnSiparisVePorsiyon/TeslimatZamaniBari';
import { mahalleyeEnYakinSubeyiBul } from '@/src/MalzemeCekmeceleri/Sube/SubeMesafeVeMahalleEsleyici';
import { Mutfak, Yemek, GelAlSubesi } from '@/src/veritabani/VeriTipleri';

interface MobilAnaVitrinProps {
  anasayfayaGitTiklandi?: () => void;
  mutfakSecildi?: (mutfak: Mutfak | null) => void;
  yemekSecildi?: (yemek: Yemek) => void;
  subeSecildi?: (sube: GelAlSubesi) => void;
}

export const MobilAnaVitrin: React.FC<MobilAnaVitrinProps> = ({ 
  anasayfayaGitTiklandi,
  mutfakSecildi: disMutfakSecildi,
  yemekSecildi,
  subeSecildi,
}) => {
  const mutfakDegistir = (mutfak: Mutfak | null) => {
    if (disMutfakSecildi) {
      disMutfakSecildi(mutfak);
    }
  };
  const { 
    aramaMetni, 
    aramaMetniniDegistir, 
    filtrePaneliniAc,
    filtreleriUygula,
    aktifFiltreler
  } = aramaVeFiltreKullan();
  
  const { tema } = temaHafizasiKullan();
  const acikMi = tema === 'acik';

  const { 
    seciliAdres, 
    adresSecimPenceresiAc,
    teslimatTipi,
    seciliGelAlSubesi,
    gelAlSubeleri,
    gelAlPenceresiAc
  } = teslimatHafizasiKullan();
  const { kampanyalar } = useKampanyalar();

  // Müşterinin mahallesine göre otomatik en yakın şube tespiti
  const enYakinSube = React.useMemo(() => {
    return mahalleyeEnYakinSubeyiBul(seciliAdres?.mahalle, gelAlSubeleri);
  }, [seciliAdres?.mahalle, gelAlSubeleri]);

  const adresMetni = teslimatTipi === 'gel_al'
    ? (seciliGelAlSubesi ? `Gel Al: ${seciliGelAlSubesi.ad}` : 'Gel Al Noktası Seçiniz')
    : (seciliAdres 
        ? `${seciliAdres.adres_basligi} (${seciliAdres.ilce || 'Afyon'}) • ${seciliAdres.mahalle}` 
        : undefined);


  return (
    <div
      className={`w-full min-h-screen pb-24 transition-colors duration-200 ${
        acikMi ? 'bg-[#FAF4EB] text-gray-900' : 'bg-[#1A0A1D] text-white'
      }`}
    >
      {/* Mobil ve Tablet İçin Üst Adres Barı */}
      <div className="lg:hidden">
        <MobilAdresBari 
          adres={adresMetni}
          adresDegistirTiklandi={teslimatTipi === 'gel_al' ? gelAlPenceresiAc : adresSecimPenceresiAc} 
        />
      </div>

      {/* Mobil ve Tablet İçin Tavana Mıhlı Arama Barı (Sticky) */}
      <div className="lg:hidden sticky top-0 z-40">
        <MobilAramaBari 
          aramaMetni={aramaMetni}
          aramaMetniDegisti={aramaMetniniDegistir}
          filtreleTiklandi={filtrePaneliniAc}
          mutfakSecildi={mutfakDegistir}
          yemekSecildi={yemekSecildi}
          kategoriSecildi={(katAd) => {
            filtreleriUygula({ ...(aktifFiltreler || {}), kategori: katAd, altKategori: undefined });
          }}
        />
      </div>

      {/* Masaüstünde 1300px Genişlik Kalıbı */}
      <div className="w-full anasayfa-genislik">
        {/* Sadece Mobil ve Tablet: Kampanya Slider (Masaüstünde Gizli) */}
        <div className="mt-2 lg:hidden px-4">
          <MobilKampanyaSlider 
            kampanyalar={kampanyalar} 
          />
        </div>

        {/* Sadece Mobil ve Tablet: Dairesel Kategoriler (Masaüstünde Gizli) */}
        <div className="lg:hidden px-4">
          <MobilKategoriler />
        </div>

        {/* Masaüstü İki Sütunlu Yerleşim: Sol Ana Liste + Sağ Filtre ve Reklam Sütunu */}
        <div className="w-full lg:flex lg:gap-6 lg:items-start lg:py-6">
          
          {/* Sol / Ana Alan: Mutfaklar, Podyum ve Popüler Yemekler */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* 🌟 Ev Mutfakları ve Aşçıları Başlığı Üzerindeki Özel Afiş Bannerı (Sadece Masaüstünde Görünür - Mobilde ve Tablette Gizli) */}
            <div className="hidden lg:block">
              <AnaAfisBannerVitrini />
            </div>

            {/* 1. Sıra: Afyon Ev Mutfakları & Aşçıları */}
            <MobilTumMutfaklarListesi mutfakSecildi={mutfakDegistir} />

            {/* 2. Sıra: Öne Çıkan Yıldız Ev Mutfakları (Podyum) */}
            <MobilMutfaklarVitirini mutfakSecildi={mutfakDegistir} />

            {/* 3. Sıra: Popüler Ev Yemekleri */}
            <MobilPopulerYemekler yemekSecildi={yemekSecildi} />
          </div>

          {/* 👉 SAĞ SÜTUN (Sadece Masaüstünde Görünür): Kare Reklam + Filtre Sütunu */}
          <div className="hidden lg:block w-[320px] shrink-0 sticky top-4 self-start">
            <SagFiltreSutunu />
          </div>

        </div>
      </div>
    </div>
  );
};
