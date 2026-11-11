import React from 'react';
import { ShieldCheck, Package } from 'lucide-react';
import { isimMaskele } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/MetinMaskeleyici';

interface Props {
  siparisKodu: string;
  musteriAdi: string;
  bolge: string;
  urunler: string;
}

export const MuhurluPaketEtiketi: React.FC<Props> = ({
  siparisKodu,
  musteriAdi,
  bolge,
  urunler
}) => {
  return (
    <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-4 text-xs space-y-2 max-w-sm shadow-xs font-mono">
      <div className="flex items-center justify-between border-b pb-2 border-stone-200">
        <div className="flex items-center gap-1.5 font-bold text-amber-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>MÜHÜRLÜ TESLİMAT FİŞİ</span>
        </div>
        <span className="font-extrabold text-stone-900">#{siparisKodu}</span>
      </div>

      <div className="space-y-1 text-stone-600">
        <div className="flex justify-between">
          <span>Alıcı:</span>
          <strong className="text-stone-900">{isimMaskele(musteriAdi)}</strong>
        </div>
        <div className="flex justify-between">
          <span>Teslimat Bölgesi:</span>
          <strong className="text-stone-900">{bolge}</strong>
        </div>
      </div>

      <div className="bg-stone-50 rounded-lg p-2 text-stone-700 text-[11px] border border-stone-100">
        <div className="font-bold flex items-center gap-1 mb-1">
          <Package className="w-3 h-3 text-stone-500" />
          <span>Paket İçeriği:</span>
        </div>
        <p>{urunler}</p>
      </div>

      <div className="text-[10px] text-center text-stone-400 pt-1">
        Gizlilik Korumalı • Açık adres ve telefon fiş üzerinde yer almaz
      </div>
    </div>
  );
};
