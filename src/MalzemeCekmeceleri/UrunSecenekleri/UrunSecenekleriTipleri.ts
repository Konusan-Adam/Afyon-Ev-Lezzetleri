export interface SecenekOgesi {
  kimlik: string;
  baslik: string;
  ek_ucret: number;
}

export interface SecenekGrubu {
  kimlik: string;
  baslik: string;
  zorunlu_mu: boolean;
  coklu_secim_mi: boolean;
  ogeler: SecenekOgesi[];
}

export interface YemekVaryasyonYapisi {
  yemek_id: string;
  secenek_gruplari: SecenekGrubu[];
}

export interface SecilenUrunKonfigurasyonu {
  adet: number;
  secilen_ogeler: SecenekOgesi[];
  ozel_not: string;
  birim_fiyat: number;
  toplam_fiyat: number;
}
