import React from 'react';
import { Star, ShieldCheck, Award, Store, MapPin, Clock } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { MutfakYorumListesi } from '@/src/VitrinOdasi/Bilesenler';

interface SubeHakkindaVeYorumlarProps {
  sube: GelAlSubesi;
}

export const SubeHakkindaVeYorumlar: React.FC<SubeHakkindaVeYorumlarProps> = ({ sube }) => {
  const subeId = sube.id || sube.kimlik || 'sube-1';

  return (
    <div className="w-full space-y-5 pt-8 border-t border-purple-900/40">
      {/* Şube Hikayesi & Hijyen Standartları */}
      <section className="bg-[#240E2A] rounded-2xl p-5 border border-purple-900/50 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Store className="w-5 h-5" />
          <h3 className="font-extrabold text-sm text-white">{sube.ad} • Şube Güvencesi</h3>
        </div>
        <p className="text-xs text-purple-200/90 leading-relaxed">
          {sube.aciklama || 'Afyon Ev Lezzetleri resmi dağıtım ve gel-al şubemizdir. Ev mutfaklarımızdan günlük taze teslim alınan bükmeler, ağzıaçıklar ve yöresel yemekler özel sıcak muhafaza tezgahlarımızda steril koşullarda müşterilerimize sunulur.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-900/40 text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>%100 Hijyen ve Sıcak Muhafaza</span>
          </div>
          <div className="flex items-center gap-2 text-purple-200">
            <Clock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{sube.calisma_saatleri || '09:00 - 22:00'} Çalışma</span>
          </div>
          <div className="flex items-center gap-2 text-purple-200">
            <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="truncate">{sube.adres}</span>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları & Değerlendirmeleri */}
      <section className="bg-[#240E2A] rounded-2xl p-5 border border-purple-900/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <h3 className="font-extrabold text-sm text-white">Şube Değerlendirmeleri & Yorumlar</h3>
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black bg-purple-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{sube.puan ? sube.puan.toFixed(1) : '5.0'} / 5.0</span>
          </div>
        </div>

        {/* Gerçek Yorum Listesi */}
        <MutfakYorumListesi mutfakId={subeId} />
      </section>
    </div>
  );
};
