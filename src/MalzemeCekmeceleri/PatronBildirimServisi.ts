import { useState, useEffect, useRef } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { 
  belgeKaydet, 
  belgeSil, 
  koleksiyonGetir, 
  koleksiyonuCanliDinle 
} from '@/src/veritabani/FirebaseKoleksiyonServisi';

export type PatronBildirimTuru = 
  | 'yeni_musteri'
  | 'yeni_mutfak'
  | 'yeni_kurye'
  | 'yeni_yemek'
  | 'iade_talebi'
  | 'hakedis_talebi'
  | 'yeni_siparis'
  | 'eksik_belge'
  | 'siparis_durumu'
  | 'genel';

export interface PatronBildirimi {
  id: string;
  tur: PatronBildirimTuru;
  baslik: string;
  detay: string;
  tarihSaat: string;
  okundu_mu: boolean;
  ilgiliKimlik?: string;
}

const YEREL_PATRON_BILDIRIMLERI_KEY = 'afyon_patron_canli_bildirimler_v1';

// Web Audio API Paylaşımlı Ses Motoru
let paylasimliAudioContext: AudioContext | null = null;

export const sesMotorunuBaslat = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!paylasimliAudioContext && AudioContextClass) {
      paylasimliAudioContext = new AudioContextClass();
    }
    if (paylasimliAudioContext && paylasimliAudioContext.state === 'suspended') {
      paylasimliAudioContext.resume();
    }
  } catch {}
};

if (typeof window !== 'undefined') {
  window.addEventListener('click', sesMotorunuBaslat, { once: false });
  window.addEventListener('keydown', sesMotorunuBaslat, { once: false });
  window.addEventListener('touchstart', sesMotorunuBaslat, { once: false });
}

// 🔔 Çift Tonlu Canlı Kasa / Bildirim Zili (Ding-Dong)
export const patronZilSesiCal = () => {
  if (typeof window === 'undefined') return;
  try {
    sesMotorunuBaslat();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = paylasimliAudioContext || (AudioContextClass ? new AudioContextClass() : null);
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const t = ctx.currentTime;
    
    // 1. Zil Tonu (C6 - 1046.5 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1046.5, t);
    gain1.gain.setValueAtTime(0.25, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.35);

    // 2. Zil Tonu (E6 - 1318.5 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, t + 0.12);
    gain2.gain.setValueAtTime(0.3, t + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.12);
    osc2.stop(t + 0.6);
  } catch (err) {
    console.warn('Patron bildirim zil sesi uyarısı:', err);
  }
};

/**
 * Masaüstü & İşletim Sistemi Bildirim İzni İsteme Fonksiyonu
 */
export const masaustuBildirimIzniIste = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    sesMotorunuBaslat();
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const izin = await Notification.requestPermission();
      return izin === 'granted';
    }
  } catch {}
  return false;
};

/**
 * Masaüstüne & Arka Plana Sesli Bildirim Kartı Gönderir
 * (Sekme arkadayken veya simge durumundayken Windows/Mac bildirim sesiyle çalar)
 */
export const masaustuBildirimGonder = (baslik: string, detay: string) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'BILDIRIM_GOSTER',
        baslik,
        detay,
        icon: '/favicon.png',
        tag: 'afyon-patron-' + Date.now(),
      });
      return;
    }

    const bildirim = new Notification(baslik, {
      body: detay,
      icon: '/favicon.png',
      tag: 'afyon-patron-' + Date.now(),
    });
    bildirim.onclick = () => {
      window.focus();
      bildirim.close();
    };
  } catch (hata) {
    console.warn('Masaüstü bildirim gönderme uyarısı:', hata);
  }
};

export const patronBildirimleriniGetir = (): PatronBildirimi[] => {
  try {
    const kayitli = localStorage.getItem(YEREL_PATRON_BILDIRIMLERI_KEY);
    if (kayitli) {
      return JSON.parse(kayitli);
    }
  } catch {}
  
  return [];
};

export const patronBildirimiEkle = (
  tur: PatronBildirimTuru,
  baslik: string,
  detay: string,
  ilgiliKimlik?: string
): PatronBildirimi => {
  console.log('[Bildirim]: Ekleme yapılıyor', tur, baslik);
  const yeniBildirim: PatronBildirimi = {
    id: 'bildirim_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
    tur,
    baslik,
    detay,
    tarihSaat: new Date().toLocaleString('tr-TR'),
    okundu_mu: false,
    ilgiliKimlik
  };

  try {
    const mevcut = patronBildirimleriniGetir();
    mevcut.unshift(yeniBildirim);
    if (mevcut.length > 100) mevcut.pop();
    localStorage.setItem(YEREL_PATRON_BILDIRIMLERI_KEY, JSON.stringify(mevcut));

    // Canlı Firebase'e anında kaydet
    if (canliFirebaseAktifMi()) {
      belgeKaydet('patron_bildirimleri', yeniBildirim.id, yeniBildirim).catch(err => {
        console.warn('Firebase patron bildirim kayıt uyarısı:', err);
      });
    }

    // Sesli zil çal
    patronZilSesiCal();

    // Masaüstü / Arka plana sesli işletim sistemi bildirimi fırlat
    masaustuBildirimGonder(baslik, detay);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_patron_yeni_bildirim', { detail: yeniBildirim }));
    }
  } catch (e) {
    console.error('Patron bildirimi kaydedilemedi:', e);
  }

  return yeniBildirim;
};

