import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { TestSiparis, TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';
import { yerelSiparisKaydet } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { siparisFiyatiniZirhlaDogrula } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/SiparisFiyatDogrulayici';
import { kuponuKullanildiOlarakIsaretle } from '@/src/MalzemeCekmeceleri/useKuponHesaplayici';
import { komisyonHesapla } from '@/src/MalzemeCekmeceleri/komisyonServisi';
import { KomisyonAyarTipi } from '@/src/veritabani/VeriTipleri';

export interface YeniSiparisGirdisi {
  musteriId: string;
  musteriAdi?: string;
  musteriTelefon?: string;
  misafirMi?: boolean;
  teslimatAdresiMetni?: string;
  mutfakId: string;
  elemanlar: TestSiparisElemani[];
  toplamTutar: number;
  teslimatUcreti: number;
  kuponKodu?: string;
  kuponIndirimTutari?: number;
  odemeYontemi: 'kapida_nakit' | 'kapida_kart' | 'online_cuzdan';
  odemeDurumu?: 'odendi' | 'bekliyor' | 'kapida';
  paytrOid?: string;
  tahminiTeslimat?: string;
  adresNotu?: string;
}

export async function veritabaninaSiparisOlustur(
  girdi: YeniSiparisGirdisi
): Promise<TestSiparis | null> {
  const kuponIndirimi = Number(girdi.kuponIndirimTutari) || 0;
  
  // Komisyon Hesaplama
  let komisyonDetaylari = { komisyonTutari: 0, platformBedeli: 0, netHakedis: girdi.toplamTutar };
  if (canliFirebaseAktifMi()) {
    const komisyonAyarlari = await koleksiyonGetir<KomisyonAyarTipi>('komisyon_ayarlari');
    komisyonDetaylari = komisyonHesapla(girdi.toplamTutar, komisyonAyarlari, girdi.mutfakId);
  }

  // 🛡️ Güvenlik Zırhı: Fiyat Manipülasyon Kontrolü (Kupon İndirimi Dahil)
  const dogrulama = siparisFiyatiniZirhlaDogrula(girdi.elemanlar, girdi.toplamTutar, girdi.teslimatUcreti, kuponIndirimi);
  if (!dogrulama.guvenliMi) {
    console.error('[GÜVENLİK ENGELİ]:', dogrulama.hataMesaji);
    throw new Error(dogrulama.hataMesaji || 'Güvenlik hatası: Tutar uyuşmazlığı');
  }

  const siparisKodu = 'AFY-' + Math.floor(100000 + Math.random() * 900000);
  const siparisId = 'sip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  // 🔐 Kalıcı 4 Haneli Güvenlik PIN Kodu (Müşteri & Kurye Doğrulama Kilidi)
  const pinKodu = String(Math.floor(1000 + Math.random() * 9000));

  const yeniSiparisKaydi: TestSiparis = {
    id: siparisId,
    siparisKodu,
    siparis_kodu: siparisKodu,
    pinKodu,
    pin_kodu: pinKodu,
    teslimat_kodu: pinKodu,
    musteri_id: girdi.musteriId,
    musteri_adi: girdi.musteriAdi || 'Müşteri',
    musteri_telefon: girdi.musteriTelefon || '',
    misafir_mi: girdi.misafirMi || false,
    teslimat_adresi_metni: girdi.teslimatAdresiMetni || '',
    mutfak_id: girdi.mutfakId,
    durum: 'beklemede',
    durum_aciklamasi: 'Sipariş alındı, mutfağın onaylaması bekleniyor.',
    elemanlar: girdi.elemanlar,
    toplam_tutar: dogrulama.hesaplananToplam,
    tutar: dogrulama.hesaplananToplam,
    toplamTutar: dogrulama.hesaplananToplam,
    teslimat_ucreti: girdi.teslimatUcreti,
    kupon_kodu: girdi.kuponKodu || '',
    kupon_indirimi: kuponIndirimi,
    komisyon_tutari: komisyonDetaylari.komisyonTutari,
    platform_bedeli: komisyonDetaylari.platformBedeli,
    net_hakedis: komisyonDetaylari.netHakedis,
    odeme_yontemi: girdi.odemeYontemi,
    odemeDurumu: girdi.odemeDurumu || (girdi.odemeYontemi === 'online_cuzdan' ? 'bekliyor' : 'kapida'),
    paytrOid: girdi.paytrOid || '',
    olusturma_tarihi: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    tahmini_teslimat: girdi.tahminiTeslimat || '40-50 dk'
  };

  // 1. Her zaman yerel depoya anında kaydet
  yerelSiparisKaydet(yeniSiparisKaydi);

  if (girdi.kuponKodu) {
    kuponuKullanildiOlarakIsaretle(girdi.kuponKodu, girdi.musteriTelefon);
  }

  // 🔔 Patron Masasına Canlı Bildirim & Ses Gönder
  patronBildirimiEkle(
    'yeni_siparis',
    'Yeni Sipariş Alındı! 🛍️',
    `#${siparisKodu} nolu ${girdi.toplamTutar} ₺ tutarındaki sipariş mutfağa iletildi. Müşteri: ${yeniSiparisKaydi.musteri_adi}`,
    yeniSiparisKaydi.id
  );

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('afyon_siparis_eklendi', { detail: yeniSiparisKaydi }));
    window.dispatchEvent(new CustomEvent('afyon_yeni_mutfak_siparisi', { detail: yeniSiparisKaydi }));
    window.dispatchEvent(new CustomEvent('afyon_siparis_durum_degisti', { detail: { siparisKimligi: yeniSiparisKaydi.id, durum: 'beklemede' } }));
  }

  // 2. Canlı Firebase aktifse siparişler koleksiyonuna kaydet
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('siparisler', yeniSiparisKaydi.id, yeniSiparisKaydi);
    } catch (fbHata) {
      console.warn('Firebase sipariş kaydetme uyarısı:', fbHata);
    }
  }

  return yeniSiparisKaydi;
}
