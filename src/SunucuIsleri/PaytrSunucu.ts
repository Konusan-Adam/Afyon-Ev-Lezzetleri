import { Router } from 'express';
import {
  paytrAnahtarlariniOku,
  paytrOidUret,
  istemciIpAl,
  uygulamaUrlAl,
  paytrCallbackDogrula,
} from './PaytrYardimciServisi';
import { paytrGetTokenCagir } from './PaytrApiIstekServisi';
import {
  paytrOturumuOlustur,
  paytrOturumDurumGuncelle,
  paytrOturumDurumAl,
} from './PaytrDurumDeposu';

const router = Router();

router.get('/paytr/hazirlik', (_req, res) => {
  const { hazirMi, eksikler } = paytrAnahtarlariniOku();
  return res.json({ basarili: true, hazirMi, eksikler });
});

router.post('/paytr/test', async (req, res) => {
  const { hazirMi, eksikler } = paytrAnahtarlariniOku();
  if (!hazirMi) {
    return res.status(400).json({ basarili: false, hazirMi: false, hata: `Eksik sunucu değişkenleri: ${eksikler.join(', ')}` });
  }
  try {
    const appUrl = uygulamaUrlAl(req);
    const merchantOid = paytrOidUret();
    const sonuc = await paytrGetTokenCagir({
      merchantOid,
      userIp: istemciIpAl(req),
      email: 'test@afyonevlezzetleri.com',
      tutarKurus: 100,
      adSoyad: 'PayTR Baglanti Testi',
      adres: 'Afyonkarahisar Merkez',
      telefon: '05000000000',
      sepet: [{ ad: 'Baglanti Testi', fiyat: 1, adet: 1 }],
      testModu: true,
      taksitAktif: false,
      maksimumTaksit: 0,
      basariliUrl: `${appUrl}/?paytr=basarili`,
      hataliUrl: `${appUrl}/?paytr=hata`,
    });
    if (sonuc.status === 'success' && sonuc.token) {
      return res.json({ basarili: true, hazirMi: true, mesaj: 'PayTR 1,00 TL test token bağlantısı başarılı.' });
    }
    return res.status(400).json({ basarili: false, hata: sonuc.reason || 'PayTR test token alınamadı.' });
  } catch (err: unknown) {
    return res.status(500).json({ basarili: false, hata: err instanceof Error ? err.message : 'PayTR bağlantı hatası.' });
  }
});

router.post('/paytr/token', async (req, res) => {
  const { tutar, sepet = [], musteri = {}, ayarlar = {} } = req.body || {};
  const tutarKurus = Math.round(Number(tutar || 0) * 100);
  if (tutarKurus <= 0) {
    return res.status(400).json({ basarili: false, hata: 'Geçerli bir ödeme tutarı gereklidir.' });
  }
  const merchantOid = paytrOidUret();
  const { hazirMi } = paytrAnahtarlariniOku();
  const demoSimulasyonAktif = Boolean(ayarlar?.demoSimulasyonAktif ?? true);

  if (!hazirMi) {
    if (!demoSimulasyonAktif) {
      return res.status(400).json({ basarili: false, hata: 'PayTR sunucu anahtarları tanımlı değil.' });
    }
    paytrOturumuOlustur(merchantOid, tutarKurus, true);
    return res.json({ basarili: true, demoMod: true, merchantOid, tutarKurus });
  }

  try {
    const appUrl = uygulamaUrlAl(req);
    const sonuc = await paytrGetTokenCagir({
      merchantOid,
      userIp: istemciIpAl(req),
      email: String(musteri.eposta || 'musteri@afyonevlezzetleri.com'),
      tutarKurus,
      adSoyad: String(musteri.adSoyad || 'Misafir Müşteri'),
      adres: String(musteri.adres || 'Afyonkarahisar'),
      telefon: String(musteri.telefon || '05000000000'),
      sepet,
      testModu: Boolean(ayarlar?.testModu ?? true),
      taksitAktif: Boolean(ayarlar?.taksitAktif ?? false),
      maksimumTaksit: Number(ayarlar?.maksimumTaksit || 0),
      basariliUrl: `${appUrl}/?paytr=basarili&oid=${merchantOid}`,
      hataliUrl: `${appUrl}/?paytr=hata&oid=${merchantOid}`,
    });
    if (sonuc.status === 'success' && sonuc.token) {
      paytrOturumuOlustur(merchantOid, tutarKurus, false);
      return res.json({
        basarili: true,
        demoMod: false,
        merchantOid,
        token: sonuc.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${sonuc.token}`,
      });
    }
    return res.status(400).json({ basarili: false, hata: sonuc.reason || 'PayTR iFrame oturumu başlatılamadı.' });
  } catch (err: unknown) {
    return res.status(500).json({ basarili: false, hata: err instanceof Error ? err.message : 'Sunucu ödeme hatası.' });
  }
});

router.post('/paytr/callback', (req, res) => {
  const { merchant_oid, status, total_amount, hash, failed_reason_msg } = req.body || {};
  if (!merchant_oid || !status || !total_amount || !hash) {
    return res.status(400).send('MISSING_FIELDS');
  }
  if (!paytrCallbackDogrula(String(merchant_oid), String(status), String(total_amount), String(hash))) {
    return res.status(400).send('BAD_HASH');
  }
  const yeniDurum = status === 'success' ? 'odendi' : 'hata';
  paytrOturumDurumGuncelle(String(merchant_oid), yeniDurum, failed_reason_msg ? String(failed_reason_msg) : undefined);
  return res.type('text/plain').send('OK');
});

router.post('/paytr/demo-sonuc', (req, res) => {
  const { merchantOid, sonuc, hataMesaji } = req.body || {};
  if (!merchantOid || (sonuc !== 'odendi' && sonuc !== 'hata')) {
    return res.status(400).json({ basarili: false, hata: 'Geçersiz demo ödeme sonucu.' });
  }
  const kayit = paytrOturumDurumGuncelle(String(merchantOid), sonuc, hataMesaji ? String(hataMesaji) : undefined);
  return res.json({ basarili: true, kayit });
});

router.get('/paytr/durum/:merchantOid', (req, res) => {
  const kayit = paytrOturumDurumAl(req.params.merchantOid);
  if (!kayit) {
    return res.status(404).json({ basarili: false, durum: 'bekliyor', hata: 'Ödeme oturumu bulunamadı.' });
  }
  return res.json({
    basarili: true,
    durum: kayit.durum,
    paytrOid: kayit.merchantOid,
    demoMod: kayit.demoMod,
    hataMesaji: kayit.hataMesaji,
  });
});

export default router;
