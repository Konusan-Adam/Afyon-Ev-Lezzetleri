import React, { useState } from 'react';
import { Bell, Volume2 } from 'lucide-react';
import { mutfakZiliCal } from '@/src/MalzemeCekmeceleri/Mutfak/MutfakZilServisi';

export const MutfakZilButonu: React.FC = () => {
  const [calindi, setCalindi] = useState(false);

  const cal = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch {}
    }
    mutfakZiliCal('Mutfak Zili Testi 🔔', 'Sipariş bildirim sistemi masaüstünde ve arka planda başarıyla aktif edildi.');
    setCalindi(true);
    setTimeout(() => setCalindi(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={cal}
      title="Sipariş Zili Testi"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-xs"
    >
      {calindi ? <Volume2 className="w-3.5 h-3.5 animate-bounce" /> : <Bell className="w-3.5 h-3.5" />}
      <span>{calindi ? 'Zil Çalıyor! 🔔' : 'Zil Testi'}</span>
    </button>
  );
};