export const patronBildirimleriniOkunduIsaretle = (): void => {
  try {
    const mevcut = patronBildirimleriniGetir();
    const guncel = mevcut.map(b => ({ ...b, okundu_mu: true }));
    localStorage.setItem(YEREL_PATRON_BILDIRIMLERI_KEY, JSON.stringify(guncel));
    
    if (canliFirebaseAktifMi()) {
      guncel.forEach(b => {
        belgeKaydet('patron_bildirimleri', b.id, { okundu_mu: true }).catch(() => {});
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_patron_yeni_bildirim', { detail: null }));
    }
  } catch {}
};

export const patronBildirimiSil = (id: string): void => {
  try {
    const mevcut = patronBildirimleriniGetir();
    const guncel = mevcut.filter(b => b.id !== id);
    localStorage.setItem(YEREL_PATRON_BILDIRIMLERI_KEY, JSON.stringify(guncel));

    if (canliFirebaseAktifMi()) {
      belgeSil('patron_bildirimleri', id).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_patron_yeni_bildirim', { detail: null }));
    }
  } catch {}
};

// Canlı Patron Bildirimlerini Dinleyen React Hook'u
export function usePatronBildirimleri() {
  const [bildirimler, setBildirimler] = useState<PatronBildirimi[]>(patronBildirimleriniGetir());
  const bilinenIdlerRef = useRef<Set<string>>(new Set(patronBildirimleriniGetir().map(b => b.id)));
  const ilkYuklemeBittiRef = useRef<boolean>(false);

  useEffect(() => {
    let aktif = true;

    // 1. Canlı Firebase dinle
    let abonelikDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      koleksiyonGetir<PatronBildirimi>('patron_bildirimleri').then((fbListe) => {
        if (!aktif) return;
        if (fbListe && Array.isArray(fbListe) && fbListe.length > 0) {
          fbListe.sort((a, b) => (b.id > a.id ? 1 : -1));
          setBildirimler(fbListe);
          fbListe.forEach(b => bilinenIdlerRef.current.add(b.id));
          ilkYuklemeBittiRef.current = true;
          try {
            localStorage.setItem(YEREL_PATRON_BILDIRIMLERI_KEY, JSON.stringify(fbListe));
          } catch {}
        } else {
          ilkYuklemeBittiRef.current = true;
        }
      });

      abonelikDurdur = koleksiyonuCanliDinle<PatronBildirimi>('patron_bildirimleri', (fbBildirimler) => {
        if (!aktif) return;
        if (fbBildirimler && Array.isArray(fbBildirimler)) {
          fbBildirimler.sort((a, b) => (b.id > a.id ? 1 : -1));
          
          // İlk yükleme sonrası gelen GERÇEK YENİ bildirim varsa zil çal ve masaüstüne bildir
          if (ilkYuklemeBittiRef.current) {
            const yeniOlanlar = fbBildirimler.filter(b => !bilinenIdlerRef.current.has(b.id) && !b.okundu_mu);
            if (yeniOlanlar.length > 0) {
              patronZilSesiCal();
              const enSon = yeniOlanlar[0];
              if (enSon) {
                masaustuBildirimGonder(enSon.baslik, enSon.detay);
              }
            }
          }

          fbBildirimler.forEach(b => bilinenIdlerRef.current.add(b.id));
          setBildirimler(fbBildirimler);
          try {
            localStorage.setItem(YEREL_PATRON_BILDIRIMLERI_KEY, JSON.stringify(fbBildirimler));
          } catch {}
        }
      });
    } else {
      ilkYuklemeBittiRef.current = true;
    }

    // 2. Global pencere içi olayı dinle
    const yerelGuncelle = () => {
      const guncel = patronBildirimleriniGetir();
      setBildirimler(guncel);
    };
    window.addEventListener('afyon_patron_yeni_bildirim', yerelGuncelle);

    return () => {
      aktif = false;
      abonelikDurdur();
      window.removeEventListener('afyon_patron_yeni_bildirim', yerelGuncelle);
    };
  }, []);

  const okunmamisSayisi = bildirimler.filter(b => !b.okundu_mu).length;

  return {
    bildirimler,
    okunmamisSayisi,
    okunduIsaretle: patronBildirimleriniOkunduIsaretle,
    bildirimSil: patronBildirimiSil,
    zilSesiCal: patronZilSesiCal
  };
}
