import React from 'react';
import { UstBar } from './UstBar/UstBar';
import { MasaustuAltBilgi } from './MasaustuAltBilgi/MasaustuAltBilgi';
import { FiltrePaneli } from './AramaFiltre/FiltrePaneli';
import { CokluSepetVitrini } from './Bilesenler/Sepet/CokluSepetVitrini';
import { OrtakSepetPenceresi } from './Bilesenler/Sepet/OrtakSepetPenceresi';
import { YuzenSepetBari } from './Bilesenler/Sepet/YuzenSepetBari';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { AdresSecimPenceresi } from './Bilesenler/AdresVeKonum/AdresSecimPenceresi';
import { HaritaAdresSecici } from './Bilesenler/AdresVeKonum/HaritaAdresSecici';
import { GelAlSubesiSecimPenceresi } from './Bilesenler/AdresVeKonum/GelAlSubesiSecimPenceresi';
import { KullaniciGirisPenceresi } from './KullaniciGiris/KullaniciGirisPenceresi';
import { MobilAnaVitrin } from './MobilAnasayfa/MobilAnaVitrin';
import { MobilAltMenu } from './MobilAnasayfa/MobilAltMenu';
import { MusteriPaneli } from './MusteriPaneli/MusteriPaneli';
import { SubeYoneticisiPaneli } from './SubePaneli/SubeYoneticisiPaneli';
import { PatronYoneticisiPaneli } from './PatronPaneli/PatronYoneticisiPaneli';
import { CerezOnayBari } from './Bilesenler/HukukVeSozlesmeler/CerezOnayBari';
import { SozlesmePenceresi } from './Bilesenler/HukukVeSozlesmeler/SozlesmePenceresi';
import { type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { TepeReklamBari } from './ReklamVeDuyuru/TepeReklamBari';
import { OnSiparisSecici } from './Bilesenler/OnSiparisVePorsiyon/OnSiparisSecici';
import { porsiyonDusur } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonServisi';
import { Yemek, Mutfak } from '@/src/veritabani/VeriTipleri';
import { UrunOzellestirmePenceresi } from './Bilesenler/UrunSecenekleri/UrunOzellestirmePenceresi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { PwaKurulumKarti } from './PwaKurulumKarti';
import { LezzetDanismaniVitrini } from './Bilesenler/YapayZekaDanismani/LezzetDanismaniVitrini';
import { MutfaklarModali } from './Bilesenler/MutfaklarModali';
import { SubelerModali } from './Bilesenler/SubelerModali';
import { SubeDetayVitrini } from './SubeVitrini/SubeDetayVitrini';
import { MutfakDetayVitrini } from './Bilesenler/Mutfak/MutfakDetayVitrini';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';
import { subeOnceliginiKontrolEt } from '@/src/MalzemeCekmeceleri/Sube/SubeOncelikAlgoritmasi';

export const AnaSayfaVitrini: React.FC = () => {
  const [aktifSozlesmeTuru, setAktifSozlesmeTuru] = React.useState<SozlesmeTuru | null>(null);
  const [seciliMutfak, setSeciliMutfak] = React.useState<Mutfak | null>(null);
  const [seciliYemekModal, setSeciliYemekModal] = React.useState<Yemek | null>(null);
  const [mutfaklarModaliAcik, setMutfaklarModaliAcik] = React.useState<boolean>(false);
  const [subelerModaliAcik, setSubelerModaliAcik] = React.useState<boolean>(false);
  const [seciliSube, setSeciliSube] = React.useState<GelAlSubesi | null>(null);

  const { gelAlSubeleri, seciliAdres } = teslimatHafizasiKullan();
  const { tumUrunler: subeUrunleri } = useSubeUrunleri();

  const {
    aramaMetni,
    aramaMetniniDegistir,
    filtrePaneliAcik,
    filtrePaneliniAc,
    filtrePaneliniKapat,
    aktifFiltreler,
    filtreleriUygula,
    sifirla,
  } = aramaVeFiltreKullan();

  const { sepetPaneliAc, sepeteEkle } = sepetHafizasiKullan();
  const { goruntulenenPanel, panelDegistir } = kullaniciHafizasiKullan();

  // Şube Müdürü doğrudan kendi şubesinin vitrinini müşteri gözüyle açtığında tetiklenir
  React.useEffect(() => {
    const handler = (event: Event) => {
      const e = event as CustomEvent<{ subeId?: string }>;
      const hedefId = e.detail?.subeId || 'sube-1';
      const bulunan =
        gelAlSubeleri.find((s) => s.id === hedefId || s.kimlik === hedefId) ||
        gelAlSubeleri[0];
      if (bulunan) {
        if (goruntulenenPanel !== 'vitrin') {
          panelDegistir('vitrin');
        }
        setSeciliSube(bulunan);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    const mutfakHandler = async (event: Event) => {
      const e = event as CustomEvent<{ mutfakId?: string }>;
      const hedefId = e.detail?.mutfakId;
      if (hedefId) {
        if (goruntulenenPanel !== 'vitrin') {
          panelDegistir('vitrin');
        }
        setSeciliSube(null);
        await mutfakAcById(hedefId);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('afyon_sube_vitrini_ac', handler);
    window.addEventListener('afyon_mutfak_vitrini_ac', mutfakHandler);
    return () => {
      window.removeEventListener('afyon_sube_vitrini_ac', handler);
      window.removeEventListener('afyon_mutfak_vitrini_ac', mutfakHandler);
    };
  }, [gelAlSubeleri, goruntulenenPanel, panelDegistir]);

  // Mutfak kimliğine göre mutfak nesnesini bulup vitrinini açar
  const mutfakAcById = async (mutfakId: string) => {
    sifirla();
    setSeciliYemekModal(null);
    try {
      const mutfaklar = await koleksiyonGetir<Mutfak>('mutfaklar');
      const bulunan = (mutfaklar || []).find((m) => m.id === mutfakId);
      if (bulunan) {
        setSeciliMutfak(bulunan);
      }
    } catch (error) {
      console.error('Mutfak yüklenirken hata oluştu:', error);
    }
  };

  // Mutfak seçildiğinde doğrudan dükkan vitrinine geçiş
  const mutfakSecildiIslemi = (mutfak: Mutfak | null) => {
    sifirla();
    setSeciliYemekModal(null);
    setSeciliSube(null);
    setMutfaklarModaliAcik(false);
    setSeciliMutfak(mutfak);
  };

  // Yemek seçildiğinde akıllı şube öncelik algoritması devreye girer:
  const yemekSecildiIslemi = (yemek: Yemek) => {
    sifirla();

    // 🎯 Akıllı Şube Algoritması: Ürün en yakın şubede hazırsa doğrudan şubeyi açar
    const sonuc = subeOnceliginiKontrolEt(
      yemek,
      seciliAdres?.mahalle,
      gelAlSubeleri,
      subeUrunleri
    );

    if (sonuc.hazirMi && sonuc.sube) {
      setSeciliSube(sonuc.sube);
      return;
    }

    // Şubede hazır değilse normal ev mutfağı yemek modalını açar
    setSeciliYemekModal(yemek);
  };

  // Marka logosuna veya Keşfet butonuna tıklandığında tam anasayfaya dönüş
  const anasayfayaDonusYap = () => {
    sifirla(); // Arama metnini ve filtreleri sıfırlar
    setSeciliMutfak(null); // Açık dükkan / mutfak vitrini varsa kapatır, ana vitrine döndürür
    setSeciliYemekModal(null);
    setMutfaklarModaliAcik(false);
    setSubelerModaliAcik(false);
    setSeciliSube(null);
    if (goruntulenenPanel !== 'vitrin') {
      panelDegistir('vitrin'); // Herhangi bir paneldeyse vitrine alır
    }
    // Sayfayı yumuşakça en tepeye kaydırır
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Şube Yönetici Paneli
  if (goruntulenenPanel === 'sube') {
    return <SubeYoneticisiPaneli />;
  }

  // Süper Admin (Patron) Masası
  if (goruntulenenPanel === 'patron') {
    return <PatronYoneticisiPaneli />;
  }

  // Müşteri Paneli (Siparişlerim / Profilim)
  if (goruntulenenPanel === 'musteri') {
    return <MusteriPaneli />;
  }

  // Vitrin görünümleri (Şube Detay, Mutfak Detay veya Ana Sayfa) — Ortak modallar tek merkezden yönetilir
  const ortakModallar = (
    <>
      <MutfaklarModali
        acikMi={mutfaklarModaliAcik}
        onKapat={() => setMutfaklarModaliAcik(false)}
        onMutfakSec={(mutfak) => mutfakSecildiIslemi(mutfak)}
      />
      <SubelerModali
        acikMi={subelerModaliAcik}
        onKapat={() => setSubelerModaliAcik(false)}
        onSubeSec={(sube) => {
          setSeciliMutfak(null);
          setSeciliSube(sube);
          setSubelerModaliAcik(false);
        }}
      />
    </>
  );

  // Şube seçildiyse doğrudan SubeDetayVitrini sayfasına git
  if (seciliSube) {
    return (
      <>
        <SubeDetayVitrini
          sube={seciliSube}
          tumSubeler={gelAlSubeleri}
          geriDonTiklandi={() => setSeciliSube(null)}
          onSubeDegistir={(yeni) => setSeciliSube(yeni)}
          seciliMahalle={seciliAdres?.mahalle}
          mutfaklarTiklandi={() => setMutfaklarModaliAcik(true)}
          subelerTiklandi={() => setSubelerModaliAcik(true)}
        />
        {ortakModallar}
      </>
    );
  }

  // Mutfak seçildiyse doğrudan MutfakDetayVitrini sayfasına git (Header'sız, ferah vitrin)
  if (seciliMutfak) {
    return (
      <>
        <div className="w-full min-h-screen bg-[#1A0A1D]">
          <MutfakDetayVitrini
            mutfak={seciliMutfak}
            geriDonTiklandi={() => setSeciliMutfak(null)}
          />

          {/* Mobil Alt Gezinti Menüsü */}
          <MobilAltMenu
            anasayfayaDon={anasayfayaDonusYap}
            subelerTiklandi={() => setSubelerModaliAcik(true)}
            mutfaklarTiklandi={() => setMutfaklarModaliAcik(true)}
            aktifSekme="mutfaklar"
          />

          {/* Sepet ve Pencereler */}
          <YuzenSepetBari />
          <CokluSepetVitrini />
          <OrtakSepetPenceresi />
          <KullaniciGirisPenceresi />

          {/* Yemek Detay & Kişiselleştirme Modalı */}
          {seciliYemekModal && (
            <UrunOzellestirmePenceresi
              yemek={seciliYemekModal}
              onKapat={() => setSeciliYemekModal(null)}
              mutfakVitriniAc={mutfakAcById}
              onSepeteEkle={async (konfig) => {
                await sepeteEkle(
                  seciliYemekModal.mutfak_id || '',
                  seciliYemekModal.id,
                  konfig.adet,
                  konfig.birim_fiyat
                );
                porsiyonDusur(seciliYemekModal.id, konfig.adet);
                setSeciliYemekModal(null);
              }}
            />
          )}
        </div>
        {ortakModallar}
      </>
    );
  }

  return (
    <main className="w-full min-h-screen">
      {/* 🚀 En Üst İnce Reklam & Duyuru Şeridi */}
      <TepeReklamBari />

      {/* Masaüstü Tek Sıra Lüks Üst Bar */}
      <div className="hidden lg:block">
        <UstBar
          aramaMetni={aramaMetni}
          aramaMetniniDegistir={aramaMetniniDegistir}
          anasayfayaGitTiklandi={anasayfayaDonusYap}
          filtreleTiklandi={filtrePaneliniAc}
          sepetiAcTiklandi={sepetPaneliAc}
          mutfakSecildi={mutfakSecildiIslemi}
          yemekSecildi={yemekSecildiIslemi}
          subeSecildi={(sube) => setSeciliSube(sube)}
        />
      </div>

      {/* Mobil ve Tablet İçin Ana Vitrin */}
      <MobilAnaVitrin 
        anasayfayaGitTiklandi={anasayfayaDonusYap} 
        mutfakSecildi={mutfakSecildiIslemi}
        yemekSecildi={yemekSecildiIslemi}
        subeSecildi={(sube) => setSeciliSube(sube)}
      />

      <MasaustuAltBilgi />

      <MobilAltMenu 
        anasayfayaDon={anasayfayaDonusYap}
        subelerTiklandi={() => setSubelerModaliAcik(true)}
        mutfaklarTiklandi={() => setMutfaklarModaliAcik(true)}
        aktifSekme={seciliSube ? 'subeler' : subelerModaliAcik ? 'subeler' : mutfaklarModaliAcik ? 'mutfaklar' : 'kesfet'}
      />

      {/* Yüzen Sepet Çubuğu (Yemeksepeti / Getir Stili) */}
      <YuzenSepetBari />

      {/* Ortak Modallar & Pencereler (Hem Mobil, Hem Tablet, Hem Masaüstünde Aktiftir) */}
      {ortakModallar}
      <FiltrePaneli
        acik={filtrePaneliAcik}
        mevcutFiltreler={aktifFiltreler}
        kapat={filtrePaneliniKapat}
        uygula={filtreleriUygula}
      />
      <CokluSepetVitrini />
      <AdresSecimPenceresi />
      <HaritaAdresSecici />
      <GelAlSubesiSecimPenceresi />
      <OrtakSepetPenceresi />
      <KullaniciGirisPenceresi />

      {/* 🍲 Canlı Arama veya Yemek Kartından Tıklanan Ürün Detay & Porsiyon Modalı */}
      {seciliYemekModal && (
        <UrunOzellestirmePenceresi
          yemek={seciliYemekModal}
          onKapat={() => setSeciliYemekModal(null)}
          mutfakVitriniAc={mutfakAcById}
          onSepeteEkle={async (konfig) => {
            await sepeteEkle(
              seciliYemekModal.mutfak_id || '',
              seciliYemekModal.id,
              konfig.adet,
              konfig.birim_fiyat
            );
            porsiyonDusur(seciliYemekModal.id, konfig.adet);
            setSeciliYemekModal(null);
          }}
        />
      )}

      {/* Yasal Çerez Onay Barı ve Sözleşme Penceresi */}
      <CerezOnayBari onSozlesmeAc={(tur) => setAktifSozlesmeTuru(tur)} />
      <SozlesmePenceresi
        tur={aktifSozlesmeTuru}
        acikMi={Boolean(aktifSozlesmeTuru)}
        onKapat={() => setAktifSozlesmeTuru(null)}
        onayButonuGoster={false}
      />

      {/* PWA Kurulum İstemi Kartı */}
      <PwaKurulumKarti />

      {/* 🤖 Afyon Lezzet Danışmanı (Hareketli Logo ve Yapay Zeka Asistanı) */}
      <LezzetDanismaniVitrini />
    </main>
  );
};
