import React from 'react';
import { X, Search, Compass, ArrowRight, Utensils } from 'lucide-react';
import { MOBIL_KATEGORI_LISTESI } from './KategoriDaireselKarti';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';

interface MobilKesfetPenceresiOzellikleri {
  acik: boolean;
  kapat: () => void;
}

const POPULER_ARAMALAR = [
  'Haşhaşlı Bükme',
  'Afyon Keşkeği',
  'Sucuklu Yumurta',
  'Kaymaklı Ekmek Kadayıfı',
  'Vişneli Tatlı',
  'Kuru Patlıcan Dolması',
];

export const MobilKesfetPenceresi: React.FC<MobilKesfetPenceresiOzellikleri> = ({ acik, kapat }) => {
  const { aramaMetni, aramaMetniniDegistir, aktifFiltreler, filtreleriUygula } = aramaVeFiltreKullan();

  if (!acik) return null;

  const kategoriSec = (kategoriId: string) => {
    filtreleriUygula({
      ...(aktifFiltreler || {}),
      kategori: kategoriId,
    });
    kapat();
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const aramaUygula = (kelime: string) => {
    aramaMetniniDegistir(kelime);
    kapat();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fadeIn lg:hidden">
      {/* Kapatmak için dış alana tıklama */}
      <div className="flex-1" onClick={kapat} />

      {/* Keşfet İçerik Paneli */}
      <div className="w-full max-h-[85vh] overflow-y-auto bg-[#180A1F] border-t border-purple-900/50 rounded-t-3xl p-5 shadow-2xl space-y-5 no-scrollbar animate-slideUp">
        
        {/* Üst Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lezzetleri Keşfet</h2>
              <p className="text-[11px] text-purple-300">Afyon ev yemekleri ve özel servisler</p>
            </div>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="w-8 h-8 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hızlı Arama Kutusu */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={aramaMetni}
            onChange={(e) => aramaMetniniDegistir(e.target.value)}
            placeholder="Yemek, aşçı veya lezzet ara..."
            className="w-full bg-[#240F2C] border border-purple-900/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-purple-400/60 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Popüler Hızlı Aramalar */}
        <div>
          <span className="text-xs font-semibold text-purple-200 block mb-2">Popüler Afyon Lezzetleri</span>
          <div className="flex flex-wrap gap-1.5">
            {POPULER_ARAMALAR.map((kelime) => (
              <button
                key={kelime}
                type="button"
                onClick={() => aramaUygula(kelime)}
                className="bg-[#260E2F] hover:bg-[#381444] text-purple-200 hover:text-amber-300 text-xs px-3 py-1.5 rounded-lg border border-purple-900/50 transition-colors cursor-pointer"
              >
                {kelime}
              </button>
            ))}
          </div>
        </div>

        {/* Tüm Kategoriler Izgarası (Grid) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" /> Tüm Kategoriler
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {MOBIL_KATEGORI_LISTESI.map((kat) => (
              <button
                key={kat.id}
                type="button"
                onClick={() => kategoriSec(kat.id)}
                className="bg-[#240F2C] hover:bg-[#34153F] border border-purple-900/40 p-3 rounded-xl flex items-center gap-3 text-left transition-all group cursor-pointer"
              >
                <img
                  src={kat.resimUrl}
                  alt={kat.baslik}
                  className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white group-hover:text-amber-300 block truncate">
                    {kat.baslik}
                  </span>
                  <span className="text-[10px] text-purple-400 flex items-center gap-0.5">
                    İncele <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
