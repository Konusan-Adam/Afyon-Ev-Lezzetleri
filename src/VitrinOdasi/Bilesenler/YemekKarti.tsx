import React from 'react';
import { Plus, Star, Clock, AlertCircle } from 'lucide-react';
import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { useSepet } from '@/src/OrtakHavuz/SepetHavuzu';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface Props {
  yemek: YemekTipi;
}

export const YemekKarti: React.FC<Props> = ({ yemek }) => {
  const { sepeteEkle } = useSepet();
  const tukendiMi = yemek.stokta_var_mi === false || yemek.tukendi_mi === true;

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${tukendiMi ? 'opacity-75 grayscale-[20%]' : ''}`}>
      <div className="h-44 w-full relative overflow-hidden bg-stone-100">
        <img
          src={gorselUrlGuvenliYap(yemek.gorsel_url)}
          alt={yemek.baslik}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {tukendiMi && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Tükendi
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{yemek.puan.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-stone-900 text-base">{yemek.baslik}</h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{yemek.aciklama}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{yemek.hazirlanma_suresi || '25-35 dk'}</span>
            </div>
            <div className="text-base font-extrabold text-amber-800">{yemek.fiyat} ₺</div>
          </div>

          <button
            disabled={tukendiMi}
            onClick={() => !tukendiMi && sepeteEkle(yemek)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm ${
              tukendiMi
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{tukendiMi ? 'Tükendi' : 'Ekle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
