import { belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface KuryeKonumGonderiVerisi {
  kuryeId: string;
  kuryeAdi: string;
  telefon?: string;
  aracTipi?: string;
  plaka?: string;
  enlem: number;
  boylam: number;
  hizKmh?: number;
  aktifSiparisIdleri?: string[];
}

export async function kuryeKonumunuFirebaseKaydet(veri: KuryeKonumGonderiVerisi): Promise<boolean> {
  const guncelTarih = new Date().toISOString();
  const konumPaketi = {
    kurye_id: veri.kuryeId,
    kurye_adi: veri.kuryeAdi,
    telefon: veri.telefon || '',
    arac_tipi: veri.aracTipi || 'Motosiklet',
    plaka: veri.plaka || '',
    enlem: veri.enlem,
    boylam: veri.boylam,
    hiz_kmh: veri.hizKmh || 0,
    guncellenme_zamani: guncelTarih,
    gps_aktif_mi: true
  };

  try {
    // 1. Kurye kimliğiyle kaydet
    await belgeKaydet('kurye_konumlari', veri.kuryeId, konumPaketi);

    // 2. Kuryenin üzerindeki aktif siparişlerin belgelerine de eş zamanlı kaydet
    if (veri.aktifSiparisIdleri && veri.aktifSiparisIdleri.length > 0) {
      for (const siparisId of veri.aktifSiparisIdleri) {
        if (siparisId) {
          await belgeKaydet('kurye_konumlari', siparisId, {
            ...konumPaketi,
            siparis_id: siparisId
          });
        }
      }
    }
    return true;
  } catch (hata) {
    console.warn('Kurye GPS kaydetme uyarısı:', hata);
    return false;
  }
}
