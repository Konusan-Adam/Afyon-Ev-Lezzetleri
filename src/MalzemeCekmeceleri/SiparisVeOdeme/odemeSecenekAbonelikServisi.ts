import { doc, onSnapshot } from 'firebase/firestore';
import { canliFirebaseAktifMi, firebaseVeritabani } from '@/src/veritabani/FirebaseIstemcisi';
import { firestoreHatasiniYonet, IslemTipi } from '@/src/veritabani/FirebaseHataYoneticisi';
import {
  OdemeSecenekleriAyari,
  VARSAYILAN_ODEME_SECENEKLERI,
} from './odemeSecenekTipleri';

type SecenekDinleyici = (ayar: OdemeSecenekleriAyari, yukleniyor: boolean) => void;

let onbellekSecenekler: OdemeSecenekleriAyari = VARSAYILAN_ODEME_SECENEKLERI;
let yuklemeDurumu = true;
let abonelikDurdur: (() => void) | null = null;
const aboneler = new Set<SecenekDinleyici>();

function tumAbonelereBildir() {
  aboneler.forEach((cb) => cb(onbellekSecenekler, yuklemeDurumu));
}

function canliDinlemeyiBaslat() {
  if (abonelikDurdur) return;
  if (!canliFirebaseAktifMi()) {
    yuklemeDurumu = false;
    tumAbonelereBildir();
    return;
  }

  const belgeYolu = 'genel_ayarlar/odeme_secenekleri';
  const docRef = doc(firebaseVeritabani, 'genel_ayarlar', 'odeme_secenekleri');
  abonelikDurdur = onSnapshot(
    docRef,
    (snap) => {
      onbellekSecenekler = snap.exists()
        ? { ...VARSAYILAN_ODEME_SECENEKLERI, ...(snap.data() as Partial<OdemeSecenekleriAyari>) }
        : VARSAYILAN_ODEME_SECENEKLERI;
      yuklemeDurumu = false;
      tumAbonelereBildir();
    },
    (hata) => {
      const mesaj = hata instanceof Error ? hata.message : String(hata);
      if (mesaj.includes('permission') || mesaj.includes('insufficient')) {
        firestoreHatasiniYonet(hata, IslemTipi.GET, belgeYolu);
      }
      yuklemeDurumu = false;
      tumAbonelereBildir();
    }
  );
}

export function odemeSecenekAboneligiEkle(cb: SecenekDinleyici): () => void {
  aboneler.add(cb);
  canliDinlemeyiBaslat();
  cb(onbellekSecenekler, yuklemeDurumu);
  return () => {
    aboneler.delete(cb);
    if (aboneler.size === 0 && abonelikDurdur) {
      abonelikDurdur();
      abonelikDurdur = null;
    }
  };
}

export function anlikOdemeSecenekleriniAl() {
  return { secenekler: onbellekSecenekler, yukleniyor: yuklemeDurumu };
}
