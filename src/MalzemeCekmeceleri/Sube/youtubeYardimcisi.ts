/**
 * YouTube Canlı Yayın ve Video Bağlantı Çözümleyici
 * Gizli (liste dışı) veya genel YouTube yayın linklerinden temiz embed URL üretir.
 */

export function youtubeVideoIdBul(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const temizUrl = url.trim();
  if (!temizUrl) return null;

  // Doğrudan video ID verilmişse (11 karakter tipik YouTube video ID)
  if (/^[a-zA-Z0-9_-]{11}$/.test(temizUrl)) {
    return temizUrl;
  }

  // Standart regex desenleri (watch?v=, youtu.be/, /live/, /embed/)
  const desenler = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/
  ];

  for (const desen of desenler) {
    const eslesme = temizUrl.match(desen);
    if (eslesme && eslesme[1]) {
      return eslesme[1];
    }
  }

  return null;
}

export function youtubeGomuluUrlUret(url?: string, otomatikOynat: boolean = true): string | null {
  const videoId = youtubeVideoIdBul(url);
  if (!videoId) return null;

  const parametreler = [
    otomatikOynat ? 'autoplay=1' : 'autoplay=0',
    'mute=1', // Tarayıcı otomatik oynatma engellerine takılmaması için sessiz başlar
    'playsinline=1',
    'rel=0',
    'modestbranding=1',
    'enablejsapi=1'
  ].join('&');

  return `https://www.youtube-nocookie.com/embed/${videoId}?${parametreler}`;
}
