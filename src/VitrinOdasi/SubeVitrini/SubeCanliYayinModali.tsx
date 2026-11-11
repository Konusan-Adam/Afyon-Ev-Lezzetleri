import React from 'react';
import { X, Radio, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';

interface SubeCanliYayinModaliProps {
  sube: GelAlSubesi;
  onKapat: () => void;
}

export const SubeCanliYayinModali: React.FC<SubeCanliYayinModaliProps> = ({
  sube,
  onKapat,
}) => {
  // Canlı yayın linki varsa YouTube embed formatına dönüştür, yoksa varsayılan hijyen canlı yayın simülasyonu göster
  const yayinLinki = sube.youtube_canli_yayin_linki || 'https://www.youtube.com/embed/live_stream?channel=afyonevlezzetleri';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#180A1F] border border-rose-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Başlık Barı */}
        <div className="p-4 bg-[#200A28] border-b border-purple-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>CANLI YAYIN</span>
            </span>
            <h3 className="text-white font-extrabold text-sm truncate">
              {sube.ad} • Şube Tezgah & Mutfak Kamerası
            </h3>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black text-purple-300 hover:text-white flex items-center justify-center border border-purple-800/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Yayın Alanı */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {sube.youtube_canli_yayin_linki ? (
            <iframe
              src={yayinLinki}
              title={`${sube.ad} Canlı Yayın`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={sube.gorsel || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'}
                alt={sube.ad}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-400 animate-ping">
                  <Radio className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-black text-base">Şube Tezgahı Canlı İzleniyor</h4>
                  <p className="text-xs text-purple-200/80 max-w-sm">
                    Bu şubemizde günlük taze bükmeler, ağzıaçıklar ve yöresel yemekler %100 hijyenik koşullarda hazırlanıp sıcak tezgaha servis edilmektedir.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Şeffaf Mutfak & Sağlık Denetimi Aktif</span>
                </div>
              </div>
            </div>
          )}

          {/* İzleyici Rozeti */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 text-[11px] text-white font-mono">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>24 Kişi İzliyor</span>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="p-4 bg-[#14061A] border-t border-purple-900/50 flex items-center justify-between text-xs text-purple-200">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Afyon Ev Lezzetleri Şeffaf Mutfak Güvencesi</span>
          </span>
          <button
            type="button"
            onClick={onKapat}
            className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 text-white font-bold transition-all cursor-pointer"
          >
            Yayından Çık
          </button>
        </div>
      </div>
    </div>
  );
};
