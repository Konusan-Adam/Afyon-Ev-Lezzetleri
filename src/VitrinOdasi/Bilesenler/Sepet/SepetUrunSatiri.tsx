import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

interface SepetUrunSatiriOzellikleri {
  eleman: SepetElemani;
}

export const SepetUrunSatiri: React.FC<SepetUrunSatiriOzellikleri> = ({ eleman }) => {
  const { adetGuncelle, sepettenSil, sepetElemanlari } = sepetHafizasiKullan();

  const yemekAdi = eleman.yemek?.baslik || eleman.coklu_menu_baslik || 'Afyon Yöresel Yemeği';
  const gorselUrl = eleman.yemek?.gorsel_url || eleman.coklu_menu_gorsel || '/marka_logosu.jpg';
  const toplamFiyat = eleman.birim_fiyat * eleman.adet;

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
    <div className="flex items-center gap-3 bg-[#230C27] border border-[#3E1646] p-2.5 rounded-xl text-xs select-none">
      <img
        src={gorselUrl}
        alt={yemekAdi}
        className="w-12 h-12 rounded-lg object-cover border border-[#521E5C] shrink-0 bg-[#290F30]"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/marka_logosu.jpg';
        }}
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate">{yemekAdi}</h4>
        {eleman.varyasyon && (
          <p className="text-[10px] text-purple-200/75 line-clamp-2 mt-0.5 leading-snug">
            {eleman.varyasyon}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[#CFA353] font-bold">{eleman.birim_fiyat} ₺ / adet</span>
          {maksStokUlasildi && stokBilgisi?.kalanStok !== undefined && (
            <span className="text-[10px] text-amber-300 font-semibold">
              (Maks. {stokBilgisi.kalanStok} {stokBilgisi.birim})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-[#140615] border border-[#521E5C] rounded-lg px-2 py-1 shrink-0">
        <button
          type="button"
          onClick={() => adetGuncelle(eleman.id, eleman.adet - 1)}
          className="text-[#DDAF53] hover:text-white transition-colors cursor-pointer"
          title="Adet Azalt"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="font-bold text-white px-1 text-xs min-w-[16px] text-center">
          {eleman.adet}
        </span>
        <button
          type="button"
          disabled={maksStokUlasildi}
          onClick={() => !maksStokUlasildi && adetGuncelle(eleman.id, eleman.adet + 1)}
          className={`transition-colors ${
            maksStokUlasildi
              ? 'text-purple-700 cursor-not-allowed'
              : 'text-[#DDAF53] hover:text-white cursor-pointer'
          }`}
          title={maksStokUlasildi ? 'Stok üst sınırına ulaşıldı' : 'Adet Artır'}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col items-end shrink-0 pl-1">
        <span className="font-bold text-[#F5D28A]">{toplamFiyat} ₺</span>
        <button
          type="button"
          onClick={() => sepettenSil(eleman.id)}
          className="text-red-400 hover:text-red-200 mt-1 cursor-pointer"
          title="Ürünü Sepetten Kaldır"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
