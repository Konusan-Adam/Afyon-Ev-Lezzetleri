/**
 * Afyon Ev Lezzetleri — Telefon Doğrulama ve Canlı Formatlama Modülü
 * BTK ve GSM standartlarına (Turkcell, Vodafone, Türk Telekom, NetGSM) tam uyumlu,
 * tuşlama esnasında anlık (canlı) operatör ve hata analizi yapar.
 */

export interface OperatorBilgisi {
  ad: string;
  renk: string;
}

// Türkiye Mobil Operatör Blokları ve İsimleri
const MOBIL_OPERATOR_HARITASI: Record<string, OperatorBilgisi> = {
  // Türk Telekom (Avea / TTNET Mobil)
  '501': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '505': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '506': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '507': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '551': { ad: 'Türk Telekom (BİMcell)', renk: 'text-sky-400' },
  '552': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '553': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '554': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '555': { ad: 'Türk Telekom', renk: 'text-sky-400' },
  '559': { ad: 'Türk Telekom', renk: 'text-sky-400' },

  // Turkcell
  '530': { ad: 'Turkcell', renk: 'text-amber-400' },
  '531': { ad: 'Turkcell', renk: 'text-amber-400' },
  '532': { ad: 'Turkcell', renk: 'text-amber-400' },
  '533': { ad: 'Turkcell', renk: 'text-amber-400' },
  '534': { ad: 'Turkcell', renk: 'text-amber-400' },
  '535': { ad: 'Turkcell', renk: 'text-amber-400' },
  '536': { ad: 'Turkcell', renk: 'text-amber-400' },
  '537': { ad: 'Turkcell', renk: 'text-amber-400' },
  '538': { ad: 'Turkcell', renk: 'text-amber-400' },
  '539': { ad: 'Turkcell', renk: 'text-amber-400' },
  '561': { ad: 'Turkcell (NetGSM / 561)', renk: 'text-amber-400' },

  // Vodafone
  '540': { ad: 'Vodafone', renk: 'text-rose-400' },
  '541': { ad: 'Vodafone', renk: 'text-rose-400' },
  '542': { ad: 'Vodafone', renk: 'text-rose-400' },
  '543': { ad: 'Vodafone', renk: 'text-rose-400' },
  '544': { ad: 'Vodafone', renk: 'text-rose-400' },
  '545': { ad: 'Vodafone', renk: 'text-rose-400' },
  '546': { ad: 'Vodafone', renk: 'text-rose-400' },
  '547': { ad: 'Vodafone', renk: 'text-rose-400' },
  '548': { ad: 'Vodafone', renk: 'text-rose-400' },
  '549': { ad: 'Vodafone', renk: 'text-rose-400' },

  // NetGSM
  '510': { ad: 'NetGSM', renk: 'text-emerald-400' }
};

/**
 * Metin içerisindeki tüm harf ve özel karakterleri temizleyip sadece rakamları döndürür.
 */
export const telefonRakamlariniAyikla = (deger: string): string => {
  if (!deger) return '';
  return deger.replace(/\D/g, '');
};

/**
 * Kullanıcı yazdıkça numarayı Türkiye standardında (05XX XXX XX XX) otomatik maskeler.
 */
export const telefonMaskele = (deger: string): string => {
  let rakamlar = telefonRakamlariniAyikla(deger);

  if (rakamlar.startsWith('90') && rakamlar.length > 10) {
    rakamlar = rakamlar.substring(2);
  }
  if (!rakamlar.startsWith('0') && rakamlar.length > 0) {
    rakamlar = '0' + rakamlar;
  }
  if (rakamlar.length > 11) {
    rakamlar = rakamlar.substring(0, 11);
  }

  if (rakamlar.length <= 4) {
    return rakamlar;
  }
  if (rakamlar.length <= 7) {
    return `${rakamlar.slice(0, 4)} ${rakamlar.slice(4)}`;
  }
  if (rakamlar.length <= 9) {
    return `${rakamlar.slice(0, 4)} ${rakamlar.slice(4, 7)} ${rakamlar.slice(7)}`;
  }
  return `${rakamlar.slice(0, 4)} ${rakamlar.slice(4, 7)} ${rakamlar.slice(7, 9)} ${rakamlar.slice(9, 11)}`;
};

export interface TelefonCanliDurumu {
  hata: string | null;
  operator: OperatorBilgisi | null;
  tamamlandiMi: boolean;
  gecerliMi: boolean;
}

/**
 * Kullanıcı her tuşa bastığında ANLIK (canlı) olarak numarayı ve operatörü denetler.
 * Daha 2. ve 4. karakterde hatayı yakalar.
 */
