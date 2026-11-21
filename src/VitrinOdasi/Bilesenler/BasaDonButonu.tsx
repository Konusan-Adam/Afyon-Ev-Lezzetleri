import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';

export const BasaDonButonu: React.FC = () => {
  const [gorunur, setGorunur] = useState(false);
  const { tema } = temaHafizasiKullan();
  const acikMi = tema === 'acik';

  useEffect(() => {
    const kaydirmaKontrol = () => {
      setGorunur(window.scrollY > 350);
    };
    kaydirmaKontrol();
    window.addEventListener('scroll', kaydirmaKontrol, { passive: true });
    return () => window.removeEventListener('scroll', kaydirmaKontrol);
  }, []);

  if (!gorunur) return null;

  const basaDon = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={basaDon}
      title="Başa Dön"
      aria-label="Sayfanın başına dön"
      className={`hidden lg:flex fixed bottom-28 right-7 z-30 w-12 h-12 rounded-2xl items-center justify-center border shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-95 ${
        acikMi
          ? 'bg-[#FFF9F0]/95 hover:bg-amber-100 border-amber-400 text-amber-800 shadow-amber-900/15'
          : 'bg-[#230C28]/95 hover:bg-[#35123E] border-amber-500/60 text-amber-400 shadow-black/50'
      }`}
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
};
