import { Router } from 'express';
import { istemciIpAl } from './PaytrYardimciServisi';
import { hukukiKayitDamgala, sunucuImzasiUret } from './ZamanDamgasiServisi';

const router = Router();

router.post('/zaman-damgasi/damgala', async (req, res) => {
  try {
    const { olayTuru, cihazBilgisi, veri } = req.body || {};
    if (!olayTuru || typeof olayTuru !== 'string') {
      return res.status(400).json({ basarili: false, hata: 'Geçerli bir olayTuru alanı zorunludur.' });
    }

    const gercekIp = istemciIpAl(req);
    const cihaz = typeof cihazBilgisi === 'string'
      ? cihazBilgisi.slice(0, 180)
      : String(req.headers['user-agent'] || '').slice(0, 180);

    const sonuc = await hukukiKayitDamgala({
      olayTuru: olayTuru.trim().slice(0, 80),
      ipAdresi: gercekIp,
      cihazBilgisi: cihaz,
      veri: veri || {},
    });

    return res.json({
      basarili: true,
      ...sonuc,
    });
  } catch (hata: unknown) {
    return res.status(500).json({
      basarili: false,
      hata: hata instanceof Error ? hata.message : 'Zaman damgası oluşturulamadı.',
    });
  }
});

router.post('/zaman-damgasi/dogrula', (req, res) => {
  const { ozetHash, sunucuUtc, ipAdresi, sunucuImzasi } = req.body || {};
  if (!ozetHash || !sunucuUtc || !ipAdresi || !sunucuImzasi) {
    return res.status(400).json({ basarili: false, gecerli: false, hata: 'Doğrulama alanları eksik.' });
  }
  const beklenenImza = sunucuImzasiUret(String(ozetHash), String(sunucuUtc), String(ipAdresi));
  return res.json({
    basarili: true,
    gecerli: beklenenImza === String(sunucuImzasi),
  });
});

export default router;
