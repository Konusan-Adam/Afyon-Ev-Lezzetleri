import type { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import http from 'http';

const guvensizHttpsAjan = new https.Agent({ rejectUnauthorized: false });

export default async function handler(req: any, res: any) {
  // CORS Başlıkları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Api-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ basarili: false, mesaj: 'Yalnızca POST istekleri kabul edilir.' });
  }

  const { hedefUrl, apiKey, veriPaketi } = req.body || {};

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
      'User-Agent': 'AfyonEvLezzetleri-Vercel-Yedekleyici/1.0',
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
          return res.status(200).json({
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
      return res.status(504).json({ basarili: false, mesaj: 'Yedekleme sunucusu zaman aşımına uğradı.' });
    });

    sunucuIstegi.on('error', (err) => {
      return res.status(502).json({ basarili: false, mesaj: `Sunucuya bağlanılamadı: ${err.message}` });
    });

    sunucuIstegi.write(govdeMetni);
    sunucuIstegi.end();
  } catch (error: any) {
    return res.status(500).json({ basarili: false, mesaj: `İstek hatası: ${error.message}` });
  }
}
