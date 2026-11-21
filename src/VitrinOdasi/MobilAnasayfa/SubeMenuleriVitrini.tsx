import React, { useState, useMemo } from 'react';
import { Store, ArrowRight, Sparkles } from 'lucide-react';
import { GelAlSubesi, SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
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

export const SubeMenuleriVitrini: React.FC<SubeMenuleriVitriniProps> = ({
  enYakinSube,
  subeSecildi,
}) => {
  const { gelAlSubeleri } = teslimatHafizasiKullan();
  const { tumUrunler, yukleniyor } = useSubeUrunleri();
  const { sepetPaneliAc } = sepetHafizasiKullan();
  const { aramaMetni } = aramaVeFiltreKullan();

  const [seciliSubeId, setSeciliSubeId] = useState<string>('tumu');
  const [seciliDetayUrun, setSeciliDetayUrun] = useState<SubeUrunu | null>(null);

  const aktifSubeler = useMemo(
    () => gelAlSubeleri.filter((s) => s.acik_mi !== false),
    [gelAlSubeleri]
  );

  const subeHaritasi = useMemo(() => {
    const harita = new Map<string, GelAlSubesi>();
    gelAlSubeleri.forEach((s) => {
      if (s.id) harita.set(s.id, s);
      if (s.kimlik) harita.set(s.kimlik, s);
    });
    return harita;
  }, [gelAlSubeleri]);

  const gosterilecekUrunler = useMemo(() => {
    const aranan = (aramaMetni || '').trim().toLocaleLowerCase('tr');
    return tumUrunler
      .filter((u) => {
        const subeUygun = seciliSubeId === 'tumu' || u.sube_id === seciliSubeId;
        const aramaUygun =
          !aranan ||
          u.ad.toLocaleLowerCase('tr').includes(aranan) ||
          (u.aciklama && u.aciklama.toLocaleLowerCase('tr').includes(aranan)) ||
          (u.kategori && u.kategori.toLocaleLowerCase('tr').includes(aranan));
        return subeUygun && aramaUygun;
      })
      .sort((a, b) => (b.stok_adedi > 0 ? 1 : 0) - (a.stok_adedi > 0 ? 1 : 0));
  }, [tumUrunler, seciliSubeId, aramaMetni]);

  if (!yukleniyor && tumUrunler.length === 0) return null;

  const hedefSube =
    (seciliSubeId !== 'tumu' ? subeHaritasi.get(seciliSubeId) : enYakinSube) ||
    aktifSubeler[0];

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

      {/* Şube Sekmeleri */}
      {aktifSubeler.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSeciliSubeId('tumu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              seciliSubeId === 'tumu'
                ? 'bg-[#6D237A] text-white border-[#9633A7] shadow-sm'
                : 'bg-[#240E2A] text-purple-200 border-purple-900/50 hover:border-amber-400/50'
            }`}
          >
            Tüm Şubeler ({tumUrunler.length})
          </button>

          {aktifSubeler.map((sube) => {
            const subeKimlik = sube.id || sube.kimlik || '';
            const secili = seciliSubeId === subeKimlik;
            const enYakinMi = enYakinSube && (enYakinSube.id === subeKimlik || enYakinSube.kimlik === subeKimlik);
            return (
              <button
                key={subeKimlik}
                type="button"
                onClick={() => setSeciliSubeId(subeKimlik)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                  secili
                    ? 'bg-[#6D237A] text-white border-[#9633A7] shadow-sm'
                    : 'bg-[#240E2A] text-purple-200 border-purple-900/50 hover:border-amber-400/50'
                }`}
              >
                <span className="truncate max-w-[160px]">{subeKisaAdiGetir(sube.ad)}</span>
                {enYakinMi && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-[#180A1F] font-extrabold">
                    Yakın
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

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
            const subeAdi =
              seciliSubeId === 'tumu'
                ? subeKisaAdiGetir(subeHaritasi.get(urun.sube_id)?.ad)
                : undefined;
            return (
              <SubeUrunKarti
                key={urun.id}
                urun={urun}
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
