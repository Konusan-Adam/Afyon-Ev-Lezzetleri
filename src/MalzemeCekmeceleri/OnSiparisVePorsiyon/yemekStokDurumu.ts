import { MutfakTipi, YemekTipi } from '@/src/veritabani/VeriTipleri';
import { calismaSaatiDurumuHesapla } from './calismaSaatiKontrolu';

export interface MutfakMolaDurumuBilgisi {
  moladaMi: boolean;
  kapaliMi: boolean;
  saatDisiMi: boolean;
  siparisEngelliMi: boolean;
  molaBitisZamani?: string;
  acilisSaati?: string;
  kapaliEtiketi: string;
  uyariMetni: string;
}

export interface YemekStokDurumBilgisi {
  sinirsizMi: boolean;
  stokTakibiVarMi: boolean;
  kalanStok?: number;
  birim: string;
  tukendiMi: boolean;
  sonKalanRozetMetni: string | null;
  minTutarTamamlanmazMi: boolean;
  minSiparisTutari: number;
  minTutarUyariMetni: string | null;
}

export function mutfakMolaDurumuGetir(
  mutfak?: Partial<MutfakTipi> | null,
  referansDakika?: number
): MutfakMolaDurumuBilgisi {
  const moladaMi = mutfak?.mola_durumu === true;
  const saatDurumu = calismaSaatiDurumuHesapla(mutfak, referansDakika);
  const kapaliMi = saatDurumu.kapaliMi;
  const molaBitisZamani = mutfak?.mola_bitis_zamani?.trim() || mutfak?.mola_bitis_saati?.trim() || undefined;

  let uyariMetni = '';
  if (moladaMi) {
    uyariMetni = molaBitisZamani
      ? `Mutfak şu an dinlenmede, tahmini açılış: ${molaBitisZamani}`
      : 'Mutfak şu an dinlenmede / molada, geçici olarak sipariş alınamamaktadır.';
  } else if (kapaliMi) {
    uyariMetni = saatDurumu.saatDisiMi && saatDurumu.acilisSaati
      ? `Mutfak çalışma saatleri dışındadır (Açılış: ${saatDurumu.acilisSaati}).`
      : 'Mutfak şu an kapalıdır.';
  }

  return {
    moladaMi,
    kapaliMi,
    saatDisiMi: saatDurumu.saatDisiMi,
    siparisEngelliMi: moladaMi || kapaliMi,
    molaBitisZamani,
    acilisSaati: saatDurumu.acilisSaati,
    kapaliEtiketi: saatDurumu.kapaliEtiketi,
    uyariMetni,
  };
}

export function yemekStokDurumuHesapla(
  yemek: Partial<YemekTipi>,
  mutfak?: Partial<MutfakTipi> | null
): YemekStokDurumBilgisi {
  const sinirsizMi = yemek.sinirsiz_stok === true;
  const kalanStokGecerli = typeof yemek.kalan_stok === 'number' && !Number.isNaN(yemek.kalan_stok);
  const stokTakibiVarMi = !sinirsizMi && kalanStokGecerli;
  const kalanStok = kalanStokGecerli ? Math.max(0, Number(yemek.kalan_stok)) : undefined;
  const birim = yemek.birim?.trim() || 'Porsiyon';

  const tukendiMi =
    yemek.stokta_var_mi === false ||
    yemek.tukendi_mi === true ||
    (stokTakibiVarMi && (kalanStok ?? 0) <= 0);

  const sonKalanRozetMetni =
    !tukendiMi && stokTakibiVarMi && kalanStok !== undefined && kalanStok >= 1 && kalanStok <= 5
      ? `Son ${kalanStok} ${birim} Kaldı`
      : null;

  const minSiparisTutari =
    typeof mutfak?.min_siparis_tutari === 'number' && mutfak.min_siparis_tutari > 0
      ? mutfak.min_siparis_tutari
      : 0;

  const fiyat = Number(yemek.fiyat) || 0;
  const minTutarTamamlanmazMi =
    !tukendiMi &&
    stokTakibiVarMi &&
    kalanStok !== undefined &&
    kalanStok > 0 &&
    minSiparisTutari > 0 &&
    kalanStok * fiyat < minSiparisTutari;

  const minTutarUyariMetni = minTutarTamamlanmazMi
    ? `Tek başına min. ${minSiparisTutari} ₺ sipariş tutarını tamamlamaz, yanına ek ürün eklemelisiniz`
    : null;

  return {
    sinirsizMi,
    stokTakibiVarMi,
    kalanStok,
    birim,
    tukendiMi,
    sonKalanRozetMetni,
    minTutarTamamlanmazMi,
    minSiparisTutari,
    minTutarUyariMetni,
  };
}
