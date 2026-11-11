import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { firebaseVeritabani, canliFirebaseAktifMi } from './FirebaseIstemcisi';
import { firestoreHatasiniYonet, IslemTipi } from './FirebaseHataYoneticisi';
export { canliFirebaseAktifMi };

function yetkiHatasiMi(hata: unknown): boolean {
  if (!hata) return false;
  const mesaj = hata instanceof Error ? hata.message : String(hata);
  return mesaj.includes('permission') || mesaj.includes('insufficient') || (hata as any)?.code === 'permission-denied';
}

function tanimsizAlanlariTemizle(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(tanimsizAlanlariTemizle);
  const sonuc: any = {};
  for (const anahtar of Object.keys(obj)) {
    const deger = obj[anahtar];
    if (deger !== undefined) {
      sonuc[anahtar] = tanimsizAlanlariTemizle(deger);
    }
  }
  return sonuc;
}

export async function koleksiyonGetir<T>(koleksiyonAdi: string): Promise<T[]> {
  try {
    const kolRef = collection(firebaseVeritabani, koleksiyonAdi);
    const snap = await getDocs(kolRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (hata) {
    if (yetkiHatasiMi(hata)) {
      firestoreHatasiniYonet(hata, IslemTipi.LIST, koleksiyonAdi);
    }
    console.warn(`Firebase ${koleksiyonAdi} okuma hatası:`, hata);
    return [];
  }
}

export function koleksiyonuCanliDinle<T>(
  koleksiyonAdi: string,
  geriCagirim: (veriler: T[]) => void
): () => void {
  try {
    const kolRef = collection(firebaseVeritabani, koleksiyonAdi);
    return onSnapshot(
      kolRef, 
      (snap) => {
        const veriler = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        geriCagirim(veriler);
      },
      (hata) => {
        if (yetkiHatasiMi(hata)) {
          firestoreHatasiniYonet(hata, IslemTipi.GET, koleksiyonAdi);
        }
        console.warn(`Firebase ${koleksiyonAdi} canlı dinleme hatası:`, hata);
      }
    );
  } catch (hata) {
    console.warn(`Firebase ${koleksiyonAdi} başlatma hatası:`, hata);
    return () => {};
  }
}

export async function belgeKaydet(koleksiyonAdi: string, belgeId: string, veri: any): Promise<boolean> {
  const temizVeri = tanimsizAlanlariTemizle(veri);
  try {
    const docRef = doc(firebaseVeritabani, koleksiyonAdi, belgeId);
    await setDoc(docRef, temizVeri, { merge: true });
    return true;
  } catch (hata) {
    if (yetkiHatasiMi(hata)) {
      firestoreHatasiniYonet(hata, IslemTipi.WRITE, `${koleksiyonAdi}/${belgeId}`);
    }
    console.error(`Firebase ${koleksiyonAdi} yazma hatası:`, hata);
    return false;
  }
}

export async function belgeGetir<T>(koleksiyonAdi: string, belgeId: string): Promise<T | null> {
  try {
    const docRef = doc(firebaseVeritabani, koleksiyonAdi, belgeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (hata) {
    if (yetkiHatasiMi(hata)) {
      firestoreHatasiniYonet(hata, IslemTipi.GET, `${koleksiyonAdi}/${belgeId}`);
    }
    console.warn(`Firebase ${koleksiyonAdi}/${belgeId} okuma hatası:`, hata);
    return null;
  }
}

export async function belgeSil(koleksiyonAdi: string, belgeId: string): Promise<boolean> {
  try {
    const docRef = doc(firebaseVeritabani, koleksiyonAdi, belgeId);
    await deleteDoc(docRef);
    return true;
  } catch (hata) {
    if (yetkiHatasiMi(hata)) {
      firestoreHatasiniYonet(hata, IslemTipi.DELETE, `${koleksiyonAdi}/${belgeId}`);
    }
    console.error(`Firebase ${koleksiyonAdi} silme hatası:`, hata);
    return false;
  }
}

export async function belgeEkle(koleksiyonAdi: string, veri: any): Promise<string | null> {
  const temizVeri = tanimsizAlanlariTemizle(veri);
  try {
    const kolRef = collection(firebaseVeritabani, koleksiyonAdi);
    const docRef = await addDoc(kolRef, temizVeri);
    return docRef.id;
  } catch (hata) {
    if (yetkiHatasiMi(hata)) {
      firestoreHatasiniYonet(hata, IslemTipi.CREATE, koleksiyonAdi);
    }
    console.error(`Firebase ${koleksiyonAdi} ekleme hatası:`, hata);
    return null;
  }
}
