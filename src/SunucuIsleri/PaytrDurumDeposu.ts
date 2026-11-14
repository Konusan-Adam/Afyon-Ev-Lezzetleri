import { paytrFirestoreKaydet, paytrFirestoreGetir } from './PaytrFirestoreDeposu';
import { paytrDosyadanOku, paytrDosyayaYaz } from './PaytrDosyaDeposu';

export type PaytrIslemDurumu = 'bekliyor' | 'odendi' | 'hata';

export interface PaytrOturumKaydi {
  merchantOid: string;
  durum: PaytrIslemDurumu;
  tutarKurus: number;
  demoMod: boolean;
  hataMesaji?: string;
  guncellemeZamani: number;
}

const oturumHaritasi = new Map<string, PaytrOturumKaydi>(
  Object.entries(paytrDosyadanOku())
);

export async function paytrOturumuOlustur(
  merchantOid: string,
  tutarKurus: number,
  demoMod: boolean
): Promise<PaytrOturumKaydi> {
  const kayit: PaytrOturumKaydi = {
    merchantOid,
    durum: 'bekliyor',
    tutarKurus,
    demoMod,
    guncellemeZamani: Date.now(),
  };
  oturumHaritasi.set(merchantOid, kayit);
  paytrDosyayaYaz(oturumHaritasi);
  await paytrFirestoreKaydet(kayit);
  return kayit;
}

export async function paytrOturumDurumGuncelle(
  merchantOid: string,
  durum: PaytrIslemDurumu,
  hataMesaji?: string
): Promise<PaytrOturumKaydi> {
  const mevcut =
    oturumHaritasi.get(merchantOid) || (await paytrFirestoreGetir(merchantOid));
  const guncel: PaytrOturumKaydi = mevcut
    ? { ...mevcut, durum, hataMesaji, guncellemeZamani: Date.now() }
    : {
        merchantOid,
        durum,
        tutarKurus: 0,
        demoMod: false,
        hataMesaji,
        guncellemeZamani: Date.now(),
      };
  oturumHaritasi.set(merchantOid, guncel);
  paytrDosyayaYaz(oturumHaritasi);
  await paytrFirestoreKaydet(guncel);
  return guncel;
}

export async function paytrOturumDurumAl(
  merchantOid: string
): Promise<PaytrOturumKaydi | null> {
  const fbKayit = await paytrFirestoreGetir(merchantOid);
  if (fbKayit) {
    oturumHaritasi.set(merchantOid, fbKayit);
    paytrDosyayaYaz(oturumHaritasi);
    return fbKayit;
  }
  return oturumHaritasi.get(merchantOid) || null;
}
