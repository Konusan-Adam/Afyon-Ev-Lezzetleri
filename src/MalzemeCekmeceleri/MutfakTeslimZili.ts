import { sekmeAlarmiBaslat } from './SekmeAlarmi';

// 🔔 Mutfak Masası Teslim Edildi Başarı Zili ve Bildirimi
export const mutfakTeslimZiliCal = (siparisKodu?: string) => {
  sekmeAlarmiBaslat('👏 (1) SİPARİŞ TESLİM EDİLDİ!');

  // 1. Web Audio API Yumuşak Aşçı Teşekkür Melodisi (La-Do#-Mi)
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const sesMerkezi = new AudioCtx();
      if (sesMerkezi.state === 'suspended') sesMerkezi.resume().catch(() => {});
      const simdi = sesMerkezi.currentTime;
      const notalar = [440, 554.37, 659.25];

      notalar.forEach((frekans, index) => {
        const baslama = simdi + index * 0.14;
        const osilator = sesMerkezi.createOscillator();
        const kazanc = sesMerkezi.createGain();
        osilator.type = 'sine';
        osilator.frequency.setValueAtTime(frekans, baslama);
        kazanc.gain.setValueAtTime(0.35, baslama);
        kazanc.gain.exponentialRampToValueAtTime(0.001, baslama + 0.8);
        osilator.connect(kazanc);
        kazanc.connect(sesMerkezi.destination);
        osilator.start(baslama);
        osilator.stop(baslama + 0.8);
      });
    }
  } catch {}

  // 2. Tarayıcı ve Android Masaüstü Bildirimi
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const baslik = 'Sipariş Teslim Edildi! 👏';
    const detay = siparisKodu
      ? `#${siparisKodu} nolu tencere siparişi müşteriye ulaştı. Eline sağlık usta!`
      : 'Siparişiniz müşteriye ulaştı. Eline sağlık usta!';
    const secenekler: any = {
      body: detay,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'afyon-teslim-mutfak',
      renotify: true,
      vibrate: [200, 100, 200]
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
