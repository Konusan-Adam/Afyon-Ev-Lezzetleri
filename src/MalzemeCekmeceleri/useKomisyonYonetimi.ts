import { useState, useEffect } from 'react';
import { KomisyonAyarTipi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonuCanliDinle, belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';

export const useKomisyonYonetimi = () => {
  const [ayarlar, setAyarlar] = useState<KomisyonAyarTipi[]>([]);

  useEffect(() => {
    if (canliFirebaseAktifMi()) {
      return koleksiyonuCanliDinle<KomisyonAyarTipi>('komisyon_ayarlari', (guncel) => {
        setAyarlar(guncel);
      });
    }
  }, []);

  const komisyonHesapla = (mutfakId: string, toplamTutar: number) => {
    // 1. Mutfak özel ayarı var mı?
    const mutfakAyari = ayarlar.find(a => a.tip === 'mutfak' && a.hedefId === mutfakId && a.aktif_mi);
    // 2. Genel ayar?
    const genelAyar = ayarlar.find(a => a.tip === 'genel' && a.aktif_mi);
    
    const aktifAyar = mutfakAyari || genelAyar;
    
    if (!aktifAyar) return { komisyonTutari: 0, platformBedeli: 0, netHakedis: toplamTutar };
    
    const komisyonTutari = (toplamTutar * aktifAyar.oran) / 100;
    const platformBedeli = aktifAyar.platformSabitUcret || 0;
    const netHakedis = toplamTutar - komisyonTutari - platformBedeli;
    
    return {
      komisyonTutari: Math.round(komisyonTutari * 100) / 100,
      platformBedeli,
      netHakedis: Math.round(netHakedis * 100) / 100
    };
  };

  return { ayarlar, komisyonHesapla };
};
