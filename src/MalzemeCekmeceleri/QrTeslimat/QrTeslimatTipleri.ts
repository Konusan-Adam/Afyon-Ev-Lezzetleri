/**
 * 🦁 AFYON EV LEZZETLERİ - QR İLE TESLİMAT DOĞRULAMA TİPLERİ
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

export interface QrTeslimatVerisi {
  siparis_id: string;
  siparis_kodu: string;
  teslimat_kodu: string; // 4 haneli yedek PIN (Örn: "4829")
  guvenlik_imzasi: string; // Şifreli jeton (QR içindeki veri)
  olusturulma_zamani: string;
  son_gecerlilik_zamani: string;
  musteri_adi: string;
  teslim_edildi_mi: boolean;
}

export interface QrDogrulamaSonucu {
  basarili_mi: boolean;
  mesaj: string;
  siparis_kodu?: string;
  teslim_zamani?: string;
}
