export interface FavoriVerisi {
  mutfakIdleri: string[];
  subeIdleri: string[];
}

export interface FavoriHafizaTipi {
  favoriMutfakIdleri: string[];
  favoriSubeIdleri: string[];
  mutfakFavoriMi: (mutfakId: string) => boolean;
  subeFavoriMi: (subeId: string) => boolean;
  mutfakFavoriDegistir: (mutfakId: string) => void;
  subeFavoriDegistir: (subeId: string) => void;
  toplamFavoriSayisi: number;
}
