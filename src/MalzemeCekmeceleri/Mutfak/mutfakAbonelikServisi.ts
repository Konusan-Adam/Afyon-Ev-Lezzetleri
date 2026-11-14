import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import {
  koleksiyonGetir,
  koleksiyonuCanliDinle,
  canliFirebaseAktifMi,
} from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { onayliMutfaklariSirala } from './mutfakFiltrelemeYardimcisi';

type Dinleyici = (mutfaklar: MutfakTipi[], yukleniyor: boolean, hata: string | null) => void;

let onbellekMutfaklar: MutfakTipi[] = [];
let yuklemeDurumu = true;
let aktifHata: string | null = null;
let abonelikBaslatildi = false;
let dinlemeDurdur: (() => void) | null = null;
const aboneler = new Set<Dinleyici>();

function tumAbonelereBildir() {
  aboneler.forEach((cb) => cb(onbellekMutfaklar, yuklemeDurumu, aktifHata));
}

function ortakDinlemeyiBaslat() {
  if (abonelikBaslatildi) return;
  abonelikBaslatildi = true;

  if (!canliFirebaseAktifMi()) {
    onbellekMutfaklar = [];
    yuklemeDurumu = false;
    tumAbonelereBildir();
    return;
  }

  koleksiyonGetir<MutfakTipi>('mutfaklar')
    .then((veriler) => {
      onbellekMutfaklar = onayliMutfaklariSirala(veriler || []);
      aktifHata = null;
      yuklemeDurumu = false;
      tumAbonelereBildir();
    })
    .catch((err: unknown) => {
      aktifHata = err instanceof Error ? err.message : 'Mutfaklar alınamadı';
      yuklemeDurumu = false;
      tumAbonelereBildir();
    });

  dinlemeDurdur = koleksiyonuCanliDinle<MutfakTipi>('mutfaklar', (guncel) => {
    onbellekMutfaklar = onayliMutfaklariSirala(guncel || []);
    yuklemeDurumu = false;
    tumAbonelereBildir();
  });
}

export function mutfakAboneligiEkle(cb: Dinleyici): () => void {
  aboneler.add(cb);
  ortakDinlemeyiBaslat();
  cb(onbellekMutfaklar, yuklemeDurumu, aktifHata);

  return () => {
    aboneler.delete(cb);
    if (aboneler.size === 0 && dinlemeDurdur) {
      dinlemeDurdur();
      dinlemeDurdur = null;
      abonelikBaslatildi = false;
    }
  };
}

export function anlikOnbellekMutfaklariAl() {
  return {
    mutfaklar: onbellekMutfaklar,
    yukleniyor: yuklemeDurumu,
    hata: aktifHata,
  };
}
