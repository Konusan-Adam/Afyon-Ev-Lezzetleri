export type PaytrIslemDurumu = 'bekliyor' | 'odendi' | 'hata';

export interface PaytrOturumKaydi {
  merchantOid: string;
  durum: PaytrIslemDurumu;
  tutarKurus: number;
  demoMod: boolean;
  hataMesaji?: string;
  guncellemeZamani: number;
}

const oturumHaritasi = new Map<string, PaytrOturumKaydi>();

export function paytrOturumuOlustur(
  merchantOid: string,
  tutarKurus: number,
  demoMod: boolean
): PaytrOturumKaydi {
  const kayit: PaytrOturumKaydi = {
    merchantOid,
    durum: 'bekliyor',
    tutarKurus,
    demoMod,
    guncellemeZamani: Date.now(),
  };
  oturumHaritasi.set(merchantOid, kayit);
  return kayit;
}

export function paytrOturumDurumGuncelle(
  merchantOid: string,
  durum: PaytrIslemDurumu,
  hataMesaji?: string
): PaytrOturumKaydi | null {
  const mevcut = oturumHaritasi.get(merchantOid);
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
  return guncel;
}

export function paytrOturumDurumAl(merchantOid: string): PaytrOturumKaydi | null {
  return oturumHaritasi.get(merchantOid) || null;
}
