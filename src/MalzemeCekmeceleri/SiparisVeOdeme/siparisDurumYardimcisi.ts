const IPTAL_DURUMLARI = new Set(['iptal', 'iptal_edildi', 'reddedildi', 'cancelled', 'canceled']);
const TAMAMLANAN_DURUMLAR = new Set(['teslim_edildi', 'tamamlandi', 'teslim']);

export function durumMetniTemizle(durum?: string): string {
  return (durum || '').trim().toLowerCase();
}

export function siparisIptalMi(durum?: string): boolean {
  return IPTAL_DURUMLARI.has(durumMetniTemizle(durum));
}

export function siparisTamamlandiMi(durum?: string): boolean {
  return TAMAMLANAN_DURUMLAR.has(durumMetniTemizle(durum));
}

export function siparisAktifMi(durum?: string): boolean {
  const temiz = durumMetniTemizle(durum);
  if (!temiz) return true;
  return !IPTAL_DURUMLARI.has(temiz) && !TAMAMLANAN_DURUMLAR.has(temiz);
}

export function standartSiparisDurumuGetir(durum?: string, asama?: string): string {
  const temizDurum = durumMetniTemizle(durum);
  const temizAsama = durumMetniTemizle(asama);

  if (IPTAL_DURUMLARI.has(temizDurum) || IPTAL_DURUMLARI.has(temizAsama)) {
    return 'iptal';
  }
  if (TAMAMLANAN_DURUMLAR.has(temizDurum) || TAMAMLANAN_DURUMLAR.has(temizAsama)) {
    return 'teslim_edildi';
  }
  return durum?.trim() || asama?.trim() || 'beklemede';
}
