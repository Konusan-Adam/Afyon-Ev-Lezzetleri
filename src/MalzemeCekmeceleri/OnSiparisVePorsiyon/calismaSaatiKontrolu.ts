export interface CalismaDurumuBilgisi {
  acikMi: boolean;
  kapaliMi: boolean;
  manuelKapaliMi: boolean;
  saatDisiMi: boolean;
  acilisSaati?: string;
  kapanisSaati?: string;
  kapaliEtiketi: string;
  uyariMetni: string;
}

export function turkiyeDakikaGetir(): number {
  try {
    const parcalar = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const saat = Number(parcalar.find((p) => p.type === 'hour')?.value ?? 0) % 24;
    const dakika = Number(parcalar.find((p) => p.type === 'minute')?.value ?? 0);
    return saat * 60 + dakika;
  } catch {
    const simdi = new Date();
    return simdi.getHours() * 60 + simdi.getMinutes();
  }
}

export function saatMetniniDakikayaCevir(metin?: string): { dakika: number; etiket: string } | null {
  if (!metin) return null;
  const eslesme = metin.trim().match(/(\d{1,2})[:.](\d{2})/);
  if (!eslesme) return null;
  const saat = Number(eslesme[1]);
  const dakika = Number(eslesme[2]);
  if (saat < 0 || saat > 23 || dakika < 0 || dakika > 59) return null;
  return {
    dakika: saat * 60 + dakika,
    etiket: `${String(saat).padStart(2, '0')}:${String(dakika).padStart(2, '0')}`,
  };
}

function calismaAraligiCoz(kayit?: {
  acilis_saati?: string;
  kapanis_saati?: string;
  calisma_saatleri?: string;
} | null) {
  if (!kayit) return null;
  const acilis = saatMetniniDakikayaCevir(kayit.acilis_saati);
  const kapanis = saatMetniniDakikayaCevir(kayit.kapanis_saati);
  if (acilis && kapanis) return { acilis, kapanis };

  const metin = kayit.calisma_saatleri?.trim();
  if (!metin) return null;
  const saatler = [...metin.matchAll(/(\d{1,2})[:.](\d{2})/g)];
  if (saatler.length < 2) return null;
  const ilk = saatMetniniDakikayaCevir(saatler[0][0]);
  const son = saatMetniniDakikayaCevir(saatler[1][0]);
  return ilk && son ? { acilis: ilk, kapanis: son } : null;
}

export function calismaSaatiDurumuHesapla(
  kayit?: {
    acik_mi?: boolean;
    mola_durumu?: boolean;
    acilis_saati?: string;
    kapanis_saati?: string;
    calisma_saatleri?: string;
  } | null,
  referansDakika?: number
): CalismaDurumuBilgisi {
  const manuelKapaliMi = kayit?.acik_mi === false;
  const moladaMi = kayit?.mola_durumu === true;
  const aralik = calismaAraligiCoz(kayit);

  let saatDisiMi = false;
  if (aralik && aralik.acilis.dakika !== aralik.kapanis.dakika) {
    const simdi = referansDakika ?? turkiyeDakikaGetir();
    const { acilis, kapanis } = aralik;
    const aralikAcik =
      kapanis.dakika > acilis.dakika
        ? simdi >= acilis.dakika && simdi < kapanis.dakika
        : simdi >= acilis.dakika || simdi < kapanis.dakika;
    saatDisiMi = !aralikAcik;
  }

  const kapaliMi = manuelKapaliMi || saatDisiMi;
  const acikMi = !kapaliMi && !moladaMi;
  const acilisSaati = aralik?.acilis.etiket;
  const kapanisSaati = aralik?.kapanis.etiket;

  const kapaliEtiketi =
    saatDisiMi && acilisSaati ? `Kapalı • Açılış ${acilisSaati}` : 'Kapalı';

  let uyariMetni = '';
  if (manuelKapaliMi) {
    uyariMetni = acilisSaati
      ? `Şu an kapalıdır (Çalışma saatleri: ${acilisSaati} - ${kapanisSaati}).`
      : 'Şu an kapalıdır.';
  } else if (saatDisiMi && acilisSaati && kapanisSaati) {
    uyariMetni = `Çalışma saatleri dışındadır (${acilisSaati} - ${kapanisSaati}). Açılış saati: ${acilisSaati}.`;
  }

  return {
    acikMi,
    kapaliMi,
    manuelKapaliMi,
    saatDisiMi,
    acilisSaati,
    kapanisSaati,
    kapaliEtiketi,
    uyariMetni,
  };
}
