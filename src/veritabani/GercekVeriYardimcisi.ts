// Canlı Firebase tabanlı yardımcı türler ve boş varsayılanlar (Statik test verisi içermez)

export const TEST_MUTFAKLARI: any[] = [];
export const TEST_YEMEKLERI: any[] = [];
export const TEST_MUSTERILERI: any[] = [];
export const TEST_KURYELERI: any[] = [];
export const TEST_SIPARISLERI: any[] = [];
export const TEST_KATEGORILERI: any[] = [];
export const TEST_KAMPANYALARI: any[] = [];
export const TEST_HAKEDIS_TALEPLERI: any[] = [];
export const TEST_KURYE_TESLIMATLARI: any[] = [];
export const TEST_VARYASYON_SABLONLARI: any[] = [];
export const TEST_ADRESLERI: any[] = [];
export const TEST_DEGERLENDIRMELERI: any[] = [];
export const TEST_IPTAL_GEREKCELERI: any[] = [];
export const TEST_KURYE_CANLI_KONUMLARI: any[] = [];
export const TEST_GEL_AL_SUBELERI: any[] = [];
export const TEST_ALT_KATEGORILERI: any[] = [];
export let TEST_SEPET_DEPOSU: any[] = [];

export interface TestSiparis {
  id: string;
  siparisKodu: string;
  siparis_kodu?: string;
  musteriAdi?: string;
  tutar?: number;
  toplamTutar?: number;
  durum?: string;
  asama?: string;
  mutfak_id?: string;
  kurye_id?: string;
  adres?: string;
  pinKodu?: string;
  olusturmaTarihi?: string;
  [key: string]: any;
}

export interface TestKurye {
  id: string;
  ad_soyad: string;
  telefon: string;
  arac_tipi: string;
  plaka: string;
  mahalle?: string;
  toplam_teslimat?: number;
  tamamlanan_siparis?: number;
  puan?: number;
  aktif_konum?: { mahalle: string; enlem: number; boylam: number };
  bakiye?: number;
  durum?: 'bosta' | 'molada' | 'yolda';
  askida_mi?: boolean;
  [key: string]: any;
}

export interface TestMusteri {
  id: string;
  ad_soyad: string;
  telefon: string;
  eposta: string;
  cuzdan_bakiyesi: number;
  varsayilan_adres_id: string;
  kayit_tarihi: string;
  askida_mi?: boolean;
  [key: string]: any;
}

export interface HakedisCekimTalebi {
  id: string;
  mutfak_id?: string;
  kurye_id?: string;
  mutfak_adi?: string;
  kurye_adi?: string;
  tutar: number;
  iban: string;
  banka_adi?: string;
  hesap_sahibi: string;
  durum: 'beklemede' | 'odendi' | 'reddedildi';
  talep_tarihi: string;
  not?: string;
  [key: string]: any;
}

export interface ReklamAyarlari {
  tepeBantAktif: boolean;
  tepeMetin: string;
  afisAktif: boolean;
  afisBaslik: string;
  afisAciklama: string;
  afisGorselUrl: string;
  kareReklamAktif: boolean;
  kareBaslik: string;
  kareAciklama: string;
  kareGorselUrl: string;
  anaAfisListesi: AnaAfisOgesi[];
  tepeBantListesi: TepeBantOgesi[];
  kareReklamListesi: KareReklamOgesi[];
  gorselVerisi?: string;
  baslik?: string;
  aciklama?: string;
  rozet?: string;
  butonMetni?: string;
  butonHedefi?: string;
  [key: string]: any;
}

export interface TepeBantOgesi {
  id: string;
  metin: string;
  aktif_mi?: boolean;
  aktif?: boolean;
  butonMetni?: string;
  butonHedefi?: string;
  [key: string]: any;
}

export interface KareReklamOgesi {
  id: string;
  baslik: string;
  aciklama: string;
  gorsel_url?: string;
  gorselUrl?: string;
  aktif_mi?: boolean;
  aktif?: boolean;
  rozet?: string;
  butonMetni?: string;
  butonHedefi?: string;
  [key: string]: any;
}

