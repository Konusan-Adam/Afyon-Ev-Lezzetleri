import { GelAlSubesi } from './VeriTipleri';

export interface SubeUrunu {
  id: string;
  sube_id: string;
  yemek_id?: string;
  ad: string;
  aciklama?: string;
  fiyat: number;
  gorsel_url?: string;
  stok_adedi: number;
  kategori: string;
  marka: 'Afyon Ev Lezzetleri';
  hazir_mi: boolean;
  gunluk_taze_mi?: boolean;
  tedarikci_id?: string;
  tedarikci_adi?: string;
  alis_fiyati?: number;
  gunluk_gelen_adet?: number;
  satilan_adet?: number;
}

export interface TedarikciHakedis {
  id: string;
  sube_id: string;
  sube_adi: string;
  tedarikci_id: string;
  tedarikci_adi: string;
  urun_id: string;
  urun_adi: string;
  teslim_adedi: number;
  satilan_adet: number;
  birim_alis_fiyati: number;
  toplam_hakedis: number;
  durum: 'beklemede' | 'onaylandi' | 'odendi' | 'iptal';
  tarih: string;
}

export interface SubeMahalleEslesmesi {
  mahalleAdi: string;
  enYakinSubeId: string;
  mesafeMetre?: number;
}

export interface SubeSiparisi {
  id: string;
  siparis_kodu: string;
  sube_id: string;
  sube_adi: string;
  musteri_id?: string;
  musteri_adi: string;
  musteri_telefon: string;
  durum: 'hazirlaniyor' | 'teslime_hazir' | 'teslim_edildi' | 'iptal';
  toplam_tutar: number;
  odeme_yontemi: string;
  pin_kodu: string;
  tahmini_hazirlanma_dakika?: number;
  olusturma_tarihi: string;
  urunler?: {
    urun_id: string;
    ad: string;
    adet: number;
    fiyat: number;
  }[];
}

export type { GelAlSubesi };
