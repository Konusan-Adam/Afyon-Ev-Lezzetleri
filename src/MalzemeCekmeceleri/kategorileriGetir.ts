import { useState, useEffect, useCallback } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, belgeKaydet, belgeSil, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface AltKategori {
  id: string;
  ust_kategori_id?: string;
  ad: string;
  resim_url?: string;
  ikon?: string;
  sira?: number;
}

export interface Kategori {
  id: string;
  ad: string;
  ikon: string;
  slug?: string;
  resim_url?: string;
  sira?: number;
}

export const KATEGORI_GUNCELLEME_OLAYI = 'afyon_kategori_guncellendi';

function tekilKategorileriAyarla(liste: Kategori[]): Kategori[] {
  const gorulenIdler = new Set<string>();
  const gorulenAdlar = new Set<string>();
  const sonuc: Kategori[] = [];

  for (const kat of liste) {
    if (!kat || !kat.id) continue;
    const adNormalize = kat.ad?.trim().toLowerCase();

    // "Tümü" veya "hepsi" durumunda tek bir Tümü kartı oluştur
    if (kat.id === 'hepsi' || kat.ad === 'Tümü' || adNormalize === 'tümü' || kat.id === 'kat-1') {
      if (gorulenAdlar.has('tümü')) continue;
      gorulenAdlar.add('tümü');
      gorulenIdler.add('hepsi');
      sonuc.push({
        id: 'hepsi',
        ad: 'Tümü',
        ikon: kat.ikon || '🍽️',
        resim_url: kat.resim_url || 'https://pngimg.com/uploads/plate/plate_PNG5337.png',
        sira: 1
      });
      continue;
    }

    if (gorulenIdler.has(kat.id) || (adNormalize && gorulenAdlar.has(adNormalize))) {
      continue;
    }

    gorulenIdler.add(kat.id);
    if (adNormalize) gorulenAdlar.add(adNormalize);
    sonuc.push(kat);
  }

  return sonuc.sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
}

export const kategorileriGetir = () => {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  const verileriYenile = useCallback(async () => {
    if (canliFirebaseAktifMi()) {
      try {
        const [fbKat, fbAlt] = await Promise.all([
          koleksiyonGetir<Kategori>('kategoriler'),
          koleksiyonGetir<AltKategori>('alt_kategoriler')
        ]);
        if (fbKat.length > 0) {
          const tekiller = tekilKategorileriAyarla(fbKat);
          setKategoriler(tekiller);
        } else {
          // Henüz kategori eklenmemişse standartları tohumla
          await kategorileriStandartSifirla();
          const yeniKat = await koleksiyonGetir<Kategori>('kategoriler');
          setKategoriler(tekilKategorileriAyarla(yeniKat));
        }
        if (fbAlt.length > 0) {
          const gorulenAltlar = new Set<string>();
          const tekilAltlar = fbAlt.filter(alt => {
            if (!alt.id || gorulenAltlar.has(alt.id)) return false;
            gorulenAltlar.add(alt.id);
            return true;
          });
          setAltKategoriler([...tekilAltlar].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0)));
        }
        setYukleniyor(false);
        return;
      } catch (hata) {
        console.warn('Firebase kategori okuma hatası:', hata);
      }
    }

    setYukleniyor(false);
  }, []);

  useEffect(() => {
    verileriYenile();

    let dinleme1 = () => {};
    let dinleme2 = () => {};

    if (canliFirebaseAktifMi()) {
      dinleme1 = koleksiyonuCanliDinle('kategoriler', () => verileriYenile());
      dinleme2 = koleksiyonuCanliDinle('alt_kategoriler', () => verileriYenile());
    }

    const olayDinleyici = () => {
      verileriYenile();
    };

    window.addEventListener(KATEGORI_GUNCELLEME_OLAYI, olayDinleyici);
    return () => {
      window.removeEventListener(KATEGORI_GUNCELLEME_OLAYI, olayDinleyici);
      dinleme1();
      dinleme2();
    };
  }, [verileriYenile]);

  return { 
    kategoriler, 
    altKategoriler, 
    yukleniyor, 
    yenile: verileriYenile 
  };
};

