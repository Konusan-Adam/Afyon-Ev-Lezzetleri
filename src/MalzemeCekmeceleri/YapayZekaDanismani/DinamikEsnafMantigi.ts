import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { OneriSecenek } from './LezzetDanismaniTipleri';
import { suAnkiZamanDilimi } from '@/src/MalzemeCekmeceleri';

export interface DinamikCevapSonucu {
  cevapMetni: string;
  onerilenYemekler: YemekTipi[];
  hizliSecenekler: OneriSecenek[];
}

export function urunGrubunuBelirle(yemek: YemekTipi): string {
  const metin = `${yemek.kategori || ''} ${yemek.alt_kategori || ''} ${yemek.baslik || ''}`.toLowerCase();
  if (metin.includes('tatli') || metin.includes('kadayif') || metin.includes('helva')) return 'tatli';
  if (metin.includes('icecek') || metin.includes('ayran') || metin.includes('serbet') || metin.includes('komposto')) return 'icecek';
  if (metin.includes('corba')) return 'corba';
  if (metin.includes('kahvalti') || metin.includes('kaymak') || metin.includes('peynir') || metin.includes('yumurta')) return 'kahvalti';
  if (metin.includes('pilav') || metin.includes('makarna') || metin.includes('borek') || metin.includes('bukme')) return 'eslikci';
  if (metin.includes('cacik') || metin.includes('salata') || metin.includes('meze') || metin.includes('yogurt')) return 'meze';
  return 'ana_yemek';
}

export function benzersizYemekler(liste: YemekTipi[]): YemekTipi[] {
  const gorulen = new Set<string>();
  return liste.filter((y) => {
    if (!y || !y.id || gorulen.has(y.id)) return false;
    gorulen.add(y.id);
    return true;
  });
}

