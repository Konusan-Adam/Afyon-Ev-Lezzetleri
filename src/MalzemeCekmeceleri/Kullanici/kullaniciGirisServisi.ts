import { Kullanici } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeGetir, belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { testKullaniciDogrula } from '@/src/veritabani/CanliVeriYardimcisi';
import { telefonGecerliMi } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { kullaniciBelgeIdOlustur, telefonStandartCekirdek } from './telefonYardimcisi';

export const PERSONEL_HESABI_UYARISI =
  'Bu bilgiler bir personel hesabına aittir. Sipariş vermek için lütfen müşteri kaydı oluşturun.';

type GuvenlikliKullanici = Kullanici & {
  sifre?: string;
  guvenlik_sorusu?: string;
  guvenlik_cevabi?: string;
};

export type MusteriGirisYaniti =
  | { basarili: true; kullanici: Kullanici }
  | { basarili: false; sebep: 'personel_hesabi' | 'hatali_bilgi' | 'gecersiz_giris'; mesaj: string };

export type GuvenlikSorusuYaniti =
  | { durum: 'bulundu'; kimlik: string; soru: string }
  | { durum: 'personel_hesabi'; mesaj: string }
  | { durum: 'bulunamadi'; mesaj: string };

async function musteriKaydiniGetir(
  telefon: string
): Promise<{ musteri: GuvenlikliKullanici | null; personelVarMi: boolean }> {
  const standartTelefon = telefonStandartCekirdek(telefon);
  const standartMusteriId = kullaniciBelgeIdOlustur(telefon, 'musteri');

  // 1. Öncelik: doğrudan <telefon>_musteri dokümanı (ör. 05551234567_musteri)
  const dogrudanKayit = await belgeGetir<GuvenlikliKullanici>('kullanicilar', standartMusteriId);
  if (dogrudanKayit && dogrudanKayit.rol === 'musteri') {
    return { musteri: dogrudanKayit, personelVarMi: false };
  }

  // 2. Fallback: eski formatlı müşteri kaydı veya personel rolü tespiti
  const tumKullanicilar = await koleksiyonGetir<GuvenlikliKullanici>('kullanicilar');
  const eslesenler = tumKullanicilar.filter(
    (k) => telefonStandartCekirdek(k.telefon || '') === standartTelefon
  );
  const eskiMusteri = eslesenler.find((k) => k.rol === 'musteri') || null;
  const personelVarMi = eslesenler.some((k) => Boolean(k.rol && k.rol !== 'musteri'));

  return { musteri: eskiMusteri, personelVarMi };
}

export async function musteriGirisKontrolEt(
  telefon: string,
  sifre: string
): Promise<MusteriGirisYaniti> {
  const dogrulama = telefonGecerliMi(telefon);
  if (!dogrulama.gecerli) {
    return {
      basarili: false,
      sebep: 'gecersiz_giris',
      mesaj: dogrulama.hata || 'Lütfen geçerli bir cep telefonu numarası giriniz.',
    };
  }

  const standartTelefon = telefonStandartCekirdek(telefon);
  const girilenSifre = sifre.trim();
  if (!girilenSifre) {
    return {
      basarili: false,
      sebep: 'gecersiz_giris',
      mesaj: 'Lütfen şifrenizi giriniz.',
    };
  }

  if (canliFirebaseAktifMi()) {
    try {
      const { musteri, personelVarMi } = await musteriKaydiniGetir(telefon);
      if (musteri) {
        const kayitliSifre = musteri.sifre?.trim();
        if (!kayitliSifre || kayitliSifre !== girilenSifre) {
          return {
            basarili: false,
            sebep: 'hatali_bilgi',
            mesaj: 'Giriş başarısız. Telefon numaranızı veya şifrenizi kontrol ediniz.',
          };
        }
        return { basarili: true, kullanici: musteri };
      }

      if (personelVarMi) {
        return {
          basarili: false,
          sebep: 'personel_hesabi',
          mesaj: PERSONEL_HESABI_UYARISI,
        };
      }

      return {
        basarili: false,
        sebep: 'hatali_bilgi',
        mesaj: 'Giriş başarısız. Telefon numaranızı veya şifrenizi kontrol ediniz.',
      };
    } catch (hata) {
      console.warn('Firebase kullanıcı giriş okuma hatası:', hata);
    }
  }

  const testKaydi = testKullaniciDogrula(standartTelefon, girilenSifre) as Kullanici | null;
  if (testKaydi) {
    if (testKaydi.rol !== 'musteri') {
      return {
        basarili: false,
        sebep: 'personel_hesabi',
        mesaj: PERSONEL_HESABI_UYARISI,
      };
    }
    return { basarili: true, kullanici: testKaydi };
  }

  return {
    basarili: false,
    sebep: 'hatali_bilgi',
    mesaj: 'Giriş başarısız. Telefon numaranızı veya şifrenizi kontrol ediniz.',
  };
}

