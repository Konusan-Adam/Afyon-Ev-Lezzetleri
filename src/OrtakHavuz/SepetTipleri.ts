import { SepetElemaniTipi, YemekTipi } from '@/src/veritabani/VeriTipleri';

export interface SepetHavuzuTipi {
  sepetElemanlari: SepetElemaniTipi[];
  sepeteEkle: (yemek: YemekTipi) => void;
  sepettenCikar: (yemekId: string) => void;
  adetGuncelle: (yemekId: string, yeniAdet: number) => void;
  sepetiTemizle: () => void;
  toplamTutar: number;
  toplamUrunSayisi: number;
  sepetAcikMi: boolean;
  sepetiAcKapat: (acik: boolean) => void;
}