export function dinamikEsnafCevabiUret(
  kullaniciMesaji: string,
  mevcutYemekler: YemekTipi[]
): DinamikCevapSonucu {
  const zaman = suAnkiZamanDilimi();
  const temiz = kullaniciMesaji.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı').trim();

  // Menü tamamen boşsa dürüstçe bildir
  if (!mevcutYemekler || mevcutYemekler.length === 0) {
    return {
      cevapMetni: 'Şu anda mutfaklarımız yeni tencereleri hazırlıyor, birazdan taze menümüz yayında olacaktır.',
      onerilenYemekler: [],
      hizliSecenekler: [],
    };
  }

  // Veritabanındaki ürünleri dinamik gruplara ayır
  const anaYemekler = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'ana_yemek');
  const eslikciler = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'eslikci');
  const icecekler = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'icecek');
  const tatlilar = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'tatli');
  const corbalar = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'corba');
  const kahvaltiliklar = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'kahvalti');
  const mezeler = mevcutYemekler.filter((y) => urunGrubunuBelirle(y) === 'meze');

  // Stokta kritik az kalan ürün var mı? (1-4 porsiyon arası)
  const azKalanUrun = mevcutYemekler.find(
    (y) => typeof y.kalan_stok === 'number' && y.kalan_stok > 0 && y.kalan_stok <= 4
  );

  // 0. Diyet, Kalori, Tarif veya Vegan Sorusu (Akıllı Mutfak ve Kalori Analizi)
  if (temiz.includes('diyet') || temiz.includes('kalori') || temiz.includes('hafif') || temiz.includes('gluten') || temiz.includes('vegan') || temiz.includes('vejetaryen') || temiz.includes('tarif') || temiz.includes('icinde ne var') || temiz.includes('içinde ne var') || temiz.includes('nasıl yapılır')) {
    const secili = mevcutYemekler[0];
    const adKucuk = secili.baslik.toLowerCase();
    
    let analizMetni = `Değerli Misafirimiz, ${secili.baslik} taze el açması hamur ve özenli malzemelerle hazırlanmaktadır.`;
    
    if (temiz.includes('kalori') || temiz.includes('diyet') || temiz.includes('hafif')) {
      if (adKucuk.includes('bükme') || adKucuk.includes('mercimek')) {
        analizMetni = `Değerli Misafirimiz, ${secili.baslik} içerisindeki haşlanmış mercimek lif ve protein açısından zengindir; bir porsiyonu ortalama 320-350 kalori civarındadır ve dengeli bir öğündür.`;
      } else if (adKucuk.includes('katmer') || adKucuk.includes('haşhaş') || adKucuk.includes('ceviz')) {
        analizMetni = `Değerli Misafirimiz, ${secili.baslik} yayık tereyağı ve haşhaş/ceviz içerdiği için enerji (kalori) değeri yüksektir; tatlı veya ara öğün olarak nefis bir lezzettir.`;
      } else {
        analizMetni = `Değerli Misafirimiz, ${secili.baslik} geleneksel porsiyon ölçülerinde dengeli beslenme prensibiyle hazırlanmıştır.`;
      }
    } else if (temiz.includes('vegan') || temiz.includes('vejetaryen')) {
      if (adKucuk.includes('mercimek') || adKucuk.includes('sebze')) {
        analizMetni = `Değerli Misafirimiz, ${secili.baslik} içerisindeki mercimek harcı sayesinde vejetaryen misafirlerimiz için uygundur.`;
      } else {
        analizMetni = `Değerli Misafirimiz, ${secili.baslik} geleneksel tarifimiz gereği süt ürünü (tereyağı vb.) içerebilir; vejetaryen tercihine uygundur ancak vegan için içerik teyidi öneririz.`;
      }
    } else if (temiz.includes('gluten')) {
      analizMetni = `Değerli Misafirimiz, ${secili.baslik} buğday unundan açıldığı için gluten içermektedir; glutensiz beslenen misafirlerimize çorba veya diğer alternatiflerimizi önerebiliriz.`;
    } else if (temiz.includes('tarif') || temiz.includes('içinde ne var') || temiz.includes('icinde ne var')) {
      analizMetni = `Değerli Misafirimiz, ${secili.baslik} için mutfak notumuz: "${secili.aciklama || 'Hakiki ev yapımı un, yöresel haşhaş ve taze iç malzemeyle özenle hazırlanmıştır.'}".`;
    }

    return {
      cevapMetni: analizMetni,
      onerilenYemekler: [secili],
      hizliSecenekler: [
        {
          id: `akilli-${secili.id}`,
          etiket: `🛒 ${secili.baslik} Sepete Ekle (${secili.fiyat} ₺)`,
          secimMetni: `${secili.baslik} sepete eklendi.`,
          yemek: secili,
          aksiyonTipi: 'sepete_ekle',
        },
      ],
    };
  }

  // 1. Kullanıcı belirli bir yemek adını doğrudan mı arıyor?
  const birebirEslesen = mevcutYemekler.find((y) => temiz.includes(y.baslik.toLowerCase()));
  if (birebirEslesen) {
    const onerilenler = [birebirEslesen];
    let aciklama = `Değerli Misafirimiz, ${birebirEslesen.baslik} şu anda taze olarak mutfağımızda hazır!`;

    // Yanına yakışan eşlikçi var mı?
    const eslik = eslikciler.find((e) => e.id !== birebirEslesen.id);
    if (eslik) {
      aciklama += ` Yanına ${eslik.baslik} çok yakışır.`;
      onerilenler.push(eslik);
    }

    // İçecek veya meze sorusu
    if (icecekler.length > 0) {
      const seciliIcecek = icecekler[0];
      aciklama += ` Yanına içecek olarak soğuk ${seciliIcecek.baslik} ekleyelim mi?`;
    }

    // Kritik stok eritmeli dokunuş
    if (azKalanUrun && azKalanUrun.id !== birebirEslesen.id) {
      aciklama += ` Bu arada mutfakta son ${azKalanUrun.kalan_stok} porsiyon ${azKalanUrun.baslik} kaldı, tükenmeden ayırayım mı?`;
    }

    const hizliSecenekler: OneriSecenek[] = [
      {
        id: `ekle-${birebirEslesen.id}`,
        etiket: `🛒 ${birebirEslesen.baslik} Sepete Ekle (${birebirEslesen.fiyat} ₺)`,
        secimMetni: `${birebirEslesen.baslik} sepetine eklendi.`,
        yemek: birebirEslesen,
        aksiyonTipi: 'sepete_ekle',
      },
    ];

    if (eslik) {
      hizliSecenekler.push({
        id: `ekle-${eslik.id}`,
        etiket: `+ ${eslik.baslik} (${eslik.fiyat} ₺)`,
        secimMetni: `${eslik.baslik} eklendi.`,
        yemek: eslik,
        aksiyonTipi: 'sepete_ekle',
      });
    }

    return { cevapMetni: aciklama, onerilenYemekler: onerilenler, hizliSecenekler };
  }

  // 2. Sulu Yemek / Tencere Sorusu
  if (temiz.includes('sulu') || temiz.includes('tencere') || temiz.includes('yemek') || temiz.includes('guvec') || temiz.includes('ana yemek')) {
    const seciliAna = anaYemekler[0] || mevcutYemekler[0];
    const seciliEslik = eslikciler[0];
    const seciliIcecek = icecekler[0];
    const onerilenler: YemekTipi[] = [seciliAna];
    if (seciliEslik) onerilenler.push(seciliEslik);

    let metin = `Değerli Misafirimiz, ${zaman.karsilama} Bugün tezgahımızda ${seciliAna.baslik} taze taze hazırlandı.`;
    if (seciliEslik) {
      metin += ` Yanına tane tane ${seciliEslik.baslik} yer misiniz?`;
    }

    // İçecek / Meze ikilemi veya teklifi
    if (mezeler.length > 0 && icecekler.length > 0) {
      metin += ` İçecek olarak ${mezeler[0].baslik} mı, yoksa buz gibi ${icecekler[0].baslik} mı ikram edelim?`;
    } else if (icecekler.length > 0) {
      metin += ` Yanına taze bir ${icecekler[0].baslik} çok yakışır.`;
    }

    // Az stok uyarısı
    if (azKalanUrun && azKalanUrun.id !== seciliAna.id) {
      metin += ` Mutfakta bugün son ${azKalanUrun.kalan_stok} porsiyon ${azKalanUrun.baslik} kaldı, tabağınıza ekleyelim mi?`;
    }

    const secenekler: OneriSecenek[] = [
      {
        id: `ekle-ana-${seciliAna.id}`,
        etiket: `🛒 ${seciliAna.baslik} Sepete Ekle (${seciliAna.fiyat} ₺)`,
        secimMetni: `${seciliAna.baslik} sepete eklendi.`,
        yemek: seciliAna,
        aksiyonTipi: 'sepete_ekle',
      },
    ];

    if (seciliEslik) {
      secenekler.push({
        id: `ekle-eslik-${seciliEslik.id}`,
        etiket: `+ ${seciliEslik.baslik} Ekle (${seciliEslik.fiyat} ₺)`,
        secimMetni: `${seciliEslik.baslik} sepete eklendi.`,
        yemek: seciliEslik,
        aksiyonTipi: 'sepete_ekle',
      });
    }

    return { cevapMetni: metin, onerilenYemekler: onerilenler, hizliSecenekler: secenekler };
  }

  // 3. Kahvaltı & Sabah Sorusu
  if (temiz.includes('kahvalti') || temiz.includes('sabah') || zaman.dilim === 'sabah') {
    const kahvaltiHavuzu = kahvaltiliklar.length > 0 ? kahvaltiliklar : eslikciler.concat(corbalar);
    const secili = kahvaltiHavuzu[0] || mevcutYemekler[0];
    const onerilenler = [secili];

    let metin = `Hayırlı sabahlar! Güne enfes bir başlangıç için tezgahımızda ${secili.baslik} hazır.`;
    if (corbalar.length > 0 && secili.id !== corbalar[0].id) {
      metin += ` Başlangıç olarak sıcacık ${corbalar[0].baslik} de tercih edebilirsiniz.`;
      onerilenler.push(corbalar[0]);
    }

    return {
      cevapMetni: metin,
      onerilenYemekler: onerilenler,
      hizliSecenekler: [
        {
          id: `kahvalti-${secili.id}`,
          etiket: `🛒 ${secili.baslik} (${secili.fiyat} ₺)`,
          secimMetni: `${secili.baslik} eklendi.`,
          yemek: secili,
          aksiyonTipi: 'sepete_ekle',
        },
      ],
    };
  }

  // 4. Çorba Sorusu
  if (temiz.includes('corba')) {
    const seciliCorba = corbalar[0] || mevcutYemekler[0];
    return {
      cevapMetni: `Değerli Misafirimiz, fırından yeni çıkan sıcak ${seciliCorba.baslik} başlangıç için harika bir seçim. Yanına fırın lezzetlerimizden eklememizi ister misiniz?`,
      onerilenYemekler: [seciliCorba],
      hizliSecenekler: [
        {
          id: `corba-${seciliCorba.id}`,
          etiket: `🛒 Sıcak ${seciliCorba.baslik} Ekle (${seciliCorba.fiyat} ₺)`,
          secimMetni: `${seciliCorba.baslik} sepete eklendi.`,
          yemek: seciliCorba,
          aksiyonTipi: 'sepete_ekle',
        },
      ],
    };
  }

  // 5. Tatlı Sorusu
  if (temiz.includes('tatli') || temiz.includes('kadayif') || temiz.includes('helva')) {
    const seciliTatli = tatlilar[0] || mevcutYemekler.find((y) => urunGrubunuBelirle(y) === 'tatli') || mevcutYemekler[0];
    let metin = `Değerli Misafirimiz, kapanış için nefis ${seciliTatli.baslik} sizleri bekliyor.`;
    if (seciliTatli.kalan_stok && seciliTatli.kalan_stok <= 4) {
      metin += ` Mutfakta bugün son ${seciliTatli.kalan_stok} porsiyon kaldı, tükenmeden ayıralım!`;
    }
    return {
      cevapMetni: metin,
      onerilenYemekler: [seciliTatli],
      hizliSecenekler: [
        {
          id: `tatli-${seciliTatli.id}`,
          etiket: `🍮 ${seciliTatli.baslik} Sepete Ekle (${seciliTatli.fiyat} ₺)`,
          secimMetni: `${seciliTatli.baslik} sepete eklendi.`,
          yemek: seciliTatli,
          aksiyonTipi: 'sepete_ekle',
        },
      ],
    };
  }

  // 6. Genel Karşılama / Bilinmeyen Soru Durumu: Sadece AKTİF veritabanı ürünlerini sunar
  const oneCikan1 = mevcutYemekler[0];
  const digerYemekler = mevcutYemekler.filter((y) => y.id !== oneCikan1.id);
  const oneCikan2 = digerYemekler[0];
  const onerilenler = oneCikan2 ? [oneCikan1, oneCikan2] : [oneCikan1];

  let genelCevap = `${zaman.karsilama} Şu an mutfaklarımızda satışta olan taze ${oneCikan1.baslik}`;
  if (oneCikan2) {
    genelCevap += ` ve ${oneCikan2.baslik} lezzetlerimizi tavsiye ederim.`;
  } else {
    genelCevap += ` lezzetimizi incelemenizi tavsiye ederim.`;
  }

  if (azKalanUrun) {
    genelCevap += ` Ayrıca mutfakta son ${azKalanUrun.kalan_stok} porsiyon ${azKalanUrun.baslik} kaldı.`;
  }

  const secenekler: OneriSecenek[] = [
    {
      id: `genel-1-${oneCikan1.id}`,
      etiket: `🛒 ${oneCikan1.baslik} (${oneCikan1.fiyat} ₺)`,
      secimMetni: `${oneCikan1.baslik} sepete eklendi.`,
      yemek: oneCikan1,
      aksiyonTipi: 'sepete_ekle',
    },
  ];

  if (oneCikan2) {
    secenekler.push({
      id: `genel-2-${oneCikan2.id}`,
      etiket: `🛒 ${oneCikan2.baslik} (${oneCikan2.fiyat} ₺)`,
      secimMetni: `${oneCikan2.baslik} sepete eklendi.`,
      yemek: oneCikan2,
      aksiyonTipi: 'sepete_ekle',
    });
  }

  return { cevapMetni: genelCevap, onerilenYemekler: benzersizYemekler(onerilenler), hizliSecenekler: secenekler };
}
