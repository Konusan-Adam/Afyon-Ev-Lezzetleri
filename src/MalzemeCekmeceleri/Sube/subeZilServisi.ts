const ZIL_AYAR_ANAHTARI = 'afyon_sube_zil_aktif';
let sesMotoru: AudioContext | null = null;

function sesMotorunuAl(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sesMotoru) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (Ctx) sesMotoru = new Ctx();
  }
  if (sesMotoru && sesMotoru.state === 'suspended') {
    sesMotoru.resume().catch(() => {});
  }
  return sesMotoru;
}

export function subeZilAktifMi(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ZIL_AYAR_ANAHTARI) !== 'kapali';
}

export function subeZilAyariniDegistir(aktif: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ZIL_AYAR_ANAHTARI, aktif ? 'acik' : 'kapali');
}

/**
 * 🚨 Nükleer Siren & Acil Durum Alarmı (Çift Osilatörlü Testere Dişi Frekans Dalgası)
 */
export function subeSiparisZiliCal(): void {
  if (!subeZilAktifMi()) return;
  const ctx = sesMotorunuAl();
  if (!ctx) return;

  const t = ctx.currentTime;
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const kazanc = ctx.createGain();

  o1.type = 'sawtooth';
  o2.type = 'sawtooth';

  // 1. Dalga: 450Hz -> 920Hz -> 520Hz -> 960Hz -> 400Hz (Klasik Nükleer Siren Yükselişi)
  o1.frequency.setValueAtTime(450, t);
  o1.frequency.linearRampToValueAtTime(920, t + 0.45);
  o1.frequency.linearRampToValueAtTime(520, t + 0.95);
  o1.frequency.linearRampToValueAtTime(960, t + 1.45);
  o1.frequency.linearRampToValueAtTime(400, t + 1.95);

  // 2. Osilatör (+8Hz akort kaymasıyla rahatsız edici çift mekanik korna uğultusu)
  o2.frequency.setValueAtTime(458, t);
  o2.frequency.linearRampToValueAtTime(928, t + 0.45);
  o2.frequency.linearRampToValueAtTime(528, t + 0.95);
  o2.frequency.linearRampToValueAtTime(968, t + 1.45);
  o2.frequency.linearRampToValueAtTime(408, t + 1.95);

  kazanc.gain.setValueAtTime(0.01, t);
  kazanc.gain.linearRampToValueAtTime(0.35, t + 0.1);
  kazanc.gain.setValueAtTime(0.35, t + 1.6);
  kazanc.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

  o1.connect(kazanc);
  o2.connect(kazanc);
  kazanc.connect(ctx.destination);

  o1.start(t);
  o2.start(t);
  o1.stop(t + 2.0);
  o2.stop(t + 2.0);
}
