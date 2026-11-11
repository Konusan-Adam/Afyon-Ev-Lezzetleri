/**
 * Afyon Ev Lezzetleri — Canlı Esnaf Saati ve Zaman Dilimi Yardımcısı
 * Günün saatine göre müşteriye samimi, hürmetli esnaf karşılaması ve öneri havuzu sunar.
 */

export type ZamanDilimi = 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'gece';

export interface ZamanDilimiBilgisi {
  dilim: ZamanDilimi;
  baslik: string;
  karsilama: string;
  odakKategoriler: string[];
}

export function suAnkiZamanDilimi(): ZamanDilimiBilgisi {
  const simdi = new Date();
  const saat = simdi.getHours();
  const dakika = simdi.getMinutes();
  const ondalikSaat = saat + dakika / 60;

  // Sabah Kuşağı: 07:00 - 11:00
  if (ondalikSaat >= 7 && ondalikSaat < 11.5) {
    return {
      dilim: 'sabah',
      baslik: 'Sabah Fırını & Kahvaltı Vakti',
      karsilama: 'Hayırlı sabahlar, gününüz bereketli olsun! Taş fırınımızda sabahın taze sıcakları çıktı. Güne nasıl başlayalım?',
      odakKategoriler: ['kahvaltilik', 'borek-hamurisi', 'corba', 'hamur-isi'],
    };
  }

  // Öğle Kuşağı: 11:30 - 15:30
  if (ondalikSaat >= 11.5 && ondalikSaat < 15.5) {
    return {
      dilim: 'ogle',
      baslik: 'Öğle Tencere Yemekleri Vakti',
      karsilama: 'Öğle vaktiniz bereketli olsun! Mutfaklarımızda kazanlar yeni açıldı, tencere yemeklerimiz dumanı üstünde. Bugün ne ikram edelim?',
      odakKategoriler: ['sulu-yemek', 'ana-yemek', 'corba', 'etli-yemekler'],
    };
  }

  // İkindi & Çay Saati: 15:30 - 18:00
  if (ondalikSaat >= 15.5 && ondalikSaat < 18) {
    return {
      dilim: 'ikindi',
      baslik: 'İkindi Çayı & Börek Saati',
      karsilama: 'İyi günler Değerli Misafirimiz! Çayınızın yanına fırından taze çıkan çıtır lezzetlerimizden veya hafif tatlılarımızdan arzu eder misiniz?',
      odakKategoriler: ['borek-hamurisi', 'tatli', 'hamur-isi', 'icecek'],
    };
  }

  // Akşam Kuşağı: 18:00 - 21:30
  if (ondalikSaat >= 18 && ondalikSaat < 21.5) {
    return {
      dilim: 'aksam',
      baslik: 'Akşam Ziyafeti Vakti',
      karsilama: 'İyi akşamlar, sofranız şen olsun! Doyurucu bir akşam sofrası için fırın ve tencere lezzetlerimiz hazır. Masanıza ne hazırlayalım?',
      odakKategoriler: ['ana-yemek', 'sulu-yemek', 'tatli', 'meze-salata'],
    };
  }

  // Gece Kuşağı: 21:30 - 07:00
  return {
    dilim: 'gece',
    baslik: 'Gece Servisi',
    karsilama: 'Hayırlı geceler Değerli Misafirimiz! Geceyi sıcak bir çorba veya hafif bir tatlıyla kapatmak ister misiniz?',
    odakKategoriler: ['corba', 'tatli', 'icecek'],
  };
}
