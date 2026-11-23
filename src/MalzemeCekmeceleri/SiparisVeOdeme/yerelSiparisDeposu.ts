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

export function yerelSiparisiTamamenSil(siparisKimligiVeKodu: string) {
  try {
    if (!siparisKimligiVeKodu) return;
    const hedef = siparisKimligiVeKodu.trim();

    // 1. Ana yerel depodan temizle
    const anaListe = yerelSiparisleriGetir();
    const filtrelenmis = anaListe.filter(
      (s) =>
        s.id !== hedef &&
        s.siparis_kodu !== hedef &&
        s.siparisKodu !== hedef &&
        (s as any).kimlik !== hedef
    );
    localStorage.setItem(SIPARIS_YEREL_DEPO_ANAHTARI, JSON.stringify(filtrelenmis));

    // 2. Diğer yerel sipariş önbelleklerinden temizle
    const digerAnahtarlar = ['afyon_aktif_siparisler_v1', 'afyon_misafir_siparisleri_v1'];
    digerAnahtarlar.forEach((k) => {
      const ham = localStorage.getItem(k);
      if (!ham) return;
      try {
        const arr = JSON.parse(ham);
        if (Array.isArray(arr)) {
          const temiz = arr.filter(
            (s: any) =>
              s.id !== hedef &&
              s.siparis_kodu !== hedef &&
              s.siparisKodu !== hedef &&
              s.kimlik !== hedef
          );
          localStorage.setItem(k, JSON.stringify(temiz));
        }
      } catch {}
    });

    // 3. afyon_son_aktif_siparis temizle
    const sonAktifHam = localStorage.getItem('afyon_son_aktif_siparis');
    if (sonAktifHam) {
      try {
        const parsed = JSON.parse(sonAktifHam);
        if (
          parsed &&
          (parsed.siparisKodu === hedef ||
            parsed.id === hedef ||
            parsed.siparis_kodu === hedef)
        ) {
          localStorage.removeItem('afyon_son_aktif_siparis');
        }
      } catch {}
    }

    // 4. TEST_SIPARISLERI bellek dizisinden tamamen sil
    for (let i = TEST_SIPARISLERI.length - 1; i >= 0; i--) {
      const s = TEST_SIPARISLERI[i];
      if (
        s.id === hedef ||
        s.siparis_kodu === hedef ||
        s.siparisKodu === hedef ||
        (s as any).kimlik === hedef
      ) {
        TEST_SIPARISLERI.splice(i, 1);
      }
    }
  } catch {}
}

