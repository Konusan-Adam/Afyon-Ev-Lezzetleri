import crypto from 'crypto';
import { rfc3161IstekOlustur, rfc3161YanitGecerliMi } from './Rfc3161Asn1Yardimcisi';

export interface ZamanDamgasiSonucu {
  damgaDurumu: 'rfc3161_onayli' | 'sunucu_muhurlu';
  sunucuUtc: string;
  sunucuYerelTr: string;
  ipAdresi: string;
  ozetHash: string;
  tsaSaglayici: string;
  tsaTokenBase64: string;
  sunucuImzasi: string;
}

const UCRETSIZ_TSA_SUNUCULARI = [
  { ad: 'FreeTSA (freetsa.org)', url: 'https://freetsa.org/tsr' },
  { ad: 'DigiCert TSA', url: 'http://timestamp.digicert.com' },
];

function kanonikJsonSirala(deger: unknown): string {
  if (deger === null || typeof deger !== 'object') {
    return JSON.stringify(deger);
  }
  if (Array.isArray(deger)) {
    return '[' + deger.map((oge) => kanonikJsonSirala(oge)).join(',') + ']';
  }
  const obj = deger as Record<string, unknown>;
  const anahtarlar = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return (
    '{' +
    anahtarlar.map((k) => `${JSON.stringify(k)}:${kanonikJsonSirala(obj[k])}`).join(',') +
    '}'
  );
}

function sunucuMuhurAnahtariAl(): string {
  return (
    process.env.ZAMAN_DAMGASI_GIZLI_ANAHTARI?.trim() ||
    process.env.PAYTR_MERCHANT_SALT?.trim() ||
    'afyon-ev-lezzetleri-hukuki-muhur-anahtari-2026'
  );
}

export function sha256OzetHesapla(metin: string): string {
  return crypto.createHash('sha256').update(metin, 'utf8').digest('hex');
}

export function sunucuImzasiUret(ozetHash: string, sunucuUtc: string, ipAdresi: string): string {
  return crypto
    .createHmac('sha256', sunucuMuhurAnahtariAl())
    .update(`${ozetHash}|${sunucuUtc}|${ipAdresi}`)
    .digest('hex');
}

async function ucretsizTsaDamgasiAl(
  ozetHash: string
): Promise<{ saglayici: string; tokenBase64: string } | null> {
  const istekPaketi = rfc3161IstekOlustur(ozetHash);

  for (const tsa of UCRETSIZ_TSA_SUNUCULARI) {
    const denetleyici = new AbortController();
    const zamanAsimi = setTimeout(() => denetleyici.abort(), 3200);
    try {
      const yanit = await fetch(tsa.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/timestamp-query',
          Accept: 'application/timestamp-reply',
        },
        body: new Uint8Array(istekPaketi),
        signal: denetleyici.signal,
      });
      clearTimeout(zamanAsimi);

      if (!yanit.ok) continue;
      const tampon = Buffer.from(await yanit.arrayBuffer());
      if (rfc3161YanitGecerliMi(tampon)) {
        return {
          saglayici: tsa.ad,
          tokenBase64: tampon.toString('base64'),
        };
      }
    } catch {
      clearTimeout(zamanAsimi);
    }
  }
  return null;
}

export async function hukukiKayitDamgala(girdi: {
  olayTuru: string;
  ipAdresi: string;
  cihazBilgisi?: string;
  veri: unknown;
}): Promise<ZamanDamgasiSonucu> {
  const simdi = new Date();
  const sunucuUtc = simdi.toISOString();
  const sunucuYerelTr = simdi.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

  const kanonikMetin = kanonikJsonSirala({
    olayTuru: girdi.olayTuru,
    sunucuUtc,
    ipAdresi: girdi.ipAdresi,
    cihazBilgisi: girdi.cihazBilgisi || '',
    veri: girdi.veri ?? {},
  });

  const ozetHash = sha256OzetHesapla(kanonikMetin);
  const sunucuImzasi = sunucuImzasiUret(ozetHash, sunucuUtc, girdi.ipAdresi);
  const tsaYaniti = await ucretsizTsaDamgasiAl(ozetHash);

  return {
    damgaDurumu: tsaYaniti ? 'rfc3161_onayli' : 'sunucu_muhurlu',
    sunucuUtc,
    sunucuYerelTr,
    ipAdresi: girdi.ipAdresi,
    ozetHash,
    tsaSaglayici: tsaYaniti ? tsaYaniti.saglayici : 'Sunucu SHA-256 + HMAC Mühür',
    tsaTokenBase64: tsaYaniti ? tsaYaniti.tokenBase64 : '',
    sunucuImzasi,
  };
}
