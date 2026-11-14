import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { PaytrOturumKaydi } from './PaytrDurumDeposu';

const KOLEKSIYON_ADI = 'paytr_oturumlari';

function sunucuFirestoreAl() {
  if (!firebaseConfig.projectId || !firebaseConfig.apiKey) return null;
  const uygulama = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(uygulama, firebaseConfig.firestoreDatabaseId);
}

export async function paytrFirestoreKaydet(kayit: PaytrOturumKaydi): Promise<boolean> {
  const db = sunucuFirestoreAl();
  if (!db) return false;
  try {
    const temizKayit: Record<string, unknown> = {
      merchantOid: kayit.merchantOid,
      durum: kayit.durum,
      tutarKurus: kayit.tutarKurus,
      demoMod: kayit.demoMod,
      guncellemeZamani: kayit.guncellemeZamani,
    };
    if (kayit.hataMesaji) {
      temizKayit.hataMesaji = kayit.hataMesaji;
    }
    await setDoc(doc(db, KOLEKSIYON_ADI, kayit.merchantOid), temizKayit, { merge: true });
    return true;
  } catch (hata) {
    console.warn('[PayTR Firestore Kayıt Uyarısı]:', hata);
    return false;
  }
}

export async function paytrFirestoreGetir(merchantOid: string): Promise<PaytrOturumKaydi | null> {
  const db = sunucuFirestoreAl();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, KOLEKSIYON_ADI, merchantOid));
    if (!snap.exists()) return null;
    return snap.data() as PaytrOturumKaydi;
  } catch (hata) {
    console.warn('[PayTR Firestore Okuma Uyarısı]:', hata);
    return null;
  }
}
