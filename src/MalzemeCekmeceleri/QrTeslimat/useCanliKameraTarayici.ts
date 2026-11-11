/**
 * 🦁 AFYON EV LEZZETLERİ - CANLI KAMERA VE QR TARAYICI KANCASI
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 * Kamera akışını açar, jsQR ile kareleri canlı tarar
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';

interface KameraAyar {
  onKodBulundu: (kodMetni: string) => void;
  aktifMi: boolean;
}

export function useCanliKameraTarayici({ onKodBulundu, aktifMi }: KameraAyar) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animasyonIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tarananSonKodRef = useRef<string | null>(null);
  const onKodBulunduRef = useRef(onKodBulundu);

  // Callback referansını güncel tutarak fonksiyon bağımlılığı döngüsünü kırıyoruz
  useEffect(() => {
    onKodBulunduRef.current = onKodBulundu;
  }, [onKodBulundu]);

  const [kameraDurumu, setKameraDurumu] = useState<'hazirlaniyor' | 'aktif' | 'hata'>('hazirlaniyor');
  const [hataMesaji, setHataMesaji] = useState<string | null>(null);
  const [fenerDestegi, setFenerDestegi] = useState(false);
  const [fenerAcik, setFenerAcik] = useState(false);

  // Kamerayı tamamen durdurma ve donanımı serbest bırakma
  const kamerayiDurdur = useCallback(() => {
    if (animasyonIdRef.current) {
      cancelAnimationFrame(animasyonIdRef.current);
      animasyonIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setKameraDurumu('hazirlaniyor');
    setFenerAcik(false);
  }, []);

  // Kare kare tarama döngüsü
  const kareTara = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animasyonIdRef.current = requestAnimationFrame(kareTara);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
      // 1280x720 yerine 540p ölçeklendirme ile tarama hızını 4 katına çıkarıyoruz
      const hedefGenislik = Math.min(video.videoWidth, 640);
      const olcek = hedefGenislik / video.videoWidth;
      const hedefYukseklik = Math.round(video.videoHeight * olcek);

      if (canvas.width !== hedefGenislik || canvas.height !== hedefYukseklik) {
        canvas.width = hedefGenislik;
        canvas.height = hedefYukseklik;
      }

      ctx.drawImage(video, 0, 0, hedefGenislik, hedefYukseklik);

      const imageData = ctx.getImageData(0, 0, hedefGenislik, hedefYukseklik);
      // attemptBoth: Ekrandaki yansımaları, parlaklık farklarını ve koyu mod kontrastlarını çözer
      const sonuc = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (sonuc && sonuc.data && sonuc.data.trim().length > 0) {
        const okunan = sonuc.data.trim();
        if (tarananSonKodRef.current !== okunan) {
          tarananSonKodRef.current = okunan;
          if (navigator.vibrate) {
            try { navigator.vibrate(100); } catch { /* Mobil titreşim */ }
          }
          onKodBulunduRef.current(okunan);
          return;
        }
      }
    }

    animasyonIdRef.current = requestAnimationFrame(kareTara);
  }, []);

  // Kamerayı başlatma (Zaten aktifse yeniden başlatmaz - titremeyi engeller)
  const kamerayiBaslat = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setKameraDurumu('hata');
      setHataMesaji('Tarayıcınız canlı kamera erişimini desteklemiyor.');
      return;
    }

    // Kamera akışı zaten canlı ve tıkır tıkır çalışıyorsa tekrar isteme
    if (streamRef.current && streamRef.current.active) {
      setKameraDurumu('aktif');
      if (!animasyonIdRef.current) {
        animasyonIdRef.current = requestAnimationFrame(kareTara);
      }
      return;
    }

    setKameraDurumu('hazirlaniyor');
    setHataMesaji(null);
    tarananSonKodRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Kamera netliği ve fener yetenekleri
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const yetenekler: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        setFenerDestegi(!!yetenekler.torch);

        // Yakın mesafeden telefon ekranını anında netlemesi için sürekli oto-fokus aç
        if (yetenekler.focusMode && Array.isArray(yetenekler.focusMode) && yetenekler.focusMode.includes('continuous')) {
          try {
            await (videoTrack as any).applyConstraints({
              advanced: [{ focusMode: 'continuous' }]
            });
          } catch {
            // Cihaz kısıtı reddederse varsayılan odaklama sürer
          }
        }
      }

      setKameraDurumu('aktif');
      animasyonIdRef.current = requestAnimationFrame(kareTara);
    } catch (err: any) {
      setKameraDurumu('hata');
      const mesaj = err?.name === 'NotAllowedError'
        ? 'Kamera izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.'
        : 'Kamera başlatılamadı. Cihazınızın kamerasını kontrol ediniz.';
      setHataMesaji(mesaj);
    }
  }, [kareTara]);

  // Feneri açıp kapatma
  const feneriDegistir = useCallback(async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && fenerDestegi) {
      try {
        const yeniDurum = !fenerAcik;
        await (track as any).applyConstraints({ advanced: [{ torch: yeniDurum }] });
        setFenerAcik(yeniDurum);
      } catch {
        // Fener donanımı desteklemedi
      }
    }
  }, [fenerAcik, fenerDestegi]);

  const sonKoduSifirla = useCallback(() => {
    tarananSonKodRef.current = null;
    if (!animasyonIdRef.current && videoRef.current) {
      animasyonIdRef.current = requestAnimationFrame(kareTara);
    }
  }, [kareTara]);

  // Sadece aktifMi değiştiğinde kamerayı yönet (Titreme/yeniden başlatma döngüsü yok)
  useEffect(() => {
    if (aktifMi) {
      kamerayiBaslat();
    } else {
      kamerayiDurdur();
    }
    return () => {
      kamerayiDurdur();
    };
  }, [aktifMi, kamerayiBaslat, kamerayiDurdur]);

  return {
    videoRef,
    kameraDurumu,
    hataMesaji,
    fenerDestegi,
    fenerAcik,
    feneriDegistir,
    kamerayiBaslat,
    kamerayiDurdur,
    sonKoduSifirla
  };
}
