export interface PorsiyonBilgisi {
  yemekId: string;
  gunlukToplam: number;
  kalanPorsiyon: number;
  tukendiMi: boolean;
  birim?: string;
  sinirsizMi?: boolean;
}

export type TeslimatZamaniTipi = 'hemen' | 'ileri_tarih';

export interface OnSiparisTercihi {
  tip: TeslimatZamaniTipi;
  tarihEtiketi: string; // Örn: 'Bugün', 'Yarın', '24 Ekim Cuma'
  saatAraligi: string;  // Örn: '18:30 - 19:30 (Akşam Yemeği)'
  tamTarih?: string;
}

export interface YemekKartiEkBilgi {
  yemekKartiRozetiGoster: boolean; // Sodexo / Multinet kabul
  yemekKartiAciklama: string;
}
