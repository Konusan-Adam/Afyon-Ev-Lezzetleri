import React from 'react';
import { Plus, Star, Clock, AlertCircle, Flame, AlertTriangle } from 'lucide-react';
import { YemekTipi } from '@/src/veritabani/VeriTipleri';
import { useSepet } from '@/src/OrtakHavuz/SepetHavuzu';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { mutfakMolaDurumuGetir, yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

interface Props {
  yemek: YemekTipi;
}

export const YemekKarti: React.FC<Props> = ({ yemek }) => {
  const { sepeteEkle } = useSepet();
  const { mutfaklarListesi } = sepetHafizasiKullan();
  const bagliMutfak = mutfaklarListesi.find((m) => m.id === yemek.mutfak_id || m.kimlik === yemek.mutfak_id);
  const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak);
  const stokBilgisi = yemekStokDurumuHesapla(yemek, bagliMutfak);
  const engelli = stokBilgisi.tukendiMi || molaBilgisi.siparisEngelliMi;

  const [gorselHatali, setGorselHatali] = React.useState(!yemek.gorsel_url?.trim());
  const gorselSrc = gorselUrlGuvenliYap(yemek.gorsel_url?.trim()) || '/marka_logosu.jpg';

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow ${stokBilgisi.tukendiMi ? 'opacity-75 grayscale-[20%]' : ''}`}>
      <div className="h-44 w-full relative overflow-hidden bg-stone-100">
        <img
          src={gorselHatali ? '/marka_logosu.jpg' : gorselSrc}
          alt={yemek.baslik}
          className={`w-full h-full ${gorselHatali ? 'object-contain p-2 bg-[#290F30]' : 'object-cover'}`}
          loading="lazy"
          onError={() => {
            if (!gorselHatali) setGorselHatali(true);
          }}
        />
        {stokBilgisi.tukendiMi && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Tükendi
            </span>
          </div>
        )}
        {stokBilgisi.sonKalanRozetMetni && (
          <div className="absolute top-3 left-3 bg-amber-950/90 text-amber-300 border border-amber-500/60 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{stokBilgisi.sonKalanRozetMetni}</span>
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
          {stokBilgisi.minTutarUyariMetni && (
            <p className="mt-2 text-[10px] leading-snug text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 flex items-start gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{stokBilgisi.minTutarUyariMetni}</span>
            </p>
          )}
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
            disabled={engelli}
            onClick={() => !engelli && sepeteEkle(yemek)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm ${
              engelli
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{stokBilgisi.tukendiMi ? 'Tükendi' : molaBilgisi.moladaMi ? 'Molada' : molaBilgisi.kapaliMi ? 'Kapalı' : 'Ekle'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
