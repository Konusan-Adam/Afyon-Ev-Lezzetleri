import { useState, useEffect } from 'react';
import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const useYemekler = (secilenKategoriSlug?: string) => {
  const [yemekler, setYemekler] = useState<YemekTipi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let dinlemeDurdur = () => {};

    const veriFiltrele = (hamListe: YemekTipi[]) => {
      const yayindakiYemekler = hamListe.filter((y: any) => {
        if (y.stokta_var_mi === false) return false;
        if (y.tukendi_mi === true) return false;
        if (y.onay_durumu === 'beklemede' || y.onay_durumu === 'reddedildi') return false;
        if (y.onayli_mi === false) return false;
        return true;
      });
      if (!secilenKategoriSlug || secilenKategoriSlug === 'tumu') {
        return yayindakiYemekler;
      }
      return yayindakiYemekler.filter((y) => y.kategori === secilenKategoriSlug);
    };

    const verileriIsle = (fbVerileri: YemekTipi[]) => {
      return fbVerileri || [];
    };

    const veriGetir = async () => {
      setYukleniyor(true);
      try {
        if (canliFirebaseAktifMi()) {
          const fb = await koleksiyonGetir<YemekTipi>('yemekler');
          const tumListe = verileriIsle(fb);
          setYemekler(veriFiltrele(tumListe));

          // Firebase'deki canlı değişiklikleri dinle
          dinlemeDurdur = koleksiyonuCanliDinle<YemekTipi>('yemekler', (guncelFb) => {
            const liste = verileriIsle(guncelFb);
            setYemekler(veriFiltrele(liste));
          });
        } else {
          setYemekler([]);
        }
      } catch (err: unknown) {
        setHata(err instanceof Error ? err.message : 'Yemekler alınamadı');
        setYemekler([]);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();

    return () => {
      dinlemeDurdur();
    };
  }, [secilenKategoriSlug]);

  return { yemekler, yukleniyor, hata };
};
