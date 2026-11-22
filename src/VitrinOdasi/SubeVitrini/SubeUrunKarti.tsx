import React from 'react';
import { ShoppingBag, Flame, Store, Check, Ban } from 'lucide-react';
import { SubeUrunu, GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';

interface SubeUrunKartiProps {
  urun: SubeUrunu;
  sube?: GelAlSubesi | null;
  subeAdi?: string;
  onGelAlSecildi?: () => void;
  detayAc?: (urun: SubeUrunu) => void;
}

export const SubeUrunKarti: React.FC<SubeUrunKartiProps> = ({
  urun,
  sube,
  subeAdi,
  onGelAlSecildi,
  detayAc,
}) => {
  const { sepeteEkle, yukleniyor } = sepetHafizasiKullan();
  const { teslimatTipiDegistir, gelAlSubesiniIdIleSec, gelAlSubeleri } = teslimatHafizasiKullan();
  const [eklendi, setEklendi] = React.useState(false);
  const anlikDakika = useCanliDakika();

  const bagliSube =
    sube || gelAlSubeleri.find((s) => s.id === urun.sube_id || s.kimlik === urun.sube_id);
  const subeDurumu = calismaSaatiDurumuHesapla(bagliSube, anlikDakika);
  const subeKapaliMi = !subeDurumu.acikMi;
  const stokTukendi = urun.stok_adedi <= 0;
  const eklemeEngelli = stokTukendi || subeKapaliMi || yukleniyor;

  const adreseSepeteAt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (eklemeEngelli) return;
    teslimatTipiDegistir('teslimat');
    await sepeteEkle(urun.sube_id, urun.id, 1, urun.fiyat);
    setEklendi(true);
    setTimeout(() => setEklendi(false), 1500);
  };

  const gelAlSepeteAt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (eklemeEngelli) return;
    gelAlSubesiniIdIleSec(urun.sube_id);
    teslimatTipiDegistir('gel_al');
    await sepeteEkle(urun.sube_id, urun.id, 1, urun.fiyat);
    if (onGelAlSecildi) onGelAlSecildi();
    setEklendi(true);
    setTimeout(() => setEklendi(false), 1500);
  };

  return (
    <div
      onClick={() => (detayAc ? detayAc(urun) : null)}
      className={`group rounded-2xl overflow-hidden bg-[#1E0926] border transition-all duration-200 flex flex-col justify-between shadow-lg cursor-pointer ${
        subeKapaliMi || stokTukendi
          ? 'opacity-75 border-rose-900/40 hover:border-rose-700/60'
          : 'border-[#521E5C]/70 hover:border-amber-400/60 hover:shadow-amber-500/10'
      }`}
    >
      <div>
        {/* Ürün Görseli & Rozetler */}
        <div className="relative h-44 w-full overflow-hidden bg-purple-950">
          <img
            src={urun.gorsel_url || 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80'}
            alt={urun.ad}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              subeKapaliMi || stokTukendi ? 'grayscale-[30%]' : 'group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Çatı Marka Rozeti (Mutfak isimleri kesinlikle gizli) */}
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-[10px] font-black text-amber-300 border border-amber-400/40 shadow-md flex items-center gap-1">
              <span>{urun.marka}</span>
            </span>
          </div>

          {/* Şube Adı Rozeti (Ana vitrinde hangi şubede hazır olduğunu gösterir) */}
          {subeAdi && (
            <div className="absolute top-2.5 right-2.5 max-w-[48%]">
              <span className="px-2 py-1 rounded-lg bg-[#2A102E]/90 backdrop-blur-xs text-[10px] font-bold text-white border border-purple-500/40 shadow-md flex items-center gap-1 truncate">
                <Store className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{subeAdi}</span>
              </span>
            </div>
          )}

          {/* Anlık Canlı Stok / Kapalı Rozeti */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            {subeKapaliMi ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide flex items-center gap-1 shadow-md bg-rose-950/95 text-rose-200 border border-rose-500/60">
                <Ban className="w-3 h-3 text-rose-400 shrink-0" />
                <span>{subeDurumu.kapaliEtiketi}</span>
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${
                  stokTukendi
                    ? 'bg-rose-950 text-rose-300 border border-rose-600/60'
                    : urun.stok_adedi < 5
                    ? 'bg-amber-500 text-black font-black animate-pulse'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>{stokTukendi ? 'Tükendi' : `Son ${urun.stok_adedi} Adet Stokta`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Ürün Bilgisi */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
            {urun.ad}
          </h3>
          <p className="text-xs text-purple-200/70 line-clamp-2 leading-relaxed">
            {urun.aciklama}
          </p>
        </div>
      </div>

      {/* Fiyat ve Butonlar */}
      <div className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
          <span className="text-[11px] text-gray-400 font-medium">Birim Fiyat:</span>
          <span className="text-base font-extrabold text-amber-400 font-mono">
            {urun.fiyat} ₺
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* 1. Buton: Adrese Sepete At */}
          <button
            type="button"
            onClick={adreseSepeteAt}
            disabled={eklemeEngelli}
            className="py-2.5 px-2 rounded-xl bg-[#2E0F36] hover:bg-[#43144F] border border-purple-700/60 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed active:scale-95"
            title={subeKapaliMi ? subeDurumu.uyariMetni : 'Adrese Kurye ile Sipariş'}
          >
            {subeKapaliMi ? (
              <Ban className="w-3.5 h-3.5 text-rose-400" />
            ) : eklendi ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="truncate">
              {subeKapaliMi ? 'Kapalı' : eklendi ? 'Eklendi' : 'Sepete Ekle'}
            </span>
          </button>

          {/* 2. Buton: Şubeden Gel-Al */}
          <button
            type="button"
            onClick={gelAlSepeteAt}
            disabled={eklemeEngelli}
            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed shadow-md active:scale-95"
            title={subeKapaliMi ? subeDurumu.uyariMetni : 'Şubeden Gel-Al Siparişi'}
          >
            {subeKapaliMi ? (
              <Ban className="w-3.5 h-3.5 text-black" />
            ) : (
              <Store className="w-3.5 h-3.5 text-black" />
            )}
            <span className="truncate">{subeKapaliMi ? 'Kapalı' : 'Gel-Al Al'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
