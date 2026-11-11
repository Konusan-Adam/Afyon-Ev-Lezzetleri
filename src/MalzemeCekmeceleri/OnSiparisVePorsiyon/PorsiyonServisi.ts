import { PorsiyonBilgisi } from './PorsiyonTipleri';

const PORSIYON_DEPO_KEY = 'afyon_gunluk_porsiyon_stoklari_v1';

// Varsayılan ev yapımı günlük üretim porsiyonları
const VARSAYILAN_PORSIYONLAR: Record<string, { toplam: number; kalan: number }> = {
  'y1': { toplam: 12, kalan: 3 }, // Karnıyarık - son 3 porsiyon (aciliyet)
  'y2': { toplam: 15, kalan: 5 }, // Bükme
  'y3': { toplam: 8, kalan: 1 },  // Çömlek Keşkek - son 1 porsiyon!
  'y4': { toplam: 10, kalan: 0 }, // Tatlı - bugün tükendi
  'y5': { toplam: 14, kalan: 4 }, // Mantı
};

function depoGetir(): Record<string, { toplam: number; kalan: number }> {
  try {
    const ham = localStorage.getItem(PORSIYON_DEPO_KEY);
    if (ham) {
      return { ...VARSAYILAN_PORSIYONLAR, ...JSON.parse(ham) };
    }
  } catch {}
  return VARSAYILAN_PORSIYONLAR;
}

function depoyaKaydet(veri: Record<string, { toplam: number; kalan: number }>): void {
  try {
    localStorage.setItem(PORSIYON_DEPO_KEY, JSON.stringify(veri));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_porsiyon_guncellendi'));
    }
  } catch {}
}

export function yemekPorsiyonGetir(
  yemekId: string,
  varsayilanToplam?: number,
  yemekBirimi?: string,
  sinirsizMi?: boolean
): PorsiyonBilgisi {
  const depo = depoGetir();
  const kayit = depo[yemekId];

  if (!kayit) {
    if (sinirsizMi || varsayilanToplam === undefined || varsayilanToplam === null) {
      return {
        yemekId,
        gunlukToplam: 999,
        kalanPorsiyon: 999,
        tukendiMi: false,
        birim: yemekBirimi || 'Porsiyon',
        sinirsizMi: true,
      };
    }
    return {
      yemekId,
      gunlukToplam: varsayilanToplam,
      kalanPorsiyon: varsayilanToplam,
      tukendiMi: varsayilanToplam <= 0,
      birim: yemekBirimi || 'Porsiyon',
      sinirsizMi: false,
    };
  }

  return {
    yemekId,
    gunlukToplam: kayit.toplam,
    kalanPorsiyon: kayit.kalan,
    tukendiMi: kayit.kalan <= 0,
    birim: (kayit as any).birim || yemekBirimi || 'Porsiyon',
    sinirsizMi: (kayit as any).sinirsizMi || false,
  };
}

export function porsiyonDusur(yemekId: string, adet: number = 1): void {
  const depo = depoGetir();
  const mevcut = depo[yemekId] || { toplam: 10, kalan: 10 };
  const yeniKalan = Math.max(0, mevcut.kalan - adet);
  depo[yemekId] = { ...mevcut, kalan: yeniKalan };
  depoyaKaydet(depo);
}

export function porsiyonBelirle(
  yemekId: string,
  toplam: number,
  kalan: number,
  birim?: string,
  sinirsizMi: boolean = false
): void {
  const depo = depoGetir();
  depo[yemekId] = {
    toplam: Math.max(1, toplam),
    kalan: Math.max(0, kalan),
    ...(birim ? { birim } : {}),
    ...(sinirsizMi ? { sinirsizMi: true } : {}),
  } as any;
  depoyaKaydet(depo);
}
