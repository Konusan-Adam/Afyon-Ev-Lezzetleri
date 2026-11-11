import React from 'react';

export interface MobilKategoriElemani {
  id: string;
  baslik: string;
  resimUrl: string;
}

export const MOBIL_KATEGORI_LISTESI: MobilKategoriElemani[] = [
  {
    id: 'Tümü',
    baslik: 'Tüm Lezzetler',
    resimUrl: 'https://pngimg.com/uploads/plate/plate_PNG5337.png'
  },
  {
    id: 'Hamur İşleri & Bükme',
    baslik: 'Hamur & Bükme',
    resimUrl: 'https://pngimg.com/uploads/pie/pie_PNG51.png'
  },
  {
    id: 'Sıcak Ev Yemekleri',
    baslik: 'Sıcak Yemekler',
    resimUrl: 'https://pngimg.com/uploads/soup/soup_PNG86.png'
  },
  {
    id: 'Et & Sucuklu Lezzetler',
    baslik: 'Et & Sucuk',
    resimUrl: 'https://pngimg.com/uploads/kebab/kebab_PNG48.png'
  },
  {
    id: 'Geleneksel Tatlılar',
    baslik: 'Afyon Tatlıları',
    resimUrl: 'https://pngimg.com/uploads/pancake/pancake_PNG98.png'
  },
  {
    id: 'Yöresel İçecekler',
    baslik: 'Ev İçecekleri',
    resimUrl: 'https://pngimg.com/uploads/cocktail/cocktail_PNG72.png'
  }
];

interface KategoriDaireselKartiOzellikleri {
  kategori: MobilKategoriElemani;
  secili: boolean;
  onSec: (id: string) => void;
}

export const KategoriDaireselKarti: React.FC<KategoriDaireselKartiOzellikleri> = ({
  kategori,
  secili,
  onSec
}) => {
  return (
    <button
      type="button"
      onClick={() => onSec(kategori.id)}
      className="group flex flex-col items-center gap-2 shrink-0 w-[78px] focus:outline-none cursor-pointer select-none transition-transform duration-200 active:scale-95"
    >
      {/* Çerçevesiz, Kutusuz, Gerçek İştah Açıcı Yemek Resmi */}
      <div className="w-16 h-16 flex items-center justify-center relative">
        <img
          src={kategori.resimUrl}
          alt={kategori.baslik}
          className={`w-14 h-14 object-contain transition-all duration-300 pointer-events-none drop-shadow-md ${
            secili
              ? 'scale-110 drop-shadow-[0_4px_14px_rgba(251,191,36,0.6)]'
              : 'group-hover:scale-105 opacity-90 group-hover:opacity-100'
          }`}
          referrerPolicy="no-referrer"
        />
        {secili && (
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-300" />
        )}
      </div>

      {/* Sade, Ferah, Doğal Kategori Başlığı */}
      <span
        className={`text-[11px] leading-tight text-center font-medium line-clamp-2 transition-colors ${
          secili
            ? 'text-amber-400 font-bold'
            : 'text-purple-200/75 group-hover:text-white'
        }`}
      >
        {kategori.baslik}
      </span>
    </button>
  );
};
