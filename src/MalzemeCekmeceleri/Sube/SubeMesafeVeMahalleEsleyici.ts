import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

/**
 * Afyonkarahisar mahalleleri ile şubelerin hizmet bölgesi eşleştirme tablosu
 */
const MAHALLE_SUBE_HARITASI: Record<string, string> = {
  'cumhuriyet': 'sube-1', // Zafer Meydanı
  'zafer': 'sube-1',
  'dumlupinar': 'sube-1',
  'marulcu': 'sube-1',
  'burmali': 'sube-1',
  'karaman': 'sube-1',
  'tavukcu': 'sube-1',
  'hacimahsut': 'sube-1',
  'guvenevler': 'sube-2', // Park Afyon
  'selcuklu': 'sube-2',
  'osmangazi': 'sube-2',
  'erenler': 'sube-2',
  'orhangazi': 'sube-2',
  'harbiye': 'sube-2',
  'battalgazi': 'sube-2',
};

/**
 * Müşterinin seçtiği mahalleye en yakın veya hizmet veren şubeyi tespit eder.
 */
export function mahalleyeEnYakinSubeyiBul(
  seciliMahalle: string | undefined | null,
  subeler: GelAlSubesi[]
): GelAlSubesi | null {
  if (!subeler || subeler.length === 0) return null;
  if (!seciliMahalle) return subeler[0];

  const temizMahalle = seciliMahalle
    .toLowerCase()
    .replace(/\s*mah(alle)?\.?/gi, '')
    .trim();

  // 1. Doğrudan harita eşleşmesi
  const eslesenSubeId = MAHALLE_SUBE_HARITASI[temizMahalle];
  if (eslesenSubeId) {
    const bulunan = subeler.find((s) => s.id === eslesenSubeId || s.kimlik === eslesenSubeId);
    if (bulunan) return bulunan;
  }

  // 2. Şubenin kendi kayıtlı mahallesiyle eşleşme
  const dogrudanBulunan = subeler.find((s) =>
    s.mahalle?.toLowerCase().includes(temizMahalle) ||
    temizMahalle.includes(s.mahalle?.toLowerCase().replace(/\s*mah(alle)?\.?/gi, '').trim() || '')
  );
  if (dogrudanBulunan) return dogrudanBulunan;

  // 3. Varsayılan olarak açık olan ilk merkez şube
  return subeler.find((s) => s.acik_mi !== false) || subeler[0];
}
