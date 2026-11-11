import { useState, useEffect } from 'react';
import { GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle, belgeKaydet, belgeSil } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const BASLANGIC_GEL_AL_SUBELERI: GelAlSubesi[] = [
  {
    id: 'sube-1',
    kimlik: 'sube-1',
    ad: 'Zafer Meydanı Gel-Al & Dağıtım Noktası',
    adres: 'Zafer Meydanı No:3 Afyon Merkez',
    ilce: 'Merkez',
    mahalle: 'Cumhuriyet Mah.',
    calisma_saatleri: '09:00 - 22:00',
    hazirlanma_suresi: '15-20 dk',
    telefon: '0272 213 00 01',
    acik_mi: true,
    canli_yayin_aktif_mi: true,
    youtube_canli_yayin_linki: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    gorsel: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    aciklama: 'Afyonkarahisar Zafer Meydanı ana merkez şubemiz. Canlı hazırlık ve teslimat masamızı şeffaf kamerayla izleyebilirsiniz.',
    puan: 4.9,
    degerlendirme_sayisi: 142
  },
  {
    id: 'sube-2',
    kimlik: 'sube-2',
    ad: 'Park Afyon AVM Gel-Al Teslimat Masası',
    adres: 'Güvenevler Mah. İnönü Cad. No:2 Park Afyon Zemin Kat',
    ilce: 'Merkez',
    mahalle: 'Güvenevler Mah.',
    calisma_saatleri: '10:00 - 22:00',
    hazirlanma_suresi: '15-20 dk',
    telefon: '0272 214 00 02',
    acik_mi: true,
    canli_yayin_aktif_mi: false,
    gorsel: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    aciklama: 'Park Afyon AVM zemin kat hızlı paket teslim noktamız. Sıcak yemeklerinizi beklemeden teslim alabilirsiniz.',
    puan: 4.8,
    degerlendirme_sayisi: 89
  }
];

export function gelAlSubeleriGetir(): {
  subeler: GelAlSubesi[];
  yukleniyor: boolean;
  subeEkle: (yeniSube: Omit<GelAlSubesi, 'id' | 'kimlik'>) => Promise<boolean>;
  subeGuncelle: (subeId: string, guncelVeri: Partial<GelAlSubesi>) => Promise<boolean>;
  subeSil: (subeId: string) => Promise<boolean>;
} {
  const [subeler, setSubeler] = useState<GelAlSubesi[]>(BASLANGIC_GEL_AL_SUBELERI);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  useEffect(() => {
    let iptal = false;
    let dinlemeDurdur = () => {};

    async function yukle() {
      if (canliFirebaseAktifMi()) {
        try {
          const fbSubeler = await koleksiyonGetir<GelAlSubesi>('gel_al_subeleri');
          if (iptal) return;
          if (fbSubeler && fbSubeler.length > 0) {
            setSubeler(fbSubeler);
          } else {
            // İlk kez açılıyorsa Firestore'a tohumla
            for (const s of BASLANGIC_GEL_AL_SUBELERI) {
              if (s.id) {
                await belgeKaydet('gel_al_subeleri', s.id, s);
              }
            }
            setSubeler(BASLANGIC_GEL_AL_SUBELERI);
          }

          // Canlı dinleme başlat
          dinlemeDurdur = koleksiyonuCanliDinle<GelAlSubesi>('gel_al_subeleri', (guncelSubeler) => {
            if (guncelSubeler && guncelSubeler.length > 0) {
              setSubeler(guncelSubeler);
            }
          });
        } catch (hata) {
          console.warn("Gel-Al şubeleri çekilirken hata:", hata);
          setSubeler(BASLANGIC_GEL_AL_SUBELERI);
        } finally {
          if (!iptal) setYukleniyor(false);
        }
      } else {
        setSubeler(BASLANGIC_GEL_AL_SUBELERI);
        setYukleniyor(false);
      }
    }

    yukle();
    return () => {
      iptal = true;
      dinlemeDurdur();
    };
  }, []);

  const subeEkle = async (yeniSube: Omit<GelAlSubesi, 'id' | 'kimlik'>): Promise<boolean> => {
    const id = `sube-${Date.now()}`;
    const veri: GelAlSubesi = {
      ...yeniSube,
      id,
      kimlik: id,
      acik_mi: yeniSube.acik_mi !== false
    };

    if (canliFirebaseAktifMi()) {
      const basarili = await belgeKaydet('gel_al_subeleri', id, veri);
      if (basarili) {
        setSubeler(eski => [...eski, veri]);
        return true;
      }
      return false;
    } else {
      setSubeler(eski => [...eski, veri]);
      return true;
    }
  };

  const subeGuncelle = async (subeId: string, guncelVeri: Partial<GelAlSubesi>): Promise<boolean> => {
    if (canliFirebaseAktifMi()) {
      const basarili = await belgeKaydet('gel_al_subeleri', subeId, guncelVeri);
      if (basarili) {
        setSubeler(eski => eski.map(s => (s.id === subeId || s.kimlik === subeId) ? { ...s, ...guncelVeri } : s));
        return true;
      }
      return false;
    } else {
      setSubeler(eski => eski.map(s => (s.id === subeId || s.kimlik === subeId) ? { ...s, ...guncelVeri } : s));
      return true;
    }
  };

  const subeSil = async (subeId: string): Promise<boolean> => {
    if (canliFirebaseAktifMi()) {
      const basarili = await belgeSil('gel_al_subeleri', subeId);
      if (basarili) {
        setSubeler(eski => eski.filter(s => s.id !== subeId && s.kimlik !== subeId));
        return true;
      }
      return false;
    } else {
      setSubeler(eski => eski.filter(s => s.id !== subeId && s.kimlik !== subeId));
      return true;
    }
  };

  return { subeler, yukleniyor, subeEkle, subeGuncelle, subeSil };
}
