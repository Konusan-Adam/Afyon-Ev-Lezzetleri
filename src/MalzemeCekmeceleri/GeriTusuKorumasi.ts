// Android Cihazlarda Geri Tuşuna Basıldığında Uygulamanın Kapanmasını Önleyen Koruyucu
// Yüklü PWA'larda Android geri tuşu basıldığında işlemi öldürmez, uygulamayı açık tutar.

let korumaAktifMi = false;

export const geriTusuKorumasiniBaslat = () => {
  if (typeof window === 'undefined' || korumaAktifMi) return;
  korumaAktifMi = true;

  try {
    // Geçmişe emniyet kilidi ekle
    window.history.pushState({ kilit: 'afyon_aktif' }, '', window.location.href);

    window.addEventListener('popstate', (olay) => {
      // Geri tuşuna basıldığında Android'in uygulamayı kapatmasını engellemek için kilidi tazele
      window.history.pushState({ kilit: 'afyon_aktif' }, '', window.location.href);
    });

    // Kazara sekme/uygulama kapatılmasını önleme uyarısı
    window.addEventListener('beforeunload', (e) => {
      // Arka planda sipariş bekleyen mutfak veya kurye varsa uyar
      const mutfakVeyaKuryeMi = window.location.hash.includes('mutfak') || window.location.hash.includes('kurye');
      if (mutfakVeyaKuryeMi) {
        e.preventDefault();
        e.returnValue = 'Sipariş bildirimlerini kaçırmamak için uygulamanın açık kalması önerilir.';
      }
    });
  } catch (hata) {
    console.warn('Geri tuşu koruması hatası:', hata);
  }
};