export async function kategoriEkleIslemi(yeniKat: Kategori): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('kategoriler', yeniKat.id, yeniKat);
    } catch (e: any) {
      console.error('Firebase kategori ekleme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function kategoriGuncelleIslemi(id: string, guncel: Partial<Kategori>): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('kategoriler', id, guncel);
    } catch (e: any) {
      console.error('Firebase kategori güncelleme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function kategoriSilIslemi(id: string): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      // Bağlı alt kategorileri de tespit edip temizleyelim
      const tumAltlar = await koleksiyonGetir<AltKategori>('alt_kategoriler');
      const bagliAltlar = tumAltlar.filter((alt) => alt.ust_kategori_id === id);
      for (const alt of bagliAltlar) {
        await belgeSil('alt_kategoriler', alt.id);
      }
      await belgeSil('kategoriler', id);
    } catch (e: any) {
      console.error('Firebase kategori silme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function altKategoriEkleIslemi(yeniAlt: AltKategori): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('alt_kategoriler', yeniAlt.id, yeniAlt);
    } catch (e: any) {
      console.error('Firebase alt kategori ekleme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function altKategoriGuncelleIslemi(id: string, guncel: Partial<AltKategori>): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('alt_kategoriler', id, guncel);
    } catch (e: any) {
      console.error('Firebase alt kategori güncelleme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function altKategoriSilIslemi(id: string): Promise<{ basarili: boolean; hata?: string }> {
  if (canliFirebaseAktifMi()) {
    try {
      await belgeSil('alt_kategoriler', id);
    } catch (e: any) {
      console.error('Firebase alt kategori silme hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }
  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}

export async function kategorileriStandartSifirla(): Promise<{ basarili: boolean; hata?: string }> {
  const standartKategoriler: (Kategori & { slug?: string })[] = [
    { id: 'hepsi', ad: 'Tümü', slug: 'tumu', ikon: '🍽️', resim_url: 'https://pngimg.com/uploads/plate/plate_PNG5337.png', sira: 1 },
    { id: 'kat-2', ad: 'Bükme & Hamur İşi', slug: 'bukme', ikon: '🥐', resim_url: 'https://pngimg.com/uploads/pie/pie_PNG51.png', sira: 2 },
    { id: 'kat-3', ad: 'Afyon Mantısı', slug: 'manti', ikon: '🥟', resim_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=500&auto=format&fit=crop&q=80', sira: 3 },
    { id: 'kat-4', ad: 'Geleneksel Keşkek', slug: 'keskek', ikon: '🍲', resim_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80', sira: 4 },
    { id: 'kat-5', ad: 'Ekmek Kadayıfı & Tatlı', slug: 'tatli', ikon: '🍰', resim_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80', sira: 5 },
    { id: 'kat-6', ad: 'Sucuklu Lezzetler', slug: 'sucuk', ikon: '🥩', resim_url: 'https://pngimg.com/uploads/kebab/kebab_PNG48.png', sira: 6 }
  ];

  const standartAltlar: AltKategori[] = [
    { id: 'alt-bukme', ust_kategori_id: 'kat-2', ad: 'Mercimekli Bükmeler', sira: 1 },
    { id: 'alt-agziacik', ust_kategori_id: 'kat-2', ad: 'Kıymalı & Patatesli Ağzıaçık', sira: 2 },
    { id: 'alt-katmer', ust_kategori_id: 'kat-2', ad: 'Haşhaşlı Katmer & Bazlama', sira: 3 },
    { id: 'alt-manti', ust_kategori_id: 'kat-3', ad: 'El Açması Tepsi Mantıları', sira: 1 },
    { id: 'alt-keskek', ust_kategori_id: 'kat-4', ad: 'Çömlek Keşkekleri', sira: 1 },
    { id: 'alt-guvec', ust_kategori_id: 'kat-4', ad: 'Fırın & Güveç Yemekleri', sira: 2 },
    { id: 'alt-dolma-sarma', ust_kategori_id: 'kat-4', ad: 'Vişneli Yaprak Sarma & Dolma', sira: 3 },
    { id: 'alt-ekmek-kadayifi', ust_kategori_id: 'kat-5', ad: 'Kaymaklı Ekmek Kadayıfı', sira: 1 },
    { id: 'alt-kabak', ust_kategori_id: 'kat-5', ad: 'Tahinli & Fındıklı Kabak Tatlısı', sira: 2 },
    { id: 'alt-baklava', ust_kategori_id: 'kat-5', ad: 'Ev Baklavası & Şerbetliler', sira: 3 },
    { id: 'alt-sucuk-tava', ust_kategori_id: 'kat-6', ad: 'Afyon Sucuk Tava & Dürüm', sira: 1 },
    { id: 'alt-tas-kadayi-kavurma', ust_kategori_id: 'kat-6', ad: 'Kavurma & Çömlek Tandır', sira: 2 },
    { id: 'alt-kofte', ust_kategori_id: 'kat-6', ad: 'Anne Köftesi & İslim Kebabı', sira: 3 }
  ];

  if (canliFirebaseAktifMi()) {
    try {
      for (const kat of standartKategoriler) {
        await belgeKaydet('kategoriler', kat.id, kat);
      }
      for (const alt of standartAltlar) {
        await belgeKaydet('alt_kategoriler', alt.id, alt);
      }
    } catch (e: any) {
      console.error('Firebase standart kategori sıfırlama hatası:', e);
      window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
      return { basarili: false, hata: e?.message };
    }
  }

  window.dispatchEvent(new Event(KATEGORI_GUNCELLEME_OLAYI));
  return { basarili: true };
}
