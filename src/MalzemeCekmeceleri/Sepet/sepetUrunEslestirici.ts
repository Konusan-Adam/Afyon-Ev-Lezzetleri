import { GelAlSubesi, MutfakTipi, SepetElemani, YemekTipi } from '@/src/veritabani/VeriTipleri';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';

function subeUrununuYemegeDonustur(urun: SubeUrunu): YemekTipi {
  return {
    id: urun.id,
    mutfak_id: urun.sube_id,
    baslik: urun.ad,
    aciklama: urun.aciklama || 'Şube tezgahından günlük taze lezzet.',
    fiyat: urun.fiyat,
    kalan_stok: urun.stok_adedi,
    kategori: urun.kategori,
    gorsel_url: urun.gorsel_url || '/marka_logosu.jpg',
    puan: 5.0,
    stokta_var_mi: urun.stok_adedi > 0,
    tukendi_mi: urun.stok_adedi <= 0,
  };
}

function subeyiMutfagaDonustur(sube: GelAlSubesi): MutfakTipi {
  const kimlik = sube.id || sube.kimlik || 'sube-1';
  return {
    id: kimlik,
    ad: sube.ad,
    aciklama: sube.aciklama,
    adres: sube.adres,
    ilce: sube.ilce,
    mahalle: sube.mahalle,
    min_siparis_tutari: 0,
    teslimat_ucreti: 0,
    puan: sube.puan || 5.0,
    degerlendirme_sayisi: sube.degerlendirme_sayisi,
    gorsel_url: sube.gorsel,
    acik_mi: sube.acik_mi,
    calisma_saatleri: sube.calisma_saatleri,
    hazirlanma_suresi: sube.hazirlanma_suresi || '15-20 dk',
    tip: 'sube',
  };
}

export function sepetElemanlariniZenginlestir(
  sepetElemanlari: SepetElemani[],
  yemekler: YemekTipi[],
  mutfaklar: MutfakTipi[],
  subeUrunleri: SubeUrunu[],
  subeler: GelAlSubesi[]
): SepetElemani[] {
  return sepetElemanlari.map((item) => {
    const bulunanYemek = yemekler.find((y) => y.id === item.yemek_id);
    const bulunanSubeUrunu = !bulunanYemek
      ? subeUrunleri.find((u) => u.id === item.yemek_id)
      : undefined;

    const eslesenYemek =
      bulunanYemek ||
      (bulunanSubeUrunu ? subeUrununuYemegeDonustur(bulunanSubeUrunu) : undefined) ||
      item.yemek ||
      (item.coklu_menu_mu
        ? {
            id: item.yemek_id || item.id,
            mutfak_id: item.mutfak_id || '',
            baslik: item.coklu_menu_baslik || 'Çoklu Menü',
            aciklama: item.varyasyon || '',
            fiyat: item.birim_fiyat || 0,
            kategori: 'Çoklu Menü',
            gorsel_url: item.coklu_menu_gorsel || '/marka_logosu.jpg',
            puan: 5.0,
          }
        : undefined);

    const hedefMutfakId = item.mutfak_id || eslesenYemek?.mutfak_id;
    const bulunanMutfak = mutfaklar.find((m) => m.id === hedefMutfakId || m.kimlik === hedefMutfakId);
    const bulunanSube = !bulunanMutfak
      ? subeler.find((s) => (s.id || s.kimlik) === hedefMutfakId)
      : undefined;

    const eslesenMutfak =
      bulunanMutfak ||
      (bulunanSube ? subeyiMutfagaDonustur(bulunanSube) : undefined) ||
      item.mutfak;

    return {
      ...item,
      mutfak_id: hedefMutfakId,
      birim_fiyat: item.birim_fiyat || eslesenYemek?.fiyat || 0,
      yemek: eslesenYemek,
      mutfak: eslesenMutfak,
    };
  });
}
