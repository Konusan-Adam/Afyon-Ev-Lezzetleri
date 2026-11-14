import React, { useState } from 'react';
import { Heart, Store, Sparkles, ChefHat } from 'lucide-react';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';
import { useMutfaklar } from '@/src/MalzemeCekmeceleri/MutfakCekmecesi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { FavoriMutfakKarti } from './FavoriMutfakKarti';
import { FavoriSubeKarti } from './FavoriSubeKarti';

export const FavorilerimSekmesi: React.FC = () => {
  const { favoriMutfakIdleri, favoriSubeIdleri, mutfakFavoriDegistir, subeFavoriDegistir, toplamFavoriSayisi } = favoriHafizasiKullan();
  const { mutfaklar } = useMutfaklar();
  const { gelAlSubeleri } = teslimatHafizasiKullan();
  const { panelDegistir } = kullaniciHafizasiKullan();

  const [filtre, setFiltre] = useState<'tumu' | 'mutfaklar' | 'subeler'>('tumu');

  const favoriMutfaklar = mutfaklar.filter((m) => favoriMutfakIdleri.includes(m.id));
  const favoriSubeler = gelAlSubeleri.filter((s) => favoriSubeIdleri.includes(s.id || s.kimlik || ''));

  if (toplamFavoriSayisi === 0) {
    return (
      <div className="py-14 text-center bg-[#180A1F] rounded-2xl border border-purple-900/40 p-6 space-y-3">
        <div className="w-16 h-16 rounded-full bg-rose-950/50 border border-rose-800/40 flex items-center justify-center mx-auto text-rose-400">
          <Heart className="w-8 h-8 fill-rose-500/30" />
        </div>
        <h3 className="text-white font-bold text-sm sm:text-base">Henüz favori lezzetiniz bulunmuyor</h3>
        <p className="text-xs text-purple-300 max-w-md mx-auto">
          Mutfak veya Gel-Al şubesi sayfalarında yer alan kalp butonuna dokunarak sık sipariş verdiğiniz favorilerinizi buraya ekleyebilirsiniz.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => panelDegistir('vitrin')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#130713] text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            Lezzetleri Keşfet ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alt Filtre Butonları */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFiltre('tumu')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filtre === 'tumu'
              ? 'bg-purple-800 text-white shadow-md'
              : 'bg-[#180A1F] text-purple-300 hover:text-white border border-[#3E1646]'
          }`}
        >
          Tümü ({toplamFavoriSayisi})
        </button>
        <button
          type="button"
          onClick={() => setFiltre('mutfaklar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filtre === 'mutfaklar'
              ? 'bg-purple-800 text-white shadow-md'
              : 'bg-[#180A1F] text-purple-300 hover:text-white border border-[#3E1646]'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-amber-400" />
          <span>Mutfaklar ({favoriMutfaklar.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setFiltre('subeler')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filtre === 'subeler'
              ? 'bg-purple-800 text-white shadow-md'
              : 'bg-[#180A1F] text-purple-300 hover:text-white border border-[#3E1646]'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span>Şubeler ({favoriSubeler.length})</span>
        </button>
      </div>

      {/* Kart Listesi */}
      <div className="space-y-3">
        {(filtre === 'tumu' || filtre === 'mutfaklar') &&
          favoriMutfaklar.map((mutfak) => (
            <FavoriMutfakKarti
              key={mutfak.id}
              mutfak={mutfak}
              onFavoridenCikar={mutfakFavoriDegistir}
            />
          ))}

        {(filtre === 'tumu' || filtre === 'subeler') &&
          favoriSubeler.map((sube) => (
            <FavoriSubeKarti
              key={sube.id || sube.kimlik}
              sube={sube}
              onFavoridenCikar={subeFavoriDegistir}
            />
          ))}
      </div>
    </div>
  );
};
