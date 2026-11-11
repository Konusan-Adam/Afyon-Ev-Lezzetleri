import { useState, useEffect, useRef } from 'react';
import { TakipVerisiTipi, SiparisAsamaTipi } from '@/src/MalzemeCekmeceleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { musteriTeslimZiliCal } from '@/src/MalzemeCekmeceleri/MusteriTeslimZili';

const YEREL_SIPARIS_ANAHTARI = 'afyon_son_aktif_siparis';

export const useSiparisTakipKancasi = () => {
  const [aktifSiparis, setAktifSiparis] = useState<TakipVerisiTipi | null>(() => {
    try {
      const ham = localStorage.getItem(YEREL_SIPARIS_ANAHTARI);
      return ham ? JSON.parse(ham) : null;
    } catch {
      return null;
    }
  });

  const [pencereAcik, setPencereAcik] = useState(false);
  const teslimZiliCalindiRef = useRef<boolean>(false);

  useEffect(() => {
    const dinle = () => {
      try {
        const ham = localStorage.getItem(YEREL_SIPARIS_ANAHTARI);
        setAktifSiparis(ham ? JSON.parse(ham) : null);
      } catch {}
    };

    const durumDinle = (e: any) => {
      const detay = e.detail;
      if (!detay) return;
      if (detay.durum === 'teslim_edildi') {
        const kod = detay.siparisKodu || detay.siparisKimligi;
        if (!teslimZiliCalindiRef.current) {
          teslimZiliCalindiRef.current = true;
          musteriTeslimZiliCal(kod);
        }
      }
    };

    window.addEventListener('afyon_yeni_siparis_olustu', dinle);
    window.addEventListener('afyon_siparis_durum_degisti', durumDinle);

    return () => {
      window.removeEventListener('afyon_yeni_siparis_olustu', dinle);
      window.removeEventListener('afyon_siparis_durum_degisti', durumDinle);
    };
  }, []);

  // Firebase Firestore üzerinden sipariş durumunu canlı dinle
  useEffect(() => {
    if (!aktifSiparis?.siparisKodu) return;

    let dinlemeDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      dinlemeDurdur = koleksiyonuCanliDinle<any>('siparisler', (siparisler) => {
        const eslesen = siparisler.find(
          (s) => s.id === aktifSiparis.siparisKodu || s.siparis_kodu === aktifSiparis.siparisKodu || s.siparisKodu === aktifSiparis.siparisKodu
        );

        if (eslesen) {
          const yeniAsama: SiparisAsamaTipi = 
            eslesen.durum === 'teslim_edildi' || eslesen.asama === 'teslim_edildi'
              ? 'teslim_edildi'
              : eslesen.durum === 'yolda' || eslesen.asama === 'kuryede'
              ? 'kuryede'
              : eslesen.durum === 'kapida'
              ? 'kapida'
              : 'ocakta';

          if (yeniAsama === 'teslim_edildi' && aktifSiparis.asama !== 'teslim_edildi' && !teslimZiliCalindiRef.current) {
            teslimZiliCalindiRef.current = true;
            musteriTeslimZiliCal(aktifSiparis.siparisKodu);
          }

          const guncel: TakipVerisiTipi = {
            ...aktifSiparis,
            asama: yeniAsama,
            kuryeAdi: eslesen.kurye_adi || eslesen.kuryeAdi || aktifSiparis.kuryeAdi,
            tahminiDakika: yeniAsama === 'teslim_edildi' ? 0 : (eslesen.hazirlanmaSuresiDakika || aktifSiparis.tahminiDakika || 30),
            sonGuncelleme: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          };

          setAktifSiparis(guncel);
          try {
            localStorage.setItem(YEREL_SIPARIS_ANAHTARI, JSON.stringify(guncel));
          } catch {}
        }
      });
    }

    return () => {
      dinlemeDurdur();
    };
  }, [aktifSiparis?.siparisKodu, aktifSiparis?.asama]);

  const siparisKaydet = (siparis: TakipVerisiTipi) => {
    setAktifSiparis(siparis);
    localStorage.setItem(YEREL_SIPARIS_ANAHTARI, JSON.stringify(siparis));
    window.dispatchEvent(new Event('afyon_yeni_siparis_olustu'));
  };

  const takibiKapat = () => setPencereAcik(false);
  const takibiAc = () => setPencereAcik(true);

  return { aktifSiparis, pencereAcik, takibiAc, takibiKapat, siparisKaydet };
};
