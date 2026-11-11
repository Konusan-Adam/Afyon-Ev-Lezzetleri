import { useState, useEffect } from 'react';
import { LezzetDanismaniAyarlari, VARSAYILAN_DANISMAN_AYARLARI } from './LezzetDanismaniTipleri';
import { belgeGetir, belgeKaydet, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const YEREL_HAFIZA_ANAHTARI = 'afyon_lezzet_danismani_ayarlari';

export function useLezzetDanismaniAyarlari() {
  const [ayarlar, setAyarlar] = useState<LezzetDanismaniAyarlari>(() => {
    try {
      const yerel = localStorage.getItem(YEREL_HAFIZA_ANAHTARI);
      if (yerel) {
        const ayrilmis = JSON.parse(yerel);
        if (ayrilmis && !ayrilmis.karsilamaMesaji?.includes('hemşerim')) {
          return ayrilmis;
        }
      }
    } catch {
      // Hata yok sayılır
    }
    return VARSAYILAN_DANISMAN_AYARLARI;
  });

  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  useEffect(() => {
    let aktif = true;

    // Canlı Firestore dinleyicisi veya belge getirme
    const dinleyiciDurdur = koleksiyonuCanliDinle<any>('genel_ayarlar', (belgeler) => {
      if (!aktif) return;
      const danismanBelgesi = belgeler.find((b) => b.id === 'lezzet_danismani');
      if (danismanBelgesi) {
        const yeniAyar: LezzetDanismaniAyarlari = {
          aktifMi: danismanBelgesi.aktifMi ?? true,
          karsilamaMesaji: danismanBelgesi.karsilamaMesaji || VARSAYILAN_DANISMAN_AYARLARI.karsilamaMesaji,
          baloncukMetni: danismanBelgesi.baloncukMetni || VARSAYILAN_DANISMAN_AYARLARI.baloncukMetni,
        };
        setAyarlar(yeniAyar);
        localStorage.setItem(YEREL_HAFIZA_ANAHTARI, JSON.stringify(yeniAyar));
      }
      setYukleniyor(false);
    });

    return () => {
      aktif = false;
      dinleyiciDurdur();
    };
  }, []);

  const ayarlariGuncelle = async (yeniAyarlar: Partial<LezzetDanismaniAyarlari>) => {
    const birlestirilmis: LezzetDanismaniAyarlari = {
      ...ayarlar,
      ...yeniAyarlar,
    };
    setAyarlar(birlestirilmis);
    try {
      localStorage.setItem(YEREL_HAFIZA_ANAHTARI, JSON.stringify(birlestirilmis));
      await belgeKaydet('genel_ayarlar', 'lezzet_danismani', birlestirilmis);
      return true;
    } catch (hata) {
      console.error('[Danışman Ayar Kayıt Hatası]:', hata);
      return false;
    }
  };

  return {
    ayarlar,
    yukleniyor,
    ayarlariGuncelle,
  };
}
