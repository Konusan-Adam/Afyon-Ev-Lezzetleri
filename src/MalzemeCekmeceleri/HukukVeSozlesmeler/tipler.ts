/**
 * Afyon Ev Lezzetleri — Hukuki Sözleşmeler ve Çerez Yönetimi Tipleri
 */

export type SozlesmeTuru = 
  | 'mesafeli_satis'
  | 'on_bilgilendirme'
  | 'kvkk_aydinlatma'
  | 'kullanici_sozlesmesi'
  | 'cerez_politikasi'
  | 'iptal_iade_kosullari'
  | string;

export type SozlesmeKonumu = 'kayit' | 'siparis' | 'asci_basvuru' | 'kurye_basvuru' | 'genel';

export type HukukiIslemTuru =
  | 'kayit'
  | 'siparis'
  | 'cerez_onayi'
  | 'teslimat'
  | 'iptal'
  | 'hakedis'
  | 'sozlesme_guncelleme'
  | 'ozel_onay';

export interface HukukiSozlesme {
  tur: SozlesmeTuru;
  baslik: string;
  kisaBaslik: string;
  versiyon: string;
  guncellenmeTarihi: string;
  icerik: string;
  zorunluMu: boolean;
  konum?: SozlesmeKonumu;
  silinebilirMi?: boolean;
}

export interface HukukiOnayLogu {
  kimlik: string;
  sozlesmeTuru: string;
  sozlesmeVersiyonu: string;
  kullaniciKimlik?: string;
  kullaniciTelefon?: string;
  kullaniciAdSoyad?: string;
  islemTuru: HukukiIslemTuru;
  tarihSaat: string;
  sunucuUtc?: string;
  ipAdresi: string;
  cihazBilgisi: string;
  onaylandiMi: boolean;
  ozetHash?: string;
  sozlesmeMetinHash?: string;
  tsaSaglayici?: string;
  tsaTokenBase64?: string;
  damgaDurumu?: 'rfc3161_onayli' | 'sunucu_muhurlu' | 'yerel_ozet';
  sunucuImzasi?: string;
  ilgiliKayitId?: string;
  ekDetay?: Record<string, unknown>;
}

export interface CerezTercihleri {
  zorunlu: boolean;
  analitik: boolean;
  pazarlama: boolean;
  onaylandi: boolean;
  tarih: string;
}