export function yerelSiparisSenkronizeEt(canliSiparisler: TestSiparis[]) {
  try {
    const mevcutYerel = yerelSiparisleriGetir();

    const canliHarita = new Map<string, TestSiparis>();
    canliSiparisler.forEach((s) => {
      if (s.id) canliHarita.set(s.id, s);
      if (s.siparis_kodu) canliHarita.set(s.siparis_kodu, s);
      if (s.siparisKodu) canliHarita.set(s.siparisKodu, s);
    });

    // 1. Canlı veritabanından tamamen silinmiş siparişleri yerel depolardan ve bellekten arındır
    for (const s of mevcutYerel) {
      const eslesen =
        (s.id && canliHarita.get(s.id)) ||
        (s.siparis_kodu && canliHarita.get(s.siparis_kodu)) ||
        (s.siparisKodu && canliHarita.get(s.siparisKodu));

      if (!eslesen) {
        if (s.id) yerelSiparisiTamamenSil(s.id);
        if (s.siparis_kodu) yerelSiparisiTamamenSil(s.siparis_kodu);
        if (s.siparisKodu) yerelSiparisiTamamenSil(s.siparisKodu);
      }
    }

    // TEST_SIPARISLERI bellek dizisinden de canlıda olmayanları temizle
    for (let i = TEST_SIPARISLERI.length - 1; i >= 0; i--) {
      const s = TEST_SIPARISLERI[i];
      const eslesen =
        (s.id && canliHarita.get(s.id)) ||
        (s.siparis_kodu && canliHarita.get(s.siparis_kodu)) ||
        (s.siparisKodu && canliHarita.get(s.siparisKodu));
      if (!eslesen) {
        TEST_SIPARISLERI.splice(i, 1);
      }
    }

    let degistiMi = false;
    const tazeYerel = yerelSiparisleriGetir();
    const guncelYerel: TestSiparis[] = [];

    for (const s of tazeYerel) {
      const eslesen =
        (s.id && canliHarita.get(s.id)) ||
        (s.siparis_kodu && canliHarita.get(s.siparis_kodu)) ||
        (s.siparisKodu && canliHarita.get(s.siparisKodu));

      if (!eslesen) continue;

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

      // İptal veya teslim edilmişse son aktif sipariş takibinden ve aktif siparişler listesinden düşür
      if (normalizeDurum === 'iptal' || normalizeDurum === 'teslim_edildi') {
        const sonAktifHam = localStorage.getItem('afyon_son_aktif_siparis');
        if (sonAktifHam) {
          try {
            const parsed = JSON.parse(sonAktifHam);
            const kod = s.siparis_kodu || s.id;
            if (parsed && (parsed.siparisKodu === kod || parsed.id === s.id)) {
              localStorage.removeItem('afyon_son_aktif_siparis');
            }
          } catch {}
        }

        const aktiflerHam = localStorage.getItem('afyon_aktif_siparisler_v1');
        if (aktiflerHam) {
          try {
            const arr = JSON.parse(aktiflerHam);
            if (Array.isArray(arr)) {
              const filtreli = arr.filter(
                (item: any) =>
                  item.id !== s.id &&
                  item.siparis_kodu !== s.siparis_kodu &&
                  item.siparisKodu !== s.siparisKodu
              );
              localStorage.setItem('afyon_aktif_siparisler_v1', JSON.stringify(filtreli));
            }
          } catch {}
        }
      }
    }

    localStorage.setItem(SIPARIS_YEREL_DEPO_ANAHTARI, JSON.stringify(guncelYerel));
    if (degistiMi && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_yerel_siparis_senkron'));
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
    const iptal = siparisIptalMi(yeniDurum);
    const tamamlandi = !siparisAktifMi(yeniDurum);

    const anahtarlar = [
      SIPARIS_YEREL_DEPO_ANAHTARI,
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
          (iptal ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
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

    // afyon_aktif_siparisler_v1: eğer iptal veya tamamlandıysa aktifler listesinden çıkar
    const aktiflerHam = localStorage.getItem('afyon_aktif_siparisler_v1');
    if (aktiflerHam) {
      try {
        const arr = JSON.parse(aktiflerHam);
        if (Array.isArray(arr)) {
          if (tamamlandi) {
            const filtreli = arr.filter(
              (s: any) =>
                s.id !== siparisKimligi &&
                s.kimlik !== siparisKimligi &&
                s.siparis_kodu !== siparisKimligi &&
                s.siparisKodu !== siparisKimligi
            );
            localStorage.setItem('afyon_aktif_siparisler_v1', JSON.stringify(filtreli));
          } else {
            const guncel = arr.map((s: any) => {
              const eslesti =
                s.id === siparisKimligi ||
                s.kimlik === siparisKimligi ||
                s.siparis_kodu === siparisKimligi ||
                s.siparisKodu === siparisKimligi;
              if (!eslesti) return s;
              return { ...s, durum: yeniDurum, asama: yeniDurum };
            });
            localStorage.setItem('afyon_aktif_siparisler_v1', JSON.stringify(guncel));
          }
        }
      } catch {}
    }

    // afyon_son_aktif_siparis temizliği
    if (tamamlandi) {
      const sonAktifHam = localStorage.getItem('afyon_son_aktif_siparis');
      if (sonAktifHam) {
        try {
          const parsed = JSON.parse(sonAktifHam);
          if (
            parsed &&
            (parsed.siparisKodu === siparisKimligi ||
              parsed.id === siparisKimligi ||
              parsed.siparis_kodu === siparisKimligi)
          ) {
            localStorage.removeItem('afyon_son_aktif_siparis');
          }
        } catch {}
      }
    }

    TEST_SIPARISLERI.forEach((s) => {
      if (
        s.id === siparisKimligi ||
        (s as any).kimlik === siparisKimligi ||
        s.siparis_kodu === siparisKimligi
      ) {
        s.durum = yeniDurum as TestSiparis['durum'];
        s.durum_aciklamasi =
          durumAciklamasi ||
          (iptal ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
      }
    });
  } catch {}
}

export function aktifMisafirSiparisSayisiGetir(): number {
  const tumu = yerelSiparisleriGetir();
  return tumu.filter((s) => siparisAktifMi(s.durum)).length;
}
