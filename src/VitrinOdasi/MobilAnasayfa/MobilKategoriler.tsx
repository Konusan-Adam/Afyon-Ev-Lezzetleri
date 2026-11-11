import React, { useState } from 'react';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { kategorileriGetir, Kategori } from '@/src/MalzemeCekmeceleri/kategorileriGetir';
import { KategoriDaireselKarti, MobilKategoriElemani } from './KategoriDaireselKarti';
import { MobilKategoriModal } from './MobilKategoriModal';
import { Sparkles, X } from 'lucide-react';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

const VARSAYILAN_RESIM = 'https://pngimg.com/uploads/plate/plate_PNG5337.png';

export const MobilKategoriler: React.FC = () => {
  const { aktifFiltreler, filtreleriUygula, altKategoriFiltresiniTemizle, kategoriFiltresiniTemizle } = aramaVeFiltreKullan();
  const { kategoriler, altKategoriler } = kategorileriGetir();
  
  const seciliKategoriAd = aktifFiltreler?.kategori || 'Tümü';
  const seciliAltKategoriAd = aktifFiltreler?.altKategori;

  // Seçilen kategori için açılan Bottom-Sheet Modalı
  const [modalAcik, setModalAcik] = useState(false);
  const [modalKategori, setModalKategori] = useState<Kategori | null>(null);

  const kategoriyeTiklandi = (kategoriAdi: string) => {
    if (kategoriAdi === 'Tümü' || kategoriAdi === 'hepsi') {
      kategoriFiltresiniTemizle();
      return;
    }

    const secilenNesne = kategoriler.find(k => k.ad === kategoriAdi);
    if (secilenNesne) {
      setModalKategori(secilenNesne);
      setModalAcik(true);
    }
  };

  const modaldaTumunuSec = () => {
    if (modalKategori) {
      filtreleriUygula({
        ...(aktifFiltreler || {}),
        kategori: modalKategori.ad,
        altKategori: undefined
      });
    }
  };

  const modaldaAltKategoriSec = (altAd: string) => {
    if (modalKategori) {
      filtreleriUygula({
        ...(aktifFiltreler || {}),
        kategori: modalKategori.ad,
        altKategori: altAd
      });
    }
  };

  const bagliAltKategoriler = modalKategori
    ? altKategoriler.filter(alt => alt.ust_kategori_id === modalKategori.id)
    : [];

  const gorulenIdler = new Set<string>();
  const donusturulmusKategoriler: MobilKategoriElemani[] = [];

  for (const k of kategoriler) {
    const elemanId = (k.id === 'hepsi' || k.ad === 'Tümü') ? 'Tümü' : k.ad;
    if (gorulenIdler.has(elemanId)) continue;
    gorulenIdler.add(elemanId);

    donusturulmusKategoriler.push({
      id: elemanId,
      baslik: elemanId === 'Tümü' ? 'Tüm Lezzetler' : k.ad,
      resimUrl: gorselUrlGuvenliYap(k.resim_url) || VARSAYILAN_RESIM
    });
  }

  return (
    <nav aria-label="Yemek Kategorileri" className="w-full pt-3 pb-2 space-y-2">
      {/* Ferah aralıklı (gap-5), yuvarlak iştah açıcı vitrin tabakları */}
      <div className="flex items-start gap-5 overflow-x-auto px-5 no-scrollbar scroll-smooth">
        {donusturulmusKategoriler.map((kategori) => (
          <KategoriDaireselKarti
            key={`mobil-kat-${kategori.id}`}
            kategori={kategori}
            secili={seciliKategoriAd === (kategori.id === 'Tümü' ? 'Tümü' : kategori.baslik)}
            onSec={kategoriyeTiklandi}
          />
        ))}
      </div>

      {/* Aktif Alt Kategori Seçilmişse Bilgi ve Temizleme Hapı */}
      {seciliAltKategoriAd && (
        <div className="px-5 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-purple-950 font-extrabold text-[11px] shadow-sm">
            <Sparkles className="w-3 h-3 text-purple-950" />
            <span>{seciliKategoriAd}: {seciliAltKategoriAd}</span>
            <button
              type="button"
              onClick={() => altKategoriFiltresiniTemizle()}
              className="ml-1 p-0.5 rounded-full hover:bg-amber-500 text-purple-950"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 🚀 ALTTAN AÇILAN MEGA MODAL (BOTTOM-SHEET) */}
      <MobilKategoriModal
        acik={modalAcik}
        onKapat={() => setModalAcik(false)}
        kategori={modalKategori}
        altKategoriler={bagliAltKategoriler}
        seciliAltKategoriAd={seciliKategoriAd === modalKategori?.ad ? seciliAltKategoriAd : undefined}
        onAltKategoriSec={modaldaAltKategoriSec}
        onTumKategoriyiSec={modaldaTumunuSec}
      />
    </nav>
  );
};
