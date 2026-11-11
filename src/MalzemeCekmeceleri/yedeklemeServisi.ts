import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface YedeklemeAyarlari {
  hedefUrl: string;
  otomatikYedekleme: boolean;
  otomatikPeriyot?: 'saatlik' | 'gunluk' | 'haftalik';
  sonYedeklemeZamani?: string;
  sonYedeklemeZamaniDamgasi?: number;
  apiKey?: string;
}

const YEREL_YEDEK_AYARLARI_KEY = 'afyon_yedekleme_ayarlari_v1';

export const yedeklemeAyarlariniGetir = (): YedeklemeAyarlari => {
  const varsayilanUrl = 'https://yedek.pazarafyon.com.tr/arsivle.php';
  try {
    const kayitli = localStorage.getItem(YEREL_YEDEK_AYARLARI_KEY);
    if (kayitli) {
      const parsed = JSON.parse(kayitli);
      // Eski afyonevlezzetleri linki kalmışsa veya http ise https'e güncelle
      if (parsed.hedefUrl && (parsed.hedefUrl.includes('afyonevlezzetleri.com.tr') || parsed.hedefUrl.startsWith('http://yedek'))) {
        parsed.hedefUrl = varsayilanUrl;
        localStorage.setItem(YEREL_YEDEK_AYARLARI_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch {}
  return { hedefUrl: varsayilanUrl, otomatikYedekleme: true, otomatikPeriyot: 'gunluk' };
};

export const yedeklemeAyarlariniKaydet = (ayarlar: YedeklemeAyarlari): void => {
  localStorage.setItem(YEREL_YEDEK_AYARLARI_KEY, JSON.stringify(ayarlar));
};

export const otomatikYedeklemeGerekiyorMu = (ayarlar: YedeklemeAyarlari): boolean => {
  if (!ayarlar.otomatikYedekleme || !ayarlar.hedefUrl || !ayarlar.hedefUrl.startsWith('http')) {
    return false;
  }
  if (!ayarlar.sonYedeklemeZamaniDamgasi) {
    return true; // İlk kez çalışıyor
  }
  const gecenSureMs = Date.now() - ayarlar.sonYedeklemeZamaniDamgasi;
  const periyot = ayarlar.otomatikPeriyot || 'gunluk';

  if (periyot === 'saatlik') return gecenSureMs >= 1000 * 60 * 60;
  if (periyot === 'gunluk') return gecenSureMs >= 1000 * 60 * 60 * 24;
  if (periyot === 'haftalik') return gecenSureMs >= 1000 * 60 * 60 * 24 * 7;

  return false;
};

export const tumVeritabaniPaketiniOlustur = async () => {
  const koleksiyonlar = ['mutfaklar', 'yemekler', 'kullanicilar', 'siparisler', 'kategoriler', 'kampanyalar', 'gel_al_subeleri', 'hukuki_onay_loglari', 'sozlesmeler'];
  const paket: Record<string, any[]> = {};
  const ozet: Record<string, number> = {};

  for (const kol of koleksiyonlar) {
    if (canliFirebaseAktifMi()) {
        const veriler = await koleksiyonGetir<any>(kol);
        paket[kol] = veriler || [];
        ozet[kol] = (veriler || []).length;
    }
  }
  return { platform: 'Afyon Ev Lezzetleri', veriPaketi: paket, kayitIstatistikleri: ozet };
};

export const bulutaYedekGonder = async (hedefUrl: string, apiKey?: string): Promise<{ basarili: boolean; mesaj: string }> => {
  if (!hedefUrl || !hedefUrl.startsWith('http')) {
    return { basarili: false, mesaj: 'Lütfen geçerli bir hedef URL adresi giriniz.' };
  }

  const veriPaketi = await tumVeritabaniPaketiniOlustur();

  // 1. Aşama: /api/arsivle köprüsünü dene (Node / Vercel Serverless)
  try {
    const yanit = await fetch('/api/arsivle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hedefUrl: hedefUrl.trim(),
        apiKey: apiKey?.trim() || '',
        veriPaketi,
      }),
    });

    if (yanit.ok) {
      const contentType = yanit.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const sonuc = await yanit.json();
        if (sonuc.basarili) {
          const ayarlar = yedeklemeAyarlariniGetir();
          yedeklemeAyarlariniKaydet({
            ...ayarlar,
            sonYedeklemeZamani: new Date().toLocaleString('tr-TR'),
            sonYedeklemeZamaniDamgasi: Date.now(),
          });
          return {
            basarili: true,
            mesaj: sonuc.mesaj || 'Yedek başarıyla DirectAdmin sunucunuza aktarıldı!'
          };
        }
      }
    }
  } catch (proxyHatasi) {
    console.warn('[Proxy denenirken hata oluştu, doğrudan gönderim deneniyor]:', proxyHatasi);
  }

  // 2. Aşama (Vercel & Statik Barındırma Koruması): Doğrudan Hedef Sunucuya Gönder
  try {
    const dogrudanBasliklar: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey?.trim()) {
      dogrudanBasliklar['X-Api-Key'] = apiKey.trim();
    }

    const dogrudanYanit = await fetch(hedefUrl.trim(), {
      method: 'POST',
      headers: dogrudanBasliklar,
      body: JSON.stringify(veriPaketi),
    });

    if (dogrudanYanit.ok) {
      const ayarlar = yedeklemeAyarlariniGetir();
      yedeklemeAyarlariniKaydet({
        ...ayarlar,
        sonYedeklemeZamani: new Date().toLocaleString('tr-TR'),
        sonYedeklemeZamaniDamgasi: Date.now(),
      });
      return {
        basarili: true,
        mesaj: 'Yedek doğrudan DirectAdmin / Bulut sunucunuza başarıyla iletildi!'
      };
    } else {
      return {
        basarili: false,
        mesaj: `Hedef sunucu yanıtı: HTTP ${dogrudanYanit.status}`
      };
    }
  } catch (dogrudanHata: any) {
    console.error('Doğrudan gönderim hatası:', dogrudanHata);
    return {
      basarili: false,
      mesaj: `Yedekleme iletilemedi. Lütfen sunucu adresini veya CORS ayarlarını kontrol edin: ${dogrudanHata?.message || 'Bağlantı hatası'}`
    };
  }
};
