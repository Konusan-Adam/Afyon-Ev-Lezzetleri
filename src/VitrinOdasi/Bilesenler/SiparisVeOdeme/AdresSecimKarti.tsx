import React from 'react';
import { MapPin, Store, ChevronRight } from 'lucide-react';
import { MusteriAdresi, GelAlSubesi } from '@/src/veritabani/VeriTipleri';

interface AdresSecimKartiOzellikleri {
  seciliAdres: MusteriAdresi | null;
  gelAlMi?: boolean;
  seciliGelAlSubesi?: GelAlSubesi | null;
  onAdresDegistir: () => void;
}

export const AdresSecimKarti: React.FC<AdresSecimKartiOzellikleri> = ({
  seciliAdres,
  gelAlMi = false,
  seciliGelAlSubesi,
  onAdresDegistir,
}) => {
  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3 shadow-lg">
      {/* Üst Başlık ve Değiştir Butonu */}
      <div className="flex items-center justify-between border-b border-[#3E1646] pb-2.5">
        <div className="flex items-center gap-2 text-[#F5D28A] font-bold text-sm">
          {gelAlMi ? <Store className="w-4 h-4 text-[#CFA353]" /> : <MapPin className="w-4 h-4 text-[#CFA353]" />}
          <span>{gelAlMi ? 'Gel-Al Teslimat Şubesi' : 'Teslimat Adresi'}</span>
        </div>
        <button
          type="button"
          onClick={onAdresDegistir}
          className="text-xs font-bold text-[#DDAF53] hover:text-[#f3cd78] hover:underline flex items-center gap-1 cursor-pointer bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-900/60 transition-colors"
        >
          <span>{gelAlMi ? 'Şubeyi Değiştir' : 'Adresi Değiştir'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Adres Bilgisi */}
      <div className="text-xs bg-[#1A081D] p-3 rounded-xl border border-[#3E1646]/60 space-y-1">
        {gelAlMi ? (
          <>
            <p className="font-bold text-white text-sm">{seciliGelAlSubesi?.ad || 'Zafer Meydanı Gel-Al Şubesi'}</p>
            <p className="text-gray-300">
              {seciliGelAlSubesi?.adres || 'Cumhuriyet Mah. Anıt Cad. No: 12 (Valilik Karşısı)'}
            </p>
          </>
        ) : (
          <>
            <p className="font-bold text-[#F5D28A] text-sm flex items-center gap-1.5">
              <span>{seciliAdres?.adres_basligi || 'Teslimat Adresi Seçilmedi'}</span>
            </p>
            <p className={`${seciliAdres ? 'text-gray-300' : 'text-amber-300/80 font-medium'} leading-relaxed`}>
              {seciliAdres
                ? `${seciliAdres.mahalle} ${seciliAdres.cadde_sokak} No:${seciliAdres.bina_no} ${seciliAdres.daire_no ? `D:${seciliAdres.daire_no}` : ''} ${seciliAdres.ilce}/${seciliAdres.il}`
                : 'Lütfen siparişinizin teslim edileceği adresi haritadan veya listeden seçiniz.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
