import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface OturumUyarisiProps {
  kalanSaniye: number;
  onDevamEt: () => void;
}

export const OturumZamanlayiciUyarisi: React.FC<OturumUyarisiProps> = ({ kalanSaniye, onDevamEt }) => {
  const dakika = Math.floor(kalanSaniye / 60);
  const saniye = kalanSaniye % 60;
  const zamanMetni = `${dakika}:${saniye < 10 ? '0' : ''}${saniye}`;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#1F0A24] border border-[#6D237A] text-white p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-300">Güvenlik: Oturum Zaman Aşımı</h3>
          <p className="text-xs text-gray-300">
            Hesabınızın güvenliği için hareketsizlik nedeniyle oturumunuz kapatılmak üzeredir.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#2E0F36] px-4 py-2 rounded-xl border border-purple-800/50">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-extrabold text-white tracking-widest">{zamanMetni}</span>
        </div>
        <button
          type="button"
          onClick={onDevamEt}
          className="w-full py-3 bg-[#6D237A] hover:bg-[#852C94] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Oturumu Açık Tut
        </button>
      </div>
    </div>
  );
};
