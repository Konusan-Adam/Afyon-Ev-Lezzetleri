/**
 * Afyon Ev Lezzetleri — Yerel Gastronomi ve Dinamik Lezzet Danışmanı Zekası
 * Sabit yemek yazmaz; veritabanındaki canlı ürünlere, stok durumuna ve saate göre konuşur.
 */

import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { dinamikEsnafCevabiUret, DinamikCevapSonucu } from './DinamikEsnafMantigi';
import { suAnkiZamanDilimi } from '@/src/MalzemeCekmeceleri';

export { dinamikEsnafCevabiUret };
export type { DinamikCevapSonucu };

export function afyonLezzetCevabiUret(
  kullaniciMesaji: string,
  mevcutYemekler: YemekTipi[] = []
): string {
  if (mevcutYemekler && mevcutYemekler.length > 0) {
    const sonuc = dinamikEsnafCevabiUret(kullaniciMesaji, mevcutYemekler);
    return sonuc.cevapMetni;
  }

  const zaman = suAnkiZamanDilimi();
  return `${zaman.karsilama} Taze lezzetlerimiz hakkında sizlere yardımcı olmaktan memnuniyet duyarım. Arzu ettiğiniz lezzeti belirtebilirsiniz.`;
}
