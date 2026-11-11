import { sekmeAlarmiBaslat } from './SekmeAlarmi';

// 🔔 Müşteri Teslim Edildi Kutlama Zili ve Bildirimi
export const musteriTeslimZiliCal = (siparisKodu?: string) => {
  sekmeAlarmiBaslat('🎉 SİPARİŞİNİZ TESLİM EDİLDİ!');

  // 1. Web Audio API Kutlama Melodisi (Do-Mi-Sol-Do)
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const sesMerkezi = new AudioCtx();
      if (sesMerkezi.state === 'suspended') sesMerkezi.resume().catch(() => {});
      const simdi = sesMerkezi.currentTime;
      const notalar = [523.25, 659.25, 783.99, 1046.50];

      notalar.forEach((frekans, index) => {
        const baslama = simdi + index * 0.12;
        const osilator = sesMerkezi.createOscillator();
        const kazanc = sesMerkezi.createGain();
        osilator.type = 'triangle';
        osilator.frequency.setValueAtTime(frekans, baslama);
        kazanc.gain.setValueAtTime(0.35, baslama);
        kazanc.gain.exponentialRampToValueAtTime(0.001, baslama + 0.6);
        osilator.connect(kazanc);
        kazanc.connect(sesMerkezi.destination);
        osilator.start(baslama);
        osilator.stop(baslama + 0.6);
      });
    }
  } catch {}

  // 2. Tarayıcı ve Android Masaüstü Bildirimi
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const baslik = 'Siparişiniz Teslim Edildi! 🎉';
    const detay = siparisKodu
      ? `#${siparisKodu} nolu lezzetiniz kapınıza ulaştı. Afiyet olsun!`
      : 'Yemeğiniz kapınıza ulaştı. Afiyet olsun!';
    const secenekler: any = {
      body: detay,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'afyon-teslim-musteri',
      renotify: true,
      vibrate: [250, 100, 250]
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
