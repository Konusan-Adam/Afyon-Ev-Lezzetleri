import fs from 'fs';
import path from 'path';
import type { PaytrOturumKaydi } from './PaytrDurumDeposu';

const DEPO_DOSYA_YOLU = path.resolve('.paytr-oturum-depo.json');

export function paytrDosyadanOku(): Record<string, PaytrOturumKaydi> {
  try {
    if (!fs.existsSync(DEPO_DOSYA_YOLU)) return {};
    const ham = fs.readFileSync(DEPO_DOSYA_YOLU, 'utf8');
    const parsed = JSON.parse(ham);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function paytrDosyayaYaz(harita: Map<string, PaytrOturumKaydi>): void {
  try {
    const sonKayitlar = Array.from(harita.entries()).slice(-500);
    const nesne = Object.fromEntries(sonKayitlar);
    fs.writeFileSync(DEPO_DOSYA_YOLU, JSON.stringify(nesne), 'utf8');
  } catch {}
}
