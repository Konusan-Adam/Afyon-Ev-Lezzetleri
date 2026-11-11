import { useState, useEffect } from 'react';
import { KuryeCanliKonumBilgisi } from '@/src/MalzemeCekmeceleri/CanliTakip/CanliTakipTipleri';
import { koleksiyonuCanliDinle, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { gercekMesafeMetreHesapla, tahminiSureDakikaHesapla } from '@/src/MalzemeCekmeceleri/CanliTakip/mesafeVeSureHesaplayici';

// Afyonkarahisar merkez teslimat referans koordinatı
const VARSAYILAN_MUSTERI_KOORDINATI = { enlem: 38.7585, boylam: 30.5445 };

export function useCanliKuryeTakip(siparisKodu: string) {
  const [bilgi, setBilgi] = useState<KuryeCanliKonumBilgisi>({
    kurye_id: 'kurye-canli',
    ad_soyad: 'Afyon Kurye Ekibi',
    telefon: '0850 303 03 03',
    arac_tipi: 'Motosiklet',
    plaka: '',
    anlik_konum: {
      enlem: 38.7569,
      boylam: 30.5387,
      etiket: 'Kurye GPS Sinyali Aranıyor...'
    },
    musteri_konum: VARSAYILAN_MUSTERI_KOORDINATI,
    kalan_dakika: 12,
    kalan_metre: 2400,
    anlik_hiz_kmh: 0,
    adim_indeksi: 2,
    tamamlandi_mi: false,
    gps_aktif_mi: false
  });

  useEffect(() => {
    if (!siparisKodu) return;

    let canliDinleyiciyiDurdur = () => {};

    const konumuGuncelle = (veriler: any[]) => {
      // 1. Sipariş kodu veya ID ile eşleşen kurye konum kaydını bul
      const eslesen = veriler.find(
        (v) =>
          v.id === siparisKodu ||
          v.siparis_id === siparisKodu ||
          (v.aktif_siparis_idleri && v.aktif_siparis_idleri.includes(siparisKodu))
      ) || veriler[0]; // Genel ilk aktif kurye konumu (tolerans)

      if (!eslesen || !eslesen.enlem || !eslesen.boylam) {
        return;
      }

      const kuryeEnlem = Number(eslesen.enlem);
      const kuryeBoylam = Number(eslesen.boylam);
      const anlikHiz = Number(eslesen.hiz_kmh) || 28;

      const mesafe = gercekMesafeMetreHesapla(
        kuryeEnlem,
        kuryeBoylam,
        VARSAYILAN_MUSTERI_KOORDINATI.enlem,
        VARSAYILAN_MUSTERI_KOORDINATI.boylam
      );

      const kalanDakika = tahminiSureDakikaHesapla(mesafe, anlikHiz);
      const kapidaMi = mesafe <= 60;

      setBilgi({
        kurye_id: eslesen.kurye_id || 'kurye-1',
        ad_soyad: eslesen.kurye_adi || 'Saha Kuryesi',
        telefon: eslesen.telefon || '',
        arac_tipi: eslesen.arac_tipi || 'Motosiklet',
        plaka: eslesen.plaka || '',
        anlik_konum: {
          enlem: kuryeEnlem,
          boylam: kuryeBoylam,
          etiket: kapidaMi ? 'Müşteri Kapısında' : 'Yolda (Canlı GPS Aktif)'
        },
        musteri_konum: VARSAYILAN_MUSTERI_KOORDINATI,
        kalan_dakika: kapidaMi ? 0 : kalanDakika,
        kalan_metre: kapidaMi ? 0 : mesafe,
        anlik_hiz_kmh: kapidaMi ? 0 : anlikHiz,
        adim_indeksi: kapidaMi ? 9 : 3,
        tamamlandi_mi: kapidaMi,
        gps_aktif_mi: true,
        son_guncelleme: eslesen.guncellenme_zamani
      });
    };

    // Firebase'deki kurye_konumlari koleksiyonunu canlı dinle (onSnapshot)
    canliDinleyiciyiDurdur = koleksiyonuCanliDinle<any>('kurye_konumlari', (guncelVeriler) => {
      konumuGuncelle(guncelVeriler);
    });

    // İlk açılışta anında bir kez getir
    koleksiyonGetir<any>('kurye_konumlari').then((veriler) => {
      if (veriler && veriler.length > 0) {
        konumuGuncelle(veriler);
      }
    });

    return () => {
      canliDinleyiciyiDurdur();
    };
  }, [siparisKodu]);

  return { bilgi, adim: bilgi.adim_indeksi };
}
