import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Canli mod: Baslangic tohumlamasi kapali, veriler dogrudan Firestore'dan yonetilir.

import { geriTusuKorumasiniBaslat } from './MalzemeCekmeceleri/GeriTusuKorumasi';
import { arkaPlanCanliTutucuBaslat } from './MalzemeCekmeceleri/ArkaPlanCanliTutucu';

// Service Worker kaydı (Arka plan masaüstü sesli bildirimler ve PWA için)
if (typeof window !== 'undefined') {
  geriTusuKorumasiniBaslat();
  arkaPlanCanliTutucuBaslat();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker kayıt uyarısı:', err);
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
