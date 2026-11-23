import { useState, useEffect, useCallback } from 'react';
import { TEST_SIPARISLERI, TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import {
  yerelSiparisleriGetir,
  yerelSiparisKaydet,
  yerelSiparisDurumGuncelle,
  yerelSiparisSenkronizeEt,
  aktifMisafirSiparisSayisiGetir,
} from './SiparisVeOdeme/yerelSiparisDeposu';
import {
  firestoreSiparisiniDonustur,
  musteriSiparisleriniSuz,
} from './SiparisVeOdeme/siparisFiltreVeDonusturucu';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { subeSiparisleriniHaritayaBirlestir } from './Sube/subeSiparisSenkronYardimcisi';
import { siparisAktifMi } from './SiparisVeOdeme/siparisDurumYardimcisi';

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

  const listeyiIsleVeAyarla = useCallback(
    (canliKayitlar: any[], subeKayitlari: SubeSiparisi[] = []) => {
      const birlesikHam = subeSiparisleriniHaritayaBirlestir(canliKayitlar, subeKayitlari);
      const donusturulmus = birlesikHam.map(firestoreSiparisiniDonustur);
      yerelSiparisSenkronizeEt(donusturulmus);

      const tekilHarita = new Map<string, TestSiparis>();
      donusturulmus.forEach((s) => tekilHarita.set(s.siparis_kodu || s.siparisKodu || s.id, s));

      const yerel = yerelSiparisleriGetir();
      yerel.forEach((s) => {
        const kod = s.siparis_kodu || s.siparisKodu || s.id;
        if (kod && tekilHarita.has(kod)) {
          const canli = tekilHarita.get(kod)!;
          tekilHarita.set(kod, {
            ...s,
            ...canli,
            pinKodu: canli.pinKodu || s.pinKodu,
            pin_kodu: canli.pin_kodu || s.pin_kodu,
            teslimat_kodu: canli.teslimat_kodu || s.teslimat_kodu,
            elemanlar: canli.elemanlar?.length > 0 ? canli.elemanlar : s.elemanlar,
          });
        }
      });

      const birlesik = Array.from(tekilHarita.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
      setSiparisler(musteriSiparisleriniSuz(birlesik, musteriId, musteriTelefon));
      setYukleniyor(false);
    },
    [musteriId, musteriTelefon]
  );

  const siparisleriYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);

    if (canliFirebaseAktifMi()) {
      try {
        const [fbSiparisler, fbSubeSiparisler] = await Promise.all([
          koleksiyonGetir<any>('siparisler'),
          koleksiyonGetir<SubeSiparisi>('sube_siparisleri'),
        ]);
        listeyiIsleVeAyarla(fbSiparisler || [], fbSubeSiparisler || []);
        return;
      } catch (err: any) {
        console.warn('Firebase siparişler okunurken hata:', err);
      }
    }

    const tekilHarita = new Map<string, TestSiparis>();
    TEST_SIPARISLERI.forEach((s) => tekilHaritadaBirlestir(tekilHarita, s));
    yerelSiparisleriGetir().forEach((s) => tekilHaritadaBirlestir(tekilHarita, s));
    const yedekListe = Array.from(tekilHarita.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
    setSiparisler(musteriSiparisleriniSuz(yedekListe, musteriId, musteriTelefon));
    setYukleniyor(false);
  }, [musteriId, musteriTelefon, listeyiIsleVeAyarla]);

  useEffect(() => {
    siparisleriYukle();
    let abonelikDurdur = () => {};
    let subeAbonelikDurdur = () => {};
    let sonGenelVeriler: any[] = [];
    let sonSubeVeriler: SubeSiparisi[] = [];

    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', (veriler) => {
        sonGenelVeriler = veriler || [];
        listeyiIsleVeAyarla(sonGenelVeriler, sonSubeVeriler);
      });
      subeAbonelikDurdur = koleksiyonuCanliDinle<SubeSiparisi>('sube_siparisleri', (veriler) => {
        sonSubeVeriler = veriler || [];
        listeyiIsleVeAyarla(sonGenelVeriler, sonSubeVeriler);
      });
    }
    const olayDinle = () => siparisleriYukle();
    window.addEventListener('afyon_siparis_durum_degisti', olayDinle);
    window.addEventListener('afyon_siparis_eklendi', olayDinle);
    return () => {
      abonelikDurdur();
      subeAbonelikDurdur();
      window.removeEventListener('afyon_siparis_durum_degisti', olayDinle);
      window.removeEventListener('afyon_siparis_eklendi', olayDinle);
    };
  }, [siparisleriYukle, listeyiIsleVeAyarla]);

  return { siparisler, yukleniyor, hata, yenile: siparisleriYukle };
}

export function useAktifSiparisSayisi(musteriId?: string, musteriTelefon?: string): number {
  const { siparisler } = useMusteriSiparisleri(musteriId, musteriTelefon);
  return siparisler.filter((s) => siparisAktifMi(s.durum)).length;
}
