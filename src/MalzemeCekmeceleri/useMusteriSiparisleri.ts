import { useState, useEffect, useCallback } from 'react';
import { TEST_SIPARISLERI, TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const SIPARIS_YEREL_DEPO_ANAHTARI = 'afyon_ev_lezzetleri_siparisleri_v1';

// Yerel depodan kayıtlı siparişleri çek
export function yerelSiparisleriGetir(): TestSiparis[] {
  try {
    const kayit = localStorage.getItem(SIPARIS_YEREL_DEPO_ANAHTARI);
    if (kayit) {
      const parsed = JSON.parse(kayit);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Hata toleransı
  }
  return [];
}

// Yerel depoya yeni sipariş kaydet / güncelle
export function yerelSiparisKaydet(siparis: TestSiparis) {
  try {
    const mevcutlar = yerelSiparisleriGetir();
    const index = mevcutlar.findIndex(s => s.id === siparis.id || s.siparis_kodu === siparis.siparis_kodu);
    if (index >= 0) {
      mevcutlar[index] = { ...mevcutlar[index], ...siparis };
    } else {
      mevcutlar.unshift(siparis);
    }
    localStorage.setItem(SIPARIS_YEREL_DEPO_ANAHTARI, JSON.stringify(mevcutlar));
    
    // TEST_SIPARISLERI dizisini de güncelle
    const testIndex = TEST_SIPARISLERI.findIndex(s => s.id === siparis.id || s.siparis_kodu === siparis.siparis_kodu);
    if (testIndex >= 0) {
      TEST_SIPARISLERI[testIndex] = { ...TEST_SIPARISLERI[testIndex], ...siparis };
    } else {
      TEST_SIPARISLERI.unshift(siparis);
    }
  } catch {
    // Depolama hatası toleransı
  }
}

// Tüm yerel depolama anahtarlarında sipariş durumunu güncelle
export function yerelSiparisDurumGuncelle(siparisKimligi: string, yeniDurum: string, durumAciklamasi?: string) {
  try {
    const anahtarlar = [
      SIPARIS_YEREL_DEPO_ANAHTARI,
      'afyon_aktif_siparisler_v1',
      'afyon_misafir_siparisleri_v1'
    ];
    anahtarlar.forEach(anahtar => {
      const kayit = localStorage.getItem(anahtar);
      if (kayit) {
        const liste = JSON.parse(kayit);
        if (Array.isArray(liste)) {
          const guncel = liste.map((s: any) => {
            if (s.id === siparisKimligi || s.kimlik === siparisKimligi || s.siparis_kodu === siparisKimligi || s.siparisKodu === siparisKimligi) {
              return {
                ...s,
                durum: yeniDurum,
                durum_aciklamasi: durumAciklamasi || (yeniDurum === 'iptal' ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi),
                durumAciklamasi: durumAciklamasi || (yeniDurum === 'iptal' ? 'Sipariş İptal Edildi.' : s.durumAciklamasi)
              };
            }
            return s;
          });
          localStorage.setItem(anahtar, JSON.stringify(guncel));
        }
      }
    });

    // Hafızadaki TEST_SIPARISLERI dizisini de güncelle
    TEST_SIPARISLERI.forEach(s => {
      if (s.id === siparisKimligi || (s as any).kimlik === siparisKimligi || s.siparis_kodu === siparisKimligi) {
        s.durum = yeniDurum as any;
        s.durum_aciklamasi = durumAciklamasi || (yeniDurum === 'iptal' ? 'Sipariş İptal Edildi.' : s.durum_aciklamasi);
      }
    });
  } catch {}
}

// Aktif misafir sipariş sayısını getir
export function aktifMisafirSiparisSayisiGetir(): number {
  const tumu = yerelSiparisleriGetir();
  return tumu.filter(s => s.durum !== 'iptal' && s.durum !== 'teslim_edildi').length;
}

export function useMusteriSiparisleri(musteriId?: string, musteriTelefon?: string) {
  const [siparisler, setSiparisler] = useState<TestSiparis[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);
  const [hata, setHata] = useState<string | null>(null);

  const filtreleSiparisler = useCallback((hamListe: TestSiparis[]): TestSiparis[] => {
    if (!musteriId && !musteriTelefon) {
      return hamListe;
    }
    const temizTel = musteriTelefon ? musteriTelefon.replace(/\D/g, '') : '';
    return hamListe.filter(s => {
      const idUyusuyor = musteriId && (s.musteri_id === musteriId || s.musteri_id === 'musteri-1' || s.musteri_id === 'musteri_ahmet_01');
      const telUyusuyor = temizTel && s.musteri_telefon && s.musteri_telefon.replace(/\D/g, '').includes(temizTel.slice(-10));
      const misafirMi = Boolean(s.misafir_mi);
      return idUyusuyor || telUyusuyor || misafirMi;
    });
  }, [musteriId, musteriTelefon]);

  const siparisleriYukle = useCallback(async () => {
    setYukleniyor(true);
    setHata(null);

    // Siparişleri tekilleştirmek için anahtar haritası (Aynı sipariş koduna sahip kopyalar birleşir)
    const tekilHarita = new Map<string, TestSiparis>();

    // 1. Canlı Firebase aktifse doğrudan Firestore'dan çek
    if (canliFirebaseAktifMi()) {
      try {
        const fbSiparisler = await koleksiyonGetir<any>('siparisler');
        if (fbSiparisler && Array.isArray(fbSiparisler) && fbSiparisler.length > 0) {
          fbSiparisler.forEach((d: any) => {
            const kod = d.siparis_kodu || d.siparisKodu || d.id;
            const gercekPin = d.pinKodu || d.pin_kodu || d.teslimat_kodu || d.pin || '';

            const siparisNesnesi: TestSiparis = {
              id: d.id,
              siparisKodu: kod,
              siparis_kodu: kod,
              pinKodu: gercekPin,
              pin_kodu: gercekPin,
              teslimat_kodu: gercekPin,
              musteri_id: d.musteri_id,
              musteri_adi: d.musteri_adi || 'Müşteri',
              musteri_telefon: d.musteri_telefon,
              misafir_mi: d.misafir_mi,
              teslimat_adresi_metni: d.teslimat_adresi_metni,
              mutfak_id: d.mutfak_id,
              kurye_id: d.kurye_id,
              kurye_adi: d.kurye_adi,
              asama: d.asama,
              kurye_alis_zamani: d.kurye_alis_zamani,
              kurye_teslim_aldi_mi: d.kurye_teslim_aldi_mi,
              durum: d.durum || 'hazirlaniyor',
              durum_aciklamasi: d.durum_aciklamasi || (d.durum === 'iptal' ? 'Sipariş İptal Edildi.' : 'Siparişiniz hazırlanıyor.'),
              toplam_tutar: Number(d.toplam_tutar || d.tutar) || 0,
              teslimat_ucreti: Number(d.teslimat_ucreti) || 0,
              odeme_yontemi: d.odeme_yontemi || 'kapida_nakit',
              olusturma_tarihi: d.olusturma_tarihi 
                ? (typeof d.olusturma_tarihi === 'string' ? d.olusturma_tarihi : new Date(d.olusturma_tarihi).toLocaleDateString('tr-TR'))
                : 'Bugün',
              tahmini_teslimat: d.tahmini_teslimat || '40-50 dk',
              elemanlar: (d.elemanlar || d.siparis_elemanlari || []).map((e: any) => ({
                yemek_id: e.yemek_id,
                yemek_baslik: e.yemek_baslik || e.baslik || (e.yemek && e.yemek.baslik),
                adet: Number(e.adet) || 1,
                birim_fiyat: Number(e.birim_fiyat || e.fiyat) || 0
              }))
            };

            // Eğer haritada varsa, daha dolu olanı ve PIN kodunu koruyarak birleştir
            if (tekilHarita.has(kod)) {
              const onceki = tekilHarita.get(kod)!;
              tekilHarita.set(kod, {
                ...onceki,
                ...siparisNesnesi,
                pinKodu: siparisNesnesi.pinKodu || onceki.pinKodu,
                pin_kodu: siparisNesnesi.pin_kodu || onceki.pin_kodu,
                teslimat_kodu: siparisNesnesi.teslimat_kodu || onceki.teslimat_kodu,
                elemanlar: siparisNesnesi.elemanlar.length > 0 ? siparisNesnesi.elemanlar : onceki.elemanlar
              });
            } else {
              tekilHarita.set(kod, siparisNesnesi);
            }
          });

          const donusturulenler = Array.from(tekilHarita.values());
          donusturulenler.sort((a, b) => (b.id > a.id ? 1 : -1));
          setSiparisler(filtreleSiparisler(donusturulenler));
          setYukleniyor(false);
          return;
        }
      } catch (err: any) {
        console.warn('Firebase siparişler okunurken hata:', err);
      }
    }

    // 2. Çevrimdışı / Yedek Depo (Burada da tekilleştirilir)
    const yerel = yerelSiparisleriGetir();
    TEST_SIPARISLERI.forEach(s => {
      const kod = s.siparis_kodu || s.siparisKodu || s.id;
      if (kod) tekilHarita.set(kod, s);
    });
    yerel.forEach(s => {
      const kod = s.siparis_kodu || s.siparisKodu || s.id;
      if (kod) {
        const onceki = tekilHarita.get(kod);
        tekilHarita.set(kod, { ...onceki, ...s });
      }
    });

    const tumSiparisler = Array.from(tekilHarita.values());
    tumSiparisler.sort((a, b) => (b.id > a.id ? 1 : -1));
    setSiparisler(filtreleSiparisler(tumSiparisler));
    setYukleniyor(false);
  }, [filtreleSiparisler]);

  useEffect(() => {
    siparisleriYukle();

    let abonelikDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', () => {
        siparisleriYukle();
      });
    }

    const olayDinle = () => {
      siparisleriYukle();
    };
    window.addEventListener('afyon_siparis_durum_degisti', olayDinle);
    window.addEventListener('afyon_siparis_eklendi', olayDinle);

    return () => {
      abonelikDurdur();
      window.removeEventListener('afyon_siparis_durum_degisti', olayDinle);
      window.removeEventListener('afyon_siparis_eklendi', olayDinle);
    };
  }, [siparisleriYukle]);

  return {
    siparisler,
    yukleniyor,
    hata,
    yenile: siparisleriYukle
  };
}
