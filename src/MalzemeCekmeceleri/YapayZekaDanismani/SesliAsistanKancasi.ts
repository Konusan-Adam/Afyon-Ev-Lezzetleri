import { useState, useEffect, useRef, useCallback } from 'react';

// Tarayıcı Ses Tanıma ve Seslendirme Kancası
export function useSesliAsistan() {
  const [dinliyorMu, setDinliyorMu] = useState<boolean>(false);
  const [sesliOkumaAktif, setSesliOkumaAktif] = useState<boolean>(() => {
    try {
      const kayitli = localStorage.getItem('afyon_danisman_sesli_okuma');
      return kayitli !== null ? kayitli === 'true' : true;
    } catch {
      return true;
    }
  });

  const tanimaRef = useRef<any>(null);

  // Sesli okuma tercihini değiştir
  const sesliOkumaDurumuDegistir = useCallback(() => {
    setSesliOkumaAktif((onceki) => {
      const yeni = !onceki;
      try {
        localStorage.setItem('afyon_danisman_sesli_okuma', String(yeni));
      } catch {
        // Hata yok sayılır
      }
      if (!yeni && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return yeni;
    });
  }, []);

  // Metni seslendir
  const metniSeslendir = useCallback((metin: string) => {
    if (!sesliOkumaAktif || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Emojileri ve özel işaretleri temizle
      const temizMetin = metin
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{2B05}\u{2B06}\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}]/gu, '')
        .replace(/[*_#~]/g, '')
        .trim();

      if (!temizMetin) return;

      const konusma = new SpeechSynthesisUtterance(temizMetin);
      konusma.lang = 'tr-TR';
      konusma.rate = 1.0;
      konusma.pitch = 1.0;

      const sesler = window.speechSynthesis.getVoices();
      const turkceSes = sesler.find((s) => s.lang.startsWith('tr'));
      if (turkceSes) {
        konusma.voice = turkceSes;
      }

      window.speechSynthesis.speak(konusma);
    } catch (hata) {
      console.warn('[Seslendirme Hatası]:', hata);
    }
  }, [sesliOkumaAktif]);

  // Sesli okumayı durdur
  const sesiDurdur = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Mikrofon ile ses dinlemeyi başlat
  const mikrofonuBaslat = useCallback((sonucOldugunda: (metin: string) => void) => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız sesle girişi desteklemiyor. Lütfen klavye ile yazınız.');
      return;
    }

    try {
      if (tanimaRef.current) {
        tanimaRef.current.abort();
      }

      const tanima = new SpeechRecognition();
      tanima.lang = 'tr-TR';
      tanima.interimResults = false;
      tanima.continuous = false;

      tanima.onstart = () => {
        setDinliyorMu(true);
      };

      tanima.onresult = (event: any) => {
        const metin = event.results[0]?.[0]?.transcript;
        if (metin && metin.trim()) {
          sonucOldugunda(metin.trim());
        }
      };

      tanima.onerror = () => {
        setDinliyorMu(false);
      };

      tanima.onend = () => {
        setDinliyorMu(false);
      };

      tanimaRef.current = tanima;
      tanima.start();
    } catch {
      setDinliyorMu(false);
    }
  }, []);

  // Mikrofon dinlemeyi durdur
  const mikrofonuDurdur = useCallback(() => {
    if (tanimaRef.current) {
      tanimaRef.current.stop();
      setDinliyorMu(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (tanimaRef.current) tanimaRef.current.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    dinliyorMu,
    sesliOkumaAktif,
    sesliOkumaDurumuDegistir,
    metniSeslendir,
    sesiDurdur,
    mikrofonuBaslat,
    mikrofonuDurdur,
  };
}
