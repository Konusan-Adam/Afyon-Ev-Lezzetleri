import React, { useState, useEffect } from 'react';
import { BellRing, ShieldCheck, BatteryCharging } from 'lucide-react';
import { useEkranUyanikTutucu } from '@/src/MalzemeCekmeceleri/EkranUyanikTutucu';
import { PilAyarRehberiModali } from './PilAyarRehberiModali';

interface Props {
  panelTuru: 'mutfak' | 'kurye';
  onSesTesti?: () => void;
}

export const TezgahBildirimCubugu: React.FC<Props> = ({ panelTuru, onSesTesti }) => {
  const { aktif: ekranAktif, baslat: ekraniAcikTut, destekleniyor } = useEkranUyanikTutucu(false);
  const [bildirimDurumu, setBildirimDurumu] = useState<NotificationPermission>('default');
  const [pilModalAcik, setPilModalAcik] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBildirimDurumu(Notification.permission);
    }
  }, []);

  const izinAlVeSesiAc = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const sonuc = await Notification.requestPermission();
        setBildirimDurumu(sonuc);
      } catch {}
    }
    await ekraniAcikTut();
    if (onSesTesti) onSesTesti();
  };

  return (
    <>
      <PilAyarRehberiModali acikMi={pilModalAcik} onKapat={() => setPilModalAcik(false)} />
      
      {bildirimDurumu === 'granted' ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Arka Plan Koruması Açık</span>
          {destekleniyor && (
            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
              <span className={`w-1.5 h-1.5 rounded-full ${ekranAktif ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              {ekranAktif ? 'Tezgah Modu' : 'Ekran'}
            </span>
          )}
          <button
            type="button"
            onClick={() => setPilModalAcik(true)}
            className="flex items-center gap-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded cursor-pointer transition-all ml-1"
            title="Telefon pil ayarları rehberi"
          >
            <BatteryCharging className="w-3 h-3" />
            <span>Pil Ayarı</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={izinAlVeSesiAc}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer animate-pulse"
          title="Tarayıcı kapalı değilken arka planda sesli bildirim almak için tıklayın"
        >
          <BellRing className="w-4 h-4 shrink-0" />
          <span>Zil ve Arka Plan Bildirimini Aç</span>
        </button>
      )}
    </>
  );
};

