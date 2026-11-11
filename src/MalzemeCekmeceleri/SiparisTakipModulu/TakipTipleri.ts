export type SiparisAsamaTipi = 'ocakta' | 'kuryede' | 'kapida' | 'teslim_edildi';

export interface TakipVerisiTipi {
  siparisKodu: string;
  pinKodu: string;
  asama: SiparisAsamaTipi;
  tahminiDakika: number;
  kuryeAdi?: string;
  sonGuncelleme: string;
  teslimatZamani?: string;
}

