import {
  OrtakSepet,
  OrtakSepetKatilimci,
  OrtakSepetElemani,
  Yemek,
} from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, belgeSil, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const SABIT_MUSTERI_KIMLIGI = '00000000-0000-0000-0000-000000000001';

// Yerel hafıza desteği
const YEREL_ORTAK_SEPET_ANAHTARI = 'afyon_ortak_sepetler_v1';

function yerelOrtakSepetVerisi(): { sepetler: OrtakSepet[]; katilimcilar: OrtakSepetKatilimci[]; elemanlar: OrtakSepetElemani[] } {
  try {
    const raw = localStorage.getItem(YEREL_ORTAK_SEPET_ANAHTARI);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { sepetler: [], katilimcilar: [], elemanlar: [] };
}

function yerelOrtakSepetKaydet(veri: { sepetler: OrtakSepet[]; katilimcilar: OrtakSepetKatilimci[]; elemanlar: OrtakSepetElemani[] }) {
  try {
    localStorage.setItem(YEREL_ORTAK_SEPET_ANAHTARI, JSON.stringify(veri));
  } catch {}
}

export async function yeniOrtakSepetOlustur(
  olusturanAd: string
): Promise<{ sepet: OrtakSepet; katilimci: OrtakSepetKatilimci } | null> {
  try {
    const sepetKimligi = 'ortak_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const rastgeleKod = 'AFYON-' + Math.floor(1000 + Math.random() * 9000).toString();

    const sepet: OrtakSepet = {
      kimlik: sepetKimligi,
      sepet_kodu: rastgeleKod,
      olusturan_musteri_kimligi: SABIT_MUSTERI_KIMLIGI,
      durum: 'aktif',
      olusturulma_tarihi: new Date().toISOString()
    };

    const katilimciKimligi = 'kat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const katilimci: OrtakSepetKatilimci = {
      kimlik: katilimciKimligi,
      ortak_sepet_kimligi: sepetKimligi,
      katilimci_adi: olusturanAd || 'Grup Lideri',
      katilma_tarihi: new Date().toISOString()
    };

    // Yerel depoya kaydet
    const depo = yerelOrtakSepetVerisi();
    depo.sepetler.push(sepet);
    depo.katilimcilar.push(katilimci);
    yerelOrtakSepetKaydet(depo);

    // Firebase aktifse Firestore'a kaydet
    if (canliFirebaseAktifMi()) {
      await belgeKaydet('ortak_sepetler', sepet.kimlik, sepet);
      await belgeKaydet('ortak_sepet_katilimcilari', katilimci.kimlik, katilimci);
    }

    return { sepet, katilimci };
  } catch (hata) {
    console.warn('Ortak sepet oluşturma hatası:', hata);
    return null;
  }
}

export async function kodaGoreOrtakSepeteKatil(
  sepetKodu: string,
  katilimciAd: string
): Promise<{ sepet: OrtakSepet; katilimci: OrtakSepetKatilimci } | null> {
  try {
    const arananKod = sepetKodu.trim().toUpperCase();
    let sepet: OrtakSepet | null = null;

    if (canliFirebaseAktifMi()) {
      const fbSepetler = await koleksiyonGetir<OrtakSepet>('ortak_sepetler');
      sepet = fbSepetler.find(s => s.sepet_kodu === arananKod && s.durum === 'aktif') || null;
    }

    if (!sepet) {
      const depo = yerelOrtakSepetVerisi();
      sepet = depo.sepetler.find(s => s.sepet_kodu === arananKod && s.durum === 'aktif') || null;
    }

    if (!sepet) {
      console.warn('Ortak sepet bulunamadı');
      return null;
    }

    const katilimci: OrtakSepetKatilimci = {
      kimlik: 'kat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ortak_sepet_kimligi: sepet.kimlik,
      katilimci_adi: katilimciAd || 'Misafir Katılımcı',
      katilma_tarihi: new Date().toISOString()
    };

    const depo = yerelOrtakSepetVerisi();
    depo.katilimcilar.push(katilimci);
    yerelOrtakSepetKaydet(depo);

    if (canliFirebaseAktifMi()) {
      await belgeKaydet('ortak_sepet_katilimcilari', katilimci.kimlik, katilimci);
    }

    return { sepet, katilimci };
  } catch (hata) {
    console.warn('Sepete katılma hatası:', hata);
    return null;
  }
}

export async function ortakSepetDetaylariniGetir(sepetKimligi: string): Promise<{
  katilimcilar: OrtakSepetKatilimci[];
  elemanlar: OrtakSepetElemani[];
}> {
  try {
    if (canliFirebaseAktifMi()) {
      const fbKatilimcilar = await koleksiyonGetir<OrtakSepetKatilimci>('ortak_sepet_katilimcilari');
      const fbElemanlar = await koleksiyonGetir<OrtakSepetElemani>('ortak_sepet_elemanlari');
      
      const filtrelenmisKat = fbKatilimcilar.filter(k => k.ortak_sepet_kimligi === sepetKimligi);
      const filtrelenmisEl = fbElemanlar.filter(e => e.ortak_sepet_kimligi === sepetKimligi);

      if (filtrelenmisKat.length > 0 || filtrelenmisEl.length > 0) {
        return {
          katilimcilar: filtrelenmisKat,
          elemanlar: filtrelenmisEl
        };
      }
    }

    const depo = yerelOrtakSepetVerisi();
    return {
      katilimcilar: depo.katilimcilar.filter(k => k.ortak_sepet_kimligi === sepetKimligi),
      elemanlar: depo.elemanlar.filter(e => e.ortak_sepet_kimligi === sepetKimligi)
    };
  } catch (hata) {
    console.warn('Ortak sepet detay hatası:', hata);
    return { katilimcilar: [], elemanlar: [] };
  }
}

export async function ortakSepeteYemekEklemeIslemi(
  sepetKimligi: string,
  katilimciKimligi: string,
  katilimciAdi: string,
  yemek: Yemek,
  adet: number = 1
): Promise<boolean> {
  try {
    const eleman: OrtakSepetElemani = {
      kimlik: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      ortak_sepet_kimligi: sepetKimligi,
      ekleyen_katilimci_adi: katilimciAdi,
      yemek_kimligi: yemek.id,
      adet,
      birim_fiyat: yemek.fiyat,
      fiyat: yemek.fiyat,
      yemek
    };

    const depo = yerelOrtakSepetVerisi();
    depo.elemanlar.push(eleman);
    yerelOrtakSepetKaydet(depo);

    if (canliFirebaseAktifMi()) {
      await belgeKaydet('ortak_sepet_elemanlari', eleman.kimlik, eleman);
    }

    return true;
  } catch (hata) {
    console.warn('Yemek ekleme hatası:', hata);
    return false;
  }
}

export async function ortakSepettenYemekSilmeIslemi(elemanKimligi: string): Promise<boolean> {
  try {
    const depo = yerelOrtakSepetVerisi();
    depo.elemanlar = depo.elemanlar.filter(e => e.kimlik !== elemanKimligi);
    yerelOrtakSepetKaydet(depo);

    if (canliFirebaseAktifMi()) {
      await belgeSil('ortak_sepet_elemanlari', elemanKimligi);
    }

    return true;
  } catch (hata) {
    console.warn('Yemek silme hatası:', hata);
    return false;
  }
}
