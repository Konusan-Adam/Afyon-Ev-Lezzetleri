export interface SiparisDegerlendirmesi {
  kimlik: string;
  siparis_kimligi: string;
  siparis_kodu?: string;
  mutfak_id: string;
  musteri_adi: string;
  puan?: number;
  yorum?: string;
  lezzet_puani: number; // 1-5
  kurye_puani: number;  // 1-5
  yorum_metni: string;
  tarih: string;
  yemek_basliklari?: string[];
  onayli_mi?: boolean;
  mutfak_cevabi?: string;
  cevap_tarihi?: string;
}
