import { SecenekGrubu } from './UrunSecenekleriTipleri';

export interface VaryasyonSablonu {
  id?: string;
  kimlik?: string;
  baslik: string;
  kategori: string;
  aciklama?: string;
  secenek_gruplari: SecenekGrubu[];
  [key: string]: any;
}

const SABLON_DEPO_ANAHTARI = 'afyon_ev_lezzetleri_varyasyon_sablonlari_v1';

export function varyasyonSablonlariniGetir(): VaryasyonSablonu[] {
  try {
    const veri = localStorage.getItem(SABLON_DEPO_ANAHTARI);
    if (veri) {
      return JSON.parse(veri);
    }
  } catch {
    // Depolama hatası durumunda tolerans
  }
  return [];
}

export function kategoriIcinSablonBul(kategoriAdi: string): VaryasyonSablonu | undefined {
  const sablonlar = varyasyonSablonlariniGetir();
  const kat = (kategoriAdi || '').toLowerCase();
  return sablonlar.find((s) => s.kategori.toLowerCase() === kat || kat.includes(s.kategori.toLowerCase()));
}

export function sablonKaydet(sablon: VaryasyonSablonu): void {
  const mevcut = varyasyonSablonlariniGetir();
  const index = mevcut.findIndex((s) => (s.kimlik || s.id) === (sablon.kimlik || sablon.id));
  let guncel: VaryasyonSablonu[];
  if (index >= 0) {
    guncel = [...mevcut];
    guncel[index] = sablon;
  } else {
    guncel = [sablon, ...mevcut];
  }
  try {
    localStorage.setItem(SABLON_DEPO_ANAHTARI, JSON.stringify(guncel));
  } catch {
    // Depo hatası
  }
}

export function sablonSil(sablonKimlik: string): void {
  const mevcut = varyasyonSablonlariniGetir();
  const guncel = mevcut.filter((s) => (s.kimlik || s.id) !== sablonKimlik);
  try {
    localStorage.setItem(SABLON_DEPO_ANAHTARI, JSON.stringify(guncel));
  } catch {
    // Depo hatası
  }
}
