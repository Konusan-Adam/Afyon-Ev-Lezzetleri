import React, { useRef, useEffect } from 'react';
import { X, Filter, Trash2, SlidersHorizontal } from 'lucide-react';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';

interface FiltreOzetBalonuOzellikleri {
  acik: boolean;
  kapat: () => void;
  filtrePaneliniAc: () => void;
}

export const FiltreOzetBalonu: React.FC<FiltreOzetBalonuOzellikleri> = ({
  acik,
  kapat,
  filtrePaneliniAc,
}) => {
  const balonRef = useRef<HTMLDivElement>(null);
  const {
    aktifFiltreler,
    aktifFiltreSayisi,
    kategoriFiltresiniTemizle,
    fiyatFiltresiniTemizle,
    puanFiltresiniTemizle,
    siralamaFiltresiniTemizle,
    tumFiltreleriTemizle,
  } = aramaVeFiltreKullan();

  // Dışına tıklanınca balonu kapat
  useEffect(() => {
    function disinaTiklandi(e: MouseEvent) {
      if (balonRef.current && !balonRef.current.contains(e.target as Node)) {
        kapat();
      }
    }
    if (acik) {
      document.addEventListener('mousedown', disinaTiklandi);
    }
    return () => {
      document.removeEventListener('mousedown', disinaTiklandi);
    };
  }, [acik, kapat]);

  if (!acik) return null;

  return (
    <div
      ref={balonRef}
      className="absolute right-0 top-full mt-2 w-80 bg-[#1A0A1D] border border-[#521E5C] rounded-2xl shadow-2xl p-4 text-xs text-white z-50 animate-in fade-in slide-in-from-top-2 duration-200 select-none"
    >
      {/* Üst Başlık & X Kapatma Düğmesi */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#3D1843]">
        <div className="flex items-center gap-2 text-[#DDAF53] font-bold">
          <Filter className="w-4 h-4 text-[#E0B25B]" />
          <span>Aktif Filtre Özeti ({aktifFiltreSayisi})</span>
        </div>
        <button
          type="button"
          onClick={kapat}
          className="w-6 h-6 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
          title="Balonu Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filtre Listesi */}
      {aktifFiltreSayisi === 0 ? (
        <div className="py-4 text-center text-[#9866A3] italic">
          Henüz aktif bir filtre seçilmedi.
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {/* Kategori */}
          {aktifFiltreler?.kategori && aktifFiltreler.kategori !== 'Tümü' && (
            <div className="flex items-center justify-between bg-[#2A102E] border border-[#521E5C] px-3 py-2 rounded-xl">
              <span className="text-gray-300">
                Kategori: <strong className="text-[#F5D28A]">{aktifFiltreler.kategori}</strong>
              </span>
              <button
                type="button"
                onClick={kategoriFiltresiniTemizle}
                className="text-[#DDAF53] hover:text-red-400 cursor-pointer p-0.5"
                title="Kategoriyi Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fiyat Aralığı */}
          {(aktifFiltreler.minFiyat !== undefined || aktifFiltreler.maxFiyat !== undefined) && (
            <div className="flex items-center justify-between bg-[#2A102E] border border-[#521E5C] px-3 py-2 rounded-xl">
              <span className="text-gray-300">
                Fiyat:{' '}
                <strong className="text-[#F5D28A]">
                  {aktifFiltreler.minFiyat || 0}₺ - {aktifFiltreler.maxFiyat || 'Sınırsız'}₺
                </strong>
              </span>
              <button
                type="button"
                onClick={fiyatFiltresiniTemizle}
                className="text-[#DDAF53] hover:text-red-400 cursor-pointer p-0.5"
                title="Fiyat Filtresini Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* En Az Puan */}
          {aktifFiltreler.minPuan !== undefined && aktifFiltreler.minPuan > 0 && (
            <div className="flex items-center justify-between bg-[#2A102E] border border-[#521E5C] px-3 py-2 rounded-xl">
              <span className="text-gray-300">
                Minimum Puan:{' '}
                <strong className="text-[#F5D28A]">{aktifFiltreler.minPuan} Yıldız</strong>
              </span>
              <button
                type="button"
                onClick={puanFiltresiniTemizle}
                className="text-[#DDAF53] hover:text-red-400 cursor-pointer p-0.5"
                title="Puan Filtresini Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sıralama */}
          {aktifFiltreler.siralama && aktifFiltreler.siralama !== 'varsayilan' && (
            <div className="flex items-center justify-between bg-[#2A102E] border border-[#521E5C] px-3 py-2 rounded-xl">
              <span className="text-gray-300">
                Sıralama:{' '}
                <strong className="text-[#F5D28A]">
                  {aktifFiltreler.siralama === 'fiyat_artan'
                    ? 'Fiyat (Artan)'
                    : aktifFiltreler.siralama === 'fiyat_azalan'
                    ? 'Fiyat (Azalan)'
                    : 'Puan (En Yüksek)'}
                </strong>
              </span>
              <button
                type="button"
                onClick={siralamaFiltresiniTemizle}
                className="text-[#DDAF53] hover:text-red-400 cursor-pointer p-0.5"
                title="Sıralamayı Sıfırla"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Alt Butonlar */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#3D1843]">
        {aktifFiltreSayisi > 0 && (
          <button
            type="button"
            onClick={() => {
              tumFiltreleriTemizle();
            }}
            className="flex-1 bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 py-1.5 px-2 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tümünü Temizle</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            kapat();
            filtrePaneliniAc();
          }}
          className="flex-1 bg-[#4D1857] hover:bg-[#621E6E] border border-[#6D237A] text-white py-1.5 px-2 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E0B25B]" />
          <span>{aktifFiltreSayisi > 0 ? 'Filtreleri Düzenle' : 'Filtre Ekle'}</span>
        </button>
      </div>
    </div>
  );
};
