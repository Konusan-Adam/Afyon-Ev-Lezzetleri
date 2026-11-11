import { useState, useEffect, useCallback, useRef } from 'react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';

const OTURUM_SURESI_MS = 60 * 60 * 1000; // 1 Saat (60 dakika)
const UYARI_SURESI_MS = 55 * 60 * 1000;  // 55. dakika uyarısı

export interface OturumZamanlayiciDurumu {
  uyariGoster: boolean;
  kalanSaniye: number;
  oturumDiriTut: () => void;
}

export const useOturumHareketsizlik = (): OturumZamanlayiciDurumu => {
  const { aktifKullanici, cikisYap, panelDegistir } = kullaniciHafizasiKullan();
  const sonHareketZamaniRef = useRef<number>(Date.now());
  const [uyariGoster, setUyariGoster] = useState<boolean>(false);
  const [kalanSaniye, setKalanSaniye] = useState<number>(300);

  // Patron / Admin bu zaman aşımı kuralından tamamen muaftır
  const yoneticiMi = aktifKullanici?.rol === 'yonetici';

  const oturumDiriTut = useCallback(() => {
    sonHareketZamaniRef.current = Date.now();
    setUyariGoster(false);
  }, []);

  useEffect(() => {
    if (yoneticiMi || !aktifKullanici) {
      setUyariGoster(false);
      return;
    }

    const hareketAlgilandi = () => {
      // 5 saniyeden daha sık güncelleme yapmayarak performansı koru
      if (Date.now() - sonHareketZamaniRef.current > 5000) {
        sonHareketZamaniRef.current = Date.now();
      }
    };

    const dinleyiciler = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    dinleyiciler.forEach((olay) => window.addEventListener(olay, hareketAlgilandi, { passive: true }));

    const kontrolAraligi = setInterval(() => {
      const gecenSure = Date.now() - sonHareketZamaniRef.current;

      if (gecenSure >= OTURUM_SURESI_MS) {
        setUyariGoster(false);
        cikisYap();
        panelDegistir('vitrin');
      } else if (gecenSure >= UYARI_SURESI_MS) {
        setUyariGoster(true);
        setKalanSaniye(Math.max(0, Math.ceil((OTURUM_SURESI_MS - gecenSure) / 1000)));
      } else {
        setUyariGoster(false);
      }
    }, 2000);

    return () => {
      dinleyiciler.forEach((olay) => window.removeEventListener(olay, hareketAlgilandi));
      clearInterval(kontrolAraligi);
    };
  }, [yoneticiMi, aktifKullanici, cikisYap, panelDegistir]);

  return { uyariGoster, kalanSaniye, oturumDiriTut };
};
