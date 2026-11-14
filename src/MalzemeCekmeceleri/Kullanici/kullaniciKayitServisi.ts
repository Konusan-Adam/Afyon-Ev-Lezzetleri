import { Kullanici } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { testKullaniciEkle, TestKullaniciKaydi } from '@/src/veritabani/CanliVeriYardimcisi';
import { telefonGecerliMi } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { telefonStandartCekirdek } from './telefonYardimcisi';

export async function veritabaninaKullaniciKaydet(
  yeniKullanici: Omit<Kullanici, 'kimlik' | 'onayli_mi' | 'olusturma_tarihi'> & { sifre?: string }
): Promise<Kullanici | null> {
  const dogrulama = telefonGecerliMi(yeniKullanici.telefon);
  if (!dogrulama.gecerli) return null;

  const standartTelefon = telefonStandartCekirdek(yeniKullanici.telefon);
  if (canliFirebaseAktifMi()) {
    try {
      const mevcutlar = await koleksiyonGetir<Kullanici>('kullanicilar');
      if (mevcutlar.some((k) => telefonStandartCekirdek(k.telefon || '') === standartTelefon)) {
        return null;
      }
    } catch {}
  }

  const duzgunTelefon = standartTelefon.startsWith('0') ? standartTelefon : `0${standartTelefon}`;
  const kimlikId = standartTelefon ? `tel_${duzgunTelefon}` : `usr_${Date.now()}`;
  const kullaniciKaydi: Kullanici & { id: string; sifre: string; onay_durumu: string; askida_mi: boolean } = {
    id: kimlikId,
    kimlik: kimlikId,
    ad_soyad: yeniKullanici.ad_soyad ? yeniKullanici.ad_soyad.trim() : 'İsimsiz',
    telefon: duzgunTelefon,
    eposta: (yeniKullanici as any).eposta || '',
    sifre: yeniKullanici.sifre || '1234',
    rol: yeniKullanici.rol,
    isletme_adi: yeniKullanici.isletme_adi || '',
    arac_tipi: yeniKullanici.arac_tipi || '',
    ilce: yeniKullanici.ilce || 'Merkez',
    onayli_mi: yeniKullanici.rol === 'musteri',
    onay_durumu: yeniKullanici.rol === 'musteri' ? 'onaylandi' : 'beklemede',
    askida_mi: false,
    olusturma_tarihi: new Date().toISOString(),
  };

  testKullaniciEkle(kullaniciKaydi as unknown as TestKullaniciKaydi);

  if (yeniKullanici.rol === 'musteri') {
    patronBildirimiEkle('yeni_musteri', 'Yeni Müşteri Kaydı', `${kullaniciKaydi.ad_soyad} (${kullaniciKaydi.telefon}) sisteme üye oldu.`);
  } else if (yeniKullanici.rol === 'ev_mutfagi' || yeniKullanici.rol === 'ticari_restoran') {
    patronBildirimiEkle('yeni_mutfak', 'Yeni Mutfak Başvurusu ⚠️', `${kullaniciKaydi.isletme_adi || kullaniciKaydi.ad_soyad} mutfak kaydı oluşturdu. Onay bekliyor.`, kimlikId);
  } else if (yeniKullanici.rol === 'kurye') {
    patronBildirimiEkle('yeni_kurye', 'Yeni Kurye Başvurusu 🛵', `${kullaniciKaydi.ad_soyad} kurye olmak için başvurdu. Onay bekliyor.`, kimlikId);
  }

  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('kullanicilar', kimlikId, kullaniciKaydi);
      if (yeniKullanici.rol === 'ev_mutfagi' || yeniKullanici.rol === 'ticari_restoran') {
        const mutfakIsmi = yeniKullanici.isletme_adi?.trim() || yeniKullanici.ad_soyad.trim();
        await belgeKaydet('mutfaklar', kimlikId, {
          id: kimlikId,
          kimlik: kimlikId,
          ad: mutfakIsmi,
          mutfak_adi: mutfakIsmi,
          aciklama: 'Afyonkarahisar anne eliyle taze pişirilen sıcak ev lezzetleri.',
          adres: `${yeniKullanici.ilce || 'Merkez'}, Afyonkarahisar`,
          telefon: standartTelefon,
          min_siparis_tutari: 100,
          teslimat_ucreti: 25,
          puan: 5.0,
          gorsel_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
          sahip_id: kimlikId,
          onayli_mi: false,
          onay_durumu: 'beklemede',
          askida_mi: false,
          hijyen_onayli_mi: false,
          esnaf_muafiyet_onayli_mi: false,
          belgeler: (yeniKullanici as any).belgeler || {},
          olusturma_tarihi: new Date().toISOString(),
        });
      }
    } catch (hata) {
      console.warn('Firebase kullanıcı/mutfak kayıt hatası:', hata);
    }
  }

  return kullaniciKaydi;
}
