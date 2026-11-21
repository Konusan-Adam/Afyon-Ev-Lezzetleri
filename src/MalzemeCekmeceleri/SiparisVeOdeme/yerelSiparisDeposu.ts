import { TEST_SIPARISLERI, TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { siparisAktifMi, siparisIptalMi, standartSiparisDurumuGetir } from './siparisDurumYardimcisi';

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

export function yerelSiparisSenkronizeEt(canliSiparisler: TestSiparis[]) {
  try {
    const mevcutYerel = yerelSiparisleriGetir();
    if (mevcutYerel.length === 0) return;

    const canliHarita = new Map<string, TestSiparis>();
    canliSiparisler.forEach((s) => {
      if (s.id) canliHarita.set(s.id, s);
      if (s.siparis_kodu) canliHarita.set(s.siparis_kodu, s);
      if (s.siparisKodu) canliHarita.set(s.siparisKodu, s);
    });

    let degistiMi = false;
    const guncelYerel: TestSiparis[] = [];

    for (const s of mevcutYerel) {
      const eslesen =
        (s.id && canliHarita.get(s.id)) ||
        (s.siparis_kodu && canliHarita.get(s.siparis_kodu)) ||
        (s.siparisKodu && canliHarita.get(s.siparisKodu));

      if (!eslesen) {
        degistiMi = true;
        continue;
      }

      const normalizeDurum = standartSiparisDurumuGetir(eslesen.durum, eslesen.asama);
      if (
        s.durum !== normalizeDurum ||
        s.durum_aciklamasi !== eslesen.durum_aciklamasi ||
        s.iptal_kaynagi !== eslesen.iptal_kaynagi
      ) {
        degistiMi = true;
      }

      guncelYerel.push({
        ...s,
        ...eslesen,
        durum: normalizeDurum as TestSiparis['durum'],
      });
    }

    if (degistiMi) {
      localStorage.setItem(SIPARIS_YEREL_DEPO_ANAHTARI, JSON.stringify(guncelYerel));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('afyon_yerel_siparis_senkron'));
      }
    }
  } catch {}
}

export function yerelSiparisDurumGuncelle(
  siparisKimligi: string,
  yeniDurum: string,
  durumAciklamasi?: string,
  iptalKaynagi?: 'musteri' | 'mutfak'
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
          (siparisIptalMi(yeniDurum) ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
        return {
          ...s,
          durum: yeniDurum,
          asama: yeniDurum,
          durum_aciklamasi: aciklama,
          durumAciklamasi: aciklama,
          ...(iptalKaynagi ? { iptal_kaynagi: iptalKaynagi } : {}),
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
          (siparisIptalMi(yeniDurum) ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
      }
    });
  } catch {}
}

export function aktifMisafirSiparisSayisiGetir(): number {
  const tumu = yerelSiparisleriGetir();
  return tumu.filter((s) => siparisAktifMi(s.durum)).length;
}
