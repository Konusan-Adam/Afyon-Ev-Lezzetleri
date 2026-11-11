import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { DanismanMesaji } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/LezzetDanismaniTipleri';
import { LezzetDanismaniBaslik } from './LezzetDanismaniBaslik';
import { MesajBaloncugu } from './MesajBaloncugu';
import { HizliOneriDugmeleri } from './HizliOneriDugmeleri';
import { useSesliAsistan } from '@/src/MalzemeCekmeceleri/YapayZekaDanismani/SesliAsistanKancasi';

interface LezzetDanismaniPenceresiProps {
  acik: boolean;
  cevapBekleniyor: boolean;
  mesajlar: DanismanMesaji[];
  sesliAsistan: ReturnType<typeof useSesliAsistan>;
  kapat: () => void;
  sifirla: () => void;
  mesajGonder: (metin: string) => void;
}

export const LezzetDanismaniPenceresi: React.FC<LezzetDanismaniPenceresiProps> = ({
  acik,
  cevapBekleniyor,
  mesajlar,
  sesliAsistan,
  kapat,
  sifirla,
  mesajGonder,
}) => {
  const [girdi, setGirdi] = useState<string>('');
  const mesajlarSonuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (acik) {
      mesajlarSonuRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mesajlar, cevapBekleniyor, acik]);

  if (!acik) return null;

  const formuGonder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!girdi.trim() || cevapBekleniyor) return;
    mesajGonder(girdi);
    setGirdi('');
  };

  const mikrofonTiklandi = () => {
    if (sesliAsistan.dinliyorMu) {
      sesliAsistan.mikrofonuDurdur();
    } else {
      sesliAsistan.mikrofonuBaslat((soylenen) => {
        setGirdi(soylenen);
        mesajGonder(soylenen);
        setGirdi('');
      });
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[85vh] bg-stone-50 rounded-2xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* 👑 Başlık Barı */}
      <LezzetDanismaniBaslik
        cevapBekleniyor={cevapBekleniyor}
        sesliOkumaAktif={sesliAsistan.sesliOkumaAktif}
        sesliOkumaDegistir={sesliAsistan.sesliOkumaDurumuDegistir}
        kapatTiklandi={kapat}
        sifirlaTiklandi={sifirla}
      />

      {/* 📜 Mesajlaşma Alanı */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-1 bg-gradient-to-b from-stone-50 via-white to-stone-100">
        {mesajlar.map((m) => (
          <MesajBaloncugu key={m.id} mesaj={m} onSecim={mesajGonder} />
        ))}

        {cevapBekleniyor && (
          <div className="flex items-center gap-2.5 text-xs text-[#2c124a] bg-amber-50/90 p-3 rounded-2xl w-fit animate-pulse border border-amber-300/80 shadow-xs">
            <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
            <span className="font-medium">Özel lezzet tavsiyeniz hazırlanıyor...</span>
          </div>
        )}
        <div ref={mesajlarSonuRef} />
      </div>

      {/* 🎙️ Canlı Sesle Konuşma Dinleme Göstergesi */}
      {sesliAsistan.dinliyorMu && (
        <div className="px-3 py-2 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-semibold flex items-center justify-between shadow-inner animate-pulse">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            Sizi dinliyorum, arzu ettiğiniz lezzeti söyleyiniz...
          </span>
          <button
            type="button"
            onClick={sesliAsistan.mikrofonuDurdur}
            className="text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md"
          >
            Tamamla
          </button>
        </div>
      )}

      {/* ⚡ Hızlı Sorular */}
      <div className="px-2 pt-1 border-t border-amber-200/50 bg-white/95">
        <HizliOneriDugmeleri oneriSecildi={mesajGonder} devreDisi={cevapBekleniyor} />
      </div>

      {/* ✍️ Giriş Formu ve Sesli Mikrofon Düğmesi */}
      <form onSubmit={formuGonder} className="p-3 bg-white border-t border-amber-200/80 flex items-center gap-2">
        {/* Bas-Konuş Mikrofon Düğmesi */}
        <button
          type="button"
          onClick={mikrofonTiklandi}
          title={sesliAsistan.dinliyorMu ? 'Dinlemeyi Durdur' : 'Sesle Söyle (Mikrofon)'}
          className={`p-2.5 rounded-xl border transition-all shrink-0 ${
            sesliAsistan.dinliyorMu
              ? 'bg-red-600 text-white border-red-700 shadow-md animate-pulse'
              : 'bg-stone-100 hover:bg-amber-100/70 text-[#2c124a] border-amber-300/80 shadow-2xs'
          }`}
        >
          {sesliAsistan.dinliyorMu ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={girdi}
          onChange={(e) => setGirdi(e.target.value)}
          placeholder="Yazın veya mikrofona dokunun..."
          disabled={cevapBekleniyor}
          className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl text-slate-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2c124a] focus:bg-white disabled:opacity-50 transition-all font-normal"
        />

        <button
          type="submit"
          disabled={!girdi.trim() || cevapBekleniyor}
          className="p-2.5 bg-gradient-to-r from-[#2c124a] to-[#3f1969] hover:from-[#1e0e33] hover:to-[#2c124a] disabled:from-gray-300 disabled:to-gray-400 text-amber-200 disabled:text-white rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
