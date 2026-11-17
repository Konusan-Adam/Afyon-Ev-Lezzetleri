import React from 'react';
import { X, ShieldCheck, Clock, Award, MapPin, Bike } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

interface MobilMutfakBilgiPenceresiOzellikleri {
  mutfak: Mutfak;
  onKapat: () => void;
}

export const MobilMutfakBilgiPenceresi: React.FC<MobilMutfakBilgiPenceresiOzellikleri> = ({
  mutfak,
  onKapat,
}) => {
  const { ayarlar } = useKuryeAyarlari();
  const calismaSaatleri = mutfak.calisma_saatleri?.trim() || '09:00 - 21:00';
  const hazirlanmaSuresi = mutfak.hazirlanma_suresi?.trim() || '25-35 dk';
  const mahalleBilgisi = mutfak.mahalle?.trim() || mutfak.adres?.trim() || 'Afyon Merkez';
  const minTutar = typeof mutfak.min_siparis_tutari === 'number' ? mutfak.min_siparis_tutari : 100;
  const teslimatUcreti = Number(ayarlar.taban_ucret) || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#1C0722] border border-purple-900/80 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <h3 className="font-extrabold text-base text-amber-300">{mutfak.ad}</h3>
          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-[#2A0E33] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-purple-200/80 leading-relaxed">
          {mutfak.aciklama || 'Afyonkarahisar yerel lezzetlerini ev mutfağında özenle ve taptaze hazırlayan onaylı ev mutfağı.'}
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>%100 Hijyen ve Gıda Güvenliği Denetimli</span>
          </div>
          <div className="flex items-center gap-2 text-purple-200 bg-[#240A2B] p-2.5 rounded-xl border border-purple-900/40">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Çalışma Saatleri: {calismaSaatleri} ({hazirlanmaSuresi})</span>
          </div>
          <div className="flex items-center gap-2 text-purple-200 bg-[#240A2B] p-2.5 rounded-xl border border-purple-900/40">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Bölge: {mahalleBilgisi}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-200 bg-[#240A2B] p-2.5 rounded-xl border border-purple-900/40">
            <Bike className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Min. Sepet: {minTutar} ₺ • Teslimat: {teslimatUcreti === 0 ? 'Ücretsiz' : `${teslimatUcreti} ₺`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-purple-200 bg-[#240A2B] p-2.5 rounded-xl border border-purple-900/40">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Afyon Ev Lezzetleri Süper Mutfak Rozeti</span>
          </div>
        </div>
      </div>
    </div>
  );
};
