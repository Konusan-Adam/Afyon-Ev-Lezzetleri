import { useState, useEffect } from 'react';
import { Yemek, MutfakTipi, KategoriTipi, GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { BASLANGIC_GEL_AL_SUBELERI } from './gelAlSubeleriGetir';
import { VARSAYILAN_SUBE_URUNLERI } from './Sube/useSubeUrunleri';
import { calismaSaatiDurumuHesapla } from './OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { mutfakMolaDurumuGetir } from './OnSiparisVePorsiyon/yemekStokDurumu';

export interface KapsamliAramaSonuclari {
  yemekler: Yemek[];
  mutfaklar: MutfakTipi[];
  kategoriler: KategoriTipi[];
  subeler: GelAlSubesi[];
  subeUrunleri: SubeUrunu[];
}

export function yemekArama(aramaMetni: string): {
  sonuclar: Yemek[];
  mutfakSonuclar: MutfakTipi[];
  kategoriSonuclar: KategoriTipi[];
  subeSonuclar: GelAlSubesi[];
  subeUrunSonuclar: SubeUrunu[];
  yukleniyor: boolean;
  hata: string | null;
  sonuclarHepsi: KapsamliAramaSonuclari;
} {
  const [yemekler, setYemekler] = useState<Yemek[]>([]);
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>([]);
  const [kategoriler, setKategoriler] = useState<KategoriTipi[]>([]);
  const [subeler, setSubeler] = useState<GelAlSubesi[]>([]);
  const [subeUrunleri, setSubeUrunleri] = useState<SubeUrunu[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!aramaMetni.trim()) {
      setYemekler([]);
      setMutfaklar([]);
      setKategoriler([]);
      setSubeler([]);
      setSubeUrunleri([]);
      setYukleniyor(false);
      return;
    }

    let iptal = false;
    setYukleniyor(true);
    setHata(null);

    async function aramaYap() {
      try {
        let temelYemekler: Yemek[] = [];
        let temelMutfaklar: MutfakTipi[] = [];
        let temelKategoriler: KategoriTipi[] = [];
        let temelSubeler: GelAlSubesi[] = BASLANGIC_GEL_AL_SUBELERI;
        let temelSubeUrunleri: SubeUrunu[] = VARSAYILAN_SUBE_URUNLERI;

        if (canliFirebaseAktifMi()) {
          const [fbYemek, fbMutfak, fbKat, fbSubeler, fbSubeUrun] = await Promise.all([
            koleksiyonGetir<Yemek>('yemekler').catch(() => []),
            koleksiyonGetir<MutfakTipi>('mutfaklar').catch(() => []),
            koleksiyonGetir<KategoriTipi>('kategoriler').catch(() => []),
            koleksiyonGetir<GelAlSubesi>('gel_al_subeleri').catch(() => []),
            koleksiyonGetir<SubeUrunu>('sube_stoklari').catch(() => []),
          ]);
          if (fbYemek) temelYemekler = fbYemek;
          if (fbMutfak) temelMutfaklar = fbMutfak;
          if (fbKat) temelKategoriler = fbKat;
          if (fbSubeler && fbSubeler.length > 0) temelSubeler = fbSubeler;
          if (fbSubeUrun && fbSubeUrun.length > 0) temelSubeUrunleri = fbSubeUrun;
        }

        if (iptal) return;

        const aranan = aramaMetni.toLocaleLowerCase('tr').trim();
        const subeHaritasi = new Map<string, GelAlSubesi>();
        temelSubeler.forEach((s) => {
          if (s.id) subeHaritasi.set(s.id, s);
          if (s.kimlik) subeHaritasi.set(s.kimlik, s);
        });

        // 1. Şubeleri Filtrele (Açıklar Üstte)
        const filtrelenmisSubeler = temelSubeler
          .filter(
            (s) =>
              s.ad.toLocaleLowerCase('tr').includes(aranan) ||
              (s.adres && s.adres.toLocaleLowerCase('tr').includes(aranan)) ||
              (s.mahalle && s.mahalle.toLocaleLowerCase('tr').includes(aranan)) ||
              (s.ilce && s.ilce.toLocaleLowerCase('tr').includes(aranan)) ||
              (s.aciklama && s.aciklama.toLocaleLowerCase('tr').includes(aranan))
          )
          .sort((a, b) => {
            const aAcik = calismaSaatiDurumuHesapla(a).acikMi ? 1 : 0;
            const bAcik = calismaSaatiDurumuHesapla(b).acikMi ? 1 : 0;
            return bAcik - aAcik;
          })
          .slice(0, 4);

        // 2. Şube Ürünlerini Filtrele (Açık şubeler ve stokta olanlar üstte)
        const filtrelenmisSubeUrunleri = temelSubeUrunleri
          .filter((u) => {
            const bagliSube = subeHaritasi.get(u.sube_id);
            return (
              u.ad.toLocaleLowerCase('tr').includes(aranan) ||
              (u.aciklama && u.aciklama.toLocaleLowerCase('tr').includes(aranan)) ||
              (u.kategori && u.kategori.toLocaleLowerCase('tr').includes(aranan)) ||
              (bagliSube?.ad && bagliSube.ad.toLocaleLowerCase('tr').includes(aranan)) ||
              (bagliSube?.mahalle && bagliSube.mahalle.toLocaleLowerCase('tr').includes(aranan))
            );
          })
          .sort((a, b) => {
            const aAcik = calismaSaatiDurumuHesapla(subeHaritasi.get(a.sube_id)).acikMi ? 1 : 0;
            const bAcik = calismaSaatiDurumuHesapla(subeHaritasi.get(b.sube_id)).acikMi ? 1 : 0;
            if (bAcik !== aAcik) return bAcik - aAcik;
            return (b.stok_adedi > 0 ? 1 : 0) - (a.stok_adedi > 0 ? 1 : 0);
          })
          .slice(0, 6);

        // 3. Yemekleri Filtrele (Açıklar üstte)
        const filtrelenmisYemekler = temelYemekler
          .filter((y) => {
            if (y.stokta_var_mi === false || y.tukendi_mi === true || y.onayli_mi === false) {
              return false;
            }
            return (
              y.baslik.toLocaleLowerCase('tr').includes(aranan) ||
              (y.aciklama && y.aciklama.toLocaleLowerCase('tr').includes(aranan)) ||
              (y.kategori && y.kategori.toLocaleLowerCase('tr').includes(aranan))
            );
          })
          .sort((a, b) => {
            const mA = temelMutfaklar.find((m) => m.id === a.mutfak_id || m.kimlik === a.mutfak_id);
            const mB = temelMutfaklar.find((m) => m.id === b.mutfak_id || m.kimlik === b.mutfak_id);
            const aAcik = !mutfakMolaDurumuGetir(mA).siparisEngelliMi ? 1 : 0;
            const bAcik = !mutfakMolaDurumuGetir(mB).siparisEngelliMi ? 1 : 0;
            return bAcik - aAcik;
          })
          .slice(0, 6);

        // 4. Mutfakları Filtrele (Açıklar üstte)
        const filtrelenmisMutfaklar = temelMutfaklar
          .filter(
            (m) =>
              (m.ad && m.ad.toLocaleLowerCase('tr').includes(aranan)) ||
              (m.mutfak_adi && m.mutfak_adi.toLocaleLowerCase('tr').includes(aranan)) ||
              (m.aciklama && m.aciklama.toLocaleLowerCase('tr').includes(aranan)) ||
              (m.adres && m.adres.toLocaleLowerCase('tr').includes(aranan))
          )
          .sort((a, b) => {
            const aAcik = !mutfakMolaDurumuGetir(a).siparisEngelliMi ? 1 : 0;
            const bAcik = !mutfakMolaDurumuGetir(b).siparisEngelliMi ? 1 : 0;
            return bAcik - aAcik;
          })
          .slice(0, 4);

        // 5. Kategorileri Filtrele
        const filtrelenmisKategoriler = temelKategoriler
          .filter(
            (k) =>
              k.ad.toLocaleLowerCase('tr').includes(aranan) ||
              (k.aciklama && k.aciklama.toLocaleLowerCase('tr').includes(aranan))
          )
          .slice(0, 4);

        setYemekler(filtrelenmisYemekler);
        setMutfaklar(filtrelenmisMutfaklar);
        setKategoriler(filtrelenmisKategoriler);
        setSubeler(filtrelenmisSubeler);
        setSubeUrunleri(filtrelenmisSubeUrunleri);
      } catch {
        if (!iptal) {
          setHata('Arama sırasında bir hata oluştu');
          setYemekler([]);
          setMutfaklar([]);
          setKategoriler([]);
          setSubeler([]);
          setSubeUrunleri([]);
        }
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    }

    aramaYap();

    return () => {
      iptal = true;
    };
  }, [aramaMetni]);

  return {
    sonuclar: yemekler,
    mutfakSonuclar: mutfaklar,
    kategoriSonuclar: kategoriler,
    subeSonuclar: subeler,
    subeUrunSonuclar: subeUrunleri,
    yukleniyor,
    hata,
    sonuclarHepsi: {
      yemekler,
      mutfaklar,
      kategoriler,
      subeler,
      subeUrunleri,
    },
  };
}
