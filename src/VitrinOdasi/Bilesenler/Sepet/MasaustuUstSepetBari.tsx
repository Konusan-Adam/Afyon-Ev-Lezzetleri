import React from 'react';
import { ShoppingBag, ChevronRight, Store, Bike } from 'lucide-react';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

export const MasaustuUstSepetBari: React.FC = () => {
  const {
    sepetElemanlari,
    toplamUrunSayisi,
    mutfakGruplari,
    sepetPaneliAc,
  } = sepetHafizasiKullan();
  const { teslimatTipi } = teslimatHafizasiKullan();
  const { tema } = temaHafizasiKullan();

  if (toplamUrunSayisi === 0 || sepetElemanlari.length === 0) return null;

  const acikMi = tema === 'acik';
  const gelAlMi = teslimatTipi === 'gel_al';
  const toplamTutar = mutfakGruplari.reduce((toplam, grup) => toplam + grup.araToplam, 0);

  const siraliUrunler = [...sepetElemanlari].sort((a, b) =>
    (b.eklenme_tarihi || '').localeCompare(a.eklenme_tarihi || '')
  );
  const gosterilenUrun = siraliUrunler[0] || sepetElemanlari[sepetElemanlari.length - 1];
  const gorselHam =
    gosterilenUrun.yemek?.gorsel_url ||
    gosterilenUrun.coklu_menu_gorsel ||
    '/marka_logosu.jpg';
  const urunGorsel = gorselUrlGuvenliYap(gorselHam) || '/marka_logosu.jpg';
  const urunBaslik =
    gosterilenUrun.yemek?.baslik ||
    gosterilenUrun.coklu_menu_baslik ||
    'Sepetinizdeki Lezzet';
  const urunAciklama =
    gosterilenUrun.yemek?.aciklama ||
    gosterilenUrun.varyasyon ||
    gosterilenUrun.mutfak?.ad ||
    'Sepetinize eklendi';
  const digerUrunSayisi = Math.max(0, sepetElemanlari.length - 1);

  return (
    <aside
      aria-label="Masaüstü Sabit Üst Sepet Çubuğu"
      className={`hidden lg:block sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-200 ${
        acikMi
          ? 'bg-[#FFF9F0]/95 border-amber-300 text-gray-900 shadow-md'
          : 'bg-[#1D0B22]/95 border-amber-500/40 text-white shadow-xl shadow-black/40'
      }`}
    >
      <div className="anasayfa-genislik px-4 py-2 flex items-center justify-between gap-4">
        <div
          onClick={sepetPaneliAc}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={urunGorsel}
              alt={urunBaslik}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/marka_logosu.jpg';
              }}
              className="w-11 h-11 rounded-xl object-cover border border-amber-400/60 shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {gosterilenUrun.adet}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold truncate">
                {urunBaslik}
              </span>
              {gosterilenUrun.mutfak?.ad && (
                <span
                  className={`text-[10px] font-semibold shrink-0 ${
                    acikMi ? 'text-amber-800' : 'text-amber-300'
                  }`}
                >
                  • {gosterilenUrun.mutfak.ad}
                </span>
              )}
              {digerUrunSayisi > 0 && (
                <span
                  className={`text-[10px] font-bold shrink-0 ${
                    acikMi ? 'text-purple-700' : 'text-purple-300'
                  }`}
                >
                  +{digerUrunSayisi} ürün daha
                </span>
              )}
            </div>
            <p
              className={`text-[11px] truncate ${
                acikMi ? 'text-gray-600' : 'text-gray-300'
              }`}
            >
              {urunAciklama}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right leading-tight">
            <div
              className={`text-[10px] font-semibold flex items-center justify-end gap-1 ${
                acikMi ? 'text-gray-600' : 'text-purple-200'
              }`}
            >
              {gelAlMi ? (
                <Store className="w-3 h-3 text-amber-500" />
              ) : (
                <Bike className="w-3 h-3 text-amber-400" />
              )}
              <span>
                {gelAlMi ? 'Gel-Al' : 'Kurye'} • {toplamUrunSayisi} Ürün
              </span>
            </div>
            <div className="text-sm font-black text-amber-500">
              {toplamTutar.toFixed(2)} ₺
            </div>
          </div>

          <button
            type="button"
            onClick={sepetPaneliAc}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sepeti Gör</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
