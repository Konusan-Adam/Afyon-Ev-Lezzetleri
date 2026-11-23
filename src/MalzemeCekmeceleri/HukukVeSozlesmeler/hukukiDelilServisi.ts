import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { canliFirebaseAktifMi, firebaseVeritabani } from '@/src/veritabani/FirebaseIstemcisi';
import { HukukiOnayLogu, HukukiIslemTuru } from './tipler';
import { sunucuZamanDamgasiAl, tarayiciSha256Hesapla } from './zamanDamgasiIstemcisi';

const YEREL_LOGLAR_ANAHTARI = 'afyon_hukuki_onay_loglari_v2';

export type HukukiLogGirdisi = Omit<
  HukukiOnayLogu,
  'kimlik' | 'tarihSaat' | 'ipAdresi' | 'cihazBilgisi'
> & {
  sozlesmeIcerik?: string;
};

export interface KritikDamgaSonucu {
  logKimlik: string;
  sunucuUtc: string;
  ozetHash: string;
  damgaDurumu: 'rfc3161_onayli' | 'sunucu_muhurlu' | 'yerel_ozet';
  tsaSaglayici: string;
}

function tanimsizlariTemizle<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const temiz: Record<string, unknown> = {};
  for (const anahtar of Object.keys(obj)) {
    if (obj[anahtar] !== undefined) {
      temiz[anahtar] = obj[anahtar];
    }
  }
  return temiz;
}

function yerelLogListesiniGuncelle(yeniLog: HukukiOnayLogu) {
  if (typeof localStorage === 'undefined') return;
  try {
    const ham = localStorage.getItem(YEREL_LOGLAR_ANAHTARI);
    const liste: HukukiOnayLogu[] = ham ? JSON.parse(ham) : [];
    const filtrelenmis = liste.filter((l) => l.kimlik !== yeniLog.kimlik);
    filtrelenmis.unshift(yeniLog);
    if (filtrelenmis.length > 500) filtrelenmis.pop();
    localStorage.setItem(YEREL_LOGLAR_ANAHTARI, JSON.stringify(filtrelenmis));
  } catch (hata) {
    console.warn('Yerel hukuki log güncellenemedi:', hata);
  }
}

export async function hukukiDelilMuhurle(
  girdi: HukukiLogGirdisi,
  ozelLogKimlik?: string
): Promise<HukukiOnayLogu> {
  const kimlik =
    ozelLogKimlik ||
    'log_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6);
  const cihazBilgisi =
    typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 120) : 'Sunucu';

  const { sozlesmeIcerik, ...logAlanlari } = girdi;
  const sozlesmeMetinHash = sozlesmeIcerik
    ? await tarayiciSha256Hesapla(sozlesmeIcerik)
    : logAlanlari.sozlesmeMetinHash;

  const damga = await sunucuZamanDamgasiAl(logAlanlari.islemTuru, {
    kimlik,
    sozlesmeTuru: logAlanlari.sozlesmeTuru,
    sozlesmeVersiyonu: logAlanlari.sozlesmeVersiyonu,
    sozlesmeMetinHash,
    kullaniciKimlik: logAlanlari.kullaniciKimlik,
    kullaniciTelefon: logAlanlari.kullaniciTelefon,
    kullaniciAdSoyad: logAlanlari.kullaniciAdSoyad,
    ilgiliKayitId: logAlanlari.ilgiliKayitId,
    onaylandiMi: logAlanlari.onaylandiMi,
    ekDetay: logAlanlari.ekDetay,
  });

  const muhurluLog: HukukiOnayLogu = {
    ...logAlanlari,
    kimlik,
    tarihSaat: damga.sunucuYerelTr,
    sunucuUtc: damga.sunucuUtc,
    ipAdresi: damga.ipAdresi,
    cihazBilgisi,
    ozetHash: damga.ozetHash,
    sozlesmeMetinHash,
    tsaSaglayici: damga.tsaSaglayici,
    tsaTokenBase64: damga.tsaTokenBase64,
    damgaDurumu: damga.damgaDurumu,
    sunucuImzasi: damga.sunucuImzasi,
  };

  yerelLogListesiniGuncelle(muhurluLog);

  if (canliFirebaseAktifMi()) {
    try {
      const belgeVerisi = tanimsizlariTemizle({
        ...muhurluLog,
        sunucuKayitZamani: serverTimestamp(),
      });
      await setDoc(doc(firebaseVeritabani, 'hukuki_onay_loglari', kimlik), belgeVerisi);
    } catch (hata) {
      console.warn('Firestore hukuki delil kaydı uyarısı:', hata);
    }
  }

  return muhurluLog;
}

export async function kritikOlayDamgala(param: {
  islemTuru: HukukiIslemTuru;
  sozlesmeTuru: string;
  ilgiliKayitId: string;
  kullaniciKimlik?: string;
  kullaniciTelefon?: string;
  kullaniciAdSoyad?: string;
  ekDetay?: Record<string, unknown>;
}): Promise<KritikDamgaSonucu> {
  const log = await hukukiDelilMuhurle({
    sozlesmeTuru: param.sozlesmeTuru,
    sozlesmeVersiyonu: '1.0.0',
    islemTuru: param.islemTuru,
    kullaniciKimlik: param.kullaniciKimlik,
    kullaniciTelefon: param.kullaniciTelefon,
    kullaniciAdSoyad: param.kullaniciAdSoyad,
    ilgiliKayitId: param.ilgiliKayitId,
    ekDetay: param.ekDetay,
    onaylandiMi: true,
  });

  return {
    logKimlik: log.kimlik,
    sunucuUtc: log.sunucuUtc || new Date().toISOString(),
    ozetHash: log.ozetHash || '',
    damgaDurumu: log.damgaDurumu || 'yerel_ozet',
    tsaSaglayici: log.tsaSaglayici || '',
  };
}
