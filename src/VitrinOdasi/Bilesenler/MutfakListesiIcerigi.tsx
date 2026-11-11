import React from 'react';
import { Store, AlertCircle } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { MobilDikeyMutfakKarti } from '@/src/VitrinOdasi/MobilAnasayfa/MobilDikeyMutfakKarti';

interface MutfakListesiIcerigiOzellikleri {
  mutfaklar: Mutfak[];
  yukleniyor: boolean;
  hata: string | null;
  aramaMetni: string;
  onMutfakSec: (mutfak: Mutfak) => void;
}

export const MutfakListesiIcerigi: React.FC<MutfakListesiIcerigiOzellikleri> = ({
  mutfaklar,
  yukleniyor,
  hata,
  aramaMetni,
  onMutfakSec,
}) => {
  if (yukleniyor && mutfaklar.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-56 bg-purple-950/40 rounded-2xl animate-pulse border border-purple-900/30" />
        ))}
      </div>
    );
  }

  if (hata) {
    return (
      <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/50 text-center space-y-2 my-2">
        <AlertCircle className="w-5 h-5 text-rose-400 mx-auto" />
        <p className="text-xs text-rose-200">{hata}</p>
      </div>
    );
  }

  if (mutfaklar.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl bg-[#240E2A]/60 border border-purple-900/40 my-3 space-y-2.5">
        <Store className="w-9 h-9 text-purple-400/60 mx-auto" />
        <p className="text-xs sm:text-sm font-bold text-purple-200">
          {aramaMetni ? `"${aramaMetni}" aramasına uygun mutfak bulunamadı.` : 'Henüz kayıtlı mutfak veya şube bulunmamaktadır.'}
        </p>
        <p className="text-[11px] text-purple-400">
          {aramaMetni ? 'Farklı bir kelime veya mahalle adı deneyebilirsiniz.' : 'Firebase Firestore mutfaklar koleksiyonuna eklenen şubeler burada listelenir.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4">
      {mutfaklar.map((mutfak) => (
        <MobilDikeyMutfakKarti
          key={mutfak.id}
          mutfak={mutfak}
          onSec={onMutfakSec}
        />
      ))}
    </div>
  );
};
