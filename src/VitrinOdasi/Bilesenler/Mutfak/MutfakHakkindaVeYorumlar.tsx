import React from 'react';
import { Star, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { MutfakYorumListesi } from '@/src/VitrinOdasi/Bilesenler';

interface MutfakHakkindaVeYorumlarOzellikleri {
  mutfak: Mutfak;
}

export const MutfakHakkindaVeYorumlar: React.FC<MutfakHakkindaVeYorumlarOzellikleri> = ({ mutfak }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Aşçının Hikayesi */}
      <section className="bg-[#240E2A] rounded-2xl p-4 border border-purple-900/40 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-amber-400">
          <HeartHandshake className="w-5 h-5" />
          <h3 className="font-bold text-sm text-white">Aşçının Hikayesi & Afyon Geleneği</h3>
        </div>
        <p className="text-xs text-purple-200/90 leading-relaxed">
          {mutfak.aciklama || 'Geleneksel ev lezzetlerini taze ve hijyenik koşullarda hazırlıyoruz.'}
          {' '}Tüm yemeklerimiz günlük olarak, hakiki Afyon tereyağı, manda kaymağı ve yerli tohum haşhaş ezmesi kullanılarak anne eliyle pişirilmektedir.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-purple-900/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-purple-200 font-medium">%100 Hijyen ve Sağlık Denetimli</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] text-purple-200 font-medium">Usta Aşçı Belgesi</span>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="bg-[#240E2A] rounded-2xl p-4 border border-purple-900/40 shadow-lg space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm text-white">Müşteri Yorumları & Değerlendirmeler</h3>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{mutfak.puan?.toFixed(1) || '4.9'} Puan</span>
          </div>
        </div>

        <MutfakYorumListesi mutfakId={mutfak.id} />
      </section>
    </div>
  );
};
