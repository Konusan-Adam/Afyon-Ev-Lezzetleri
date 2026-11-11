import React from 'react';
import { akilliKuryeUcretiHesapla } from '@/src/MalzemeCekmeceleri/AkilliKurye/rotaKonsolidasyon';
import { mahalleyeGoreMesafeVeUcretBul } from '@/src/MalzemeCekmeceleri/AkilliKurye/mesafeHesaplayici';

interface KuryeUcretBilgiKartiProps {
  mutfakSayisi: number;
  sepetToplamTutari: number;
  teslimatMahallesi?: string;
}

export const KuryeUcretBilgiKarti: React.FC<KuryeUcretBilgiKartiProps> = ({
  mutfakSayisi,
  sepetToplamTutari,
  teslimatMahallesi,
}) => {
  const bolgeBilgi = mahalleyeGoreMesafeVeUcretBul(teslimatMahallesi);
  const sonuc = akilliKuryeUcretiHesapla(mutfakSayisi, bolgeBilgi.bazUcret, sepetToplamTutari);

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs space-y-1.5 my-2">
      <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-200">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Akıllı Kurye & Rota Sistemi
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
          {sonuc.ucretsizMi ? 'ÜCRETSİZ TESLİMAT' : `${sonuc.nihaiTeslimatUcreti} ₺`}
        </span>
      </div>

      <div className="text-amber-800/80 dark:text-amber-300/80 flex justify-between">
        <span>Bölge: {bolgeBilgi.bolgeAdi} (~{bolgeBilgi.mesafeKm} km)</span>
        {sonuc.konsolidasyonIndirimi > 0 && (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            -{sonuc.konsolidasyonIndirimi} ₺ İndirim
          </span>
        )}
      </div>

      <p className="text-[11px] text-amber-900/70 dark:text-amber-400/70 italic border-t border-amber-200/50 dark:border-amber-900/30 pt-1">
        {sonuc.aciklama}
      </p>
    </div>
  );
};
