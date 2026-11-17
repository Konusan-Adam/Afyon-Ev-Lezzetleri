import React, { useState } from 'react';
import { CokluMenuKalemiTipi } from '@/src/veritabani/VeriTipleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface CokluMenuKolajGorseliProps {
  kalemler: CokluMenuKalemiTipi[];
  kapakGorselleri?: string[];
  baslik: string;
}

const KolajKaresi: React.FC<{
  url?: string;
  alt: string;
  fazlaSayisi?: number;
}> = ({ url, alt, fazlaSayisi = 0 }) => {
  const guvenliUrl = gorselUrlGuvenliYap(url?.trim()) || '/marka_logosu.jpg';
  const [hatali, setHatali] = useState(!url?.trim());

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#290F30]">
      <img
        src={hatali ? '/marka_logosu.jpg' : guvenliUrl}
        alt={alt}
        className={`w-full h-full ${hatali ? 'object-contain p-1.5' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
        loading="lazy"
        onError={() => {
          if (!hatali) setHatali(true);
        }}
      />
      {fazlaSayisi > 0 && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center">
          <span className="text-amber-300 font-black text-base sm:text-lg tracking-tight drop-shadow">
            +{fazlaSayisi}
          </span>
        </div>
      )}
    </div>
  );
};

export const CokluMenuKolajGorseli: React.FC<CokluMenuKolajGorseliProps> = ({
  kalemler,
  kapakGorselleri = [],
  baslik,
}) => {
  const siraliKalemler = [...(kalemler || [])].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
  const kalemGorselleri = siraliKalemler.map((k) => k.gorsel_url).filter((u) => Boolean(u && u.trim()));
  const kaynakGorseller =
    kalemGorselleri.length > 0
      ? kalemGorselleri
      : (kapakGorselleri || []).filter((u) => Boolean(u && u.trim()));

  const gorselListesi =
    kaynakGorseller.length > 0 ? kaynakGorseller.slice(0, 6) : ['/marka_logosu.jpg'];

  const adet = gorselListesi.length;
  const fazlaSayisi = siraliKalemler.length > 6 ? siraliKalemler.length - 6 : 0;

  const izgarasinifi =
    adet === 1
      ? 'grid-cols-1 grid-rows-1'
      : adet === 2
      ? 'grid-cols-2 grid-rows-1'
      : adet <= 4
      ? 'grid-cols-2 grid-rows-2'
      : 'grid-cols-3 grid-rows-2';

  return (
    <div className={`w-full h-44 sm:h-48 grid ${izgarasinifi} gap-0.5 bg-[#16061A] overflow-hidden`}>
      {gorselListesi.map((url, idx) => (
        <KolajKaresi
          key={`${idx}-${url}`}
          url={url}
          alt={siraliKalemler[idx]?.ad || baslik}
          fazlaSayisi={idx === 5 ? fazlaSayisi : 0}
        />
      ))}
    </div>
  );
};
