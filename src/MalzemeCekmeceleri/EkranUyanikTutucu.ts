// Tezgah Modu — Ekran Uyanık Tutucu (Screen Wake Lock API)
// Mutfak tezgâhında veya kurye tutacağında telefon/tabletin ekranının kapanıp uykuya dalmasını önler.

import { useState, useEffect, useCallback } from 'react';

let wakeLockNesnesi: any = null;

export const ekranUyanikTutucuTalepEt = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }

  try {
    wakeLockNesnesi = await (navigator as any).wakeLock.request('screen');
    wakeLockNesnesi.addEventListener('release', () => {
      wakeLockNesnesi = null;
    });
    return true;
  } catch (err) {
    // Tarayıcı izin politikası veya kullanıcı etkileşimi eksikliği durumunda sessizce yut
    return false;
  }
};

export const ekranUyanikTutucuSerbestBirak = async () => {
  if (wakeLockNesnesi) {
    try {
      await wakeLockNesnesi.release();
    } catch {}
    wakeLockNesnesi = null;
  }
};

export const useEkranUyanikTutucu = (otomatikAktif: boolean = false) => {
  const [aktif, setAktif] = useState(false);
  const [destekleniyor, setDestekleniyor] = useState(false);

  const baslat = useCallback(async () => {
    const basarili = await ekranUyanikTutucuTalepEt();
    setAktif(basarili);
    return basarili;
  }, []);

  const durdur = useCallback(async () => {
    await ekranUyanikTutucuSerbestBirak();
    setAktif(false);
  }, []);

  useEffect(() => {
    const destek = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
    setDestekleniyor(destek);

    if (destek && otomatikAktif) {
      baslat();

      // Sekme gizlenip tekrar açıldığında kilit serbest kalır, geri dönüldüğünde tekrar al
      const gorunurlukDegisti = () => {
        if (document.visibilityState === 'visible') {
          baslat();
        }
      };

      document.addEventListener('visibilitychange', gorunurlukDegisti);
      return () => {
        document.removeEventListener('visibilitychange', gorunurlukDegisti);
        durdur();
      };
    }
  }, [otomatikAktif, baslat, durdur]);

  return { aktif, destekleniyor, baslat, durdur };
};
