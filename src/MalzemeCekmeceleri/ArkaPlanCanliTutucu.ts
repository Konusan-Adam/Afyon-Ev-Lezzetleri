// Arka Plan Canlı Tutucu (Android RAM & LMK Koruması)
// Uygulama simge durumuna alındığında işletim sisteminin uygulamayı öldürmesini engeller.

let sesMerkezi: any = null;
let sessizOsilator: any = null;
let kalpAtisiZamanlayici: any = null;
let aktifMi = false;

export const arkaPlanCanliTutucuBaslat = () => {
  if (typeof window === 'undefined' || aktifMi) return;
  aktifMi = true;

  try {
    const AudioSinifi = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioSinifi) {
      sesMerkezi = new AudioSinifi();
      
      // İnsan kulağının duyamayacağı 0 seviyeli sessiz tampon (Android Media Session kilidi)
      const sessizTampon = sesMerkezi.createBuffer(1, sesMerkezi.sampleRate * 1, sesMerkezi.sampleRate);
      
      const sessizCal = () => {
        if (!sesMerkezi || sesMerkezi.state === 'closed') return;
        if (sesMerkezi.state === 'suspended') {
          sesMerkezi.resume().catch(() => {});
        }
        const kaynak = sesMerkezi.createBufferSource();
        kaynak.buffer = sessizTampon;
        kaynak.connect(sesMerkezi.destination);
        kaynak.start(0);
      };

      // Uygulama arka plana geçtiğinde sessiz kalp atışı ile Android'e "ben yaşıyorum" sinyali gönder
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          sessizCal();
        }
      });

      // Her 25 saniyede bir hafif kalp atışı
      kalpAtisiZamanlayici = setInterval(() => {
        sessizCal();
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'KALP_ATISI' });
        }
      }, 25000);
    }
  } catch (err) {
    console.warn('Arka plan canlı tutucu başlatılamadı:', err);
  }
};