export const telefonCanliDurumunuGetir = (telefonMetni: string): TelefonCanliDurumu => {
  const rakamlar = telefonRakamlariniAyikla(telefonMetni);

  if (!rakamlar || rakamlar.length === 0) {
    return { hata: null, operator: null, tamamlandiMi: false, gecerliMi: false };
  }

  // 1. Karakter Kontrolleri: 0 ile başlamalıdır
  if (rakamlar[0] !== '0') {
    return {
      hata: 'Cep telefonu 0 ile başlamalıdır (Örn: 0542...).',
      operator: null,
      tamamlandiMi: false,
      gecerliMi: false
    };
  }

  // 2. Karakter Kontrolü: 0'dan sonra mutlaka 5 gelmelidir
  if (rakamlar.length >= 2 && rakamlar[1] !== '5') {
    return {
      hata: 'Hatalı numara! Cep telefonları 05 ile başlar (0' + rakamlar[1] + ' geçersizdir).',
      operator: null,
      tamamlandiMi: false,
      gecerliMi: false
    };
  }

  // 3 ve 4. Karakter Kontrolü: Operatör Kodu (05XX)
  if (rakamlar.length >= 4) {
    const operatorKodu = rakamlar.substring(1, 4); // '542', '532', '505' vb.
    const bulunanOperator = MOBIL_OPERATOR_HARITASI[operatorKodu];

    if (!bulunanOperator) {
      return {
        hata: `Geçersiz operatör kodu (0${operatorKodu})! Türkiye'de böyle bir mobil hat bloğu yoktur.`,
        operator: null,
        tamamlandiMi: false,
        gecerliMi: false
      };
    }

    // Numara tamamlandıysa (11 hane - 05XXXXXXXXX) ek sahte numara kontrolleri yap
    if (rakamlar.length === 11) {
      const safOnHane = rakamlar.substring(1);

      // Aynı rakamın tekrarı: 5555555555, 5444444444 vb.
      if (/^(\d)\1{9}$/.test(safOnHane)) {
        return {
          hata: 'Sahte numara tespit edildi! Lütfen gerçek telefonunuzu giriniz.',
          operator: bulunanOperator,
          tamamlandiMi: true,
          gecerliMi: false
        };
      }

      // Sıralı rakamlar: 05301234567, 05421234567, 05551234567, 05320000000
      const sonYediHane = safOnHane.substring(3);
      if (
        sonYediHane === '1234567' ||
        sonYediHane === '7654321' ||
        sonYediHane === '0000000' ||
        sonYediHane === '1111111'
      ) {
        return {
          hata: 'Geçersiz test/sıralı numara formatı!',
          operator: bulunanOperator,
          tamamlandiMi: true,
          gecerliMi: false
        };
      }

      return {
        hata: null,
        operator: bulunanOperator,
        tamamlandiMi: true,
        gecerliMi: true
      };
    }

    // Henüz 11 haneye ulaşmadı ama yazılan kısım doğru bir operatörle ilerliyor
    return {
      hata: null,
      operator: bulunanOperator,
      tamamlandiMi: false,
      gecerliMi: false
    };
  }

  return { hata: null, operator: null, tamamlandiMi: false, gecerliMi: false };
};

/**
 * Form gönderimi (Submit) esnasında nihai geçerlilik kontrolü.
 */
export const telefonGecerliMi = (telefon: string): { gecerli: boolean; hata?: string } => {
  const durum = telefonCanliDurumunuGetir(telefon);

  if (!telefon || telefon.trim().length === 0) {
    return { gecerli: false, hata: 'Lütfen cep telefonu numaranızı giriniz.' };
  }

  if (durum.hata) {
    return { gecerli: false, hata: durum.hata };
  }

  const rakamlar = telefonRakamlariniAyikla(telefon);
  if (rakamlar.length < 11) {
    return {
      gecerli: false,
      hata: 'Cep telefonu 11 haneli olmalıdır (Örn: 0542 333 44 55).'
    };
  }

  if (!durum.gecerliMi) {
    return { gecerli: false, hata: 'Lütfen geçerli bir cep telefonu numarası giriniz.' };
  }

  return { gecerli: true };
};

/**
 * Veritabanına kaydederken standart '05XXXXXXXXX' formatına çevirir.
 */
export const telefonuStandartlastir = (telefon: string): string => {
  let rakamlar = telefonRakamlariniAyikla(telefon);
  if (rakamlar.startsWith('90')) rakamlar = rakamlar.substring(2);
  if (!rakamlar.startsWith('0')) rakamlar = '0' + rakamlar;
  return rakamlar;
};
