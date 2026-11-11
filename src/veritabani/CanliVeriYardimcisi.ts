export * from './GercekVeriYardimcisi';
import { 
  TestSiparis, 
  TestKurye, 
  HakedisCekimTalebi, 
  TestMusteri, 
  TestVaryasyonSablonu, 
  TestIptalGerekcesi, 
  ReklamAyarlari,
  AnaAfisOgesi,
  TepeBantOgesi,
  KareReklamOgesi,
  AnaAfisAyari
} from './GercekVeriYardimcisi';
import { MusteriAdresi, GelAlSubesi, KategoriTipi, KampanyaTipi, MutfakTipi, YemekTipi } from './VeriTipleri';

export const TEST_KATEGORILERI: KategoriTipi[] = [];
export const TEST_KAMPANYALARI: KampanyaTipi[] = [];
export const TEST_MUTFAKLARI: MutfakTipi[] = [];
export const TEST_YEMEKLERI: YemekTipi[] = [];
export const TEST_SIPARISLERI: TestSiparis[] = [];
export const TEST_KURYELERI: TestKurye[] = [];
export const TEST_HAKEDIS_TALEPLERI: HakedisCekimTalebi[] = [];
export const TEST_MUSTERILERI: TestMusteri[] = [];
export const TEST_VARYASYON_SABLONLARI: TestVaryasyonSablonu[] = [];
export const TEST_IPTAL_GEREKCELERI: TestIptalGerekcesi[] = [];
export const TEST_KURYE_TESLIMATLARI: any[] = [];
export const TEST_DEGERLENDIRMELERI: any[] = [];

export const VARSAYILAN_KATEGORILERI = TEST_KATEGORILERI;
export const VARSAYILAN_KAMPANYALARI = TEST_KAMPANYALARI;
export const VARSAYILAN_MUTFAKLARI = TEST_MUTFAKLARI;
export const VARSAYILAN_YEMEKLERI = TEST_YEMEKLERI;
export const VARSAYILAN_SIPARISLERI = TEST_SIPARISLERI;
export const VARSAYILAN_KURYELERI = TEST_KURYELERI;
export const VARSAYILAN_HAKEDIS_TALEPLERI = TEST_HAKEDIS_TALEPLERI;
export const VARSAYILAN_MUSTERILERI = TEST_MUSTERILERI;
export const VARSAYILAN_VARYASYON_SABLONLARI = TEST_VARYASYON_SABLONLARI;
export const VARSAYILAN_IPTAL_GEREKCELERI = TEST_IPTAL_GEREKCELERI;

export const testSiparisDurumGuncelle = async (id: string, durum: string, aciklama?: string) => {};
export const testSepeteEkle = async (yemek: any) => {};
export const testSepetiGetir = async () => [];
export const testKuryeKonumuGetir = async (id: string) => ({enlem: 0, boylam: 0});
export const testGelAlSubeleriGetir = async () => [];
export const testYemekGuncelle = async (id: string, veri: any) => {};
export const testYemekSil = async (id: string) => {};
export const testYeniYemekEkle = async (yemek: any) => {};
export const testHakedisDurumGuncelle = async (id: string, durum: string, aciklama?: string) => {};
export const testKuryeEkle = async (kurye: any) => {};
export const testKuryeGuncelle = async (id: string, veri: any) => {};
export const testKuryeSil = async (id: string) => {};
export const testMusteriEkle = async (musteri: any) => {};
export const testMusteriGuncelle = async (id: string, veri: any) => {};
export const testMusteriSil = async (id: string) => {};
export const testMutfakEkle = async (mutfak: any) => {};
export const testMutfakGuncelle = async (id: string, veri: any) => {};
export const testMutfakSil = async (id: string) => {};
export const testVaryasyonSablonuEkle = async (sablon: any) => {};
export const testVaryasyonSablonuGuncelle = async (id: string, veri: any) => {};
export const testVaryasyonSablonuSil = async (id: string) => {};
export const testKategoriEkle = async (kategori: any) => {};
export const testKategoriGuncelle = async (id: string, veri: any) => {};
export const testKategoriSil = async (id: string) => {};
export const testAltKategoriEkle = async (alt: any) => {};
export const testAltKategoriSil = async (id: string) => {};
export const testSepetElemaniSil = async (id: string) => {};

export const TEST_GEL_AL_SUBELERI: GelAlSubesi[] = [];
export const reklamAyarlariniGetir = (): ReklamAyarlari => {
  try {
    const kayitli = localStorage.getItem('afyon_reklam_ayarlari');
    if (kayitli) {
      return JSON.parse(kayitli);
    }
  } catch {}
  return {
    tepeBantAktif: true,
    tepeMetin: 'İlk siparişe özel %25 indirim fırsatını kaçırma! Hemen üye ol.',
    afisAktif: true,
    afisBaslik: 'Ev Yapımı Haşhaşlı Bükme & Mantı',
    afisAciklama: 'Marifetli Afyonlu ev aşçılarımızın ellerinden çıkan doğal ve katkısız lezzetleri hemen sipariş verin.',
    afisGorselUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    kareReklamAktif: true,
    kareBaslik: 'Öğle Menülerinde %20 İndirim',
    kareAciklama: 'Çömlek keşkek ve güveç siparişlerinize ayran hediye.',
    kareGorselUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    tepeBantListesi: [
      { id: 'tepe-1', metin: 'İlk siparişe özel %25 indirim fırsatını kaçırma! Hemen üye ol.', aktif: true, aktif_mi: true, butonMetni: 'İndirimi Kap', butonHedefi: 'kayit' },
      { id: 'tepe-2', metin: 'Afyonun en lezzetli ev yemekleri ve yöresel tatları kapınızda!', aktif: true, aktif_mi: true, butonMetni: 'Keşfet', butonHedefi: 'mutfaklar' }
    ],
    anaAfisListesi: [
      { id: 'afis-1', baslik: 'Ev Yapımı Haşhaşlı Bükme & Mantı', altBaslik: 'Marifetli Afyonlu ev aşçılarımızın ellerinden çıkan doğal ve katkısız lezzetleri hemen sipariş verin.', rozet: 'GELENEKSEL ANNE MUTFAĞI', gorselVerisi: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&auto=format&fit=crop&q=80', butonMetni: 'Mutfakları İncele', butonHedefi: 'mutfaklar', aktif: true, aktif_mi: true, sira: 1 },
      { id: 'afis-2', baslik: 'Hakiki Manda Kaymaklı Ekmek Kadayıfı', altBaslik: 'Geleneksel şerbetiyle kabartılmış, üzerinde bol taze manda kaymağıyla tatlı şöleni.', rozet: 'TATLI DÜNYASI', gorselVerisi: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&auto=format&fit=crop&q=80', butonMetni: 'Tatlıları Gör', butonHedefi: 'mutfaklar', aktif: true, aktif_mi: true, sira: 2 }
    ],
    kareReklamListesi: [
      { id: 'kare-1', baslik: 'Geleneksel Afyon Tarhanası & Çorba', aciklama: 'Tamamen doğal malzemelerle evde üretilen yöresel çorbalarımız sofranıza katılıyor.', rozet: 'ANNE ELİNDEN', gorselUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80', aktif: true, aktif_mi: true, butonMetni: 'Çorbaları İncele', butonHedefi: 'mutfaklar' }
    ]
  };
};

export const reklamAyarlariniKaydet = (ayarlar: ReklamAyarlari) => {
  try {
    localStorage.setItem('afyon_reklam_ayarlari', JSON.stringify(ayarlar));
  } catch {}
};
