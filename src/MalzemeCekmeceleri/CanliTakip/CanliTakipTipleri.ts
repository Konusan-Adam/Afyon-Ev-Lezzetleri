/**
 * 🦁 AFYON EV LEZZETLERİ - CANLI TAKİP TİPLERİ
 * %100 Gerçek GPS Akışı Veri Tipleri
 */

export interface KonumKoordinati {
  enlem: number;
  boylam: number;
  etiket?: string;
  adres_metni?: string;
}

export interface KuryeCanliKonumBilgisi {
  kurye_id: string;
  ad_soyad: string;
  telefon: string;
  arac_tipi: string;
  plaka: string;
  anlik_konum: KonumKoordinati;
  musteri_konum?: KonumKoordinati;
  kalan_dakika: number;
  kalan_metre: number;
  anlik_hiz_kmh: number;
  adim_indeksi: number;
  tamamlandi_mi: boolean;
  gps_aktif_mi: boolean;
  son_guncelleme?: string;
}

// Geriye dönük uyumluluk takma adı
export type KuryeSimulasyonBilgisi = KuryeCanliKonumBilgisi;
