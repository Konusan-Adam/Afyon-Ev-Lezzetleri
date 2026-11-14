import crypto from 'crypto';
import { paytrAnahtarlariniOku, paytrSepetKodla } from './PaytrYardimciServisi';

export interface PaytrTokenGirdisi {
  merchantOid: string;
  userIp: string;
  email: string;
  tutarKurus: number;
  adSoyad: string;
  adres: string;
  telefon: string;
  sepet: Array<{ ad?: string; baslik?: string; fiyat?: number; adet?: number }>;
  testModu: boolean;
  taksitAktif: boolean;
  maksimumTaksit: number;
  basariliUrl: string;
  hataliUrl: string;
}

export async function paytrGetTokenCagir(girdi: PaytrTokenGirdisi) {
  const { merchantId, merchantKey, merchantSalt, hazirMi } = paytrAnahtarlariniOku();
  if (!hazirMi) {
    return { status: 'failed', reason: 'PayTR anahtarlari sunucuda tanimli degil.' };
  }

  const userBasket = paytrSepetKodla(girdi.sepet);
  const noInstallment = girdi.taksitAktif ? '0' : '1';
  const maxInstallment = girdi.taksitAktif ? String(Math.max(0, girdi.maksimumTaksit || 0)) : '0';
  const testMode = girdi.testModu ? '1' : '0';
  const currency = 'TL';

  const hashStr = `${merchantId}${girdi.userIp}${girdi.merchantOid}${girdi.email}${girdi.tutarKurus}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
  const paytrToken = crypto
    .createHmac('sha256', merchantKey)
    .update(`${hashStr}${merchantSalt}`)
    .digest('base64');

  const form = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: girdi.userIp,
    merchant_oid: girdi.merchantOid,
    email: girdi.email,
    payment_amount: String(girdi.tutarKurus),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: girdi.adSoyad.slice(0, 60) || 'Musteri',
    user_address: girdi.adres.slice(0, 200) || 'Afyonkarahisar',
    user_phone: girdi.telefon.replace(/\D/g, '').slice(0, 20) || '05000000000',
    merchant_ok_url: girdi.basariliUrl,
    merchant_fail_url: girdi.hataliUrl,
    timeout_limit: '30',
    currency,
    test_mode: testMode,
  });

  const yanit = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  return (await yanit.json()) as { status: string; token?: string; reason?: string };
}
