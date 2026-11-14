import { TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { yerelSiparisleriGetir } from './yerelSiparisDeposu';

export function firestoreSiparisiniDonustur(d: any): TestSiparis {
  const kod = d.siparis_kodu || d.siparisKodu || d.id;
  const gercekPin = d.pinKodu || d.pin_kodu || d.teslimat_kodu || d.pin || '';

  return {
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
    durum: d.durum || 'beklemede',
    durum_aciklamasi:
      d.durum_aciklamasi ||
      (d.durum === 'iptal' ? 'Sipariş İptal Edildi.' : 'Siparişiniz hazırlanıyor.'),
    toplam_tutar: Number(d.toplam_tutar || d.tutar) || 0,
    teslimat_ucreti: Number(d.teslimat_ucreti) || 0,
    odeme_yontemi: d.odeme_yontemi || 'kapida_nakit',
    odemeDurumu: d.odemeDurumu,
    paytrOid: d.paytrOid,
    olusturma_tarihi: d.olusturma_tarihi
      ? typeof d.olusturma_tarihi === 'string'
        ? d.olusturma_tarihi
        : new Date(d.olusturma_tarihi).toLocaleDateString('tr-TR')
      : 'Bugün',
    tahmini_teslimat: d.tahmini_teslimat || '40-50 dk',
    elemanlar: (d.elemanlar || d.siparis_elemanlari || []).map((e: any) => ({
      yemek_id: e.yemek_id,
      yemek_baslik: e.yemek_baslik || e.baslik || (e.yemek && e.yemek.baslik),
      adet: Number(e.adet) || 1,
      birim_fiyat: Number(e.birim_fiyat || e.fiyat) || 0,
    })),
  };
}

export function musteriSiparisleriniSuz(
  hamListe: TestSiparis[],
  musteriId?: string,
  musteriTelefon?: string
): TestSiparis[] {
  const temizTel = musteriTelefon ? musteriTelefon.replace(/\D/g, '').slice(-10) : '';
  const cihazSiparisleri = yerelSiparisleriGetir();
  const cihazAnahtarlari = new Set<string>();
  cihazSiparisleri.forEach((s) => {
    if (s.id) cihazAnahtarlari.add(s.id);
    if (s.siparis_kodu) cihazAnahtarlari.add(s.siparis_kodu);
  });

  return hamListe.filter((s) => {
    const idUyusuyor = Boolean(musteriId && s.musteri_id === musteriId);
    const sTel = (s.musteri_telefon || '').replace(/\D/g, '').slice(-10);
    const telUyusuyor = Boolean(temizTel.length === 10 && sTel.length === 10 && sTel === temizTel);
    const buCihazaAitMi = Boolean(
      (s.id && cihazAnahtarlari.has(s.id)) ||
        (s.siparis_kodu && cihazAnahtarlari.has(s.siparis_kodu))
    );

    if (!musteriId && temizTel.length < 10) {
      return buCihazaAitMi;
    }
    return idUyusuyor || telUyusuyor || buCihazaAitMi;
  });
}
