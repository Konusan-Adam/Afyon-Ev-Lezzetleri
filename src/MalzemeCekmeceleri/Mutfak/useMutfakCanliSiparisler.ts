import { useState, useEffect, useRef } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { mutfakZiliCal } from './MutfakZilServisi';

export interface CanliSiparisTipi {
  id: string;
  siparisKodu?: string;
  pinKodu?: string;
  musteriAdi?: string;
  asama?: string;
  tutar?: number;
  urunler?: any[];
  olusturmaTarihi?: string;
}

export const useMutfakCanliSiparisler = () => {
  const [siparisler, setSiparisler] = useState<CanliSiparisTipi[]>([]);
  const oncekiSayiRef = useRef<number>(0);

  useEffect(() => {
    if (!canliFirebaseAktifMi()) return;

    const abonelikBitir = koleksiyonuCanliDinle<CanliSiparisTipi>('siparisler', (yeniSiparisler) => {
      if (oncekiSayiRef.current > 0 && yeniSiparisler.length > oncekiSayiRef.current) {
        const enSon = yeniSiparisler[yeniSiparisler.length - 1] || yeniSiparisler[0];
        const baslik = 'Yeni Mutfak Siparişi Geldi! 🍲';
        const detay = enSon?.musteriAdi
          ? `${enSon.musteriAdi} yeni bir sipariş verdi (${enSon.tutar || 0} ₺).`
          : 'Yeni bir tencere siparişi alındı.';
        mutfakZiliCal(baslik, detay);
      }
      oncekiSayiRef.current = yeniSiparisler.length;
      setSiparisler(yeniSiparisler);
    });

    return () => abonelikBitir();
  }, []);

  return { siparisler, toplamSiparisSayisi: siparisler.length };
};
