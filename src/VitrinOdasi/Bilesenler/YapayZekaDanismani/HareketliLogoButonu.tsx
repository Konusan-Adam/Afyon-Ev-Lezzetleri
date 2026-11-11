import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface HareketliLogoButonuProps {
  baloncukMetni: string;
  tiklandi: () => void;
  pencereAcik: boolean;
}

export const HareketliLogoButonu: React.FC<HareketliLogoButonuProps> = ({
  baloncukMetni,
  tiklandi,
  pencereAcik,
}) => {
  const [baloncukGoster, setBaloncukGoster] = useState<boolean>(false);

  useEffect(() => {
    // 2 saniye sonra tatlı bir karşılama balonu açılır
    const zamanlayici = setTimeout(() => {
      setBaloncukGoster(true);
    }, 2000);
    return () => clearTimeout(zamanlayici);
  }, []);

  if (pencereAcik) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-3 select-none">
      {/* 💬 Sıcak ve Kurumsal Karşılama Baloncuğu */}
      {baloncukGoster && (
        <div className="relative mb-2 max-w-[220px] bg-gradient-to-br from-[#1e0e33] to-[#2c124a] text-amber-50 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl border border-amber-400/40 animate-fade-in">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBaloncukGoster(false);
            }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black/40 hover:bg-black/60 text-amber-300 rounded-full flex items-center justify-center text-[10px]"
            title="Kapat"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          <div className="cursor-pointer" onClick={tiklandi}>
            <p className="leading-snug text-white font-medium">{baloncukMetni}</p>
            <span className="text-[10px] text-amber-300 font-semibold mt-1.5 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Afyon Lezzet Danışmanı • Sesli & Yazılı
            </span>
          </div>
          {/* Baloncuk Ucu */}
          <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-[#2c124a] border-b border-r border-amber-400/40 rotate-45" />
        </div>
      )}

      {/* 🌟 Hareketli & Işıltılı Canlı Marka Logosu */}
      <div className="relative group cursor-pointer" onClick={tiklandi}>
        {/* Arkadaki Asil Işık Halkası */}
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-amber-400 opacity-75 blur-xs group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

        {/* Canlı Logo Butonu */}
        <button
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-stone-900 p-0.5 shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center justify-center overflow-hidden border-2 border-amber-400/90"
          aria-label="Afyon Lezzet Danışmanı"
        >
          <img
            src="/marka_logosu.jpg"
            alt="Afyon Ev Lezzetleri Logosu"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Mini Parlama / Yıldız Rozeti */}
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-tr from-[#1e0e33] to-[#3f1969] text-amber-300 rounded-full flex items-center justify-center shadow-md border border-amber-400/80">
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>
        </button>
      </div>
    </div>
  );
};
