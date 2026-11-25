import crypto from 'crypto';
import { paytrAnahtarlariniOku } from './PaytrYardimciServisi';
import { paytrOturumDurumAl, paytrOturumIadeGuncelle } from './PaytrDurumDeposu';

export interface PaytrIadeSonucu {
  basarili: boolean;
  iadeDurumu: 'tamamlandi' | 'demo_iade' | 'hata';
  referansNo?: string;
  mesaj: string;
}

const OID_DESENI = /^[a-zA-Z0-9_-]{3,80}$/;

export async function paytrIadeIslemiYap(
  merchantOid: string,
  tutarTl: number,
  referansNo?: string
): Promise<PaytrIadeSonucu> {
  const temizOid = String(merchantOid || '').trim();
  if (!OID_DESENI.test(temizOid)) {
    return { basarili: false, iadeDurumu: 'hata', mesaj: 'Geçersiz PayTR sipariş numarası.' };
  }

  const oturum = await paytrOturumDurumAl(temizOid);
  if (oturum && oturum.durum !== 'odendi') {
    return { basarili: false, iadeDurumu: 'hata', mesaj: 'Ödemesi tamamlanmamış işlem için iade başlatılamaz.' };
  }
  if (oturum?.iadeDurumu === 'tamamlandi') {
    return {
      basarili: true,
      iadeDurumu: oturum.demoMod ? 'demo_iade' : 'tamamlandi',
      referansNo: oturum.iadeReferans,
      mesaj: 'Bu ödeme için iade işlemi daha önce tamamlanmıştır.',
    };
  }

  const beklenenTl = oturum?.tutarKurus && oturum.tutarKurus > 0
    ? oturum.tutarKurus / 100
    : Number(tutarTl || 0);
  const istenenTl = Number(tutarTl || 0) > 0 ? Math.min(Number(tutarTl), beklenenTl) : beklenenTl;
  if (!Number.isFinite(istenenTl) || istenenTl <= 0) {
    return { basarili: false, iadeDurumu: 'hata', mesaj: 'Geçerli bir iade tutarı bulunamadı.' };
  }

  const iadeTutariStr = istenenTl.toFixed(2);
  const iadeKurus = Math.round(istenenTl * 100);
  const temizRef = (referansNo || `IADE_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);

  const { merchantId, merchantKey, merchantSalt, hazirMi } = paytrAnahtarlariniOku();
  if (!hazirMi || oturum?.demoMod) {
    await paytrOturumIadeGuncelle(temizOid, 'tamamlandi', iadeKurus, temizRef, 'Test/Demo PayTR iadesi kaydedildi.');
    return {
      basarili: true,
      iadeDurumu: 'demo_iade',
      referansNo: temizRef,
      mesaj: 'Test/önizleme ortamında PayTR iade talebi kaydedildi (canlı ortamda 1-7 iş günü içinde karta yansır).',
    };
  }

  try {
    const paytrToken = crypto
      .createHmac('sha256', merchantKey)
      .update(`${merchantId}${temizOid}${iadeTutariStr}${merchantSalt}`)
      .digest('base64');

    const form = new URLSearchParams({
      merchant_id: merchantId,
      merchant_oid: temizOid,
      return_amount: iadeTutariStr,
      paytr_token: paytrToken,
      reference_no: temizRef,
    });

    const yanit = await fetch('https://www.paytr.com/odeme/iade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const sonuc = (await yanit.json()) as { status?: string; err_msg?: string; return_amount?: string };

    if (sonuc.status === 'success') {
      await paytrOturumIadeGuncelle(temizOid, 'tamamlandi', iadeKurus, temizRef, 'PayTR iade talebi onaylandı.');
      return {
        basarili: true,
        iadeDurumu: 'tamamlandi',
        referansNo: temizRef,
        mesaj: 'PayTR iade talebiniz onaylandı. Tutar bankanıza bağlı olarak 1–7 iş günü içinde kartınıza yansıyacaktır.',
      };
    }

    const hata = sonuc.err_msg || 'PayTR iade talebi başarısız oldu.';
    await paytrOturumIadeGuncelle(temizOid, 'hata', iadeKurus, temizRef, hata);
    return { basarili: false, iadeDurumu: 'hata', referansNo: temizRef, mesaj: hata };
  } catch (err: unknown) {
    const mesaj = err instanceof Error ? err.message : 'PayTR iade bağlantı hatası.';
    await paytrOturumIadeGuncelle(temizOid, 'hata', iadeKurus, temizRef, mesaj);
    return { basarili: false, iadeDurumu: 'hata', referansNo: temizRef, mesaj };
  }
}
