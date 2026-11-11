export type KuryeAsamaTipi = 'mutfaga_gidiliyor' | 'paket_alindi' | 'teslim_edildi';

export interface KorlemeSiparisTipi {
  siparisKodu: string;
  mutfakKodu: string;
  urunOzetMetni: string;
  teslimatBolgesi: string;
  acikAdres: string;
  musteriAdi: string;
  musteriTelefon: string;
  pinKodu: string;
  asama: KuryeAsamaTipi;
}
