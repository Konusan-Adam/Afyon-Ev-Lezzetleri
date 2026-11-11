// Sekme Başlığı Yanıp Sönen Alarm Yöneticisi
// Kullanıcı başka sekmedeyken veya tarayıcı simge durumundayken sekme adını alarm moduna geçirir.

let alarmZamanlayici: any = null;
let orijinalBaslik = typeof document !== 'undefined' ? document.title : 'Afyon Ev Lezzetleri';
let alarmAktifMi = false;

export const sekmeAlarmiBaslat = (alarmMetni: string = '🔔 YENİ SİPARİŞ VAR!') => {
  if (typeof document === 'undefined') return;

  if (!alarmAktifMi) {
    orijinalBaslik = document.title || 'Afyon Ev Lezzetleri';
    alarmAktifMi = true;
  }

  if (alarmZamanlayici) {
    clearInterval(alarmZamanlayici);
  }

  let durum = false;
  alarmZamanlayici = setInterval(() => {
    durum = !durum;
    document.title = durum ? alarmMetni : `⚠️ ${orijinalBaslik}`;
  }, 1000);

  // Kullanıcı sekmeye tıkladığında veya odaklandığında alarmı otomatik temizle
  const temizle = () => {
    sekmeAlarmiDurdur();
    window.removeEventListener('focus', temizle);
    window.removeEventListener('click', temizle);
  };

  window.addEventListener('focus', temizle);
  window.addEventListener('click', temizle);
};

export const sekmeAlarmiDurdur = () => {
  if (alarmZamanlayici) {
    clearInterval(alarmZamanlayici);
    alarmZamanlayici = null;
  }
  alarmAktifMi = false;
  if (typeof document !== 'undefined' && orijinalBaslik) {
    document.title = orijinalBaslik;
  }
};
