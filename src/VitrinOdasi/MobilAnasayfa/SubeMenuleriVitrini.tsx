import React, { useState, useMemo } from 'react';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { GelAlSubesi, SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';
import { SubeUrunKarti } from '../SubeVitrini/SubeUrunKarti';
import { SubeUrunDetayModali } from '../SubeVitrini/SubeUrunDetayModali';

interface SubeMenuleriVitriniProps {
  enYakinSube?: GelAlSubesi | null;
  subeSecildi?: (sube: GelAlSubesi) => void;
}

function subeKisaAdiGetir(ad?: string): string {
  if (!ad) return '';
  return ad
    .replace(' Gel-Al & Dağıtım Noktası', '')
    .replace(' Gel-Al Teslimat Masası', '')
    .replace(' Gel-Al Noktası', '')
    .trim();
}

function kategoriEslesiyorMu(urunKat?: string, seciliKat?: string): boolean {
  if (!seciliKat || seciliKat === 'Tümü') return true;
  const u = (urunKat || '').toLocaleLowerCase('tr').trim();
  const s = seciliKat.toLocaleLowerCase('tr').trim();
  if (!u) return false;
  if (u === s || u.includes(s) || s.includes(u)) return true;
  if ((s.includes('bükme') || s.includes('hamur')) && (u.includes('bükme') || u.includes('hamur'))) return true;
  if (s.includes('mantı') && u.includes('mantı')) return true;
  if (s.includes('tatlı') && u.includes('tatlı')) return true;
  if ((s.includes('sucuk') || s.includes('et')) && (u.includes('ev yemek') || u.includes('et') || u.includes('köfte'))) return true;
  if (s.includes('keşkek') && u.includes('ev yemek')) return true;
  return false;
}

export const SubeMenuleriVitrini: React.FC<SubeMenuleriVitriniProps> = ({
  enYakinSube,
  subeSecildi,
}) => {
  const { gelAlSubeleri } = teslimatHafizasiKullan();
  const { tumUrunler, yukleniyor } = useSubeUrunleri();
  const { sepetPaneliAc } = sepetHafizasiKullan();
  const { aramaMetni, aktifFiltreler } = aramaVeFiltreKullan();
  const anlikDakika = useCanliDakika();

  const [seciliDetayUrun, setSeciliDetayUrun] = useState<SubeUrunu | null>(null);

  const subeHaritasi = useMemo(() => {
    const harita = new Map<string, GelAlSubesi>();
    gelAlSubeleri.forEach((s) => {
      if (s.id) harita.set(s.id, s);
      if (s.kimlik) harita.set(s.kimlik, s);
    });
    return harita;
  }, [gelAlSubeleri]);

  const siraliSubeler = useMemo(() => {
    return [...gelAlSubeleri].sort((a, b) => {
      const aAcik = calismaSaatiDurumuHesapla(a, anlikDakika).acikMi ? 1 : 0;
      const bAcik = calismaSaatiDurumuHesapla(b, anlikDakika).acikMi ? 1 : 0;
      return bAcik - aAcik;
    });
  }, [gelAlSubeleri, anlikDakika]);

  const seciliSubeId = aktifFiltreler?.subeId;
  const gosterilecekUrunler = useMemo(() => {
    const aranan = (aramaMetni || '').trim().toLocaleLowerCase('tr');
    const seciliKategori = aktifFiltreler?.kategori;
    const minFiyat = aktifFiltreler?.minFiyat;
    const maxFiyat = aktifFiltreler?.maxFiyat ?? aktifFiltreler?.maksFiyat;
    const siralama = aktifFiltreler?.siralama || 'varsayilan';

    return tumUrunler
      .filter((u) => {
        const bagliSube = subeHaritasi.get(u.sube_id);
        const subeUygun = !seciliSubeId || u.sube_id === seciliSubeId;
        const kategoriUygun = kategoriEslesiyorMu(u.kategori, seciliKategori);
        const minUygun = minFiyat === undefined || u.fiyat >= minFiyat;
        const maxUygun = maxFiyat === undefined || u.fiyat <= maxFiyat;
        const aramaUygun =
          !aranan ||
          u.ad.toLocaleLowerCase('tr').includes(aranan) ||
          (u.aciklama && u.aciklama.toLocaleLowerCase('tr').includes(aranan)) ||
          (u.kategori && u.kategori.toLocaleLowerCase('tr').includes(aranan)) ||
          (bagliSube?.ad && bagliSube.ad.toLocaleLowerCase('tr').includes(aranan)) ||
          (bagliSube?.mahalle && bagliSube.mahalle.toLocaleLowerCase('tr').includes(aranan));

        return subeUygun && kategoriUygun && minUygun && maxUygun && aramaUygun;
      })
      .sort((a, b) => {
        const aAcik = calismaSaatiDurumuHesapla(subeHaritasi.get(a.sube_id), anlikDakika).acikMi ? 1 : 0;
        const bAcik = calismaSaatiDurumuHesapla(subeHaritasi.get(b.sube_id), anlikDakika).acikMi ? 1 : 0;
        if (bAcik !== aAcik) return bAcik - aAcik;
        if (siralama === 'fiyat_artan') return a.fiyat - b.fiyat;
        if (siralama === 'fiyat_azalan') return b.fiyat - a.fiyat;
        return (b.stok_adedi > 0 ? 1 : 0) - (a.stok_adedi > 0 ? 1 : 0);
      });
  }, [tumUrunler, seciliSubeId, aktifFiltreler, aramaMetni, subeHaritasi, anlikDakika]);

  if (!yukleniyor && tumUrunler.length === 0) return null;

  const hedefSube =
    (seciliSubeId ? subeHaritasi.get(seciliSubeId) : enYakinSube) ||
    siraliSubeler[0];

  return (
    <section className="w-full py-3 px-4 lg:px-0 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-400" />
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide">
            Şubelerden Hemen Hazır Menüler
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            Gel-Al %10 Avantajlı
          </span>
        </div>

        {hedefSube && subeSecildi && (
          <button
            type="button"
            onClick={() => subeSecildi(hedefSube)}
            className="text-[11px] sm:text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Şubeye Git</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Ürün Izgarası */}
      {yukleniyor && tumUrunler.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse hidden sm:block" />
        </div>
      ) : gosterilecekUrunler.length === 0 ? (
        <div className="bg-[#240E2A]/50 border border-purple-900/30 rounded-2xl p-5 text-center">
          <p className="text-xs text-purple-300/70">
            Aradığınız kritere uygun hazır şube menüsü bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {gosterilecekUrunler.map((urun) => {
            const bagliSube = subeHaritasi.get(urun.sube_id);
            const subeAdi = subeKisaAdiGetir(bagliSube?.ad);
            return (
              <SubeUrunKarti
                key={urun.id}
                urun={urun}
                sube={bagliSube}
                subeAdi={subeAdi}
                onGelAlSecildi={sepetPaneliAc}
                detayAc={(secilen) => setSeciliDetayUrun(secilen)}
              />
            );
          })}
        </div>
      )}

      {seciliDetayUrun && (
        <SubeUrunDetayModali
          urun={seciliDetayUrun}
          onKapat={() => setSeciliDetayUrun(null)}
          onGelAlSecildi={sepetPaneliAc}
        />
      )}
    </section>
  );
};