export async function veritabanindanKullaniciGirisYaptir(
  telefon: string,
  sifre: string
): Promise<Kullanici | null> {
  const sonuc = await musteriGirisKontrolEt(telefon, sifre);
  return sonuc.basarili ? sonuc.kullanici : null;
}

export async function kullaniciGuvenlikSorusuGetir(
  telefon: string
): Promise<GuvenlikSorusuYaniti> {
  const dogrulama = telefonGecerliMi(telefon);
  if (!dogrulama.gecerli) {
    return {
      durum: 'bulunamadi',
      mesaj: dogrulama.hata || 'Lütfen geçerli bir cep telefonu numarası giriniz.',
    };
  }

  if (canliFirebaseAktifMi()) {
    try {
      const { musteri, personelVarMi } = await musteriKaydiniGetir(telefon);
      if (musteri) {
        if (musteri.guvenlik_sorusu?.trim()) {
          return {
            durum: 'bulundu',
            kimlik: musteri.id || musteri.kimlik || kullaniciBelgeIdOlustur(telefon, 'musteri'),
            soru: musteri.guvenlik_sorusu.trim(),
          };
        }
        return {
          durum: 'bulunamadi',
          mesaj: 'Bu müşteri hesabında kayıtlı bir güvenlik sorusu bulunamadı.',
        };
      }

      if (personelVarMi) {
        return {
          durum: 'personel_hesabi',
          mesaj: PERSONEL_HESABI_UYARISI,
        };
      }
    } catch (hata) {
      console.warn('Güvenlik sorusu getirme hatası:', hata);
    }
  }

  return {
    durum: 'bulunamadi',
    mesaj: 'Bu telefon numarasına ait aktif bir müşteri hesabı veya güvenlik sorusu bulunamadı.',
  };
}

export async function sifreSifirlaGuvenlikSorusuIle(
  telefon: string,
  cevap: string,
  yeniSifre: string
): Promise<boolean> {
  const dogrulama = telefonGecerliMi(telefon);
  if (!dogrulama.gecerli || !cevap.trim() || yeniSifre.trim().length < 4) return false;

  const girilenCevap = cevap.trim().toLowerCase();
  const yeniSifreTemiz = yeniSifre.trim();

  if (canliFirebaseAktifMi()) {
    try {
      const { musteri } = await musteriKaydiniGetir(telefon);
      if (musteri && musteri.guvenlik_cevabi?.trim()) {
        if (musteri.guvenlik_cevabi.trim().toLowerCase() === girilenCevap) {
          const kimlikId =
            musteri.id || musteri.kimlik || kullaniciBelgeIdOlustur(telefon, 'musteri');
          return await belgeKaydet('kullanicilar', kimlikId, {
            ...musteri,
            sifre: yeniSifreTemiz,
          });
        }
      }
    } catch (hata) {
      console.warn('Şifre sıfırlama hatası:', hata);
    }
  }

  return false;
}
