// Pazar yeri komisyon ve güvenlik filtresi (Telefon, IBAN ve harici iletişim engeli)
export interface GuvenlikKontrolSonucu {
  guvenliMi: boolean;
  uyari?: string;
}

const YASAKLI_KELIMELER = [
  'iban', 'havale', 'eft', 'whatsapp', 'wp', 'hesap no',
  'ara beni', 'beni ara', 'özelden', 'elden ver', 'elden ode',
  'numaram', 'telefonum', 'banka'
];

export const icerikGuvenlikKontrolu = (metin: string): GuvenlikKontrolSonucu => {
  if (!metin || !metin.trim()) return { guvenliMi: true };

  const temizMetin = metin.toLowerCase();

  // 1. IBAN Tespiti (TR ile başlayan veya iban kelimesi)
  if (/tr\s*\d{2}/i.test(temizMetin) || temizMetin.includes('iban')) {
    return {
      guvenliMi: false,
      uyari: 'Güvenlik Uyarısı: IBAN veya banka bilgisi paylaşımı yasaktır.'
    };
  }

  // 2. Telefon Numarası Tespiti (Aralıklı veya bitişik 10-11 haneli sayılar / 05xx)
  const sadeceRakamlar = metin.replace(/\D/g, '');
  if (sadeceRakamlar.length >= 10 && (sadeceRakamlar.startsWith('05') || sadeceRakamlar.startsWith('5'))) {
    return {
      guvenliMi: false,
      uyari: 'Güvenlik Uyarısı: Telefon numarası paylaşımı yasaktır.'
    };
  }

  // 3. Harici İletişim Kelimeleri Tespiti
  for (const kelime of YASAKLI_KELIMELER) {
    if (temizMetin.includes(kelime)) {
      return {
        guvenliMi: false,
        uyari: `Güvenlik Uyarısı: "${kelime}" gibi harici iletişim ifadeleri yasaktır.`
      };
    }
  }

  return { guvenliMi: true };
};
