import React, { useMemo } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { filtreliYemekleriGetir } from '@/src/MalzemeCekmeceleri/filtreliYemekleriGetir';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { mutfakMolaDurumuGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';
import { MobilYemekKarti } from './MobilYemekKarti';
import { Yemek } from '@/src/veritabani/VeriTipleri';

interface MobilPopulerYemeklerOzellikleri {
  yemekSecildi?: (yemek: Yemek) => void;
}

export const MobilPopulerYemekler: React.FC<MobilPopulerYemeklerOzellikleri> = ({
  yemekSecildi
}) => {
  const { aramaMetni, aktifFiltreler, filtreler } = aramaVeFiltreKullan();
  const { mutfaklarListesi } = sepetHafizasiKullan();
  const anlikDakika = useCanliDakika();
  const seciliFiltreler = aktifFiltreler || filtreler || { kategori: 'Tümü' };
  const { yemekler, yukleniyor } = filtreliYemekleriGetir(aramaMetni, seciliFiltreler);

  const siraliYemekler = useMemo(() => {
    if (!yemekler || yemekler.length === 0) return [];
    const mutfakHaritasi = new Map(
      mutfaklarListesi.flatMap((m) => [
        ...(m.id ? [[m.id, m] as const] : []),
        ...(m.kimlik ? [[m.kimlik, m] as const] : []),
      ])
    );
    return [...yemekler].sort((a, b) => {
      const aAcik = !mutfakMolaDurumuGetir(mutfakHaritasi.get(a.mutfak_id), anlikDakika).siparisEngelliMi ? 1 : 0;
      const bAcik = !mutfakMolaDurumuGetir(mutfakHaritasi.get(b.mutfak_id), anlikDakika).siparisEngelliMi ? 1 : 0;
      return bAcik - aAcik;
    });
  }, [yemekler, mutfaklarListesi, anlikDakika]);

  if (yukleniyor && (!yemekler || yemekler.length === 0)) {
    return (
      <section className="w-full py-3 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse" />
          <div className="h-72 bg-purple-950/20 rounded-2xl animate-pulse hidden sm:block" />
        </div>
      </section>
    );
  }

  const kategoriAdi = seciliFiltreler?.kategori;

  return (
    <section className="w-full py-3 px-4">
      {/* Başlık Satırı */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide">
            {kategoriAdi && kategoriAdi !== 'Tümü'
              ? `${kategoriAdi} Lezzetleri`
              : 'Günün Popüler Ev Yemekleri'}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-300/70 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Sıcak & Taze</span>
        </div>
      </div>

      {/* Responsive Izgara: Mobilde 1, Tablette 2, Masaüstünde 3 Sıra */}
      {siraliYemekler.length === 0 ? (
        <div className="bg-[#240E2A]/50 border border-purple-900/30 rounded-2xl p-6 text-center">
          <p className="text-xs text-purple-300/70">
            Aradığınız kriterlere uygun lezzet bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {siraliYemekler.map((yemek) => (
            <MobilYemekKarti
              key={yemek.id}
              yemek={yemek}
              onSec={yemekSecildi}
            />
          ))}
        </div>
      )}
    </section>
  );
};
