import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';

export function subeDurumunuGenelSipariseEsle(
  subeDurum: SubeSiparisi['durum'],
  teslimatTipi?: string
): { durum: string; asama: string; durumAciklamasi: string } {
  if (subeDurum === 'iptal') {
    return {
      durum: 'iptal',
      asama: 'iptal',
      durumAciklamasi: 'Sipariş şube tarafından iptal edildi.',
    };
  }
  if (subeDurum === 'teslim_edildi') {
    return {
      durum: 'teslim_edildi',
      asama: 'teslim_edildi',
      durumAciklamasi: 'Sipariş teslim edildi. Afiyet olsun!',
    };
  }
  if (subeDurum === 'teslime_hazir') {
    if (teslimatTipi === 'gel_al') {
      return {
        durum: 'teslime_hazir',
        asama: 'hazir',
        durumAciklamasi: 'Siparişiniz şubede teslime hazır! Şubeden teslim alabilirsiniz.',
      };
    }
    return {
      durum: 'paketlendi',
      asama: 'paketlendi',
      durumAciklamasi: 'Sipariş şubede paketlendi, kurye bekleniyor.',
    };
  }
  return {
    durum: 'hazirlaniyor',
    asama: 'ocakta',
    durumAciklamasi: 'Şube siparişiniz hazırlanıyor.',
  };
}

export function subeSiparisKaydiniBirlestir(genelSiparis: any, subeSiparis?: SubeSiparisi | null): any {
  if (!subeSiparis) return genelSiparis;

  const genelDurum = (genelSiparis.durum || '').toLowerCase();
  const genelAsama = (genelSiparis.asama || '').toLowerCase();
  const subeDurum = subeSiparis.durum;
  const teslimatTipi = subeSiparis.teslimat_tipi || genelSiparis.teslimat_tipi || 'teslimat';

  if (genelDurum === 'iptal' || subeDurum === 'iptal') {
    return {
      ...genelSiparis,
      sube_id: genelSiparis.sube_id || subeSiparis.sube_id,
      sube_adi: genelSiparis.sube_adi || subeSiparis.sube_adi,
      teslimat_tipi: teslimatTipi,
      durum: 'iptal',
      asama: 'iptal',
      durum_aciklamasi: genelSiparis.durum_aciklamasi || 'Sipariş iptal edildi.',
    };
  }

  if (genelDurum === 'teslim_edildi' || subeDurum === 'teslim_edildi') {
    return {
      ...genelSiparis,
      sube_id: genelSiparis.sube_id || subeSiparis.sube_id,
      sube_adi: genelSiparis.sube_adi || subeSiparis.sube_adi,
      teslimat_tipi: teslimatTipi,
      durum: 'teslim_edildi',
      asama: 'teslim_edildi',
      durum_aciklamasi: genelSiparis.durum_aciklamasi || 'Sipariş teslim edildi. Afiyet olsun!',
    };
  }

  // Kurye zaten yola çıktıysa veya kapıdaysa şube 'teslime_hazir' bilgisi kurye aşamasını geri almaz
  const kuryedeVeyaKapida =
    genelDurum === 'yolda' ||
    genelDurum === 'kapida' ||
    genelAsama === 'kuryede' ||
    genelAsama === 'kurye_geliyor' ||
    Boolean(genelSiparis.kurye_teslim_aldi_mi);

  if (subeDurum === 'teslime_hazir' && !kuryedeVeyaKapida) {
    const eslenen = subeDurumunuGenelSipariseEsle('teslime_hazir', teslimatTipi);
    return {
      ...genelSiparis,
      sube_id: genelSiparis.sube_id || subeSiparis.sube_id,
      sube_adi: genelSiparis.sube_adi || subeSiparis.sube_adi,
      teslimat_tipi: teslimatTipi,
      durum: eslenen.durum,
      asama: eslenen.asama,
      durum_aciklamasi: eslenen.durumAciklamasi,
    };
  }

  return {
    ...genelSiparis,
    sube_id: genelSiparis.sube_id || subeSiparis.sube_id,
    sube_adi: genelSiparis.sube_adi || subeSiparis.sube_adi,
    teslimat_tipi: teslimatTipi,
    ...(genelDurum === 'beklemede' && subeDurum === 'hazirlaniyor'
      ? { durum: 'hazirlaniyor', asama: 'ocakta' }
      : {}),
  };
}

export function subeSiparisleriniHaritayaBirlestir(genelListe: any[], subeListe: SubeSiparisi[]): any[] {
  const subeHarita = new Map<string, SubeSiparisi>();
  (subeListe || []).forEach((s) => {
    if (s.id) subeHarita.set(s.id, s);
    if (s.siparis_kodu) subeHarita.set(s.siparis_kodu, s);
  });

  const islenenIdler = new Set<string>();
  const sonuc = (genelListe || []).map((g) => {
    const eslesenSube = subeHarita.get(g.id) || subeHarita.get(g.siparis_kodu) || subeHarita.get(g.siparisKodu);
    if (eslesenSube?.id) islenenIdler.add(eslesenSube.id);
    if (eslesenSube?.siparis_kodu) islenenIdler.add(eslesenSube.siparis_kodu);
    return subeSiparisKaydiniBirlestir(g, eslesenSube);
  });

  // Genel siparisler koleksiyonunda henüz kaydı olmayan salt şube siparişlerini de ekle
  (subeListe || []).forEach((s) => {
    if (islenenIdler.has(s.id) || (s.siparis_kodu && islenenIdler.has(s.siparis_kodu))) return;
    const eslenen = subeDurumunuGenelSipariseEsle(s.durum, s.teslimat_tipi);
    sonuc.push({
      id: s.id,
      siparis_kodu: s.siparis_kodu,
      siparisKodu: s.siparis_kodu,
      pin_kodu: s.pin_kodu,
      pinKodu: s.pin_kodu,
      teslimat_kodu: s.pin_kodu,
      musteri_id: s.musteri_id,
      musteri_adi: s.musteri_adi,
      musteri_telefon: s.musteri_telefon,
      teslimat_tipi: s.teslimat_tipi || 'gel_al',
      teslimat_adresi_metni: s.teslimat_adresi_metni || '',
      mutfak_id: s.sube_id,
      sube_id: s.sube_id,
      sube_adi: s.sube_adi,
      mutfak_adi: s.sube_adi,
      siparis_kaynagi: 'sube',
      durum: eslenen.durum,
      asama: eslenen.asama,
      durum_aciklamasi: eslenen.durumAciklamasi,
      toplam_tutar: s.toplam_tutar,
      odeme_yontemi: s.odeme_yontemi,
      odemeDurumu: s.odeme_durumu,
      paytrOid: s.paytr_oid,
      olusturma_tarihi: s.olusturma_tarihi,
      elemanlar: (s.urunler || []).map((u) => ({
        yemek_id: u.urun_id,
        yemek_baslik: u.ad,
        baslik: u.ad,
        adet: u.adet,
        birim_fiyat: u.fiyat,
      })),
    });
  });

  return sonuc;
}
