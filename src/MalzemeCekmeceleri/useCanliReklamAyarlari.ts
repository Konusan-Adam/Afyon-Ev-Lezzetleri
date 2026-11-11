import { useState, useEffect } from 'react';
import { 
  ReklamAyarlari, 
  TepeBantOgesi, 
  AnaAfisOgesi, 
  KareReklamOgesi 
} from '@/src/veritabani/GercekVeriYardimcisi';
import { 
  koleksiyonuCanliDinle, 
  koleksiyonGetir, 
  belgeKaydet 
} from '@/src/veritabani/FirebaseKoleksiyonServisi';

export const VARSAYILAN_REKLAM_VERILERI: ReklamAyarlari = {
  tepeBantAktif: true,
  tepeMetin: 'İlk siparişe özel indirim fırsatını kaçırma! Hemen sipariş ver.',
  afisAktif: true,
  afisBaslik: 'Ev Yapımı Haşhaşlı Bükme & Mantı',
  afisAciklama: 'Marifetli Afyonlu ev aşçılarımızın ellerinden çıkan doğal ve katkısız lezzetler.',
  afisGorselUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&auto=format&fit=crop&q=80',
  kareReklamAktif: true,
  kareBaslik: 'Geleneksel Afyon Tarhanası',
  kareAciklama: 'Doğal malzemelerle evde üretilen yöresel çorbalarımız sofranıza katılıyor.',
  kareGorselUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
  tepeBantListesi: [
    {
      id: 'tepe-1',
      metin: 'Afyon Ev Lezzetleri: Karahisarın en marifetli ev aşçıları kapınızda!',
      aktif: true,
      aktif_mi: true,
      butonMetni: 'Mutfakları Gör',
      butonHedefi: 'mutfaklar'
    },
    {
      id: 'tepe-2',
      metin: 'Sıcak & taze haşhaşlı bükme ve katmerler her sabah fırından yeni çıktı!',
      aktif: true,
      aktif_mi: true,
      butonMetni: 'İncele',
      butonHedefi: 'mutfaklar'
    }
  ],
  anaAfisListesi: [
    {
      id: 'afis-1',
      baslik: 'Ev Yapımı Haşhaşlı Bükme & Mantı',
      altBaslik: 'Marifetli Afyonlu ev aşçılarımızın ellerinden çıkan doğal ve katkısız lezzetleri hemen sipariş verin.',
      rozet: 'GELENEKSEL ANNE MUTFAĞI',
      gorselVerisi: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=1200&auto=format&fit=crop&q=80',
      butonMetni: 'Mutfakları İncele',
      butonHedefi: 'mutfaklar',
      aktif: true,
      aktif_mi: true,
      sira: 1
    },
    {
      id: 'afis-2',
      baslik: 'Hakiki Manda Kaymaklı Ekmek Kadayıfı',
      altBaslik: 'Geleneksel şerbetiyle kabartılmış, üzerinde bol taze manda kaymağıyla tatlı şöleni.',
      rozet: 'TATLI DÜNYASI',
      gorselVerisi: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&auto=format&fit=crop&q=80',
      butonMetni: 'Tatlıları Gör',
      butonHedefi: 'mutfaklar',
      aktif: true,
      aktif_mi: true,
      sira: 2
    },
    {
      id: 'afis-3',
      baslik: 'Fırın Güveçte Şuhut Keşkeği',
      altBaslik: 'Saatlerce odun ateşinde kemikli etle dövülerek hazırlanan nefis Afyon keşkeği.',
      rozet: 'COĞRAFİ İŞARETLİ LEZZET',
      gorselVerisi: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&auto=format&fit=crop&q=80',
      butonMetni: 'Sipariş Ver',
      butonHedefi: 'mutfaklar',
      aktif: true,
      aktif_mi: true,
      sira: 3
    }
  ],
  kareReklamListesi: [
    {
      id: 'kare-1',
      baslik: 'Geleneksel Afyon Tarhanası & Çorba',
      aciklama: 'Tamamen doğal malzemelerle evde üretilen yöresel çorbalarımız sofranıza lezzet katıyor.',
      rozet: 'ANNE ELİNDEN',
      gorselUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80',
      aktif: true,
      aktif_mi: true,
      butonMetni: 'Çorbaları İncele',
      butonHedefi: 'mutfaklar'
    },
    {
      id: 'kare-2',
      baslik: 'Öğle Menülerinde %20 İndirim',
      aciklama: 'Çömlek keşkek ve güveç siparişlerinize ev yapımı yayık ayran hediye!',
      rozet: 'ÖZEL FIRSAT',
      gorselUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
      aktif: true,
      aktif_mi: true,
      butonMetni: 'Fırsatı Yakala',
      butonHedefi: 'mutfaklar'
    }
  ]
};

export function useCanliReklamAyarlari() {
  const [ayarlar, setAyarlar] = useState<ReklamAyarlari>(VARSAYILAN_REKLAM_VERILERI);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let aktif = true;

    // 1. Canlı Firestore dinleyicisi
    const abonelikDurdur = koleksiyonuCanliDinle<any>('genel_ayarlar', (list) => {
      if (!aktif) return;
      const ana = list.find((item) => item.id === 'reklam_ayarlari');
      if (ana) {
        setAyarlar({
          ...VARSAYILAN_REKLAM_VERILERI,
          ...ana
        });
      }
      setYukleniyor(false);
    });

    // 2. İlk açılışta veritabanında henüz kayıt yoksa varsayılanı Firebase'e tohumla
    koleksiyonGetir<any>('genel_ayarlar').then((list) => {
      if (!aktif) return;
      const ana = list.find((item) => item.id === 'reklam_ayarlari');
      if (!ana) {
        belgeKaydet('genel_ayarlar', 'reklam_ayarlari', VARSAYILAN_REKLAM_VERILERI).catch(() => {});
      } else {
        setAyarlar({
          ...VARSAYILAN_REKLAM_VERILERI,
          ...ana
        });
      }
      setYukleniyor(false);
    }).catch(() => {
      if (aktif) setYukleniyor(false);
    });

    return () => {
      aktif = false;
      abonelikDurdur();
    };
  }, []);

  const reklamAyarlariniGuncelle = async (yeniAyarlar: ReklamAyarlari): Promise<boolean> => {
    setAyarlar(yeniAyarlar);
    try {
      const basarili = await belgeKaydet('genel_ayarlar', 'reklam_ayarlari', {
        ...yeniAyarlar,
        guncellenme_tarihi: new Date().toISOString()
      });
      return basarili;
    } catch (hata) {
      console.warn('Canlı reklam ayarı kaydetme hatası:', hata);
      return false;
    }
  };

  return {
    ayarlar,
    tepeBantListesi: ayarlar.tepeBantListesi || [],
    anaAfisListesi: ayarlar.anaAfisListesi || [],
    kareReklamListesi: ayarlar.kareReklamListesi || [],
    yukleniyor,
    reklamAyarlariniGuncelle
  };
}
