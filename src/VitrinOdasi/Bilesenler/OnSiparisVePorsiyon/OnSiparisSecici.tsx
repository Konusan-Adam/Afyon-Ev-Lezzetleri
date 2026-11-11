import React, { useState } from 'react';
import { Clock, Calendar, Zap, Check, X, Sparkles } from 'lucide-react';
import { useOnSiparis } from '@/src/OrtakHavuz/OnSiparisHafizasi';
import { OnSiparisTercihi } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonTipleri';

const HAZIR_ZAMAN_DILIMLERI = [
  {
    id: 'hemen',
    tip: 'hemen' as const,
    baslik: 'Hemen Şimdi (Sıcak Teslimat)',
    detay: '25-35 dakika içinde fırından kapınıza',
    ikon: Zap,
    renk: 'from-amber-500 to-amber-600',
  },
  {
    id: 'bugun_aksam',
    tip: 'ileri_tarih' as const,
    baslik: 'Bugün Akşam Yemeği',
    detay: '18:30 - 19:30 arası sıcacık teslimat',
    tarih: 'Bugün',
    saat: '18:30 - 19:30',
    ikon: Clock,
    renk: 'from-purple-600 to-purple-800',
  },
  {
    id: 'yarin_oglen',
    tip: 'ileri_tarih' as const,
    baslik: 'Yarın Öğlen Yemeği',
    detay: '12:00 - 13:00 arası iş yerine / eve',
    tarih: 'Yarın',
    saat: '12:00 - 13:00',
    ikon: Calendar,
    renk: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'yarin_aksam',
    tip: 'ileri_tarih' as const,
    baslik: 'Yarın Akşam Yemeği',
    detay: '18:30 - 19:30 arası tencere yemeği',
    tarih: 'Yarın',
    saat: '18:30 - 19:30',
    ikon: Clock,
    renk: 'from-purple-600 to-purple-800',
  },
  {
    id: 'cuma_gunu',
    tip: 'ileri_tarih' as const,
    baslik: 'Hafta Sonu / Özel Gün Sofrası',
    detay: 'Toplu tepsi bükmesi & çömlek keşkek',
    tarih: 'Hafta Sonu',
    saat: '13:00 - 15:00',
    ikon: Sparkles,
    renk: 'from-rose-600 to-rose-800',
  },
];

export const OnSiparisSecici: React.FC = () => {
  const { tercih, seciciAcik, seciciyiKapat, tercihGuncelle } = useOnSiparis();
  const [ozelSecimAktif, setOzelSecimAktif] = useState(false);
  const [ozelTarih, setOzelTarih] = useState('');
  const [ozelSaat, setOzelSaat] = useState('18:00');

  if (!seciciAcik) return null;

  const secimYap = (item: typeof HAZIR_ZAMAN_DILIMLERI[0]) => {
    if (item.tip === 'hemen') {
      tercihGuncelle({
        tip: 'hemen',
        tarihEtiketi: 'Hemen Şimdi',
        saatAraligi: '25-35 dk Sıcak Teslimat',
      });
    } else {
      tercihGuncelle({
        tip: 'ileri_tarih',
        tarihEtiketi: item.tarih || 'İleri Tarih',
        saatAraligi: item.saat || 'Belirlenen Saatte',
      });
    }
    seciciyiKapat();
  };

  const ozelTarihKaydet = () => {
    if (!ozelTarih) return;
    tercihGuncelle({
      tip: 'ileri_tarih',
      tarihEtiketi: ozelTarih,
      saatAraligi: `Saat ${ozelSaat} civarı`,
      tamTarih: `${ozelTarih} ${ozelSaat}`,
    });
    seciciyiKapat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#180A1F] border border-[#481B54] rounded-3xl p-5 shadow-2xl space-y-4">
        
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Teslimat Zamanı Seçimi</h3>
              <p className="text-[11px] text-purple-300">İster hemen sıcacık, ister ileri tarihli ayırtın</p>
            </div>
          </div>
          <button
            type="button"
            onClick={seciciyiKapat}
            className="w-8 h-8 rounded-full bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hazır Zaman Seçenekleri */}
        <div className="space-y-2.5">
          {HAZIR_ZAMAN_DILIMLERI.map((item) => {
            const IkonBileseni = item.ikon;
            const seciliMi =
              item.tip === tercih.tip &&
              (item.tip === 'hemen' || (item.tarih && tercih.tarihEtiketi.includes(item.tarih)));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => secimYap(item)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  seciliMi
                    ? 'bg-purple-900/60 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-[#120614] border-purple-900/40 hover:border-purple-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.renk} flex items-center justify-center text-white shrink-0`}>
                    <IkonBileseni className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{item.baslik}</span>
                      {seciliMi && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-extrabold">
                          SEÇİLİ
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">{item.detay}</div>
                  </div>
                </div>

                {seciliMi && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Özel Tarih & Saat Aç/Kapat */}
        <div className="pt-2 border-t border-purple-900/40">
          {!ozelSecimAktif ? (
            <button
              type="button"
              onClick={() => setOzelSecimAktif(true)}
              className="w-full py-2 text-xs font-bold text-amber-400 hover:text-amber-300 text-center cursor-pointer"
            >
              + Başka Bir Gün ve Saat Belirle
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-[#120614] border border-purple-900/60 space-y-3">
              <span className="text-xs font-bold text-white block">Özel Tarih & Saat</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Tarih</label>
                  <input
                    type="date"
                    value={ozelTarih}
                    onChange={(e) => setOzelTarih(e.target.value)}
                    className="w-full bg-[#1E0E22] border border-purple-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Saat</label>
                  <input
                    type="time"
                    value={ozelSaat}
                    onChange={(e) => setOzelSaat(e.target.value)}
                    className="w-full bg-[#1E0E22] border border-purple-800 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={ozelTarihKaydet}
                disabled={!ozelTarih}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-extrabold text-xs cursor-pointer disabled:opacity-50"
              >
                Bu Saati Uygula
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
