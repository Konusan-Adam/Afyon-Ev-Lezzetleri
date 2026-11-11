import { useState, useEffect } from 'react';
import { Yemek, MutfakTipi, KategoriTipi } from '@/src/veritabani/VeriTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface KapsamliAramaSonuclari {
  yemekler: Yemek[];
  mutfaklar: MutfakTipi[];
  kategoriler: KategoriTipi[];
}

export function yemekArama(aramaMetni: string): { sonuclar: Yemek[]; mutfakSonuclar: MutfakTipi[]; kategoriSonuclar: KategoriTipi[]; yukleniyor: boolean; hata: string | null; sonuclarHepsi: KapsamliAramaSonuclari } {
  const [yemekler, setYemekler] = useState<Yemek[]>([]);
  const [mutfaklar, setMutfaklar] = useState<MutfakTipi[]>([]);
  const [kategoriler, setKategoriler] = useState<KategoriTipi[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    if (!aramaMetni.trim()) {
      setYemekler([]);
      setMutfaklar([]);
      setKategoriler([]);
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

        if (canliFirebaseAktifMi()) {
          const [fbYemek, fbMutfak, fbKat] = await Promise.all([
            koleksiyonGetir<Yemek>('yemekler').catch(() => []),
            koleksiyonGetir<MutfakTipi>('mutfaklar').catch(() => []),
            koleksiyonGetir<KategoriTipi>('kategoriler').catch(() => [])
          ]);
          if (fbYemek) temelYemekler = fbYemek;
          if (fbMutfak) temelMutfaklar = fbMutfak;
          if (fbKat) temelKategoriler = fbKat;
        }

        if (iptal) return;

        const aranan = aramaMetni.toLowerCase().trim();

        // 1. Yemekleri Filtrele (Sadece açık mutfakların yemeklerini göster)
        const filtrelenmisYemekler = temelYemekler.filter((y) => {
          const mutfak = temelMutfaklar.find(m => m.id === y.mutfak_id);
          const mutfakAcik = mutfak?.acik_mi !== false;
          
          if (!mutfakAcik) return false;

          return (
            y.baslik.toLowerCase().includes(aranan) ||
            (y.aciklama && y.aciklama.toLowerCase().includes(aranan)) ||
            (y.kategori && y.kategori.toLowerCase().includes(aranan))
          );
        }).slice(0, 6);

        // 2. Mutfakları Filtrele (Sadece açık olanları göster)
        const filtrelenmisMutfaklar = temelMutfaklar.filter((m) =>
          m.acik_mi !== false && (
            (m.ad && m.ad.toLowerCase().includes(aranan)) ||
            (m.mutfak_adi && m.mutfak_adi.toLowerCase().includes(aranan)) ||
            (m.aciklama && m.aciklama.toLowerCase().includes(aranan)) ||
            (m.adres && m.adres.toLowerCase().includes(aranan))
          )
        ).slice(0, 4);

        // 3. Kategorileri Filtrele
        const filtrelenmisKategoriler = temelKategoriler.filter((k) =>
          k.ad.toLowerCase().includes(aranan) ||
          (k.aciklama && k.aciklama.toLowerCase().includes(aranan))
        ).slice(0, 4);

        setYemekler(filtrelenmisYemekler);
        setMutfaklar(filtrelenmisMutfaklar);
        setKategoriler(filtrelenmisKategoriler);
      } catch (err: unknown) {
        if (!iptal) {
          setHata('Arama sırasında bir hata oluştu');
          setYemekler([]);
          setMutfaklar([]);
          setKategoriler([]);
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
    yukleniyor,
    hata,
    sonuclarHepsi: {
      yemekler,
      mutfaklar,
      kategoriler
    }
  };
}
