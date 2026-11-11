import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { mutfakDegerlendirmeleriniGetir } from '@/src/MalzemeCekmeceleri/Degerlendirme/degerlendirmeDeposu';
import { SiparisDegerlendirmesi } from '@/src/MalzemeCekmeceleri/Degerlendirme/DegerlendirmeTipleri';

interface MutfakYorumListesiOzellikleri {
  mutfakId: string;
}

export const MutfakYorumListesi: React.FC<MutfakYorumListesiOzellikleri> = ({ mutfakId }) => {
  const [yorumlar, setYorumlar] = useState<SiparisDegerlendirmesi[]>([]);

  useEffect(() => {
    const yorumlar = mutfakDegerlendirmeleriniGetir(mutfakId);
    setYorumlar(yorumlar.filter(y => y.onayli_mi));
  }, [mutfakId]);

  if (yorumlar.length === 0) {
    return (
      <div className="bg-[#1A0A1D] rounded-xl p-4 text-center text-xs text-purple-300/70 border border-purple-950">
        Bu mutfak için henüz değerlendirme yapılmamış. İlk siparişi verip lezzeti puanlayın!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {yorumlar.map((yorum, index) => (
        <div key={`${yorum.kimlik}-${index}`} className="bg-[#1A0A1D] rounded-xl p-3.5 border border-purple-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#321138] border border-[#CFA353]/50 flex items-center justify-center text-[10px] font-bold text-[#F5D28A]">
                {yorum.musteri_adi.charAt(0)}
              </div>
              <span className="text-xs font-bold text-white">{yorum.musteri_adi}</span>
            </div>
            <span className="text-[10px] text-purple-400">{yorum.tarih}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1 text-amber-400">
              <span className="text-gray-400 text-[10px]">Lezzet:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(yorum.lezzet_puani) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 text-purple-300">
              <span className="text-gray-400 text-[10px]">Kurye/Hız:</span>
              <span className="font-bold text-[#DDAF53]">{yorum.kurye_puani}/5</span>
            </div>
          </div>

          <p className="text-xs text-purple-200/90 leading-relaxed bg-[#120614] p-2.5 rounded-lg border border-purple-950/40">
            {yorum.yorum_metni}
          </p>
        </div>
      ))}
    </div>
  );
};
