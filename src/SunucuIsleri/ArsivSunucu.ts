import { Router } from 'express';
import http from 'http';
import https from 'https';

const router = Router();
const guvensizHttpsAjan = new https.Agent({ rejectUnauthorized: false });

// Arşivleme için Güvenli Sunucu-Sunucuya Köprü Rotası
router.post('/arsivle', async (req, res) => {
  const { hedefUrl, apiKey, veriPaketi } = req.body;

  if (!hedefUrl || typeof hedefUrl !== 'string' || !hedefUrl.startsWith('http')) {
    return res.status(400).json({ basarili: false, mesaj: 'Geçersiz hedef URL adresi girildi.' });
  }

  try {
    const urlObj = new URL(hedefUrl);
    const isHttps = urlObj.protocol === 'https:';
    const istemciModul = isHttps ? https : http;

    const govdeMetni = JSON.stringify(veriPaketi || {});
    const basliklar: Record<string, any> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(govdeMetni),
      'User-Agent': 'AfyonEvLezzetleri-Yedekleyici/1.0',
    };
    if (apiKey && typeof apiKey === 'string' && apiKey.trim()) {
      basliklar['X-Api-Key'] = apiKey.trim();
    }

    const istekSecenekleri: any = {
      method: 'POST',
      headers: basliklar,
      timeout: 25000,
    };

    if (isHttps) {
      istekSecenekleri.agent = guvensizHttpsAjan;
    }

    const sunucuIstegi = istemciModul.request(urlObj, istekSecenekleri, (sunucuYaniti) => {
      let gelenVeri = '';
      sunucuYaniti.on('data', (p) => (gelenVeri += p));
      sunucuYaniti.on('end', () => {
        const basariliMi = sunucuYaniti.statusCode && sunucuYaniti.statusCode >= 200 && sunucuYaniti.statusCode < 300;
        if (basariliMi) {
          return res.json({
            basarili: true,
            mesaj: 'Yedek paketi sunucuya başarıyla ulaştı!',
            sunucuYaniti: gelenVeri.substring(0, 500)
          });
        } else {
          return res.status(sunucuYaniti.statusCode || 500).json({
            basarili: false,
            mesaj: `Yedekleme sunucusu HTTP ${sunucuYaniti.statusCode} döndürdü: ${gelenVeri.substring(0, 300)}`
          });
        }
      });
    });

    sunucuIstegi.on('timeout', () => {
      sunucuIstegi.destroy();
      return res.status(504).json({ basarili: false, mesaj: 'Yedekleme sunucusu 25 saniye içinde yanıt vermedi (Zaman aşımı).' });
    });

    sunucuIstegi.on('error', (err) => {
      console.error('[Yedekleme Köprü Hatası]:', err);
      return res.status(502).json({ basarili: false, mesaj: `Sunucuya bağlanılamadı: ${err.message}` });
    });

    sunucuIstegi.write(govdeMetni);
    sunucuIstegi.end();
  } catch (error: any) {
    console.error('[Yedekleme Proxy Hatası]:', error);
    return res.status(500).json({ basarili: false, mesaj: `İstek hazırlanamadı: ${error.message}` });
  }
});

export default router;
