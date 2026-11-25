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

export function siparisMusteriTarafindanIptalEdilebilirMi(siparis: {
  durum?: string;
  asama?: string;
  siparis_kaynagi?: string;
  sube_id?: string;
}): boolean {
  const durum = durumMetniTemizle(siparis.durum);
  const asama = durumMetniTemizle(siparis.asama);
  if (IPTAL_DURUMLARI.has(durum) || TAMAMLANAN_DURUMLAR.has(durum)) return false;
  if (durum === 'yolda' || durum === 'teslime_hazir' || asama === 'yolda' || asama === 'teslime_hazir') {
    return false;
  }

  const subeMi = siparis.siparis_kaynagi === 'sube' || Boolean(siparis.sube_id);
  if (subeMi) {
    return !durum || durum === 'beklemede' || durum === 'hazirlaniyor';
  }

  // Ev Mutfağı: Mutfak "hazirlaniyor / ocakta" aşamasına geçtiyse keyfi iptal kapanır
  if (asama === 'ocakta' || durum === 'hazirlaniyor') return false;
  return !durum || durum === 'beklemede' || durum === 'onay_bekliyor';
}
