import { TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';

export interface FiyatDogrulamaSonucu {
  guvenliMi: boolean;
  hesaplananToplam: number;
  hataMesaji?: string;
}

/**
 * 🦁 Afyon Ev Lezzetleri — Güvenlik Zırhı: Sipariş Fiyat ve Tutar Denetçisi
 * Kötü niyetli istemci manipülasyonlarını (ör. 1 TL sipariş hilesi) engeller.
 */
export function siparisFiyatiniZirhlaDogrula(
  elemanlar: TestSiparisElemani[],
  istemciToplamTutari: number,
  teslimatUcreti: number,
  kuponIndirimi: number = 0
): FiyatDogrulamaSonucu {
  if (!elemanlar || elemanlar.length === 0) {
    return {
      guvenliMi: false,
      hesaplananToplam: 0,
      hataMesaji: 'Güvenlik Uyarısı: Siparişte en az 1 yemek bulunmalıdır.'
    };
  }

  let gercekUrunlerToplami = 0;
  for (const eleman of elemanlar) {
    const adet = Number(eleman.adet) || 1;
    const birimFiyat = Number(eleman.birimFiyat || eleman.fiyat) || 0;

    if (adet <= 0 || birimFiyat <= 0) {
      return {
        guvenliMi: false,
        hesaplananToplam: 0,
        hataMesaji: 'Güvenlik Uyarısı: Geçersiz ürün adedi veya sıfır/negatif fiyat tespit edildi.'
      };
    }
    gercekUrunlerToplami += adet * birimFiyat;
  }

  const tabanTutar = gercekUrunlerToplami + (Number(teslimatUcreti) || 0);
  const gercekToplamTutar = Math.round(Math.max(0, tabanTutar - (Number(kuponIndirimi) || 0)) * 100) / 100;
  const yuvarlanmisIstemciTutari = Math.round((Number(istemciToplamTutari) || 0) * 100) / 100;

  // 1 Kuruştan fazla fark varsa siparişi engelle
  if (Math.abs(gercekToplamTutar - yuvarlanmisIstemciTutari) > 0.05) {
    return {
      guvenliMi: false,
      hesaplananToplam: gercekToplamTutar,
      hataMesaji: `Güvenlik Engeli: Gönderilen tutar (${yuvarlanmisIstemciTutari} ₺) gerçek sepet toplamıyla (${gercekToplamTutar} ₺) eşleşmiyor!`
    };
  }

  return {
    guvenliMi: true,
    hesaplananToplam: gercekToplamTutar
  };
}
