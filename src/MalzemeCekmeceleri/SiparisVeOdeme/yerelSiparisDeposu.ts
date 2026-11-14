import { TEST_SIPARISLERI, TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';

const SIPARIS_YEREL_DEPO_ANAHTARI = 'afyon_ev_lezzetleri_siparisleri_v1';

export function yerelSiparisleriGetir(): TestSiparis[] {
  try {
    const kayit = localStorage.getItem(SIPARIS_YEREL_DEPO_ANAHTARI);
    if (kayit) {
      const parsed = JSON.parse(kayit);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function yerelSiparisKaydet(siparis: TestSiparis) {
  try {
    const mevcutlar = yerelSiparisleriGetir();
    const index = mevcutlar.findIndex(
      (s) => s.id === siparis.id || s.siparis_kodu === siparis.siparis_kodu
    );
    if (index >= 0) {
      mevcutlar[index] = { ...mevcutlar[index], ...siparis };
    } else {
      mevcutlar.unshift(siparis);
    }
    localStorage.setItem(SIPARIS_YEREL_DEPO_ANAHTARI, JSON.stringify(mevcutlar));

    const testIndex = TEST_SIPARISLERI.findIndex(
      (s) => s.id === siparis.id || s.siparis_kodu === siparis.siparis_kodu
    );
    if (testIndex >= 0) {
      TEST_SIPARISLERI[testIndex] = { ...TEST_SIPARISLERI[testIndex], ...siparis };
    } else {
      TEST_SIPARISLERI.unshift(siparis);
    }
  } catch {}
}

export function yerelSiparisDurumGuncelle(
  siparisKimligi: string,
  yeniDurum: string,
  durumAciklamasi?: string
) {
  try {
    const anahtarlar = [
      SIPARIS_YEREL_DEPO_ANAHTARI,
      'afyon_aktif_siparisler_v1',
      'afyon_misafir_siparisleri_v1',
    ];
    anahtarlar.forEach((anahtar) => {
      const kayit = localStorage.getItem(anahtar);
      if (!kayit) return;
      const liste = JSON.parse(kayit);
      if (!Array.isArray(liste)) return;

      const guncel = liste.map((s: any) => {
        const eslesti =
          s.id === siparisKimligi ||
          s.kimlik === siparisKimligi ||
          s.siparis_kodu === siparisKimligi ||
          s.siparisKodu === siparisKimligi;
        if (!eslesti) return s;

        const aciklama =
          durumAciklamasi ||
          (yeniDurum === 'iptal' ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
        return {
          ...s,
          durum: yeniDurum,
          durum_aciklamasi: aciklama,
          durumAciklamasi: aciklama,
        };
      });
      localStorage.setItem(anahtar, JSON.stringify(guncel));
    });

    TEST_SIPARISLERI.forEach((s) => {
      if (
        s.id === siparisKimligi ||
        (s as any).kimlik === siparisKimligi ||
        s.siparis_kodu === siparisKimligi
      ) {
        s.durum = yeniDurum as TestSiparis['durum'];
        s.durum_aciklamasi =
          durumAciklamasi ||
          (yeniDurum === 'iptal' ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
      }
    });
  } catch {}
}

export function aktifMisafirSiparisSayisiGetir(): number {
  const tumu = yerelSiparisleriGetir();
  return tumu.filter((s) => s.durum !== 'iptal' && s.durum !== 'teslim_edildi').length;
}
