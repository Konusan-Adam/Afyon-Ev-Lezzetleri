import React from 'react';
import { Bike, Phone, MessageSquare, ShieldCheck, Gauge, Clock, Navigation } from 'lucide-react';
import { KuryeSimulasyonBilgisi } from '@/src/MalzemeCekmeceleri/CanliTakip/CanliTakipTipleri';

interface KuryeKartiProps {
  bilgi: KuryeSimulasyonBilgisi;
}

export const KuryeKarti: React.FC<KuryeKartiProps> = ({ bilgi }) => {
  return (
    <div className="bg-[#1C0922] border border-[#521E5C] rounded-2xl p-4 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[#1C0821] shadow-lg shadow-amber-500/30">
              <Bike className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1C0922] rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-white font-black text-sm">{bilgi.ad_soyad}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-amber-300/80 font-semibold">
              {bilgi.arac_tipi} • Plaka: {bilgi.plaka}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Müşteri ve Kurye Doğrudan Özel Numarayı Göremez — Platform İçi Güvenli Hat */}
          <a
            href="tel:08503030303"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95 text-xs font-bold"
            title="Güvenli Santral Üzerinden Kuryeye Bağlan"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Kuryeyi Ara</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-900/40 text-center">
        <div className="bg-[#120414] p-2 rounded-xl border border-purple-950">
          <span className="text-[10px] text-gray-400 block flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Kalan Süre
          </span>
          <span className="text-xs font-black text-[#F5D28A]">
            {bilgi.tamamlandi_mi ? 'Kapınızda' : `${bilgi.kalan_dakika} dk`}
          </span>
        </div>
        <div className="bg-[#120414] p-2 rounded-xl border border-purple-950">
          <span className="text-[10px] text-gray-400 block flex items-center justify-center gap-1">
            <Navigation className="w-3 h-3 text-blue-400" /> Mesafe
          </span>
          <span className="text-xs font-black text-white">
            {bilgi.tamamlandi_mi ? '0 m' : `${bilgi.kalan_metre} m`}
          </span>
        </div>
        <div className="bg-[#120414] p-2 rounded-xl border border-purple-950">
          <span className="text-[10px] text-gray-400 block flex items-center justify-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-400" /> Anlık Hız
          </span>
          <span className="text-xs font-black text-emerald-400">
            {bilgi.anlik_hiz_kmh} km/s
          </span>
        </div>
      </div>
    </div>
  );
};
