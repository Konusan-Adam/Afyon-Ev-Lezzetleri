import React from 'react';
import { Star, Clock, ShieldCheck, MapPin, Truck, Coffee } from 'lucide-react';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';
import { mutfakMolaDurumuGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

interface Props {
  mutfak: MutfakTipi;
}

export const MutfakKarti: React.FC<Props> = ({ mutfak }) => {
  const { ayarlar } = useKuryeAyarlari();
  const molaBilgisi = mutfakMolaDurumuGetir(mutfak);
  const teslimatUcreti = Number(ayarlar.taban_ucret) || 0;

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full ${molaBilgisi.siparisEngelliMi ? 'opacity-80' : ''}`}>
      <div className="h-40 w-full relative overflow-hidden bg-[#290F30] flex items-center justify-center">
        <img
          src="/marka_logosu.jpg"
          alt={mutfak.ad}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
        {molaBilgisi.siparisEngelliMi && (
          <div className="absolute inset-0 bg-stone-950/70 flex flex-col items-center justify-center gap-1 px-3 text-center">
            <span className={`${molaBilgisi.moladaMi ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-200'} font-bold text-xs px-3 py-1 rounded-lg inline-flex items-center gap-1.5`}>
              {molaBilgisi.moladaMi && <Coffee className="w-3.5 h-3.5" />}
              {molaBilgisi.moladaMi ? 'Mutfak Dinlenmede / Molada' : 'Şuan Kapalı'}
            </span>
            {molaBilgisi.moladaMi && molaBilgisi.molaBitisZamani && (
              <span className="text-[11px] font-semibold text-amber-200">
                Tahmini Açılış: {molaBilgisi.molaBitisZamani}
              </span>
            )}
          </div>
        )}
        {mutfak.hijyen_onayli_mi && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hijyen Onaylı</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-stone-900 text-base">{mutfak.ad}</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{mutfak.puan?.toFixed(1) || '5.0'}</span>
            </div>
          </div>
          {mutfak.mahalle && (
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{mutfak.mahalle}</span>
            </div>
          )}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{mutfak.aciklama}</p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{mutfak.hazirlanma_suresi || mutfak.calisma_saatleri || '30-45 dk'}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-stone-800">
              <Truck className="w-3.5 h-3.5 text-stone-400" />
              <span>{teslimatUcreti === 0 ? 'Ücretsiz Teslimat' : `${teslimatUcreti} ₺`}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Min. Sepet: <strong className="text-stone-800">{mutfak.min_siparis_tutari || 100} ₺</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
