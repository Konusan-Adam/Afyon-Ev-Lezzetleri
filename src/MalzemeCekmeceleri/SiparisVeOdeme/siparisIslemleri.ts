import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { TestSiparis, TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';
import { yerelSiparisKaydet } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { siparisFiyatiniZirhlaDogrula } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/SiparisFiyatDogrulayici';
import { kuponuKullanildiOlarakIsaretle } from '@/src/MalzemeCekmeceleri/useKuponHesaplayici';
import { komisyonHesapla } from '@/src/MalzemeCekmeceleri/komisyonServisi';
import { KomisyonAyarTipi } from '@/src/veritabani/VeriTipleri';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import {
  subeAdiniCoz,
  subeSiparisiMiBelirle,
  subeSiparisiVeStokIsle,
} from '@/src/MalzemeCekmeceleri/Sube/subeSiparisKayitServisi';
import { mutfakAdiniCoz, siparisPatronBildirimiGonder } from './siparisBildirimYardimcisi';

export interface YeniSiparisGirdisi {
  musteriId: string;
  musteriAdi?: string;
  musteriTelefon?: string;
  misafirMi?: boolean;
  teslimatTipi?: 'gel_al' | 'teslimat';
  teslimatAdresiMetni?: string;
  mutfakId: string;
  subeAdi?: string;
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
  const pinKodu = String(Math.floor(1000 + Math.random() * 9000));
  const odemeDurumu = girdi.odemeDurumu || (girdi.odemeYontemi === 'online_cuzdan' ? 'bekliyor' : 'kapida');

  const subeSiparisiMi = canliFirebaseAktifMi()
    ? await subeSiparisiMiBelirle(girdi.mutfakId, girdi.elemanlar)
    : girdi.mutfakId.startsWith('sube');

  const cozulenBirimAdi = subeSiparisiMi
    ? canliFirebaseAktifMi()
      ? await subeAdiniCoz(girdi.mutfakId, girdi.subeAdi)
      : girdi.subeAdi || 'Afyon Ev Lezzetleri Şubesi'
    : await mutfakAdiniCoz(girdi.mutfakId);

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
    teslimat_tipi: girdi.teslimatTipi || 'teslimat',
    teslimat_adresi_metni: girdi.teslimatAdresiMetni || '',
    mutfak_id: girdi.mutfakId,
    mutfak_adi: cozulenBirimAdi,
    siparis_kaynagi: subeSiparisiMi ? 'sube' : 'mutfak',
    ...(subeSiparisiMi ? { sube_id: girdi.mutfakId, sube_adi: cozulenBirimAdi } : {}),
    durum: 'beklemede',
    durum_aciklamasi: subeSiparisiMi
      ? 'Sipariş şubeye iletildi, hazırlanıyor.'
      : 'Sipariş alındı, mutfağın onaylaması bekleniyor.',
    elemanlar: girdi.elemanlar,
    urunler: girdi.elemanlar,
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
    odemeDurumu,
    paytrOid: girdi.paytrOid || '',
    olusturma_tarihi: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    tahmini_teslimat: girdi.tahminiTeslimat || '40-50 dk',
  };

  // 1. Önce Canlı Firebase Veritabanına Yaz (Başarısız olursa sahte başarı dönme)
  if (canliFirebaseAktifMi()) {
    const genelKayitBasarili = await belgeKaydet('siparisler', yeniSiparisKaydi.id, yeniSiparisKaydi);
    if (!genelKayitBasarili) {
      throw new Error('Sipariş veritabanına kaydedilemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.');
    }

    if (subeSiparisiMi) {
      await subeSiparisiVeStokIsle({
        siparisId: yeniSiparisKaydi.id,
        siparisKodu,
        subeId: girdi.mutfakId,
        subeAdi: cozulenBirimAdi,
        musteriId: girdi.musteriId,
        musteriAdi: girdi.musteriAdi || 'Müşteri',
        musteriTelefon: girdi.musteriTelefon || '',
        teslimatTipi: girdi.teslimatTipi || 'teslimat',
        teslimatAdresiMetni: girdi.teslimatAdresiMetni || '',
        adresNotu: girdi.adresNotu || '',
        toplamTutar: dogrulama.hesaplananToplam,
        odemeYontemi: girdi.odemeYontemi,
        odemeDurumu,
        paytrOid: girdi.paytrOid,
        pinKodu,
        olusturmaTarihi: yeniSiparisKaydi.olusturma_tarihi,
        elemanlar: girdi.elemanlar,
      });
    }
  }

  // 2. Veritabanı kaydı onaylandıktan sonra yerel depo, kupon ve canlı bildirimleri işle
  yerelSiparisKaydet(yeniSiparisKaydi);

  if (girdi.kuponKodu) {
    kuponuKullanildiOlarakIsaretle(girdi.kuponKodu, girdi.musteriTelefon);
  }

  await siparisPatronBildirimiGonder({
    siparisId: yeniSiparisKaydi.id,
    siparisKodu,
    toplamTutar: dogrulama.hesaplananToplam,
    musteriAdi: yeniSiparisKaydi.musteri_adi,
    mutfakId: girdi.mutfakId,
    subeSiparisiMi,
    subeAdi: subeSiparisiMi ? cozulenBirimAdi : undefined,
    mutfakAdi: !subeSiparisiMi ? cozulenBirimAdi : undefined,
    teslimatTipi: girdi.teslimatTipi || 'teslimat',
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('afyon_siparis_eklendi', { detail: yeniSiparisKaydi }));
    window.dispatchEvent(
      new CustomEvent(subeSiparisiMi ? 'afyon_yeni_sube_siparisi' : 'afyon_yeni_mutfak_siparisi', {
        detail: yeniSiparisKaydi,
      })
    );
    window.dispatchEvent(new CustomEvent('afyon_siparis_durum_degisti', { detail: { siparisKimligi: yeniSiparisKaydi.id, durum: 'beklemede' } }));
  }

  return yeniSiparisKaydi;
}

export type { SubeSiparisi };
