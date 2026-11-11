import React, { useMemo } from 'react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { mutfakYemekleriGetir } from '@/src/MalzemeCekmeceleri/Mutfak/mutfakYemekleriGetir';
import { MasaustuMutfakVitrini } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Masaustu/MasaustuMutfakVitrini';
import { MobilMutfakVitrini } from '@/src/VitrinOdasi/Bilesenler/Mutfak/MobilMutfakVitrini';

interface MutfakDetayVitriniOzellikleri {
  mutfak: Mutfak;
  geriDonTiklandi: () => void;
}

export const MutfakDetayVitrini: React.FC<MutfakDetayVitriniOzellikleri> = ({
  mutfak,
  geriDonTiklandi
}) => {
  const { yemekler, yukleniyor } = mutfakYemekleriGetir(mutfak.id);

  const kategoriler = useMemo(() => {
    const kume = new Set<string>();
    kume.add('Tümü');
    yemekler.forEach((y) => {
      if (y.kategori) kume.add(y.kategori);
    });
    return Array.from(kume);
  }, [yemekler]);

  return (
    <div className="w-full">
      {/* Sadece Masaüstü Tasarımı (lg ve üzeri ekranlar) */}
      <div className="hidden lg:block">
        <MasaustuMutfakVitrini
          mutfak={mutfak}
          yemekler={yemekler}
          yukleniyor={yukleniyor}
          kategoriler={kategoriler}
          geriDonTiklandi={geriDonTiklandi}
        />
      </div>

      {/* Mobil ve Tablet Tasarımı (lg altı ekranlar) */}
      <div className="block lg:hidden">
        <MobilMutfakVitrini
          mutfak={mutfak}
          yemekler={yemekler}
          yukleniyor={yukleniyor}
          kategoriler={kategoriler}
          geriDonTiklandi={geriDonTiklandi}
        />
      </div>
    </div>
  );
};
