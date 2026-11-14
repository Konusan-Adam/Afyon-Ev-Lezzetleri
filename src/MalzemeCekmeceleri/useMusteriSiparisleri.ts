import { useState, useEffect, useCallback } from 'react';
import { TEST_SIPARISLERI, TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import {
  yerelSiparisleriGetir,
  yerelSiparisKaydet,
  yerelSiparisDurumGuncelle,
  aktifMisafirSiparisSayisiGetir,
} from './SiparisVeOdeme/yerelSiparisDeposu';
import {
  firestoreSiparisiniDonustur,
  musteriSiparisleriniSuz,
} from './SiparisVeOdeme/siparisFiltreVeDonusturucu';

export {
  yerelSiparisleriGetir,
  yerelSiparisKaydet,
  yerelSiparisDurumGuncelle,
  aktifMisafirSiparisSayisiGetir,
};

function tekilHaritadaBirlestir(harita: Map<string, TestSiparis>, yeni: TestSiparis) {
  const kod = yeni.siparis_kodu || yeni.siparisKodu || yeni.id;
  if (!kod) return;
  const onceki = harita.get(kod);
  if (onceki) {
    harita.set(kod, {
      ...onceki,
      ...yeni,
      pinKodu: yeni.pinKodu || onceki.pinKodu,
      pin_kodu: yeni.pin_kodu || onceki.pin_kodu,
      teslimat_kodu: yeni.teslimat_kodu || onceki.teslimat_kodu,
      elemanlar: yeni.elemanlar?.length > 0 ? yeni.elemanlar : onceki.elemanlar,
    });
  } else {
    harita.set(kod, yeni);
  }
}

export function useMusteriSiparisleri(musteriId?: string, musteriTelefon?: string) {
  const [siparisler, setSiparisler] = useState<TestSiparis[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  const siparisleriYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);
    const tekilHarita = new Map<string, TestSiparis>();
    const yerel = yerelSiparisleriGetir();

    if (canliFirebaseAktifMi()) {
      try {
        const fbSiparisler = await koleksiyonGetir<any>('siparisler');
        yerel.forEach((s) => tekilHaritadaBirlestir(tekilHarita, s));
        (fbSiparisler || []).forEach((d: any) =>
          tekilHaritadaBirlestir(tekilHarita, firestoreSiparisiniDonustur(d))
        );
        const birlesik = Array.from(tekilHarita.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
        setSiparisler(musteriSiparisleriniSuz(birlesik, musteriId, musteriTelefon));
        setYukleniyor(false);
        return;
      } catch (err: any) {
        console.warn('Firebase siparişler okunurken hata:', err);
      }
    }

    TEST_SIPARISLERI.forEach((s) => tekilHaritadaBirlestir(tekilHarita, s));
    yerel.forEach((s) => tekilHaritadaBirlestir(tekilHarita, s));
    const yedekListe = Array.from(tekilHarita.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
    setSiparisler(musteriSiparisleriniSuz(yedekListe, musteriId, musteriTelefon));
    setYukleniyor(false);
  }, [musteriId, musteriTelefon]);

  useEffect(() => {
    siparisleriYukle();
    let abonelikDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', () => siparisleriYukle());
    }
    const olayDinle = () => siparisleriYukle();
    window.addEventListener('afyon_siparis_durum_degisti', olayDinle);
    window.addEventListener('afyon_siparis_eklendi', olayDinle);
    return () => {
      abonelikDurdur();
      window.removeEventListener('afyon_siparis_durum_degisti', olayDinle);
      window.removeEventListener('afyon_siparis_eklendi', olayDinle);
    };
  }, [siparisleriYukle]);

  return { siparisler, yukleniyor, hata, yenile: siparisleriYukle };
}
