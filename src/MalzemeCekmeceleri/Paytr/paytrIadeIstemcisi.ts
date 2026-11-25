export interface PaytrIadeYanit {
  basarili: boolean;
  iadeDurumu: 'tamamlandi' | 'demo_iade' | 'hata';
  referansNo?: string;
  mesaj: string;
}

export async function paytrIadesiBaslat(
  merchantOid: string,
  tutar: number,
  referansNo?: string
): Promise<PaytrIadeYanit> {
  try {
    const yanit = await fetch('/api/paytr/iade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchantOid, tutar, referansNo }),
    });
    const veri = (await yanit.json()) as PaytrIadeYanit;
    return veri;
  } catch {
    return {
      basarili: false,
      iadeDurumu: 'hata',
      mesaj: 'İade servisine şu an ulaşılamadı. Yönetici manuel iade incelemesi başlatılmıştır.',
    };
  }
}
