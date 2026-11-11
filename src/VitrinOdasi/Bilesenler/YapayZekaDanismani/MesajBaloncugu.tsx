import React from 'react';
import { DanismanMesaji } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/LezzetDanismaniTipleri';
import { MesajUrunKarti } from './MesajUrunKarti';
import { MesajSecenekDugmeleri } from './MesajSecenekDugmeleri';

interface MesajBaloncuguProps {
  mesaj: DanismanMesaji;
  onSecim?: (secim: string) => void;
}

export const MesajBaloncugu: React.FC<MesajBaloncuguProps> = ({ mesaj, onSecim }) => {
  const kullaniciMi = mesaj.rol === 'kullanici';

  return (
    <div className={`flex w-full ${kullaniciMi ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`flex gap-2 max-w-[88%] ${kullaniciMi ? 'flex-row-reverse' : 'flex-row'}`}>
        {!kullaniciMi && (
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-amber-400/60 shadow-xs mt-1 bg-stone-900">
            <img src="/marka_logosu.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs font-normal ${
              kullaniciMi
                ? 'bg-gradient-to-r from-[#2c1348] to-[#3f1969] text-amber-50 border border-purple-400/30 rounded-tr-xs shadow-md'
                : 'bg-white text-slate-800 border border-amber-200/80 rounded-tl-xs shadow-xs'
            }`}
          >
            {mesaj.icerik}

            {/* Önerilen Canlı Veritabanı Yemekleri Kartları */}
            {!kullaniciMi && mesaj.onerilenYemekler && mesaj.onerilenYemekler.length > 0 && (
              <div className="mt-2 space-y-1">
                {mesaj.onerilenYemekler.map((yemek, sira) => (
                  <MesajUrunKarti key={`${mesaj.id}-yemek-${yemek.id}-${sira}`} yemek={yemek} />
                ))}
              </div>
            )}

            {/* Hızlı Seçenek / İçecek & Eşlikçi Düğmeleri */}
            {!kullaniciMi && onSecim && (
              <MesajSecenekDugmeleri secenekler={mesaj.hizliSecenekler} onSecim={onSecim} />
            )}
          </div>

          <span className={`block text-[10px] text-gray-500 mt-1 px-1 font-medium ${kullaniciMi ? 'text-right' : 'text-left'}`}>
            {mesaj.zaman}
          </span>
        </div>
      </div>
    </div>
  );
};
