import { sekmeAlarmiBaslat } from '@/src/MalzemeCekmeceleri/SekmeAlarmi';

// Web Audio API & Masaüstü / Telefon İşletim Sistemi Zili (Arka Plan Desteğiyle)
export const mutfakZiliCal = (baslik?: string, detay?: string) => {
  // 1. Sekme Başlığında Yanıp Sönen Alarm (Kullanıcı başka sekmedeyse)
  sekmeAlarmiBaslat('🔔 (1) YENİ SİPARİŞ GELİYOR!');

  // 2. Sayfa içi Web Audio Zili
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const sesMerkezi = new AudioContextClass();
      if (sesMerkezi.state === 'suspended') {
        sesMerkezi.resume().catch(() => {});
      }
      const simdi = sesMerkezi.currentTime;

      // 1. Ton (587.33 Hz - Re / D5)
      const osilator1 = sesMerkezi.createOscillator();
      const kazanc1 = sesMerkezi.createGain();
      osilator1.type = 'sine';
      osilator1.frequency.setValueAtTime(587.33, simdi);
      kazanc1.gain.setValueAtTime(0.4, simdi);
      kazanc1.gain.exponentialRampToValueAtTime(0.001, simdi + 0.8);
      osilator1.connect(kazanc1);
      kazanc1.connect(sesMerkezi.destination);
      osilator1.start(simdi);
      osilator1.stop(simdi + 0.8);

      // 2. Ton (880 Hz - La / A5)
      const osilator2 = sesMerkezi.createOscillator();
      const kazanc2 = sesMerkezi.createGain();
      osilator2.type = 'sine';
      osilator2.frequency.setValueAtTime(880, simdi + 0.15);
      kazanc2.gain.setValueAtTime(0.45, simdi + 0.15);
      kazanc2.gain.exponentialRampToValueAtTime(0.001, simdi + 1.2);
      osilator2.connect(kazanc2);
      kazanc2.connect(sesMerkezi.destination);
      osilator2.start(simdi + 0.15);
      osilator2.stop(simdi + 1.2);
    }
  } catch (hata) {
    console.warn('Mutfak zili çalınamadı:', hata);
  }

  // 3. Arka Plan & Masaüstü/Telefon İşletim Sistemi Bildirimi (Android & Masaüstü SW Uyumlu)
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const bildirimBaslik = baslik || 'Yeni Mutfak Siparişi Geldi! 🍲';
    const bildirimDetay = detay || 'Taze sipariş tencereye girmek için onayınızı bekliyor.';
    const bildirimSecenekleri: any = {
      body: bildirimDetay,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'afyon-mutfak-siparis',
      renotify: true,
      silent: false,
    };

    // Android Chrome ve modern tarayıcılar için Service Worker Registration üzerinden bildirim aç
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((kayit) => {
        kayit.showNotification(bildirimBaslik, {
          ...bildirimSecenekleri,
          vibrate: [300, 150, 300, 150, 300] as any,
        }).catch(() => {
          // Fallback
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

