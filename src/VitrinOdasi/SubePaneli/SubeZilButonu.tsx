import React, { useState } from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { subeZilAktifMi, subeZilAyariniDegistir, subeSiparisZiliCal } from '@/src/MalzemeCekmeceleri/Sube/subeZilServisi';

export const SubeZilButonu: React.FC = () => {
  const [aktif, setAktif] = useState<boolean>(subeZilAktifMi());

  const ayariDegistir = () => {
    const yeni = !aktif;
    setAktif(yeni);
    subeZilAyariniDegistir(yeni);
    if (yeni) subeSiparisZiliCal();
  };

  return (
    <div className="flex items-center gap-1 bg-[#2A102E] border border-[#521E5C] rounded-xl p-0.5 sm:p-1 shrink-0">
      <button
        type="button"
        onClick={ayariDegistir}
        className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
          aktif
            ? 'bg-amber-500/20 text-[#DDAF53] border border-amber-500/40'
            : 'text-stone-400 hover:text-white'
        }`}
        title={aktif ? '🚨 Nükleer Siren Açık (Kapatmak için tıkla)' : 'Siren Kapalı'}
      >
        {aktif ? <Bell className="w-3.5 h-3.5 text-[#DDAF53] animate-bounce" /> : <BellOff className="w-3.5 h-3.5" />}
        <span className="hidden md:inline">{aktif ? '🚨 Siren Açık' : 'Siren Kapalı'}</span>
      </button>

      {aktif && (
        <button
          type="button"
          onClick={() => subeSiparisZiliCal()}
          className="p-1.5 rounded-lg hover:bg-[#3E1646] text-[#DDAF53] transition-colors cursor-pointer"
          title="🚨 Nükleer Sireni Test Et"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
