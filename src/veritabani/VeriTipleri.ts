export interface MutfakTipi {
  id: string;
  ad: string;
  mutfak_adi?: string;
  aciklama?: string;
  adres?: string;
  ilce?: string;
  mahalle?: string;
  min_siparis_tutari?: number;
  teslimat_ucreti?: number;
  puan: number;
  degerlendirme_sayisi?: number;
  gorsel_url?: string;
  hijyen_onayli_mi?: boolean;
  esnaf_muafiyet_onayli_mi?: boolean;
  onayli_mi?: boolean;
  onay_durumu?: string;
  acik_mi?: boolean;
  calisma_saatleri?: string;
  hazirlanma_suresi?: string;
  belgeler?: any;
  tip?: string;
  askida_mi?: boolean;
}

export interface YemekTipi {
  id: string;
  mutfak_id: string;
  baslik: string;
  aciklama: string;
  fiyat: number;
  birim?: string; // Porsiyon, Adet, Kg, Gram, Litre, Dilim, Tepsi, Kavanoz, Tabak, Paket
  gunluk_stok?: number;
  kalan_stok?: number;
  sinirsiz_stok?: boolean;
  kategori: string;
  alt_kategori?: string;
  gorsel_url: string;
  populer?: boolean;
  puan: number;
  hazirlanma_suresi?: string;
  stokta_var_mi?: boolean;
  secenek_gruplari?: any[];
  tukendi_mi?: boolean;
  onay_durumu?: string;
  onayli_mi?: boolean;
}

export interface KategoriTipi {
  id: string;
  ad: string;
  slug: string;
  ikon: string;
  aciklama?: string;
  sira?: number;
}

export interface KampanyaTipi {
  id: string;
  baslik: string;
  aciklama: string;
  gorsel_url: string;
  gorselTipi?: 'arka_plan' | 'sag_taraf';
  link: string;
  aktif_mi: boolean;
}

export interface SepetElemaniTipi {
  id: string;
  yemek: YemekTipi;
  adet: number;
  birim_fiyat: number;
}

export type Yemek = YemekTipi;
export type Mutfak = MutfakTipi;

export interface OrtakSepet {
  kimlik: string;
  sepet_kodu: string;
  olusturan_musteri_kimligi: string;
  durum: 'aktif' | 'siparis_verildi' | 'iptal';
  olusturulma_tarihi?: string;
}

export interface OrtakSepetKatilimci {
  kimlik: string;
  ortak_sepet_kimligi: string;
  katilimci_adi: string;
  katilma_tarihi?: string;
}

export interface OrtakSepetElemani {
  kimlik: string;
  ortak_sepet_kimligi: string;
  ekleyen_katilimci_adi?: string;
  katilimci_adi?: string;
  katilimci_kimligi?: string;
  yemek_kimligi: string;
  yemek_basligi?: string;
  adet: number;
  birim_fiyat?: number;
  fiyat: number;
  yemek?: YemekTipi;
}

export interface MusteriAdresi {
  id?: string;
  kimlik?: string;
  musteri_kimligi?: string;
  baslik?: string;
  adres_basligi?: string;
  adres_tarifi?: string;
  acik_adres_tarifi?: string;
  mahalle?: string;
  cadde_sokak?: string;
  ilce?: string;
  il?: string;
  bina_no?: string;
  kat?: string;
  daire_no?: string;
  telefon?: string;
  varsayilan_mi?: boolean;
  olusturma_tarihi?: string;
  enlem?: number;
  boylam?: number;
}

export interface GelAlSubesi {
  id?: string;
  kimlik?: string;
  ad: string;
  adres: string;
  ilce?: string;
  mahalle?: string;
  telefon?: string;
  acik_mi?: boolean;
  calisma_saatleri?: string;
  hazirlanma_suresi?: string;
  enlem?: number;
  boylam?: number;
  // 🎥 Şubeye Özel YouTube Canlı Yayın ve Vitrin Alanları (Sadece Şube İçindir)
  youtube_canli_yayin_linki?: string;
  canli_yayin_aktif_mi?: boolean;
  gorsel?: string;
  aciklama?: string;
  puan?: number;
  degerlendirme_sayisi?: number;
  acilis_saati?: string;
  kapanis_saati?: string;
  hijyen_puani?: number;
}

export interface Kullanici {
  id?: string;
  kimlik?: string;
  ad_soyad: string;
  telefon: string;
  eposta?: string;
  rol: string;
  isletme_adi?: string;
  sube_id?: string;
  arac_tipi?: string;
  plaka?: string;
  ilce?: string;
  onayli_mi?: boolean;
  olusturma_tarihi?: string;
}

export type KullaniciRolu = 'musteri' | 'asci' | 'kurye' | 'yonetici' | 'sube_admin' | 'ev_mutfagi' | 'ticari_restoran' | string;

export interface SepetElemani {
  id: string;
  musteri_id?: string;
  yemek_id?: string;
  yemek?: YemekTipi;
  adet: number;
  birim_fiyat: number;
  secilen_ekstralar?: any[];
  mutfak_id?: string;
  mutfak?: MutfakTipi;
  eklenme_tarihi?: string;
}

export interface FiltreKriterleri {
  aramaMetni?: string;
  kategori?: string;
  altKategori?: string;
  minPuan?: number;
  minFiyat?: number;
  maxFiyat?: number;
  maksFiyat?: number;
  sadecePopuler?: boolean;
  siralama?: 'varsayilan' | 'fiyat_artan' | 'fiyat_azalan' | 'puan_azalan';
}

export interface KuryeCanliKonumVerisi {
  kimlik?: string;
  siparis_id: string;
  kurye_id?: string;
  enlem: number;
  boylam: number;
  kurye_adi: string;
  kurye_telefon: string;
  arac_tipi?: string;
  plaka?: string;
  tahmini_dakika?: number;
  kalan_dakika?: number;
  kalan_metre?: number;
  anlik_hiz_kmh?: number;
  tamamlandi_mi?: boolean;
  guncellenme_zamani?: string;
  guncellenme_tarihi?: string;
}
export interface KuryeAyarlari {
  id: string; // 'genel_ayarlar' ID'si olacak
  taban_ucret: number;
  km_basi_ucret: number;
  elektrikli_bonusu: number;
  yagmurlu_hava_carpani: number;
  gece_vardiyasi_primi: number;
  ucretsiz_teslimat_aktif?: boolean;
  ucretsiz_teslimat_esigi?: number;
}

export interface KomisyonAyarTipi {
  id: string; // 'genel_komisyon' veya mutfakId bazlı
  tip: 'genel' | 'mutfak' | 'kategori' | 'urun';
  hedefId?: string; // Mutfak ID, Kategori ID veya Yemek ID
  oran: number; // Yüzde oranı (örneğin 15 için %15)
  platformSabitUcret?: number; // Ek hizmet bedeli
  aktif_mi: boolean;
  olusturma_tarihi?: string;
  guncellenme_tarihi?: string;
}

