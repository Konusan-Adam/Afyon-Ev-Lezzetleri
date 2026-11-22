import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Kullanici } from '@/src/veritabani/VeriTipleri';
import { auth, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { telefonGecerliMi } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { veritabaninaKullaniciKaydet } from './kullaniciKayitServisi';
import { PERSONEL_HESABI_UYARISI } from './kullaniciGirisServisi';

export interface GoogleKullaniciTaslagi {
  uid: string;
  adSoyad: string;
  eposta: string;
  telefon?: string;
}

export type GoogleGirisSonucu =
  | { durum: 'giris_basarili'; kullanici: Kullanici }
  | { durum: 'telefon_gerekli'; taslak: GoogleKullaniciTaslagi }
  | { durum: 'hata'; hataMesaji: string };

export async function googleIleOturumAc(): Promise<GoogleGirisSonucu> {
  if (!canliFirebaseAktifMi()) {
    return { durum: 'hata', hataMesaji: 'Google ile giriş için canlı bağlantı yapılandırması bulunamadı.' };
  }

  try {
    const saglayici = new GoogleAuthProvider();
    const sonuc = await signInWithPopup(auth, saglayici);
    const user = sonuc.user;

    if (!user || !user.email) {
      return { durum: 'hata', hataMesaji: 'Google hesabından kullanıcı bilgisi alınamadı.' };
    }

    const epostaTemiz = user.email.trim().toLowerCase();
    const tumKullanicilar = await koleksiyonGetir<Kullanici>('kullanicilar');
    const eslesenler = tumKullanicilar.filter(
      (k) =>
        (k.firebase_uid && k.firebase_uid === user.uid) ||
        (k.eposta && k.eposta.trim().toLowerCase() === epostaTemiz)
    );

    const mevcutMusteri = eslesenler.find((k) => k.rol === 'musteri');
    if (mevcutMusteri && telefonGecerliMi(mevcutMusteri.telefon).gecerli) {
      return { durum: 'giris_basarili', kullanici: mevcutMusteri };
    }

    const personelKaydi = eslesenler.find((k) => k.rol && k.rol !== 'musteri');
    if (!mevcutMusteri && personelKaydi) {
      return {
        durum: 'hata',
        hataMesaji: PERSONEL_HESABI_UYARISI,
      };
    }

    return {
      durum: 'telefon_gerekli',
      taslak: {
        uid: user.uid,
        adSoyad: user.displayName?.trim() || '',
        eposta: user.email.trim(),
        telefon: user.phoneNumber || '',
      },
    };
  } catch (hata: any) {
    const kod = hata?.code || '';
    if (kod === 'auth/popup-closed-by-user' || kod === 'auth/cancelled-popup-request') {
      return { durum: 'hata', hataMesaji: 'Google giriş penceresi kapatıldı.' };
    }
    if (kod === 'auth/popup-blocked') {
      return { durum: 'hata', hataMesaji: 'Tarayıcı açılır pencereyi engelledi. Lütfen izin verip tekrar deneyiniz.' };
    }
    console.warn('Google giriş hatası:', hata);
    return { durum: 'hata', hataMesaji: 'Google ile giriş yapılamadı. Lütfen tekrar deneyiniz.' };
  }
}

export async function googleKaydiniTamamla(bilgiler: {
  uid: string;
  adSoyad: string;
  eposta: string;
  telefon: string;
  guvenlikSorusu?: string;
  guvenlikCevabi?: string;
}): Promise<Kullanici | null> {
  return veritabaninaKullaniciKaydet({
    firebase_uid: bilgiler.uid,
    ad_soyad: bilgiler.adSoyad.trim(),
    telefon: bilgiler.telefon.trim(),
    eposta: bilgiler.eposta.trim(),
    rol: 'musteri',
    guvenlik_sorusu: bilgiler.guvenlikSorusu || '',
    guvenlik_cevabi: bilgiler.guvenlikCevabi || '',
  });
}