export interface AnaAfisOgesi {
  id: string;
  baslik: string;
  aciklama?: string;
  altBaslik?: string;
  gorsel_url?: string;
  gorselUrl?: string;
  aktif_mi?: boolean;
  aktif?: boolean;
  rozet?: string;
  gorselVerisi?: string;
  gorselTipi?: 'arka_plan' | 'sag_taraf';
  butonMetni?: string;
  butonHedefi?: string;
  sira?: number;
  [key: string]: any;
}

export type AnaAfisAyari = ReklamAyarlari;

export interface TestVaryasyonSablonu {
  id?: string;
  baslik: string;
  kategori: string;
  aciklama: string;
  secenek_gruplari: any[];
  kimlik?: string;
  ad?: string;
  secenekler?: any[];
  [key: string]: any;
}

export interface AltKategori {
  id: string;
  ust_kategori_id?: string;
  ad: string;
  slug?: string;
  sira?: number;
  [key: string]: any;
}

export interface TestKullaniciKaydi {
  kimlik: string;
  ad_soyad: string;
  telefon: string;
  sifre: string;
  rol: string;
  isletme_adi?: string;
  [key: string]: any;
}

export interface TestIptalGerekcesi {
  kimlik: string;
  baslik: string;
}

export interface TestSiparisElemani {
  id: string;
  yemek_id: string;
  baslik: string;
  yemek_baslik?: string;
  fiyat: number;
  birim_fiyat?: number;
  adet: number;
  gorsel_url?: string;
  [key: string]: any;
}

export const TEST_MODU = false;

export function reklamAyarlariniGetir(): ReklamAyarlari {
  return {
    tepeBantAktif: true,
    tepeMetin: 'Afyon Ev Lezzetleri Canlı Sipariş Sistemine Hoş Geldiniz!',
    afisAktif: true,
    afisBaslik: 'Geleneksel Afyon Haşhaşlı Bükmesi',
    afisAciklama: 'Anne eliyle taze açılan çıtır bükmeler kapınızda.',
    afisGorselUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    kareReklamAktif: true,
    kareBaslik: 'Öğle Menülerinde %20 İndirim',
    kareAciklama: 'Çömlek keşkek ve güveç siparişlerinize ayran hediye.',
    kareGorselUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    anaAfisListesi: [],
    tepeBantListesi: [],
    kareReklamListesi: []
  };
}

export function reklamAyarlariniKaydet(_ayarlar: ReklamAyarlari) {}

export function testSiparisDurumGuncelle(_siparisId: string, _durum: string, _aciklama?: string) {}

export function testYemekGuncelle(_yemekId: string, _veri: any) {
  return null;
}

export function testYemekSil(_yemekId: string) {
  return true;
}

export function testYeniYemekEkle(veri: any) {
  return { ...veri, id: `yemek-${Date.now()}` };
}

export function testHakedisDurumGuncelle(_talepId: string, _durum: string, _not?: string) {}

export function testKuryeKonumuGetir(_siparisId: string) {
  return { mahalle: 'Afyon Merkez', enlem: 38.7569, boylam: 30.5387 };
}

export function testSiparisOlustur(veri: any) {
  const kod = `SİP-${Math.floor(1000 + Math.random() * 9000)}`;
  return { ...veri, id: `sip-${Date.now()}`, siparisKodu: kod, siparis_kodu: kod };
}

export function testSepeteEkle(veri: any) {
  return { ...veri, id: `sep-${Date.now()}` };
}

export function testSepetiGetir(_musteriId: string) {
  return [];
}

export function testSepetAdetiGuncelle(_id: string, _adet: number) {
  return true;
}

export function testSepetElemaniSil(_id: string) {
  return true;
}

export function testMutfakSepetiniTemizle(_musteriId: string, _mutfakId: string) {
  return true;
}

export function testGelAlSubeleriGetir() {
  return [];
}

export function testKategoriEkle(veri: any) { return veri; }
export function testKategoriGuncelle(_id: string, veri: any) { return veri; }
export function testKategoriSil(_id: string) { return true; }
export function testAltKategoriEkle(veri: any) { return veri; }
export function testAltKategoriSil(_id: string) { return true; }

export function testKullaniciDogrula(_tel: string, _sifre: string) { return null; }
export function testKullaniciEkle(_veri: any) {}
export function testKuryeHakedisTalebiOlustur(_veri: any) {}
export function testHakedisTalebiOlustur(_veri: any) {}
