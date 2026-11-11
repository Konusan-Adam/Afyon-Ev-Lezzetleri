import { kuryeAyarlariniGetir } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

export interface TeslimatBolgesi {
  bolgeAdi: string;
  mahalleler: string[];
  mesafeKm: number;
}

export const AFYON_TESLIMAT_BöLGELERI: TeslimatBolgesi[] = [
  {
    bolgeAdi: 'Merkez & Çarşı Çevresi',
    mahalleler: ['Cumhuriyet', 'Marulcu', 'Dumlupınar', 'Ali Çetinkaya', 'Yenice', 'Selçuklu'],
    mesafeKm: 2.5,
  },
  {
    bolgeAdi: 'Orta Halka (Üniversite & Erenler)',
    mahalleler: ['Erenler', 'Fatih', 'Ataköy', 'Karşıyaka', 'Harp İş', 'Kanlıca', 'Nazmi Saatçi'],
    mesafeKm: 6.0,
  },
  {
    bolgeAdi: 'Uzak Bölge & Termal Yerleşkeler',
    mahalleler: ['Erkmen', 'Ömer-Gecek', 'Sadıkbey', 'Kocatepe', 'Beyyazı', 'Çayırbağ'],
    mesafeKm: 12.0,
  },
];

export function mahalleyeGoreMesafeVeUcretBul(mahalleAdi?: string): { mesafeKm: number; bazUcret: number; bolgeAdi: string } {
  const ayarlar = kuryeAyarlariniGetir();
  const tabanUcret = Number(ayarlar.taban_ucret) || 20;
  const kmUcreti = Number(ayarlar.km_basi_ucret) || 2;

  let secilenMesafe = 2.5;
  let secilenBolge = 'Merkez & Çarşı Çevresi';

  let hedefMahalle = mahalleAdi;
  if (!hedefMahalle && typeof window !== 'undefined') {
    try {
      hedefMahalle = localStorage.getItem('afyon_aktif_secili_mahalle') || '';
      if (!hedefMahalle) {
        const misafirAdres = localStorage.getItem('afyon_misafir_secili_adres');
        if (misafirAdres) {
          const parsed = JSON.parse(misafirAdres);
          hedefMahalle = parsed?.mahalle || '';
        }
      }
    } catch {}
  }

  if (hedefMahalle) {
    const temizMahalle = hedefMahalle.trim().toLowerCase();
    for (const bolge of AFYON_TESLIMAT_BöLGELERI) {
      const eslesme = bolge.mahalleler.some((m) => m.toLowerCase().includes(temizMahalle) || temizMahalle.includes(m.toLowerCase()));
      if (eslesme) {
        secilenMesafe = bolge.mesafeKm;
        secilenBolge = bolge.bolgeAdi;
        break;
      }
    }
  }

  // Dinamik Akıllı Kurye Baz Ücreti: Taban + (KM * KM Başı)
  const hesaplananBazUcret = Math.round(tabanUcret + (secilenMesafe * kmUcreti));

  return {
    mesafeKm: secilenMesafe,
    bazUcret: Math.max(15, hesaplananBazUcret),
    bolgeAdi: secilenBolge,
  };
}

