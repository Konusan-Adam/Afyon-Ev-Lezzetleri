export type OdemeTipi = 'kapida_nakit' | 'kapida_kart' | 'online_cuzdan';

export interface OdemeSecenekleriAyari {
  kapidaNakitAktif: boolean;
  kapidaKartAktif: boolean;
  varsayilanYontem: OdemeTipi;
}

export const VARSAYILAN_ODEME_SECENEKLERI: OdemeSecenekleriAyari = {
  kapidaNakitAktif: true,
  kapidaKartAktif: true,
  varsayilanYontem: 'kapida_nakit',
};

export function yontemAktifMi(
  yontem: OdemeTipi,
  secenekler: OdemeSecenekleriAyari,
  onlineOdemeAktif: boolean
): boolean {
  if (yontem === 'kapida_nakit') return secenekler.kapidaNakitAktif !== false;
  if (yontem === 'kapida_kart') return secenekler.kapidaKartAktif !== false;
  return onlineOdemeAktif !== false;
}

export function aktifVarsayilanYontemiBul(
  secenekler: OdemeSecenekleriAyari,
  onlineOdemeAktif: boolean
): OdemeTipi | null {
  if (yontemAktifMi(secenekler.varsayilanYontem, secenekler, onlineOdemeAktif)) {
    return secenekler.varsayilanYontem;
  }
  const siraliYontemler: OdemeTipi[] = ['kapida_nakit', 'kapida_kart', 'online_cuzdan'];
  return siraliYontemler.find((y) => yontemAktifMi(y, secenekler, onlineOdemeAktif)) || null;
}
