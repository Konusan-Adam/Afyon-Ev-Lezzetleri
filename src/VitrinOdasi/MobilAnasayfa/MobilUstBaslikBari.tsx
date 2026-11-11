import React from 'react';

interface MobilUstBaslikBariProps {
  anasayfayaGitTiklandi: () => void;
}

export const MobilUstBaslikBari: React.FC<MobilUstBaslikBariProps> = ({ anasayfayaGitTiklandi }) => {
  return (
    <header className="lg:hidden w-full bg-[#130713] border-b border-[#2D1233] px-4 py-2.5 flex items-center justify-between select-none">
      <button
        type="button"
        onClick={anasayfayaGitTiklandi}
        className="flex items-center gap-2.5 text-left border-0 bg-transparent p-0 cursor-pointer focus:outline-none group active:scale-95 transition-transform"
      >
        <div className="w-9 h-9 rounded-full ring-2 ring-[#CFA353] p-0.5 bg-white overflow-hidden flex items-center justify-center shadow-md">
          <img
            src="/marka_logosu.jpg"
            alt="Afyon Ev Lezzetleri Logo"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-sm font-bold tracking-wider text-[#DDAF53]">
            AFYON
          </span>
          <span className="text-[9px] font-semibold tracking-[0.2em] text-[#DDAF53]/90 uppercase">
            EV LEZZETLERİ
          </span>
        </div>
      </button>
    </header>
  );
};
