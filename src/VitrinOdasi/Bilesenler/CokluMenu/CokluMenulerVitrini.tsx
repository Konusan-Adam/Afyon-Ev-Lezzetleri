import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { CokluMenuTipi } from '@/src/veritabani/VeriTipleri';
import { useCokluMenuler } from '@/src/MalzemeCekmeceleri/CokluMenu/useCokluMenuler';
import { CokluMenuKarti } from './CokluMenuKarti';
import { CokluMenuDetayModali } from './CokluMenuDetayModali';

interface CokluMenulerVitriniProps {
  mutfakId?: string;
  baslik?: string;
  kompaktMi?: boolean;
}

export const CokluMenulerVitrini: React.FC<CokluMenulerVitriniProps> = ({
  mutfakId,
  baslik = 'Çoklu Ziyafet & Ev Yemeği Paketleri',
  kompaktMi = false,
}) => {
  const { cokluMenuler, yukleniyor } = useCokluMenuler(mutfakId);
  const [seciliMenu, setSeciliMenu] = useState<CokluMenuTipi | null>(null);

  if (yukleniyor || cokluMenuler.length === 0) {
    return null;
  }

  return (
    <section className={kompaktMi ? 'mb-6' : 'w-full py-3 px-4'}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-amber-400" />
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-wide">
            {baslik}
          </h3>
        </div>
        <span className="text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
          {cokluMenuler.length} Paket
        </span>
      </div>

      <div
        className={
          kompaktMi
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        }
      >
        {cokluMenuler.map((menu) => (
          <CokluMenuKarti key={menu.id} menu={menu} onSec={setSeciliMenu} />
        ))}
      </div>

      {seciliMenu && (
        <CokluMenuDetayModali
          menu={seciliMenu}
          onKapat={() => setSeciliMenu(null)}
        />
      )}
    </section>
  );
};
