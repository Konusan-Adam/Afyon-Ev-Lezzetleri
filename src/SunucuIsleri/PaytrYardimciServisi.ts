import crypto from 'crypto';
import type { Request } from 'express';

export interface PaytrAnahtarBilgisi {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  hazirMi: boolean;
  eksikler: string[];
}

export function paytrAnahtarlariniOku(): PaytrAnahtarBilgisi {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim() || '';
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim() || '';
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim() || '';

  const eksikler: string[] = [];
  if (!merchantId || merchantId.startsWith('MY_')) eksikler.push('PAYTR_MERCHANT_ID');
  if (!merchantKey || merchantKey.startsWith('MY_')) eksikler.push('PAYTR_MERCHANT_KEY');
  if (!merchantSalt || merchantSalt.startsWith('MY_')) eksikler.push('PAYTR_MERCHANT_SALT');

  return {
    merchantId,
    merchantKey,
    merchantSalt,
    hazirMi: eksikler.length === 0,
    eksikler,
  };
}

export function paytrOidUret(): string {
  const rastgele = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AFY${Date.now()}${rastgele}`;
}

export function istemciIpAl(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ham = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  const ip = (ham || req.socket.remoteAddress || '127.0.0.1').trim();
  return ip === '::1' || ip.startsWith('::ffff:') ? '127.0.0.1' : ip;
}

export function uygulamaUrlAl(req: Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl && !envUrl.startsWith('MY_')) return envUrl.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

export function paytrSepetKodla(sepet: Array<{ ad?: string; baslik?: string; fiyat?: number; adet?: number }>): string {
  const kalemler = (sepet || []).map((u) => [
    String(u.baslik || u.ad || 'Ev Lezzeti').slice(0, 80),
    Number(u.fiyat || 0).toFixed(2),
    Math.max(1, Number(u.adet || 1)),
  ]);
  if (kalemler.length === 0) kalemler.push(['Afyon Ev Lezzetleri Siparisi', '1.00', 1]);
  return Buffer.from(JSON.stringify(kalemler)).toString('base64');
}

export function paytrCallbackDogrula(
  merchantOid: string,
  status: string,
  totalAmount: string,
  gelenHash: string
): boolean {
  const { merchantKey, merchantSalt, hazirMi } = paytrAnahtarlariniOku();
  if (!hazirMi || !gelenHash) return false;
  const beklenen = crypto
    .createHmac('sha256', merchantKey)
    .update(`${merchantOid}${merchantSalt}${status}${totalAmount}`)
    .digest('base64');
  const a = Buffer.from(beklenen);
  const b = Buffer.from(gelenHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
