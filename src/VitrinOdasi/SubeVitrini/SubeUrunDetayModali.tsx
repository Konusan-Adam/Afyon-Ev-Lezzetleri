import React from 'react';
import { X, ShoppingBag, Store, Flame, Check, Sparkles } from 'lucide-react';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';

interface SubeUrunDetayModaliProps {
  urun: SubeUrunu | null;
  onKapat: () => void;
  onGelAlSecildi?: () => void;
}

export const SubeUrunDetayModali: React.FC<SubeUrunDetayModaliProps> = ({
  urun,
  onKapat,
  onGelAlSecildi,
}) => {
  const { sepeteEkle, yukleniyor } = sepetHafizasiKullan();
  const { teslimatTipiDegistir } = teslimatHafizasiKullan();
  const [adet, setAdet] = React.useState<number>(1);
  const [eklendi, setEklendi] = React.useState<boolean>(false);

  if (!urun) return null;

  const stokTukendi = urun.stok_adedi <= 0;

  const adreseSepeteAt = async () => {
    await sepeteEkle(urun.sube_id, urun.id, adet, urun.fiyat);
    setEklendi(true);
    setTimeout(() => {
      setEklendi(false);
      onKapat();
    }, 1200);
  };

  const gelAlSepeteAt = async () => {
    teslimatTipiDegistir('gel_al');
    await sepeteEkle(urun.sube_id, urun.id, adet, urun.fiyat);
    if (onGelAlSecildi) onGelAlSecildi();
    setEklendi(true);
    setTimeout(() => {
      setEklendi(false);
      onKapat();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#180A1F] border border-purple-800/80 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Üst Görsel ve Kapatma Butonu */}
        <div className="relative h-64 w-full bg-purple-950 shrink-0">
          <img
            src={urun.gorsel_url || 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80'}
            alt={urun.ad}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#180A1F] via-transparent to-black/40" />

          {/* Çatı Marka Rozeti */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-xs font-black text-amber-300 border border-amber-400/50 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{urun.marka}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onKapat}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik Gövdesi */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">{urun.ad}</h2>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{urun.kategori}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {(urun.fiyat * adet).toFixed(2)} ₺
              </span>
              <div className="text-[11px] text-gray-400">({urun.fiyat} ₺ / adet)</div>
            </div>
          </div>

          <p className="text-xs text-purple-200/80 leading-relaxed bg-[#230D2C] p-3.5 rounded-2xl border border-purple-900/50">
            {urun.aciklama || 'Afyonkarahisar’ın geleneksel ev mutfağından günlük taze hazırlanan özel lezzet.'}
          </p>

          {/* Stok Durumu */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#250D2D] border border-purple-900/60">
            <span className="text-xs text-purple-300 font-semibold">Tezgah Anlık Stok:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm ${
                stokTukendi
                  ? 'bg-rose-950 text-rose-300 border border-rose-600/60'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{stokTukendi ? 'Tükendi' : `${urun.stok_adedi} Adet Hazır`}</span>
            </span>
          </div>

          {/* Adet Seçici */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-gray-300">Porsiyon / Adet:</span>
            <div className="flex items-center gap-3 bg-[#230D2C] border border-purple-900/60 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setAdet(Math.max(1, adet - 1))}
                className="w-8 h-8 rounded-lg bg-purple-900/40 text-white font-bold hover:bg-purple-800 transition-colors cursor-pointer flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-extrabold text-amber-400 text-sm">{adet}</span>
              <button
                type="button"
                onClick={() => setAdet(Math.min(urun.stok_adedi || 10, adet + 1))}
                className="w-8 h-8 rounded-lg bg-purple-900/40 text-white font-bold hover:bg-purple-800 transition-colors cursor-pointer flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 bg-[#14061A] border-t border-purple-900/60 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={adreseSepeteAt}
            disabled={stokTukendi || yukleniyor}
            className="py-3 px-4 rounded-xl bg-[#2E0F36] hover:bg-[#43144F] border border-purple-700/60 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 shadow-md active:scale-95"
          >
            {eklendi ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-amber-400" />}
            <span>{eklendi ? 'Eklendi!' : 'Adrese Sepete Ekle'}</span>
          </button>

          <button
            type="button"
            onClick={gelAlSepeteAt}
            disabled={stokTukendi || yukleniyor}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 shadow-lg active:scale-95"
          >
            <Store className="w-4 h-4 text-black" />
            <span>Şubeden Gel-Al Al</span>
          </button>
        </div>

      </div>
    </div>
  );
};
