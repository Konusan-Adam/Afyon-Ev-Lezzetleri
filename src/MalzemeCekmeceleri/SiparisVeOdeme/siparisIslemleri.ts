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
  subeStoklariniAtomikDus,
  subeStoklariniGeriYukle,
} from '@/src/MalzemeCekmeceleri/Sube/subeSiparisKayitServisi';
import { mutfakAdiniCoz, siparisPatronBildirimiGonder } from './siparisBildirimYardimcisi';
import { sunucuZamanDamgasiAl } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/zamanDamgasiIstemcisi';

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

  const normalizedElemanlar = girdi.elemanlar.map((el: any) => ({
    ...el,
    yemek_id: el.yemek_id || el.id || 'yemek',
    baslik: el.baslik || el.yemek_baslik || 'Ürün',
    adet: Number(el.adet) || 1,
    birim_fiyat: Number(el.birim_fiyat ?? el.fiyat) || 0,
  }));

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
    durum: subeSiparisiMi ? 'hazirlaniyor' : 'beklemede',
    asama: subeSiparisiMi ? 'ocakta' : 'beklemede',
    durum_aciklamasi: subeSiparisiMi
      ? (girdi.teslimatTipi === 'gel_al'
          ? 'Şube siparişiniz alındı, tezgahta hazırlanıyor.'
          : 'Şube siparişiniz alındı, paketleniyor.')
      : 'Sipariş alındı, mutfağın onaylaması bekleniyor.',
    elemanlar: normalizedElemanlar,
    urunler: normalizedElemanlar,
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
    olusturma_tarihi: new Date().toISOString(),
    tahmini_teslimat: girdi.tahminiTeslimat || '40-50 dk',
  };

  const siparisDamgasi = await sunucuZamanDamgasiAl('siparis_olusturma', {
    siparisId,
    siparisKodu,
    musteriId: girdi.musteriId,
    mutfakId: girdi.mutfakId,
    toplamTutar: dogrulama.hesaplananToplam,
    odemeYontemi: girdi.odemeYontemi,
    teslimatTipi: girdi.teslimatTipi || 'teslimat',
  });
  (yeniSiparisKaydi as any).olusturma_tarihi = siparisDamgasi.sunucuUtc;
  (yeniSiparisKaydi as any).hukuki_zaman_damgasi = {
    sunucuUtc: siparisDamgasi.sunucuUtc,
    ozetHash: siparisDamgasi.ozetHash,
    damgaDurumu: siparisDamgasi.damgaDurumu,
    tsaSaglayici: siparisDamgasi.tsaSaglayici,
    ipAdresi: siparisDamgasi.ipAdresi,
  };

  // 1. Şube ürünüyse önce stok kontrolü ve atomik stok düşümü yap (Yetersiz stokta sahte sipariş oluşmaz)
  if (canliFirebaseAktifMi()) {
    let stokDusulduMu = false;
    if (subeSiparisiMi) {
      await subeStoklariniAtomikDus(girdi.elemanlar);
      stokDusulduMu = true;
    }

    try {
      const genelKayitBasarili = await belgeKaydet('siparisler', yeniSiparisKaydi.id, yeniSiparisKaydi);
      if (!genelKayitBasarili) {
        throw new Error('Sipariş veritabanına kaydedilemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyiniz.');
      }

      if (subeSiparisiMi) {
        await subeSiparisiVeStokIsle(
          {
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
          },
          true
        );
      }
    } catch (kayitHatasi) {
      if (stokDusulduMu) {
        await subeStoklariniGeriYukle(girdi.elemanlar);
      }
      throw kayitHatasi;
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
    window.dispatchEvent(new CustomEvent('afyon_siparis_durum_degisti', { detail: { siparisKimligi: yeniSiparisKaydi.id, durum: yeniSiparisKaydi.durum } }));
  }

  return yeniSiparisKaydi;
}

export type { SubeSiparisi };
