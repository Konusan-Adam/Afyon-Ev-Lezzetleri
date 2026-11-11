import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { veritabaninaYeniAdresEkle } from '@/src/MalzemeCekmeceleri/AdresVeKonum/adresIslemleri';

export interface MisafirProfili {
  telefon: string;
  ad_soyad: string;
  son_mahalle?: string;
  son_acik_adres?: string;
  son_bina_daire?: string;
  toplam_siparis_sayisi: number;
  son_siparis_kodu?: string;
  son_siparis_tarihi?: string;
}

const YEREL_MISAFIR_DEPOSU = 'afyon_misafir_profilleri_v1';

export function yerelMisafirleriGetir(): Record<string, MisafirProfili> {
  try {
    const ham = localStorage.getItem(YEREL_MISAFIR_DEPOSU);
    if (ham) return JSON.parse(ham);
  } catch {}
  return {};
}

export function yerelMisafirKaydet(profil: MisafirProfili) {
  try {
    const mevcutlar = yerelMisafirleriGetir();
    mevcutlar[profil.telefon] = profil;
    localStorage.setItem(YEREL_MISAFIR_DEPOSU, JSON.stringify(mevcutlar));
  } catch {}
}

export async function misafirProfiliniGetir(telefon: string): Promise<MisafirProfili | null> {
  const temiz = telefon.replace(/\D/g, '').slice(-10);
  if (temiz.length < 10) return null;

  // 1. Önce yerel hafızadan anında kontrol et
  const yerel = yerelMisafirleriGetir();
  if (yerel[temiz]) {
    return yerel[temiz];
  }

  // 2. Canlı Firebase veritabanından sorgula
  if (canliFirebaseAktifMi()) {
    try {
      const fbMisafirler = await koleksiyonGetir<MisafirProfili>('misafir_kullanicilar');
      const bulunan = fbMisafirler.find((m) => m.telefon === temiz);
      if (bulunan) {
        yerelMisafirKaydet(bulunan);
        return bulunan;
      }
    } catch {}
  }

  return null;
}

export async function misafirProfiliniKaydetVeGuncelle(
  girdi: {
    telefon: string;
    adSoyad: string;
    mahalle?: string;
    acikAdres?: string;
    binaDaire?: string;
    siparisKodu?: string;
  }
): Promise<MisafirProfili> {
  const temiz = girdi.telefon.replace(/\D/g, '').slice(-10);
  const mevcut = yerelMisafirleriGetir()[temiz];
  const yeniToplam = (mevcut?.toplam_siparis_sayisi || 0) + 1;

  const profil: MisafirProfili = {
    telefon: temiz,
    ad_soyad: girdi.adSoyad,
    son_mahalle: girdi.mahalle || mevcut?.son_mahalle,
    son_acik_adres: girdi.acikAdres || mevcut?.son_acik_adres,
    son_bina_daire: girdi.binaDaire || mevcut?.son_bina_daire,
    toplam_siparis_sayisi: yeniToplam,
    son_siparis_kodu: girdi.siparisKodu,
    son_siparis_tarihi: new Date().toISOString()
  };

  // Yerel hafızaya kaydet
  yerelMisafirKaydet(profil);

  // Canlı Firebase veritabanına yaz
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('misafir_kullanicilar', temiz, profil);
    } catch (err) {
      console.warn('Misafir kullanıcı kaydetme hatası:', err);
    }
  }

  // musteri_adresleri tablosuna da kaydet
  if (girdi.mahalle && girdi.acikAdres) {
    try {
      await veritabaninaYeniAdresEkle({
        musteri_kimligi: `misafir_${temiz}`,
        baslik: 'Son Teslimat Adresi',
        mahalle: girdi.mahalle,
        adres_tarifi: girdi.binaDaire ? `${girdi.acikAdres} (Bina/Daire: ${girdi.binaDaire})` : girdi.acikAdres,
        telefon: temiz,
        bina_no: girdi.binaDaire || '1',
        daire_no: girdi.binaDaire || '1',
        enlem: 38.7569,
        boylam: 30.5401,
        varsayilan_mi: true
      });
    } catch (adresErr) {
      console.warn('Müşteri adresleri kayıt hatası:', adresErr);
    }
  }

  return profil;
}
