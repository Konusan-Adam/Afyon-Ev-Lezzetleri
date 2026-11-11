export interface SiparisDegerlendirmesi {
  kimlik: string;
  siparis_kimligi: string;
  mutfak_id: string;
  musteri_adi: string;
  lezzet_puani: number; // 1-5
  kurye_puani: number;  // 1-5
  yorum_metni: string;
  tarih: string;
  yemek_basliklari?: string[];
  onayli_mi?: boolean;
}
