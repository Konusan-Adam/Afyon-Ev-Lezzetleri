import React, { useState } from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

export const MasaustuYemekKarti: React.FC<{ yemek: Yemek }> = ({ yemek }) => {
  const { sepeteEkle, sepetElemanlari, adetGuncelle } = sepetHafizasiKullan();
  const [eklendi, setEklendi] = useState(false);

  const sepetElemani = sepetElemanlari.find((e) => e.yemek_id === yemek.id);

  const ekle = async () => {
    if (sepetElemani) {
      await adetGuncelle(sepetElemani.id, sepetElemani.adet + 1);
    } else {
      await sepeteEkle(yemek.mutfak_id || 'm1', yemek.id, 1, yemek.fiyat);
    }
    setEklendi(true);
    setTimeout(() => setEklendi(false), 900);
  };

  return (
    <article className="bg-[#240E2A] rounded-2xl p-4 border border-purple-900/40 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-xl flex gap-4 group justify-between">
      {/* Sol: Yemek Bilgisi ve Fiyat */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-white text-sm font-bold group-hover:text-amber-300 transition-colors">
              {yemek.baslik}
            </h3>
            {yemek.populer && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                Yıldız Lezzet
              </span>
            )}
          </div>
          <p className="text-xs text-purple-200/70 line-clamp-2 leading-relaxed">
            {yemek.aciklama}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-purple-900/30">
          <div>
            <span className="text-[10px] text-purple-300/70 block -mb-0.5">{yemek.birim || 'Porsiyon'}</span>
            <span className="text-amber-400 font-extrabold text-base">{yemek.fiyat} ₺</span>
          </div>
          <button
            type="button"
            onClick={ekle}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              eklendi
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-[#1A0A1D] active:scale-95'
            }`}
          >
            {eklendi ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
            <span>{eklendi ? 'Eklendi' : sepetElemani ? `+ Ekle (${sepetElemani.adet})` : 'Sepete Ekle'}</span>
          </button>
        </div>
      </div>

      {/* Sağ: Görsel */}
      <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-purple-950">
        <img src={gorselUrlGuvenliYap(yemek.gorsel_url)} alt={yemek.baslik} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-amber-300 text-[10px] font-bold">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span>{yemek.puan?.toFixed(1) || '4.9'}</span>
        </div>
      </div>
    </article>
  );
};
