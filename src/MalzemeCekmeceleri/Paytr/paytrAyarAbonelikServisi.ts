import { doc, onSnapshot } from 'firebase/firestore';
import { canliFirebaseAktifMi, firebaseVeritabani } from '@/src/veritabani/FirebaseIstemcisi';
import { firestoreHatasiniYonet, IslemTipi } from '@/src/veritabani/FirebaseHataYoneticisi';
import { PaytrCanliAyarlari, VARSAYILAN_PAYTR_AYARLARI } from './paytrAyarTipleri';

type PaytrAyarDinleyici = (ayar: PaytrCanliAyarlari, yukleniyor: boolean) => void;

let onbellekAyar: PaytrCanliAyarlari = VARSAYILAN_PAYTR_AYARLARI;
let yuklemeDurumu = true;
let abonelikDurdur: (() => void) | null = null;
const aboneler = new Set<PaytrAyarDinleyici>();

function tumAbonelereBildir() {
  aboneler.forEach((cb) => cb(onbellekAyar, yuklemeDurumu));
}

function canliDinlemeyiBaslat() {
  if (abonelikDurdur) return;
  if (!canliFirebaseAktifMi()) {
    yuklemeDurumu = false;
    tumAbonelereBildir();
    return;
  }

  const belgeYolu = 'genel_ayarlar/paytr_ayarlari';
  const docRef = doc(firebaseVeritabani, 'genel_ayarlar', 'paytr_ayarlari');
  abonelikDurdur = onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onbellekAyar = { ...VARSAYILAN_PAYTR_AYARLARI, ...(snap.data() as Partial<PaytrCanliAyarlari>) };
      } else {
        onbellekAyar = VARSAYILAN_PAYTR_AYARLARI;
      }
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

export function paytrAyarAboneligiEkle(cb: PaytrAyarDinleyici): () => void {
  aboneler.add(cb);
  canliDinlemeyiBaslat();
  cb(onbellekAyar, yuklemeDurumu);

  return () => {
    aboneler.delete(cb);
    if (aboneler.size === 0 && abonelikDurdur) {
      abonelikDurdur();
      abonelikDurdur = null;
    }
  };
}

export function anlikPaytrAyarlariniAl() {
  return { ayarlar: onbellekAyar, yukleniyor: yuklemeDurumu };
}
