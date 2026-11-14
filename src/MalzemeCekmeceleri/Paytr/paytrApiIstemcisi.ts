import { PaytrCanliAyarlari } from './paytrAyarTipleri';

export interface PaytrTokenIstekBilgisi {
  tutar: number;
  sepet: Array<{ ad: string; fiyat: number; adet: number }>;
  musteri: {
    adSoyad: string;
    telefon: string;
    adres: string;
    eposta?: string;
  };
  ayarlar: PaytrCanliAyarlari;
}

export interface PaytrTokenYaniti {
  basarili: boolean;
  demoMod?: boolean;
  merchantOid?: string;
  iframeUrl?: string;
  hata?: string;
}

export interface PaytrDurumYaniti {
  basarili: boolean;
  durum: 'bekliyor' | 'odendi' | 'hata';
  paytrOid?: string;
  hataMesaji?: string;
}

export async function paytrOturumBaslat(istek: PaytrTokenIstekBilgisi): Promise<PaytrTokenYaniti> {
  const yanit = await fetch('/api/paytr/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(istek),
  });
  return (await yanit.json()) as PaytrTokenYaniti;
}

export async function paytrDurumSorgula(merchantOid: string): Promise<PaytrDurumYaniti> {
  const yanit = await fetch(`/api/paytr/durum/${encodeURIComponent(merchantOid)}`);
  return (await yanit.json()) as PaytrDurumYaniti;
}

export async function paytrDemoSonucGonder(
  merchantOid: string,
  sonuc: 'odendi' | 'hata',
  hataMesaji?: string
) {
  const yanit = await fetch('/api/paytr/demo-sonuc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchantOid, sonuc, hataMesaji }),
  });
  return await yanit.json();
}
