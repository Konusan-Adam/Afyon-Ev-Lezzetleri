import { useState, useEffect } from 'react';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle, belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const VARSAYILAN_SUBE_URUNLERI: SubeUrunu[] = [
  {
    id: 'sube-urun-1',
    sube_id: 'sube-1',
    ad: 'Taze Çıtır Afyon Mercimekli Bükmesi',
    aciklama: 'Közde haşhaşlı, çıtır el açması sıcak günlük bükme.',
    fiyat: 45,
    stok_adedi: 24,
    kategori: 'Bükmeler & Hamur İşi',
    gorsel_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
  {
    id: 'sube-urun-2',
    sube_id: 'sube-1',
    ad: 'Fırından Sıcak Patatesli Ağzıaçık',
    aciklama: 'Hakiki Afyon patatesi ve dana kıymalı geleneksel ağzıaçık.',
    fiyat: 40,
    stok_adedi: 18,
    kategori: 'Bükmeler & Hamur İşi',
    gorsel_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
  {
    id: 'sube-urun-3',
    sube_id: 'sube-1',
    ad: 'Süzme Yoğurtlu Afyon Ev Mantısı',
    aciklama: 'Nohutlu, tereyağlı naneli sosuyla sıcak servis porsiyon.',
    fiyat: 195,
    stok_adedi: 12,
    kategori: 'Ev Yemekleri',
    gorsel_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
  {
    id: 'sube-urun-4',
    sube_id: 'sube-1',
    ad: 'Geleneksel Vişneli Ekmek Kadayıfı & Manda Kaymağı',
    aciklama: 'Orijinal vişne şerbeti ve taze Afyon manda kaymağı dilimi.',
    fiyat: 120,
    stok_adedi: 9,
    kategori: 'Tatlılar',
    gorsel_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
  {
    id: 'sube-urun-5',
    sube_id: 'sube-2',
    ad: 'Kıymalı Çıtır Afyon Bükmesi',
    aciklama: 'Park Afyon fırınından yeni çıkmış sıcak bükme.',
    fiyat: 55,
    stok_adedi: 20,
    kategori: 'Bükmeler & Hamur İşi',
    gorsel_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
  {
    id: 'sube-urun-6',
    sube_id: 'sube-2',
    ad: 'Fırınlanmış Afyon Çullama Köftesi',
    aciklama: 'Özel baharat karışımlı, un ve yumurtayla fırınlanmış ev köftesi.',
    fiyat: 185,
    stok_adedi: 15,
    kategori: 'Ev Yemekleri',
    gorsel_url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80',
    marka: 'Afyon Ev Lezzetleri',
    hazir_mi: true,
    gunluk_taze_mi: true,
  },
];

export function useSubeUrunleri(subeId?: string | null) {
  const [urunler, setUrunler] = useState<SubeUrunu[]>(VARSAYILAN_SUBE_URUNLERI);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);

  useEffect(() => {
    let dinlemeDurdur: (() => void) | undefined;

    const veriGetir = async () => {
      if (!canliFirebaseAktifMi()) return;
      setYukleniyor(true);
      try {
        const fbUrunler = await koleksiyonGetir<SubeUrunu>('sube_stoklari');
        if (fbUrunler && fbUrunler.length > 0) {
          setUrunler(fbUrunler);
        } else {
          // Başlangıçta boşsa şube ürünlerini Firestore'a yükle
          for (const u of VARSAYILAN_SUBE_URUNLERI) {
            await belgeKaydet('sube_stoklari', u.id, u);
          }
        }
        dinlemeDurdur = koleksiyonuCanliDinle<SubeUrunu>('sube_stoklari', (guncel) => {
          if (guncel && guncel.length > 0) {
            setUrunler(guncel);
          }
        });
      } catch (err) {
        console.warn('Şube stokları çekilirken hata oluştu:', err);
      } finally {
        setYukleniyor(false);
      }
    };

    veriGetir();
    return () => {
      if (dinlemeDurdur) dinlemeDurdur();
    };
  }, []);

  const seciliSubeUrunleri = subeId
    ? urunler.filter((u) => u.sube_id === subeId)
    : urunler;

  return {
    urunler: seciliSubeUrunleri,
    tumUrunler: urunler,
    yukleniyor,
  };
}
