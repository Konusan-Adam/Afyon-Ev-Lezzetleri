import React from 'react';
import { useLezzetDanismaniAyarlari } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/LezzetDanismaniAyarKancasi';
import { useLezzetDanismani } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/LezzetDanismaniKancasi';
import { HareketliLogoButonu } from './HareketliLogoButonu';
import { LezzetDanismaniPenceresi } from './LezzetDanismaniPenceresi';

export const LezzetDanismaniVitrini: React.FC = () => {
  const { ayarlar, yukleniyor } = useLezzetDanismaniAyarlari();
  const {
    pencereAcik,
    cevapBekleniyor,
    mesajlar,
    sesliAsistan,
    pencereDurumuDegistir,
    pencereyiKapat,
    mesajGonder,
    sohbetiSifirla,
  } = useLezzetDanismani(ayarlar);

  // Eğer patron tarafından kapatıldıysa veya henüz yükleniyorsa ekrana hiçbir şey basılmaz
  if (yukleniyor || !ayarlar.aktifMi) {
    return null;
  }

  return (
    <>
      <HareketliLogoButonu
        baloncukMetni={ayarlar.baloncukMetni}
        tiklandi={pencereDurumuDegistir}
        pencereAcik={pencereAcik}
      />
      <LezzetDanismaniPenceresi
        acik={pencereAcik}
        cevapBekleniyor={cevapBekleniyor}
        mesajlar={mesajlar}
        sesliAsistan={sesliAsistan}
        kapat={pencereyiKapat}
        sifirla={sohbetiSifirla}
        mesajGonder={mesajGonder}
      />
    </>
  );
};
