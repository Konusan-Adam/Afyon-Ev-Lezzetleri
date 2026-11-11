import React, { useState, useMemo } from 'react';
import { Store, X, MapPin, Clock, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { GelAlSubesi } from '@/src/veritabani/SubeTipleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';

interface SubelerModaliProps {
  acikMi: boolean;
  onKapat: () => void;
  onSubeSec: (sube: GelAlSubesi) => void;
}

export const SubelerModali: React.FC<SubelerModaliProps> = ({
  acikMi,
  onKapat,
  onSubeSec,
}) => {
  const { gelAlSubeleri, seciliGelAlSubesi } = teslimatHafizasiKullan();
  const [aramaMetni, setAramaMetni] = useState<string>('');

  const filtrelenmisSubeler = useMemo(() => {
    if (!aramaMetni.trim()) return gelAlSubeleri;
    const aranan = aramaMetni.toLocaleLowerCase('tr').trim();
    return gelAlSubeleri.filter((s) => {
      const adEslesir = (s.ad || '').toLocaleLowerCase('tr').includes(aranan);
      const mahalleEslesir = (s.mahalle || '').toLocaleLowerCase('tr').includes(aranan);
      const adresEslesir = (s.adres || '').toLocaleLowerCase('tr').includes(aranan);
      return adEslesir || mahalleEslesir || adresEslesir;
    });
  }, [gelAlSubeleri, aramaMetni]);

  if (!acikMi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-2xl bg-[#180A1F] rounded-t-3xl sm:rounded-3xl border border-purple-800/60 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobil Çekme Tutamacı */}
        <div className="w-12 h-1.5 bg-purple-700/50 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Modal Başlığı */}
        <div className="px-5 py-4 border-b border-purple-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Afyon Şubelerimiz & Gel-Al Noktaları</h2>
              <p className="text-[11px] text-purple-300/80">Ziyaret etmek istediğiniz şubenin vitrinini seçin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="p-2 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arama Çubuğu */}
        <div className="p-4 border-b border-purple-900/40 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              placeholder="Şube veya mahalle arayın... (Örn: Zafer, Park Afyon)"
              className="w-full bg-[#200A28] border border-purple-800/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-300/50 outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Şube Kartları Listesi */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtrelenmisSubeler.length === 0 ? (
            <div className="py-12 text-center text-xs text-purple-300/60">
              Aradığınız kriterde şube bulunamadı.
            </div>
          ) : (
            filtrelenmisSubeler.map((sube) => {
              const seciliMi = seciliGelAlSubesi?.id === sube.id || seciliGelAlSubesi?.kimlik === sube.kimlik;
              return (
                <div
                  key={sube.id || sube.kimlik}
                  onClick={() => {
                    onSubeSec(sube);
                    onKapat();
                  }}
                  className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                    seciliMi
                      ? 'bg-gradient-to-r from-[#32113D] to-[#250A2E] border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                      : 'bg-[#200A28] hover:bg-[#2B0E37] border-purple-900/60 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Şube Görseli veya İkonu */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-purple-800/80 bg-purple-950">
                      <img
                        src={sube.gorsel || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80'}
                        alt={sube.ad}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {sube.ad}
                        </h3>
                        {seciliMi && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                            Mevcut Şubeniz
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-purple-200/80 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{sube.adres}</span>
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-purple-300/70 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{sube.calisma_saatleri || '09:00 - 22:00'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Canlı Stok Hazır</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E0F36] group-hover:bg-amber-400 group-hover:text-black text-amber-300 border border-purple-700/60 font-bold text-xs transition-all shadow-sm">
                      <span>Vitrini Gör</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
