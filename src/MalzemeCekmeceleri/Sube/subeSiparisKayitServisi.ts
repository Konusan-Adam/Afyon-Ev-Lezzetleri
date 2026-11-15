import { doc, runTransaction } from 'firebase/firestore';
import { firebaseVeritabani } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeGetir, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { firestoreHatasiniYonet, IslemTipi } from '@/src/veritabani/FirebaseHataYoneticisi';
import { GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { SubeSiparisi, SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';
import { subeSiparisiOlustur } from './subeSiparisServisi';

export interface SubeSiparisKayitVerisi {
  siparisId: string;
  siparisKodu: string;
  subeId: string;
  subeAdi?: string;
  musteriId: string;
  musteriAdi: string;
  musteriTelefon: string;
  teslimatTipi: 'gel_al' | 'teslimat';
  teslimatAdresiMetni?: string;
  adresNotu?: string;
  toplamTutar: number;
  odemeYontemi: string;
  odemeDurumu: 'odendi' | 'bekliyor' | 'kapida';
  paytrOid?: string;
  pinKodu: string;
  olusturmaTarihi: string;
  elemanlar: TestSiparisElemani[];
}

export async function subeSiparisiMiBelirle(
  mutfakId: string,
  elemanlar: TestSiparisElemani[]
): Promise<boolean> {
  if (mutfakId.startsWith('sube')) return true;
  const sube = await belgeGetir<GelAlSubesi>('gel_al_subeleri', mutfakId);
  if (sube) return true;

  for (const el of elemanlar) {
    const urunId = el.yemek_id || el.id;
    if (urunId) {
      const stokUrun = await belgeGetir<SubeUrunu>('sube_stoklari', urunId);
      if (stokUrun) return true;
    }
  }
  return false;
}

export async function subeAdiniCoz(subeId: string, verilenAd?: string): Promise<string> {
  if (verilenAd && verilenAd.trim()) return verilenAd.trim();
  const dogrudan = await belgeGetir<GelAlSubesi>('gel_al_subeleri', subeId);
  if (dogrudan) {
    const ad = dogrudan.ad || (dogrudan as any).sube_adi || (dogrudan as any).isim;
    if (ad && String(ad).trim()) return String(ad).trim();
  }
  const tumSubeler = await koleksiyonGetir<GelAlSubesi>('gel_al_subeleri');
  const eslesen = (tumSubeler || []).find((s) => s.id === subeId || s.kimlik === subeId);
  const cozulmus = eslesen?.ad || (eslesen as any)?.sube_adi || (eslesen as any)?.isim;
  return cozulmus && String(cozulmus).trim() ? String(cozulmus).trim() : 'Afyon Ev Lezzetleri Şubesi';
}

async function subeStoklariniAtomikDus(elemanlar: TestSiparisElemani[]): Promise<void> {
  try {
    await runTransaction(firebaseVeritabani, async (islem) => {
      const guncellenecekler: { ref: ReturnType<typeof doc>; yeniStok: number; yeniSatilan: number }[] = [];

      for (const eleman of elemanlar) {
        const urunId = eleman.yemek_id || eleman.id;
        if (!urunId) continue;
        const urunRef = doc(firebaseVeritabani, 'sube_stoklari', urunId);
        const snap = await islem.get(urunRef);
        if (!snap.exists()) continue;

        const veri = snap.data() as SubeUrunu;
        const yeniStok = Math.max(0, Number(veri.stok_adedi || 0) - Number(eleman.adet || 1));
        const yeniSatilan = Number(veri.satilan_adet || 0) + Number(eleman.adet || 1);
        guncellenecekler.push({ ref: urunRef, yeniStok, yeniSatilan });
      }

      for (const g of guncellenecekler) {
        islem.update(g.ref, {
          stok_adedi: g.yeniStok,
          satilan_adet: g.yeniSatilan,
        });
      }
    });
  } catch (hata) {
    const mesaj = hata instanceof Error ? hata.message : String(hata);
    if (mesaj.includes('permission') || mesaj.includes('insufficient')) {
      firestoreHatasiniYonet(hata, IslemTipi.WRITE, 'sube_stoklari');
    }
    throw hata;
  }
}

export async function subeSiparisiVeStokIsle(veri: SubeSiparisKayitVerisi): Promise<string> {
  const gercekSubeAdi = await subeAdiniCoz(veri.subeId, veri.subeAdi);

  const subeSiparisKaydi: SubeSiparisi = {
    id: veri.siparisId,
    siparis_kodu: veri.siparisKodu,
    sube_id: veri.subeId,
    sube_adi: gercekSubeAdi,
    musteri_id: veri.musteriId,
    musteri_adi: veri.musteriAdi || 'Müşteri',
    musteri_telefon: veri.musteriTelefon || '',
    teslimat_tipi: veri.teslimatTipi,
    teslimat_adresi_metni: veri.teslimatAdresiMetni || '',
    adres_notu: veri.adresNotu || '',
    durum: 'hazirlaniyor',
    toplam_tutar: veri.toplamTutar,
    odeme_yontemi: veri.odemeYontemi,
    odeme_durumu: veri.odemeDurumu,
    paytr_oid: veri.paytrOid || '',
    pin_kodu: veri.pinKodu,
    olusturma_tarihi: veri.olusturmaTarihi,
    urunler: veri.elemanlar.map((e) => ({
      urun_id: e.yemek_id || e.id || 'urun',
      ad: e.yemek_baslik || e.baslik || 'Ürün',
      adet: e.adet,
      fiyat: e.birim_fiyat || e.fiyat || 0,
    })),
  };

  const subeKayitBasarili = await subeSiparisiOlustur(subeSiparisKaydi);
  if (!subeKayitBasarili) {
    throw new Error('Şube siparişi veritabanına kaydedilemedi.');
  }

  await subeStoklariniAtomikDus(veri.elemanlar);
  return gercekSubeAdi;
}
