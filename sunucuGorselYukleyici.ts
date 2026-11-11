/**
 * Afyon Ev Lezzetleri — Sunucu Görsel Yükleyici Servisi
 * Bu servis, seçilen görselleri istemci tarafında WebP formatına sıkıştırıp
 * Abi'nin cPanel sunucusuna (yedek.pazarafyon.com.tr/yukle.php) doğrudan FormData ile POST eder.
 * Ağ engeli durumunda yerel /api/gorsel-yukle köprüsü üzerinden iletir.
 * uploads/yemekler/ ve uploads/kategoriler/ klasör mimarisini tam destekler.
 */

export type GorselKlasorTipi = 'yemekler' | 'kategoriler' | 'afisler' | 'mutfaklar' | 'belgeler';

export interface YuklemeSonucu {
  basarili: boolean;
  url?: string;
  klasor?: string;
  dosyaAdi?: string;
  hata?: string;
}

/**
 * Dosyanın bir görsel olup olmadığını MIME veya uzantıdan doğrular.
 */
function dosyaGorselMi(dosya: File): boolean {
  if (dosya.type && dosya.type.startsWith('image/')) return true;
  const isim = (dosya.name || '').toLowerCase();
  return /\.(jpe?g|png|webp|gif|bmp|heic|heif|avif)$/i.test(isim);
}

/**
 * Görsel URL'sini tarayıcıda SSL ve karma içerik sorunlarına takılmadan
 * güvenli bir şekilde görüntülenecek yerel köprüye veya orijinal adrese dönüştürür.
 */
export function gorselUrlGuvenliYap(url?: string): string {
  if (!url) return '';
  if (url.includes('yedek.pazarafyon.com.tr/uploads/')) {
    const parcalar = url.split('yedek.pazarafyon.com.tr/uploads/');
    if (parcalar[1]) {
      return `/api/uploads/${parcalar[1]}`;
    }
  }
  return url;
}

/**
 * Görseli istemci tarafında WebP formatına dönüştürüp doğrudan cPanel sunucusuna aktarır.
 */
export async function sunucuyaGorselYukle(
  dosya: File,
  klasor: GorselKlasorTipi = 'yemekler'
): Promise<YuklemeSonucu> {
  if (!dosyaGorselMi(dosya)) {
    return { basarili: false, hata: 'Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP).' };
  }

  // 1. Görseli optimize et (Canvas -> WebP Blob & Base64)
  const optimizasyonSonucu = await new Promise<{ blob: Blob; veriUrl: string; dosyaAdi: string } | null>((resolve) => {
    const okuyucu = new FileReader();
    okuyucu.onload = (e) => {
      const hamVeri = e.target?.result as string;
      const resim = new Image();

      resim.onload = () => {
        const maxBoyut = klasor === 'afisler' ? 1200 : 800;
        let genislik = resim.width;
        let yukseklik = resim.height;

        if (genislik > maxBoyut || yukseklik > maxBoyut) {
          if (genislik > yukseklik) {
            yukseklik = Math.round((yukseklik * maxBoyut) / genislik);
            genislik = maxBoyut;
          } else {
            genislik = Math.round((genislik * maxBoyut) / yukseklik);
            yukseklik = maxBoyut;
          }
        }

        const tuval = document.createElement('canvas');
        tuval.width = genislik;
        tuval.height = yukseklik;
        const ctx = tuval.getContext('2d');

        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(resim, 0, 0, genislik, yukseklik);

        const optimizeDosyaAdi = `afyon_${klasor}_${Date.now()}.webp`;
        const veriUrl = tuval.toDataURL('image/webp', 0.85);

        tuval.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, veriUrl, dosyaAdi: optimizeDosyaAdi });
            } else {
              resolve(null);
            }
          },
          'image/webp',
          0.85
        );
      };

      resim.onerror = () => resolve(null);
      resim.src = hamVeri;
    };

    okuyucu.onerror = () => resolve(null);
    okuyucu.readAsDataURL(dosya);
  });

  const yuklenecekDosya = optimizasyonSonucu?.blob || dosya;
  const nihaiDosyaAdi = optimizasyonSonucu?.dosyaAdi || `afyon_${klasor}_${Date.now()}_${dosya.name}`;
  const base64Verisi = optimizasyonSonucu?.veriUrl;

  // 2. YÖNTEM A: Doğrudan cPanel sunucusuna POST (CORS aktif ve hızlı)
  try {
    const formVerisi = new FormData();
    formVerisi.append('dosya', yuklenecekDosya, nihaiDosyaAdi);
    formVerisi.append('klasor', klasor);

    const dogrudanYanit = await fetch('https://yedek.pazarafyon.com.tr/yukle.php', {
      method: 'POST',
      body: formVerisi,
    });

    if (dogrudanYanit.ok) {
      const ayrilmis = await dogrudanYanit.json();
      const basarili = (ayrilmis.basarili === true || ayrilmis.durum === 'basarili') && ayrilmis.url;
      if (basarili) {
        return {
          basarili: true,
          url: ayrilmis.url,
          klasor: ayrilmis.klasor || klasor,
          dosyaAdi: ayrilmis.dosyaAdi || nihaiDosyaAdi,
        };
      }
    }
  } catch (dogrudanHata) {
    console.warn('Doğrudan cPanel yüklemesi başarısız, güvenli yerel köprü deneniyor:', dogrudanHata);
  }

  // 3. YÖNTEM B: Yerel Express Köprüsü (/api/gorsel-yukle) üzerinden cPanel'e aktar
  if (base64Verisi) {
    try {
      const kopruYaniti = await fetch('/api/gorsel-yukle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resimBase64: base64Verisi,
          dosyaAdi: nihaiDosyaAdi,
          klasor,
        }),
      });

      if (kopruYaniti.ok) {
        const kopruJson = await kopruYaniti.json();
        const basarili = (kopruJson.basarili === true || kopruJson.durum === 'basarili') && (kopruJson.url || kopruJson.yerelUrl);
        if (basarili) {
          return {
            basarili: true,
            url: kopruJson.url || kopruJson.yerelUrl,
            klasor: kopruJson.klasor || klasor,
            dosyaAdi: kopruJson.dosyaAdi || nihaiDosyaAdi,
          };
        }
      }
    } catch (kopruHatasi) {
      console.error('Yerel köprü üzerinden görsel aktarımı başarısız oldu:', kopruHatasi);
    }
  }

  // Her iki yol da başarısız olursa kullanıcıya gerçek hatayı bildir
  return {
    basarili: false,
    hata: 'Görsel yedek.pazarafyon.com.tr sunucusuna yüklenemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.',
  };
}
