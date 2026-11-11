/**
 * İki GPS koordinatı arasındaki gerçek mesafeyi (metre) ve tahmini varış süresini hesaplar.
 */
export function gercekMesafeMetreHesapla(
  enlem1: number,
  boylam1: number,
  enlem2: number,
  boylam2: number
): number {
  const dunyaYaricapi = 6371e3; // Metre
  const radyan1 = (enlem1 * Math.PI) / 180;
  const radyan2 = (enlem2 * Math.PI) / 180;
  const farkEnlem = ((enlem2 - enlem1) * Math.PI) / 180;
  const farkBoylam = ((boylam2 - boylam1) * Math.PI) / 180;

  const a =
    Math.sin(farkEnlem / 2) * Math.sin(farkEnlem / 2) +
    Math.cos(radyan1) * Math.cos(radyan2) *
    Math.sin(farkBoylam / 2) * Math.sin(farkBoylam / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(dunyaYaricapi * c);
}

export function tahminiSureDakikaHesapla(mesafeMetre: number, anlikHizKmh: number = 28): number {
  if (mesafeMetre <= 50) return 0;
  const etkiliHiz = Math.max(15, anlikHizKmh); // Şehir içi motor en az 15 km/s kabul edilir
  const hizMetreDakika = (etkiliHiz * 1000) / 60;
  return Math.max(1, Math.ceil(mesafeMetre / hizMetreDakika));
}
