import { useState, useEffect, useRef } from 'react';
import { kuryeKonumunuFirebaseKaydet } from './kuryeKonumGonderici';

interface KuryeKonumYayiniOzellikleri {
  kuryeId: string;
  kuryeAdi: string;
  telefon?: string;
  aracTipi?: string;
  plaka?: string;
  gorevde: boolean;
  aktifPaketIdleri: string[];
}

export function useKuryeKonumYayini({
  kuryeId,
  kuryeAdi,
  telefon,
  aracTipi,
  plaka,
  gorevde,
  aktifPaketIdleri
}: KuryeKonumYayiniOzellikleri) {
  const [yayinAktif, setYayinAktif] = useState(false);
  const [sonKonum, setSonKonum] = useState<{ enlem: number; boylam: number } | null>(null);
  const [hataMesaji, setHataMesaji] = useState<string | null>(null);
  const sonGonderimZamaniRef = useRef<number>(0);

  useEffect(() => {
    if (!gorevde) {
      setYayinAktif(false);
      return;
    }

    const konumGuncelle = (enlem: number, boylam: number, hizKmh: number = 0) => {
      const simdi = Date.now();
      // Veritabanını yormamak için her 3 saniyede en fazla 1 kez güncelle
      if (simdi - sonGonderimZamaniRef.current < 3000) return;
      sonGonderimZamaniRef.current = simdi;

      setSonKonum({ enlem, boylam });
      setYayinAktif(true);
      setHataMesaji(null);

      kuryeKonumunuFirebaseKaydet({
        kuryeId,
        kuryeAdi,
        telefon,
        aracTipi,
        plaka,
        enlem,
        boylam,
        hizKmh,
        aktifSiparisIdleri: aktifPaketIdleri
      });
    };

    let watchId: number | null = null;

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const hiz = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 26;
          konumGuncelle(pos.coords.latitude, pos.coords.longitude, hiz);
        },
        (err) => {
          // GPS izni verilmediğinde veya cihazda GPS olmadığında Afyon merkezden yayın başlatır
          setHataMesaji('Cihaz GPS izni bekleniyor veya varsayılan konum devrede.');
          konumGuncelle(38.7569, 30.5387, 25);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
      );
    } else {
      // Tarayıcı desteklemiyorsa Afyon merkez koordinatını kullan
      konumGuncelle(38.7569, 30.5387, 25);
    }

    return () => {
      if (watchId !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [gorevde, kuryeId, kuryeAdi, telefon, aracTipi, plaka, aktifPaketIdleri]);

  return { yayinAktif, sonKonum, hataMesaji };
}
