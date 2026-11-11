import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Kategori, AltKategori } from '@/src/MalzemeCekmeceleri/kategorileriGetir';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface MobilKategoriModalProps {
  acik: boolean;
  onKapat: () => void;
  kategori: Kategori | null;
  altKategoriler: AltKategori[];
  seciliAltKategoriAd?: string;
  onAltKategoriSec: (altKategoriAd: string) => void;
  onTumKategoriyiSec: () => void;
}

export const MobilKategoriModal: React.FC<MobilKategoriModalProps> = ({
  acik,
  onKapat,
  kategori,
  altKategoriler,
  seciliAltKategoriAd,
  onAltKategoriSec,
  onTumKategoriyiSec
}) => {
  // Modal açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    if (acik) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [acik]);

  if (!acik || !kategori) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
      {/* Karartma Perdesi */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onKapat}
      />

      {/* Alttan Açılan Bottom-Sheet Modal Kartı */}
      <div className="relative w-full sm:max-w-lg bg-[#16071B] border-t sm:border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.9)] z-10 overflow-hidden max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        
        {/* Tutma Çubuğu (Mobilde aşağı kaydırma hissi için) */}
        <div className="sm:hidden w-12 h-1.5 bg-purple-900/80 rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Başlık Bölümü */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between bg-[#1F0A26]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-amber-400/40 flex items-center justify-center shrink-0">
              {kategori.resim_url ? (
                <img 
                  src={gorselUrlGuvenliYap(kategori.resim_url)} 
                  alt={kategori.ad} 
                  className="w-10 h-10 object-contain drop-shadow-[0_4px_8px_rgba(251,191,36,0.3)]" 
                />
              ) : (
                <span className="text-2xl">{kategori.ikon}</span>
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Kategori Seçimi</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {kategori.ad}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onKapat}
            className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçeriği (Alt Kategori Listesi) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5 mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Bir Çeşit veya Alt Kategori Seçin:</span>
          </div>

          {/* 1. Seçenek: Bu Kategorinin Tüm Lezzetleri */}
          <button
            type="button"
            onClick={() => {
              onTumKategoriyiSec();
              onKapat();
            }}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all cursor-pointer ${
              !seciliAltKategoriAd
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 border-amber-300 font-extrabold shadow-md'
                : 'bg-[#220B2A] hover:bg-[#33113E] text-white border-purple-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🍽️</span>
              <div className="text-left">
                <div className="text-xs font-bold">Tüm {kategori.ad}</div>
                <div className={`text-[10px] ${!seciliAltKategoriAd ? 'text-purple-950 font-semibold' : 'text-purple-300'}`}>
                  Bu gruptaki tüm ev yemeklerini ve çeşitleri göster
                </div>
              </div>
            </div>
            {!seciliAltKategoriAd ? (
              <Check className="w-5 h-5 text-purple-950 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
            )}
          </button>

          {/* Alt Kategori Kartları */}
          {altKategoriler.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-extrabold text-amber-400/90 uppercase tracking-wider px-1">
                Özel Alt Çeşitler ({altKategoriler.length})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {altKategoriler.map((alt) => {
                  const seciliMi = seciliAltKategoriAd === alt.ad;

                  return (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => {
                        onAltKategoriSec(alt.ad);
                        onKapat();
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all cursor-pointer text-left ${
                        seciliMi
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 border-amber-300 font-extrabold shadow-md'
                          : 'bg-[#1D0923] hover:bg-[#2F0F38] text-gray-200 hover:text-white border-purple-900/50 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {alt.resim_url ? (
                          <div className="w-6 h-6 rounded-full bg-purple-950 border border-amber-400/50 flex items-center justify-center overflow-hidden shrink-0">
                            <img src={gorselUrlGuvenliYap(alt.resim_url)} alt={alt.ad} className="w-5 h-5 object-contain" />
                          </div>
                        ) : alt.ikon ? (
                          <span className="text-sm shrink-0">{alt.ikon}</span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold truncate">{alt.ad}</span>
                      </div>

                      {seciliMi ? (
                        <Check className="w-4 h-4 text-purple-950 shrink-0 ml-2" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Alt Kapatma Çubuğu */}
        <div className="p-3 bg-[#130517] border-t border-purple-900/40 text-center">
          <button
            type="button"
            onClick={onKapat}
            className="w-full py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white text-xs font-bold transition-all"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
