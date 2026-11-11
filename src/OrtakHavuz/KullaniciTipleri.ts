export interface KullaniciProfili {
  kimlik: string;
  adSoyad: string;
  telefon: string;
  rol: 'musteri' | 'ev_mutfagi' | 'kurye' | 'yonetici';
  seciliAdres: string;
}

export interface KullaniciHavuzuTipi {
  kullanici: KullaniciProfili | null;
  oturumAcikMi: boolean;
  oturumAc: (adSoyad: string, telefon: string) => void;
  cikisYap: () => void;
  adresDegistir: (yeniAdres: string) => void;
}
