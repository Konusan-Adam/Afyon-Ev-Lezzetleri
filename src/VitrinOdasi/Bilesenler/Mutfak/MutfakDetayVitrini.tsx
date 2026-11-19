import React, { useMemo } from 'react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
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
  const { mutfaklarListesi } = sepetHafizasiKullan();
  const canliMutfak = useMemo(() => {
    return (
      mutfaklarListesi.find((m) => m.id === mutfak.id || (mutfak.kimlik && m.kimlik === mutfak.kimlik)) ||
      mutfak
    );
  }, [mutfaklarListesi, mutfak]);

  const { yemekler, yukleniyor } = mutfakYemekleriGetir(canliMutfak.id);

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
          mutfak={canliMutfak}
          yemekler={yemekler}
          yukleniyor={yukleniyor}
          kategoriler={kategoriler}
          geriDonTiklandi={geriDonTiklandi}
        />
      </div>

      {/* Mobil ve Tablet Tasarımı (lg altı ekranlar) */}
      <div className="block lg:hidden">
        <MobilMutfakVitrini
          mutfak={canliMutfak}
          yemekler={yemekler}
          yukleniyor={yukleniyor}
          kategoriler={kategoriler}
          geriDonTiklandi={geriDonTiklandi}
        />
      </div>
    </div>
  );
};
