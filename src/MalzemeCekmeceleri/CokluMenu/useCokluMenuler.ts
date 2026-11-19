import { useState, useEffect, useMemo } from 'react';
import { CokluMenuTipi, MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { mutfakAboneligiEkle } from '@/src/MalzemeCekmeceleri/Mutfak/mutfakAbonelikServisi';
import { onayliMutfakMi } from '@/src/MalzemeCekmeceleri/Mutfak/mutfakFiltrelemeYardimcisi';

function gecerliCokluMenuMu(menu: CokluMenuTipi, aktifMutfaklar: MutfakTipi[]): boolean {
  if (menu.stokta_var_mi === false || menu.tukendi_mi === true) return false;
  if (menu.onay_durumu === 'beklemede' || menu.onay_durumu === 'reddedildi' || menu.onayli_mi === false) {
    return false;
  }
  if (!Array.isArray(menu.kalemler) || menu.kalemler.length === 0) return false;

  const bagliMutfak = aktifMutfaklar.find(
    (m) => m.id === menu.mutfak_id || m.kimlik === menu.mutfak_id
  );
  if (!bagliMutfak) return false;
  return onayliMutfakMi(bagliMutfak);
}

export function useCokluMenuler(hedefMutfakId?: string) {
  const [hamMenuler, setHamMenuler] = useState<CokluMenuTipi[]>([]);
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  useEffect(() => {
    if (!canliFirebaseAktifMi()) {
      setHamMenuler([]);
      setYukleniyor(false);
      return;
    }

    const mutfakCik = mutfakAboneligiEkle((liste) => {
      setMutfaklar(liste || []);
    });

    const menuCik = koleksiyonuCanliDinle<CokluMenuTipi>('coklu_menuler', (veriler) => {
      setHamMenuler(veriler || []);
      setYukleniyor(false);
    });

    return () => {
      mutfakCik();
      menuCik();
    };
  }, []);

  const cokluMenuler = useMemo(() => {
    return hamMenuler
      .filter((menu) => {
        if (!gecerliCokluMenuMu(menu, mutfaklar)) return false;
        if (hedefMutfakId) {
          const mutfakEslesen = mutfaklar.find(
            (m) => m.id === menu.mutfak_id || m.kimlik === menu.mutfak_id
          );
          const hedefEslesiyorMu =
            menu.mutfak_id === hedefMutfakId ||
            mutfakEslesen?.id === hedefMutfakId ||
            mutfakEslesen?.kimlik === hedefMutfakId;
          if (!hedefEslesiyorMu) return false;
        }
        return true;
      })
      .map((menu) => {
        const eslesenMutfak = mutfaklar.find(
          (m) => m.id === menu.mutfak_id || m.kimlik === menu.mutfak_id
        );
        return {
          ...menu,
          mutfak_adi: menu.mutfak_adi || eslesenMutfak?.ad || 'Afyon Ev Mutfağı',
        };
      });
  }, [hamMenuler, mutfaklar, hedefMutfakId]);

  return { cokluMenuler, yukleniyor };
}
