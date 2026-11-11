import { Yemek, GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { mahalleyeEnYakinSubeyiBul } from './SubeMesafeVeMahalleEsleyici';

export interface SubeOncelikSonucu {
  hazirMi: boolean;
  sube?: GelAlSubesi;
  subeUrunu?: SubeUrunu;
}

/**
 * Müşterinin tıkladığı yemeğin, teslimat mahallesine en yakın şubede
 * hazır stokta bulunup bulunmadığını denetler.
 * Hazırsa öncelikli olarak şubeye yönlendirme kararı üretir.
 */
export function subeOnceliginiKontrolEt(
  yemek: Yemek,
  seciliMahalle: string | undefined,
  gelAlSubeleri: GelAlSubesi[],
  subeUrunleri: SubeUrunu[]
): SubeOncelikSonucu {
  if (!gelAlSubeleri || gelAlSubeleri.length === 0) {
    return { hazirMi: false };
  }

  // 1. Müşterinin mahallesine en yakın şubeyi bul
  const enYakinSube = mahalleyeEnYakinSubeyiBul(seciliMahalle, gelAlSubeleri);
  if (!enYakinSube) {
    return { hazirMi: false };
  }

  const subeId = enYakinSube.id || enYakinSube.kimlik;

  // 2. Bu şubenin canlı hazır stoklarını filtrele
  const buSubeninUrunleri = subeUrunleri.filter(
    (u) => (u.sube_id === subeId || u.sube_id === enYakinSube.id) && u.stok_adedi > 0
  );

  if (buSubeninUrunleri.length === 0) {
    return { hazirMi: false };
  }

  // 3. Tıklanan yemek ile şubedeki hazır ürünleri karşılaştır
  const arananBaslik = yemek.baslik.toLocaleLowerCase('tr').trim();
  const arananKategori = (yemek.kategori || '').toLocaleLowerCase('tr').trim();

  // Kelime köklerini ayıkla (Örn: "mercimekli", "bükme", "ağzıaçık", "mantı", "kadayıf")
  const arananKelimeler = arananBaslik.split(/\s+/).filter((k) => k.length > 3);

  const eslesenUrun = buSubeninUrunleri.find((u) => {
    const subeUrunAdi = u.ad.toLocaleLowerCase('tr');
    
    // Birebir eşleşme
    if (subeUrunAdi.includes(arananBaslik) || arananBaslik.includes(subeUrunAdi)) {
      return true;
    }

    // Önemli anahtar kelimelerden herhangi biri tutuyor mu?
    const kelimeUyusmasi = arananKelimeler.some((kelime) => subeUrunAdi.includes(kelime));
    return kelimeUyusmasi;
  });

  if (eslesenUrun) {
    return {
      hazirMi: true,
      sube: enYakinSube,
      subeUrunu: eslesenUrun,
    };
  }

  return { hazirMi: false };
}
