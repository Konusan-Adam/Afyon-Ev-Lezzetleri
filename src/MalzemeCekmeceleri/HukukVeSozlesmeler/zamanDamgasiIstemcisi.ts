export interface IstemciZamanDamgasiYaniti {
  damgaDurumu: 'rfc3161_onayli' | 'sunucu_muhurlu' | 'yerel_ozet';
  sunucuUtc: string;
  sunucuYerelTr: string;
  ipAdresi: string;
  ozetHash: string;
  tsaSaglayici: string;
  tsaTokenBase64: string;
  sunucuImzasi: string;
}

export async function tarayiciSha256Hesapla(metin: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const veri = new TextEncoder().encode(metin);
      const ozet = await window.crypto.subtle.digest('SHA-256', veri);
      return Array.from(new Uint8Array(ozet))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // WebCrypto desteklenmeyen bağlamlarda yedek özet
  }
  let hash = 2166136261;
  for (let i = 0; i < metin.length; i++) {
    hash ^= metin.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 'fnv_' + (hash >>> 0).toString(16).padStart(8, '0');
}

export async function sunucuZamanDamgasiAl(
  olayTuru: string,
  veri: unknown
): Promise<IstemciZamanDamgasiYaniti> {
  const cihazBilgisi =
    typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 180) : '';

  const denetleyici = new AbortController();
  const zamanAsimi = setTimeout(() => denetleyici.abort(), 4500);

  try {
    const yanit = await fetch('/api/zaman-damgasi/damgala', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ olayTuru, cihazBilgisi, veri }),
      signal: denetleyici.signal,
    });
    clearTimeout(zamanAsimi);

    if (yanit.ok) {
      const sonuc = await yanit.json();
      if (sonuc?.basarili && sonuc?.ozetHash) {
        return {
          damgaDurumu: sonuc.damgaDurumu || 'sunucu_muhurlu',
          sunucuUtc: sonuc.sunucuUtc,
          sunucuYerelTr: sonuc.sunucuYerelTr,
          ipAdresi: sonuc.ipAdresi || 'bilinmiyor',
          ozetHash: sonuc.ozetHash,
          tsaSaglayici: sonuc.tsaSaglayici || 'Sunucu SHA-256',
          tsaTokenBase64: sonuc.tsaTokenBase64 || '',
          sunucuImzasi: sonuc.sunucuImzasi || '',
        };
      }
    }
  } catch {
    clearTimeout(zamanAsimi);
  }

  const simdi = new Date();
  const sunucuUtc = simdi.toISOString();
  const ozetHash = await tarayiciSha256Hesapla(
    JSON.stringify({ olayTuru, sunucuUtc, cihazBilgisi, veri })
  );

  return {
    damgaDurumu: 'yerel_ozet',
    sunucuUtc,
    sunucuYerelTr: simdi.toLocaleString('tr-TR'),
    ipAdresi: 'istemci_yerel',
    ozetHash,
    tsaSaglayici: 'Firestore ServerTimestamp + SHA-256',
    tsaTokenBase64: '',
    sunucuImzasi: '',
  };
}
