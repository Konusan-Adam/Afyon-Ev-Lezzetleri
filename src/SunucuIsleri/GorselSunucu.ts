import { Router } from 'express';
import https from 'https';
import FormData from 'form-data';

const router = Router();
const guvensizHttpsAjan = new https.Agent({ rejectUnauthorized: false });

// Görsel Yükleme için Güvenli Sunucu Köprüsü
router.post('/gorsel-yukle', async (req, res) => {
  const { resimBase64, dosyaAdi, klasor = 'yemekler' } = req.body;

  if (!resimBase64 || typeof resimBase64 !== 'string') {
    return res.status(400).json({ basarili: false, hata: 'Resim verisi eksik veya geçersiz.' });
  }

  try {
    // Base64 başlığını temizle
    const safBase64 = resimBase64.includes(',') ? resimBase64.split(',')[1] : resimBase64;
    const resimTampon = Buffer.from(safBase64, 'base64');
    const nihaiDosyaAdi = dosyaAdi || `afyon_${klasor}_${Date.now()}.webp`;

    const form = new FormData();
    form.append('dosya', resimTampon, {
      filename: nihaiDosyaAdi,
      contentType: 'image/webp',
    });
    form.append('klasor', klasor);

    const formHeaders = form.getHeaders();

    form.getLength((err, length) => {
      if (!err && length) {
        formHeaders['Content-Length'] = length;
      }

      const sunucuIstegi = https.request(
        'https://yedek.pazarafyon.com.tr/yukle.php',
        {
          method: 'POST',
          agent: guvensizHttpsAjan,
          headers: formHeaders,
        },
        (sunucuYaniti) => {
          let gelenVeri = '';
          sunucuYaniti.on('data', (parca) => (gelenVeri += parca));
          sunucuYaniti.on('end', () => {
            try {
              const ayrilmisYanit = JSON.parse(gelenVeri);
              const basariliMi = ayrilmisYanit && (ayrilmisYanit.basarili === true || ayrilmisYanit.durum === 'basarili') && ayrilmisYanit.url;
              if (basariliMi) {
                const altYol = ayrilmisYanit.url.replace(/^https?:\/\/yedek\.pazarafyon\.com\.tr\/uploads\//, '') || nihaiDosyaAdi;
                return res.json({
                  basarili: true,
                  url: ayrilmisYanit.url,
                  yerelUrl: `/api/uploads/${altYol}`,
                  klasor: ayrilmisYanit.klasor || klasor,
                  dosyaAdi: ayrilmisYanit.dosyaAdi || nihaiDosyaAdi,
                  mesaj: ayrilmisYanit.mesaj || 'Görsel sunucuya başarıyla yüklendi.'
                });
              } else {
                return res.status(500).json({
                  basarili: false,
                  hata: ayrilmisYanit?.hata || 'Sunucu görseli kaydetmedi: ' + gelenVeri
                });
              }
            } catch (ayristirmaHatasi) {
              console.error('[Görsel Yanıt Ayrıştırma Hatası]:', gelenVeri);
              return res.status(500).json({
                basarili: false,
                hata: 'Sunucudan geçersiz yanıt alındı: ' + gelenVeri.substring(0, 150)
              });
            }
          });
        }
      );

      sunucuIstegi.on('error', (istekHatasi) => {
        console.error('[Sunucu İstek Hatası]:', istekHatasi);
        return res.status(502).json({
          basarili: false,
          hata: 'DirectAdmin sunucusuna bağlanılamadı: ' + istekHatasi.message
        });
      });

      form.pipe(sunucuIstegi);
    });
  } catch (genelHata: any) {
    console.error('[Görsel Köprü Hatası]:', genelHata);
    return res.status(500).json({ basarili: false, hata: genelHata.message });
  }
});

// Yüklenen Görselleri Güvenli Sunma Köprüsü
router.get('/uploads/*', (req, res) => {
  const altYol = (req.params as Record<string, string>)[0];
  if (!altYol || altYol.includes('..')) {
    return res.status(400).send('Geçersiz dosya adı.');
  }

  const hedefGorselUrl = `https://yedek.pazarafyon.com.tr/uploads/${altYol}`;

  const istek = https.get(hedefGorselUrl, { agent: guvensizHttpsAjan }, (yanit) => {
    if (yanit.statusCode === 200) {
      res.setHeader('Content-Type', yanit.headers['content-type'] || 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
      yanit.pipe(res);
    } else {
      res.status(yanit.statusCode || 404).send('Görsel bulunamadı.');
    }
  });

  istek.on('error', (err) => {
    console.error('[Görsel Getirme Hatası]:', err);
    res.status(502).send('Görsele ulaşılamadı.');
  });
});

export default router;
