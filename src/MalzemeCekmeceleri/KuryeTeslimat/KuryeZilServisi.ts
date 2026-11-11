import { sekmeAlarmiBaslat } from '@/src/MalzemeCekmeceleri/SekmeAlarmi';

// Kurye Dağıtım Masası Sesli Korna/Zil ve Masaüstü/Telefon Bildirim Servisi
export const kuryeZiliCal = (baslik?: string, detay?: string) => {
  // 1. Sekme Başlığı Yanıp Sönen Alarm (Kullanıcı başka sekmede veya haritadaysa)
  sekmeAlarmiBaslat('🛵 (1) YENİ PAKET HAZIR!');

  // 2. Web Audio API Korna / İkaz Zili (Çift Tonlu Bip-Bip)
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const sesMerkezi = new AudioContextClass();
      if (sesMerkezi.state === 'suspended') {
        sesMerkezi.resume().catch(() => {});
      }
      const simdi = sesMerkezi.currentTime;

      // 1. Bip (750 Hz)
      const osilator1 = sesMerkezi.createOscillator();
      const kazanc1 = sesMerkezi.createGain();
      osilator1.type = 'triangle';
      osilator1.frequency.setValueAtTime(750, simdi);
      kazanc1.gain.setValueAtTime(0.4, simdi);
      kazanc1.gain.exponentialRampToValueAtTime(0.001, simdi + 0.25);
      osilator1.connect(kazanc1);
      kazanc1.connect(sesMerkezi.destination);
      osilator1.start(simdi);
      osilator1.stop(simdi + 0.25);

      // 2. Bip (950 Hz - Daha yüksek ve enerjik)
      const osilator2 = sesMerkezi.createOscillator();
      const kazanc2 = sesMerkezi.createGain();
      osilator2.type = 'triangle';
      osilator2.frequency.setValueAtTime(950, simdi + 0.2);
      kazanc2.gain.setValueAtTime(0.45, simdi + 0.2);
      kazanc2.gain.exponentialRampToValueAtTime(0.001, simdi + 0.55);
      osilator2.connect(kazanc2);
      kazanc2.connect(sesMerkezi.destination);
      osilator2.start(simdi + 0.2);
      osilator2.stop(simdi + 0.55);
    }
  } catch (hata) {
    console.warn('Kurye zili çalınamadı:', hata);
  }

  // 3. Arka Plan & Masaüstü/Telefon İşletim Sistemi Bildirimi (Android & Masaüstü SW Uyumlu)
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const bildirimBaslik = baslik || 'Yeni Paket Dağıtıma Hazır! 🛵';
    const bildirimDetay = detay || 'Mutfakta paketlenen yeni sipariş kurye bekliyor.';
    const bildirimSecenekleri: any = {
      body: bildirimDetay,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'afyon-kurye-paket',
      renotify: true,
      silent: false,
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((kayit) => {
        kayit.showNotification(bildirimBaslik, {
          ...bildirimSecenekleri,
          vibrate: [350, 150, 350, 150, 350] as any,
        }).catch(() => {
          try {
            new Notification(bildirimBaslik, bildirimSecenekleri);
          } catch {}
        });
      }).catch(() => {
        try {
          new Notification(bildirimBaslik, bildirimSecenekleri);
        } catch {}
      });
    } else {
      try {
        const bildirim = new Notification(bildirimBaslik, bildirimSecenekleri);
        bildirim.onclick = () => {
          window.focus();
          bildirim.close();
        };
      } catch {}
    }
  }
};

