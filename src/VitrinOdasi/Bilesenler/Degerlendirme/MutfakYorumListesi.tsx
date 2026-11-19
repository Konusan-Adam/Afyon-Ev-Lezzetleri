import React, { useState, useEffect } from 'react';
import { Star, Store } from 'lucide-react';
import {
  mutfakDegerlendirmeleriniGetir,
  firestoreDegerlendirmeDonustur,
} from '@/src/MalzemeCekmeceleri/Degerlendirme/degerlendirmeDeposu';
import { SiparisDegerlendirmesi } from '@/src/MalzemeCekmeceleri/Degerlendirme/DegerlendirmeTipleri';
import { canliFirebaseAktifMi, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { tarihSaatFormatla } from '@/src/MalzemeCekmeceleri/Ortak/tarihFormatlayici';

interface MutfakYorumListesiOzellikleri {
  mutfakId: string;
}

export const MutfakYorumListesi: React.FC<MutfakYorumListesiOzellikleri> = ({ mutfakId }) => {
  const [yorumlar, setYorumlar] = useState<SiparisDegerlendirmesi[]>(() =>
    mutfakDegerlendirmeleriniGetir(mutfakId).filter((y) => y.onayli_mi !== false)
  );

  useEffect(() => {
    const yerelListe = mutfakDegerlendirmeleriniGetir(mutfakId).filter((y) => y.onayli_mi !== false);
    setYorumlar(yerelListe);

    if (!canliFirebaseAktifMi()) return;

    const abonelikCik = koleksiyonuCanliDinle<any>('degerlendirmeler', (veriler) => {
      const canliListe = (veriler || [])
        .map(firestoreDegerlendirmeDonustur)
        .filter((d) => (!d.mutfak_id || d.mutfak_id === mutfakId || mutfakId === 'tumu') && d.onayli_mi !== false)
        .sort((a, b) => (b.tarih || '').localeCompare(a.tarih || ''));

      setYorumlar(canliListe);
    });

    return () => {
      abonelikCik();
    };
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
      {yorumlar.map((yorum, index) => {
        const gosterilecekPuan = Number(yorum.puan ?? yorum.lezzet_puani) || 5;
        const gosterilecekYorum = yorum.yorum || yorum.yorum_metni;

        return (
          <div key={`${yorum.kimlik}-${index}`} className="bg-[#1A0A1D] rounded-xl p-3.5 border border-purple-950/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#321138] border border-[#CFA353]/50 flex items-center justify-center text-[10px] font-bold text-[#F5D28A] shrink-0">
                  {yorum.musteri_adi.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white truncate">{yorum.musteri_adi}</span>
              </div>
              <span className="text-[10px] text-purple-400 shrink-0">{tarihSaatFormatla(yorum.tarih)}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1 text-amber-400">
                <span className="text-gray-400 text-[10px]">Puan:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(gosterilecekPuan) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {yorum.kurye_puani > 0 && (
                <div className="flex items-center gap-1 text-purple-300">
                  <span className="text-gray-400 text-[10px]">Kurye/Hız:</span>
                  <span className="font-bold text-[#DDAF53]">{yorum.kurye_puani}/5</span>
                </div>
              )}
            </div>

            {gosterilecekYorum && (
              <p className="text-xs text-purple-200/90 leading-relaxed bg-[#120614] p-2.5 rounded-lg border border-purple-950/40">
                {gosterilecekYorum}
              </p>
            )}

            {yorum.mutfak_cevabi && (
              <div className="ml-3 pl-3 border-l-2 border-amber-500/60 bg-[#250D2B] rounded-r-xl p-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                    <Store className="w-3 h-3" />
                    Mutfak Cevabı
                  </span>
                  {yorum.cevap_tarihi && (
                    <span className="text-[10px] text-purple-300/70">
                      {tarihSaatFormatla(yorum.cevap_tarihi)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">{yorum.mutfak_cevabi}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
