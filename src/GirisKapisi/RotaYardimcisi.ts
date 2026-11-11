import { PanelTipi } from '@/src/OrtakHavuz/KullaniciHafizasi';

/**
 * Tarayıcı adres çubuğundaki yolu, hash veya arama parametresini
 * analiz ederek ilgili APK / Panel tipini tespit eder.
 */
export function mevcutUrlPaneliniBul(): PanelTipi {
  if (typeof window === 'undefined') return 'vitrin';
  const yol = window.location.pathname.toLowerCase();
  const etiket = window.location.hash.toLowerCase();
  const parametre = new URLSearchParams(window.location.search).get('panel');

  if (yol.includes('musteri') || etiket.includes('musteri') || parametre === 'musteri') {
    return 'musteri';
  }
  if (yol.includes('sube') || parametre === 'sube') {
    return 'sube';
  }
  return 'vitrin';
}

/**
 * Sayfa yenilenmeden adres çubuğunu ve başlığı ilgili APK rotasına eşitler.
 */
export function urlVeBasligiGuncelle(panel: PanelTipi): void {
  if (typeof window === 'undefined') return;

  const hedefYol = panel === 'musteri' ? '/musteri' : panel === 'sube' ? '/sube' : '/';
  if (window.location.pathname !== hedefYol && !window.location.hash) {
    window.history.pushState({ panel }, '', hedefYol);
  }

  const basliklar: Record<PanelTipi, string> = {
    vitrin: 'Afyon Ev Lezzetleri — Müşteri Vitrini',
    musteri: 'Afyon Ev Lezzetleri — Müşteri Hesabım',
    mutfak: 'Afyon Ev Lezzetleri — Müşteri Vitrini',
    kurye: 'Afyon Ev Lezzetleri — Müşteri Vitrini',
    patron: 'Afyon Ev Lezzetleri — Müşteri Vitrini',
    sube: 'Afyon Ev Lezzetleri — Şube Yönetim Paneli',
  };

  document.title = basliklar[panel] || 'Afyon Ev Lezzetleri';
}
