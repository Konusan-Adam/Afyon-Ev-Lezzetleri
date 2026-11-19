import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

export const MasaustuSepetSatiri: React.FC<{ eleman: SepetElemani }> = ({ eleman }) => {
  const { adetGuncelle, sepettenSil, sepetElemanlari } = sepetHafizasiKullan();

  const stokBilgisi = !eleman.coklu_menu_mu && eleman.yemek
    ? yemekStokDurumuHesapla(eleman.yemek, eleman.mutfak)
    : null;

  const digerSatirlarToplami = sepetElemanlari
    .filter((e) => e.yemek_id === eleman.yemek_id && e.id !== eleman.id)
    .reduce((t, e) => t + e.adet, 0);

  const maksStokUlasildi = Boolean(
    stokBilgisi?.stokTakibiVarMi &&
      stokBilgisi.kalanStok !== undefined &&
      eleman.adet + digerSatirlarToplami >= stokBilgisi.kalanStok
  );

  return (
    <div className="flex items-center justify-between py-2 border-b border-purple-900/30 text-xs">
      <div className="flex-1 min-w-0 pr-2">
        <p className="font-semibold text-white truncate">
          {eleman.yemek?.baslik || eleman.coklu_menu_baslik || 'Lezzet'}
        </p>
        {eleman.varyasyon && (
          <p className="text-[10px] text-purple-300/75 line-clamp-2 mt-0.5 leading-snug">
            {eleman.varyasyon}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-400 font-bold">{eleman.birim_fiyat} ₺</span>
          {maksStokUlasildi && stokBilgisi?.kalanStok !== undefined && (
            <span className="text-[9px] text-amber-300/90 font-semibold">
              (Maks. {stokBilgisi.kalanStok} {stokBilgisi.birim})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-black/50 border border-purple-800/60 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => {
              if (eleman.adet > 1) {
                adetGuncelle(eleman.id, eleman.adet - 1);
              } else {
                sepettenSil(eleman.id);
              }
            }}
            className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/50 cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-6 text-center font-bold text-white text-xs">{eleman.adet}</span>

          <button
            type="button"
            disabled={maksStokUlasildi}
            onClick={() => !maksStokUlasildi && adetGuncelle(eleman.id, eleman.adet + 1)}
            title={maksStokUlasildi ? 'Stok üst sınırına ulaşıldı' : 'Adet Artır'}
            className={`w-6 h-6 flex items-center justify-center ${
              maksStokUlasildi
                ? 'text-purple-700 cursor-not-allowed'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/50 cursor-pointer'
            }`}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => sepettenSil(eleman.id)}
          className="text-purple-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
          title="Sil"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
