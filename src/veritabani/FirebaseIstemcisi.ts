import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const firebaseUygulamasi = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseUygulamasi, firebaseConfig.firestoreDatabaseId);
export const firebaseVeritabani = db;
export const auth = getAuth(firebaseUygulamasi);

export const canliFirebaseAktifMi = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
};

async function baglantiTestiYap() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (hata) {
    if (hata instanceof Error && hata.message.includes('the client is offline')) {
      console.warn('Firebase çevrimdışı, lütfen yapılandırmanızı kontrol ediniz.');
    }
  }
}

if (typeof window !== 'undefined') {
  baglantiTestiYap();
}
