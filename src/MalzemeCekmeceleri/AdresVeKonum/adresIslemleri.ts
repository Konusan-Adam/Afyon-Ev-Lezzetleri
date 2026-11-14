import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, belgeSil, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const YEREL_ADRES_ANAHTARI = 'afyon_kayitli_adresler_v1';

function yerelAdresleriYukle(): MusteriAdresi[] {
  try {
    const ham = localStorage.getItem(YEREL_ADRES_ANAHTARI);
    if (ham) {
      const parsed = JSON.parse(ham);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

function yerelAdresleriKaydet(adresler: MusteriAdresi[]) {
  try {
    localStorage.setItem(YEREL_ADRES_ANAHTARI, JSON.stringify(adresler));
  } catch {}
}

let geciciAdresDeposu: MusteriAdresi[] = yerelAdresleriYukle();

export async function veritabanindanAdresleriGetir(musteriKimligi: string): Promise<MusteriAdresi[]> {
  if (canliFirebaseAktifMi()) {
    try {
      const fbAdresler = await koleksiyonGetir<MusteriAdresi>('musteri_adresleri');
      if (fbAdresler && Array.isArray(fbAdresler)) {
        const filtrelenmis = fbAdresler.filter((a) => {
          if (!musteriKimligi || musteriKimligi === 'misafir') {
            return !a.musteri_kimligi || a.musteri_kimligi === 'misafir';
          }
          return a.musteri_kimligi === musteriKimligi;
        });

        // Firebase'den kullanıcıya özel adresler geldiyse yerel önbelleği güncelle
        if (filtrelenmis.length > 0) {
          geciciAdresDeposu = filtrelenmis;
          yerelAdresleriKaydet(filtrelenmis);
        }
        return filtrelenmis;
      }
    } catch (hata) {
      console.warn('Firebase adres çekme hatası:', hata);
    }
  }

  // Çevrimdışı yedek
  return geciciAdresDeposu.filter((a) => !a.musteri_kimligi || a.musteri_kimligi === musteriKimligi);
}

export async function veritabaninaYeniAdresEkle(
  yeniAdres: Omit<MusteriAdresi, 'kimlik' | 'olusturma_tarihi'>
): Promise<MusteriAdresi | null> {
  const kimlik = `adr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const olusturulan: MusteriAdresi = {
    ...yeniAdres,
    id: kimlik,
    kimlik,
    olusturma_tarihi: new Date().toISOString()
  };

  if (olusturulan.varsayilan_mi) {
    geciciAdresDeposu.forEach((a) => (a.varsayilan_mi = false));
  }

  geciciAdresDeposu.push(olusturulan);
  yerelAdresleriKaydet(geciciAdresDeposu);

  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('musteri_adresleri', kimlik, olusturulan);
    } catch (hata) {
      console.warn('Firebase adres ekleme hatası:', hata);
    }
  }

  return olusturulan;
}

export async function veritabanindaVarsayilanAdresYap(
  musteriKimligi: string,
  adresKimligi: string
): Promise<boolean> {
  geciciAdresDeposu.forEach((a) => {
    a.varsayilan_mi = a.kimlik === adresKimligi || a.id === adresKimligi;
  });
  yerelAdresleriKaydet(geciciAdresDeposu);

  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('musteri_adresleri', adresKimligi, { varsayilan_mi: true });
    } catch (hata) {
      console.warn('Firebase varsayılan adres güncelleme hatası:', hata);
    }
  }

  return true;
}

export function yerelAdresleriSifirla() {
  geciciAdresDeposu = [];
  yerelAdresleriKaydet([]);
}

export async function veritabanindanAdresSil(adresKimligi: string): Promise<boolean> {
  console.log('veritabanindanAdresSil çağrıldı, adresKimligi:', adresKimligi);

  // Yerel depodan temizle
  geciciAdresDeposu = geciciAdresDeposu.filter((a) => {
    const id = a.kimlik || a.id;
    return id !== adresKimligi;
  });
  yerelAdresleriKaydet(geciciAdresDeposu);

  // Misafir deposundan da temizle
  try {
    const misafirAdresHam = localStorage.getItem('afyon_misafir_secili_adres');
    if (misafirAdresHam) {
      const parsed = JSON.parse(misafirAdresHam);
      if (parsed?.kimlik === adresKimligi || parsed?.id === adresKimligi) {
        localStorage.removeItem('afyon_misafir_secili_adres');
      }
    }
  } catch {}

  // Firebase koleksiyonundan sil
  if (canliFirebaseAktifMi()) {
    try {
      await belgeSil('musteri_adresleri', adresKimligi);
      console.log('Firebase adres silme başarılı');
    } catch (hata) {
      console.error('Firebase adres silme hatası:', hata);
    }
  }

  return true;
}
