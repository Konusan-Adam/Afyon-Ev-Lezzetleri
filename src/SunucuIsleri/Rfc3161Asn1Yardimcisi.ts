import crypto from 'crypto';

const SHA256_OID_DER = Buffer.from([
  0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01,
]);
const DER_NULL = Buffer.from([0x05, 0x00]);

function derUzunlukKodla(uzunluk: number): Buffer {
  if (uzunluk < 0x80) {
    return Buffer.from([uzunluk]);
  }
  const baytlar: number[] = [];
  let kalan = uzunluk;
  while (kalan > 0) {
    baytlar.unshift(kalan & 0xff);
    kalan >>= 8;
  }
  return Buffer.from([0x80 | baytlar.length, ...baytlar]);
}

function derSarmala(etiket: number, icerik: Buffer): Buffer {
  return Buffer.concat([Buffer.from([etiket]), derUzunlukKodla(icerik.length), icerik]);
}

function pozitifTamSayiDer(baytlar: Buffer): Buffer {
  const kopya = Buffer.from(baytlar);
  kopya[0] = kopya[0] & 0x7f;
  if (kopya[0] === 0) kopya[0] = 0x01;
  return derSarmala(0x02, kopya);
}

/**
 * Verilen 64 karakterlik SHA-256 hex özeti için RFC 3161 TimeStampReq DER paketi üretir.
 */
export function rfc3161IstekOlustur(sha256Hex: string): Buffer {
  const ozetBuffer = Buffer.from(sha256Hex, 'hex');
  if (ozetBuffer.length !== 32) {
    throw new Error('RFC 3161 zaman damgası için geçerli 32 baytlık SHA-256 özeti gereklidir.');
  }

  const versiyon = Buffer.from([0x02, 0x01, 0x01]);
  const algoritmaTanimlayici = derSarmala(0x30, Buffer.concat([SHA256_OID_DER, DER_NULL]));
  const mesajOzeti = derSarmala(0x04, ozetBuffer);
  const messageImprint = derSarmala(0x30, Buffer.concat([algoritmaTanimlayici, mesajOzeti]));
  const nonce = pozitifTamSayiDer(crypto.randomBytes(8));
  const certReq = Buffer.from([0x01, 0x01, 0xff]);

  return derSarmala(0x30, Buffer.concat([versiyon, messageImprint, nonce, certReq]));
}

/**
 * TSA sunucusundan dönen TimeStampResp DER paketinin geçerli ve onaylı (PKIStatus 0 veya 1) olduğunu kontrol eder.
 */
export function rfc3161YanitGecerliMi(yanitBuffer: Buffer): boolean {
  if (!yanitBuffer || yanitBuffer.length < 32 || yanitBuffer[0] !== 0x30) {
    return false;
  }
  // PKIStatusInfo: outer SEQ -> inner SEQ (PKIStatusInfo) -> INTEGER (0 = granted, 1 = grantedWithMods)
  const ilkYirmi = yanitBuffer.subarray(0, 24);
  for (let i = 2; i < ilkYirmi.length - 3; i++) {
    if (ilkYirmi[i] === 0x30 && ilkYirmi[i + 2] === 0x02 && ilkYirmi[i + 3] === 0x01) {
      const durumKodu = ilkYirmi[i + 4];
      return durumKodu === 0 || durumKodu === 1;
    }
  }
  return false;
}
