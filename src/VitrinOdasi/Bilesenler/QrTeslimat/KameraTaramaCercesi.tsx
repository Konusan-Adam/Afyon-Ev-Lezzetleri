/**
 * 🦁 AFYON EV LEZZETLERİ - KAMERA TARAMA ÇERÇEVESİ BİLEŞENİ
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 * Canlı kamera vizörü, lazer tarama çizgisi ve fener kontrolü
 */

import React from 'react';
import { Camera, Flashlight, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  kameraDurumu: 'hazirlaniyor' | 'aktif' | 'hata';
  hataMesaji: string | null;
  fenerDestegi: boolean;
  fenerAcik: boolean;
  onFeneriDegistir: () => void;
  onYenidenDene: () => void;
}

export const KameraTaramaCercesi: React.FC<Props> = ({
  videoRef,
  kameraDurumu,
  hataMesaji,
  fenerDestegi,
  fenerAcik,
  onFeneriDegistir,
  onYenidenDene
}) => {
  return (
    <div className="relative w-full h-64 bg-black rounded-2xl overflow-hidden border border-emerald-500/50 shadow-inner flex items-center justify-center">
      {/* Canlı Video Akışı */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`w-full h-full object-cover ${kameraDurumu === 'aktif' ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Hazırlanıyor Ekranı */}
      {kameraDurumu === 'hazirlaniyor' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#120414] text-white">
          <Camera className="w-8 h-8 text-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-300 font-medium">Kamera Başlatılıyor...</span>
        </div>
      )}

      {/* Hata Ekranı */}
      {kameraDurumu === 'hata' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-[#18051a] text-white space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <p className="text-xs text-rose-200">{hataMesaji || 'Kamera açılamadı.'}</p>
          <button
            type="button"
            onClick={onYenidenDene}
            className="px-3 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      )}

      {/* Vizör ve Lazer Tarama Çizgisi */}
      {kameraDurumu === 'aktif' && (
        <>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-48 h-48 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {/* Köşe Vurguları */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-300" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-300" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-300" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-300" />

              {/* Yukarı Aşağı Kayan Lazer */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-bounce" />
            </div>
          </div>

          {/* Fener Butonu */}
          {fenerDestegi && (
            <button
              type="button"
              onClick={onFeneriDegistir}
              className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                fenerAcik ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/50' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
              title="Feneri Aç/Kapat"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}

          {/* Bilgi Şeridi */}
          <div className="absolute bottom-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-emerald-300 border border-emerald-500/30">
            QR kodu çerçevenin içine tutun
          </div>
        </>
      )}
    </div>
  );
};
