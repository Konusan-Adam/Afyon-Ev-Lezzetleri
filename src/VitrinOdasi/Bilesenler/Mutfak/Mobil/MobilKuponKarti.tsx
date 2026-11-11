import React, { useState } from 'react';
import { Ticket, Check } from 'lucide-react';
import { useAdminKuponu } from '@/src/MalzemeCekmeceleri/useAdminKuponu';

export const MobilKuponKarti: React.FC = () => {
  const { kupon } = useAdminKuponu();
  const [kopyalandi, setKopyalandi] = useState(false);

  if (!kupon.aktif) {
    return null;
  }

  const kuponKopyala = async () => {
    try {
      await navigator.clipboard.writeText(kupon.kod);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      // Sessiz kal
    }
  };

  return (
    <div
      onClick={kuponKopyala}
      className="mx-4 mt-3 bg-[#1C0722] border border-purple-900/60 rounded-2xl p-3.5 flex items-center gap-3 relative overflow-hidden cursor-pointer hover:border-amber-400/40 transition-colors shadow-lg select-none"
    >
      {/* Sol ve Sağ Bilet Çentikleri */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#120415] rounded-full border-r border-purple-900/60" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#120415] rounded-full border-l border-purple-900/60" />

      {/* Bilet İkonu */}
      <div className="w-10 h-10 rounded-xl bg-[#2D0F35] border border-purple-800/50 flex items-center justify-center shrink-0 text-fuchsia-400">
        {kopyalandi ? <Check className="w-5 h-5 text-emerald-400" /> : <Ticket className="w-5 h-5" />}
      </div>

      {/* Kupon Metni */}
      <div className="min-w-0 flex-1 pl-1">
        <h5 className="text-white text-xs font-bold truncate">
          {kopyalandi ? 'Kupon Kodu Kopyalandı! 📋' : `${kupon.baslik} (${kupon.kod})`}
        </h5>
        <p className="text-purple-300/70 text-[11px] truncate mt-0.5">
          Min. sepet {kupon.minSepetTutari} ₺. Sepette anında indirim uygulanır.
        </p>
      </div>
    </div>
  );
};

