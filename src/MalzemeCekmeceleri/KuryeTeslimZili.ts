import { sekmeAlarmiBaslat } from './SekmeAlarmi';

// 🔔 Kurye Masası Teslimat Tamamlandı Prim Zili ve Bildirimi
export const kuryeTeslimZiliCal = (siparisKodu?: string) => {
  sekmeAlarmiBaslat('🛵 TESLİMAT TAMAMLANDI (+35₺)!');

  // 1. Web Audio API Canlı Prim Fanfarı (Re-Fa#-La)
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const sesMerkezi = new AudioCtx();
      if (sesMerkezi.state === 'suspended') sesMerkezi.resume().catch(() => {});
      const simdi = sesMerkezi.currentTime;
      const notalar = [587.33, 739.99, 880.00];

      notalar.forEach((frekans, index) => {
        const baslama = simdi + index * 0.1;
        const osilator = sesMerkezi.createOscillator();
        const kazanc = sesMerkezi.createGain();
        osilator.type = 'triangle';
        osilator.frequency.setValueAtTime(frekans, baslama);
        kazanc.gain.setValueAtTime(0.4, baslama);
        kazanc.gain.exponentialRampToValueAtTime(0.001, baslama + 0.7);
        osilator.connect(kazanc);
        kazanc.connect(sesMerkezi.destination);
        osilator.start(baslama);
        osilator.stop(baslama + 0.7);
      });
    }
  } catch {}

  // 2. Tarayıcı ve Android Masaüstü Bildirimi
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const baslik = 'Teslimat Başarıyla Tamamlandı! 🛵';
    const detay = siparisKodu
      ? `#${siparisKodu} nolu paket teslim edildi. +35 ₺ prim hesabınıza yansıdı.`
      : 'Paket teslim edildi. +35 ₺ prim hesabınıza yansıdı.';
    const secenekler: any = {
      body: detay,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'afyon-teslim-kurye',
      renotify: true,
      vibrate: [300, 100, 300]
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((k) => k.showNotification(baslik, secenekler))
        .catch(() => {
          try { new Notification(baslik, secenekler); } catch {}
        });
    } else {
      try { new Notification(baslik, secenekler); } catch {}
    }
  }
};
