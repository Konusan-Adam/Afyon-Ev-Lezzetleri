import { useState, useEffect } from 'react';
import { KuryeAyarlari } from '@/src/veritabani/VeriTipleri';
import { belgeGetir, belgeKaydet, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';

const GENEL_AYARLAR_ID = 'genel_ayarlar';
const YEREL_KURYE_AYARLARI_KEY = 'afyon_kurye_ayarlari_v1';

export const VARSAYILAN_KURYE_AYARLARI: KuryeAyarlari = {
  id: GENEL_AYARLAR_ID,
  taban_ucret: 35,
  km_basi_ucret: 4,
  elektrikli_bonusu: 15,
  yagmurlu_hava_carpani: 1.25,
  gece_vardiyasi_primi: 20,
  ucretsiz_teslimat_aktif: true,
  ucretsiz_teslimat_esigi: 2000,
};

export function kuryeAyarlariniGetir(): KuryeAyarlari {
  try {
    const kayitli = localStorage.getItem(YEREL_KURYE_AYARLARI_KEY);
    if (kayitli) {
      return { ...VARSAYILAN_KURYE_AYARLARI, ...JSON.parse(kayitli) };
    }
  } catch {}
  return VARSAYILAN_KURYE_AYARLARI;
}

let aktifOnbellekAyarlar: KuryeAyarlari = kuryeAyarlariniGetir();
const aboneBilesenler = new Set<(ayar: KuryeAyarlari) => void>();
let ortakDinlemeDurdur: (() => void) | null = null;
let ilkYuklemeBasladi = false;
let windowDinleyiciEklendi = false;

function tumAboneleriGuncelle(yeniAyar: KuryeAyarlari) {
  aktifOnbellekAyarlar = yeniAyar;
  try {
    localStorage.setItem(YEREL_KURYE_AYARLARI_KEY, JSON.stringify(yeniAyar));
  } catch {}
  aboneBilesenler.forEach((cb) => cb(yeniAyar));
}

function ortakAbonelikBaslat() {
  if (typeof window !== 'undefined' && !ilkYuklemeBasladi) {
    ilkYuklemeBasladi = true;

    if (!windowDinleyiciEklendi) {
      windowDinleyiciEklendi = true;
      window.addEventListener('afyon_kurye_ayarlari_guncellendi', () => {
        tumAboneleriGuncelle(kuryeAyarlariniGetir());
      });
    }

    if (canliFirebaseAktifMi()) {
      belgeGetir<KuryeAyarlari>('genel_ayarlar', GENEL_AYARLAR_ID)
        .then((fbAyar) => {
          if (fbAyar) {
            tumAboneleriGuncelle({ ...VARSAYILAN_KURYE_AYARLARI, ...fbAyar });
          }
        })
        .catch(() => {});

      ortakDinlemeDurdur = koleksiyonuCanliDinle<KuryeAyarlari>('genel_ayarlar', (guncel) => {
        const bul = guncel.find((a) => a.id === GENEL_AYARLAR_ID);
        if (bul) {
          tumAboneleriGuncelle({ ...VARSAYILAN_KURYE_AYARLARI, ...bul });
        }
      });
    }
  }
}

export function useKuryeAyarlari() {
  const [ayarlar, setAyarlar] = useState<KuryeAyarlari>(aktifOnbellekAyarlar);

  useEffect(() => {
    ortakAbonelikBaslat();
    aboneBilesenler.add(setAyarlar);
    setAyarlar(aktifOnbellekAyarlar);

    return () => {
      aboneBilesenler.delete(setAyarlar);
      if (aboneBilesenler.size === 0 && ortakDinlemeDurdur) {
        ortakDinlemeDurdur();
        ortakDinlemeDurdur = null;
        ilkYuklemeBasladi = false;
      }
    };
  }, []);

  const ayarKaydet = async (yeniAyarlar: KuryeAyarlari) => {
    const tamAyar = { ...VARSAYILAN_KURYE_AYARLARI, ...yeniAyarlar, id: GENEL_AYARLAR_ID };
    tumAboneleriGuncelle(tamAyar);
    try {
      window.dispatchEvent(new Event('afyon_kurye_ayarlari_guncellendi'));
    } catch {}

    if (canliFirebaseAktifMi()) {
      await belgeKaydet('genel_ayarlar', GENEL_AYARLAR_ID, tamAyar);
    }
  };

  return { ayarlar, ayarKaydet };
}
