import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

export const PwaKurulumKarti: React.FC = () => {
  const [tetikleyici, setTetikleyici] = useState<any>(null);
  const [goster, setGoster] = useState(false);
  const [kuruldu, setKuruldu] = useState(false);

  useEffect(() => {
    const islemYakala = (e: Event) => {
      e.preventDefault();
      setTetikleyici(e);
      // Daha önce reddetmediyse veya kapatmadıysa göster
      const kapatildiMi = localStorage.getItem('afyon_pwa_kapatildi');
      if (!kapatildiMi) {
        setGoster(true);
      }
    };

    window.addEventListener('beforeinstallprompt', islemYakala);

    // iOS veya doğrudan tarayıcı testi için (istemci desteği)
    const iosMu = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const standaloneMi = window.matchMedia('(display-mode: standalone)').matches || (window as any).navigator.standalone;

    if (!standaloneMi && !localStorage.getItem('afyon_pwa_kapatildi')) {
      // 3 saniye sonra kibarca göster
      const zamanlayici = setTimeout(() => {
        setGoster(true);
      }, 3000);
      return () => clearTimeout(zamanlayici);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', islemYakala);
    };
  }, []);

  const uygulamayiKur = async () => {
    if (tetikleyici) {
      tetikleyici.prompt();
      const sonuc = await tetikleyici.userChoice;
      if (sonuc.outcome === 'accepted') {
        setKuruldu(true);
        setTimeout(() => setGoster(false), 2000);
      }
      setTetikleyici(null);
    } else {
      // Tarayıcı otomatik prompt desteklemiyorsa bilgi ver
      alert('Uygulamayı yüklemek için tarayıcınızın menüsünden (⋮ veya paylaş butonu) "Ana Ekrana Ekle" veya "Uygulamayı Yükle" seçeneğini kullanabilirsiniz.');
    }
  };

  const kapat = () => {
    setGoster(false);
    localStorage.setItem('afyon_pwa_kapatildi', 'true');
  };

  if (!goster || kuruldu) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[9999] bg-[#1C0722] border-2 border-amber-500/80 rounded-3xl p-4 shadow-2xl animate-bounce-short text-white flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-purple-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
        <Smartphone className="w-6 h-6 stroke-[2.5]" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
          <span>Afyon Ev Lezzetleri Uygulaması</span>
        </h4>
        <p className="text-[11px] text-purple-200 mt-0.5 leading-tight">
          Masaüstüne veya telefona indirerek sesli bildirimleri ve sipariş zilini arka planda kesintisiz alın!
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={uygulamayiKur}
          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-purple-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[3]" />
          <span>Yükle</span>
        </button>

        <button
          type="button"
          onClick={kapat}
          className="p-1.5 text-purple-400 hover:text-white rounded-lg bg-purple-950/60 cursor-pointer"
          title="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
