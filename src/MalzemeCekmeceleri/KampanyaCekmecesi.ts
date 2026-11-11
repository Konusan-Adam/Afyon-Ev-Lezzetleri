import { useState, useEffect } from 'react';
import { AnaAfisOgesi } from '@/src/veritabani/GercekVeriYardimcisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle, belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const VARSAYILAN_MOBIL_KAMPANYALAR: AnaAfisOgesi[] = [
  {
    id: 'kamp-1',
    rozet: 'İLK SİPARİŞE ÖZEL',
    baslik: 'İlk Siparişine Özel %25 İndirim 🔥',
    aciklama: 'Karahisar ev kadınlarının hazırladığı taze lezzetlerle tanışın.',
    gorsel_url: 'https://pngimg.com/uploads/pie/pie_PNG51.png',
    butonMetni: 'Hemen Keşfet!',
    butonHedefi: 'kesfet',
    aktif: true,
    aktif_mi: true
  },
  {
    id: 'kamp-2',
    rozet: 'GÜNÜN FIRSATI',
    baslik: 'Kaymaklı Ekmek Kadayıfında 3 Al 2 Öde',
    aciklama: 'Manda kaymağının eşsiz lezzeti sofranızda şölene dönüşsün.',
    gorsel_url: 'https://pngimg.com/uploads/plate/plate_PNG5337.png',
    butonMetni: 'Hemen Keşfet!',
    butonHedefi: 'kesfet',
    aktif: true,
    aktif_mi: true
  },
  {
    id: 'kamp-3',
    rozet: 'GELENEKSEL LEZZET',
    baslik: 'Tandırda Hakiki Şuhut Keşkeği',
    aciklama: 'Saatlerce dövülen enfes geleneksel lezzet sıcacık kapında.',
    gorsel_url: 'https://pngimg.com/uploads/soup/soup_PNG86.png',
    butonMetni: 'Hemen Keşfet!',
    butonHedefi: 'kesfet',
    aktif: true,
    aktif_mi: true
  }
];

export const useKampanyalar = () => {
  const [kampanyalar, setKampanyalar] = useState<AnaAfisOgesi[]>(VARSAYILAN_MOBIL_KAMPANYALAR);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let dinlemeDurdur = () => {};

    const veriGetir = async () => {
      setYukleniyor(true);
      try {
        if (canliFirebaseAktifMi()) {
          const fb = await koleksiyonGetir<AnaAfisOgesi>('kampanyalar');
          setKampanyalar((fb || []).filter((k) => k.aktif_mi !== false && k.aktif !== false));

          dinlemeDurdur = koleksiyonuCanliDinle<AnaAfisOgesi>('kampanyalar', (guncelFb) => {
            setKampanyalar((guncelFb || []).filter((k) => k.aktif_mi !== false && k.aktif !== false));
          });
        } else {
          setKampanyalar([]);
        }
      } catch (err) {
        console.warn("Kampanya getirme hatası:", err);
        setKampanyalar([]);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();
    return () => dinlemeDurdur();
  }, []);

  const kampanyalariKaydet = async (yeniListe: AnaAfisOgesi[]): Promise<boolean> => {
    try {
      for (const kampanya of yeniListe) {
        await belgeKaydet('kampanyalar', kampanya.id, kampanya);
      }
      return true;
    } catch (e) {
      console.error("Kampanya kaydetme hatası:", e);
      return false;
    }
  };

  return { kampanyalar, yukleniyor, kampanyalariKaydet };
};
