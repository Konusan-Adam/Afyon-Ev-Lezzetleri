import fs from 'fs';
import { PaytrOturumKaydi } from './PaytrDurumDeposu';

const DEPO_DOSYA_YOLU = '/tmp/afyon_paytr_oturumlari.json';
const MAKSIMUM_KAYIT = 300;

export function paytrDisktenYukle(): Map<string, PaytrOturumKaydi> {
  const harita = new Map<string, PaytrOturumKaydi>();
  try {
    if (!fs.existsSync(DEPO_DOSYA_YOLU)) return harita;
    const ham = fs.readFileSync(DEPO_DOSYA_YOLU, 'utf8');
    const liste = JSON.parse(ham) as PaytrOturumKaydi[];
    if (Array.isArray(liste)) {
      liste.forEach((kayit) => {
        if (kayit?.merchantOid) harita.set(kayit.merchantOid, kayit);
      });
    }
  } catch {
    // Disk okuma hatasında boş harita ile devam edilir
  }
  return harita;
}

export function paytrDiskeKaydet(harita: Map<string, PaytrOturumKaydi>): void {
  try {
    const sirali = Array.from(harita.values())
      .sort((a, b) => b.guncellemeZamani - a.guncellemeZamani)
      .slice(0, MAKSIMUM_KAYIT);
    fs.writeFileSync(DEPO_DOSYA_YOLU, JSON.stringify(sirali), 'utf8');
  } catch {
    // Disk yazma hatası bellek içi akışı kesmez
  }
}
