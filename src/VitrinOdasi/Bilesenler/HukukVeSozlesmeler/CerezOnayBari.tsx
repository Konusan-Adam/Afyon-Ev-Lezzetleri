import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, Settings, X } from 'lucide-react';
import { cerezTercihleriniGetir, cerezTercihleriniKaydet } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/hukukDeposu';
import { SozlesmeTuru } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/tipler';

interface CerezOnayBariProps {
  onSozlesmeAc: (tur: SozlesmeTuru) => void;
}

export const CerezOnayBari: React.FC<CerezOnayBariProps> = ({ onSozlesmeAc }) => {
  const [gorunur, setGorunur] = useState(false);
  const [detayModu, setDetayModu] = useState(false);
  const [analitikIzin, setAnalitikIzin] = useState(true);
  const [pazarlamaIzin, setPazarlamaIzin] = useState(false);

  useEffect(() => {
    const mevcut = cerezTercihleriniGetir();
    if (!mevcut) {
      const zamanlayici = setTimeout(() => {
        setGorunur(true);
      }, 1200);
      return () => clearTimeout(zamanlayici);
    }
  }, []);

  if (!gorunur) return null;

  const tumunuKabulEt = () => {
    cerezTercihleriniKaydet({
      zorunlu: true,
      analitik: true,
      pazarlama: true,
      onaylandi: true,
      tarih: new Date().toISOString()
    });
    setGorunur(false);
  };

  const sadeceZorunlulariKabulEt = () => {
    cerezTercihleriniKaydet({
      zorunlu: true,
      analitik: false,
      pazarlama: false,
      onaylandi: true,
      tarih: new Date().toISOString()
    });
    setGorunur(false);
  };

  const secimleriKaydet = () => {
    cerezTercihleriniKaydet({
      zorunlu: true,
      analitik: analitikIzin,
      pazarlama: pazarlamaIzin,
      onaylandi: true,
      tarih: new Date().toISOString()
    });
    setGorunur(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 lg:max-w-4xl lg:mx-auto z-[90] animate-slideUp">
      <div className="bg-[#1A081D]/95 border border-[#6D237A] rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-[#521E5C] flex items-center justify-center border border-[#852C94] shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-[#DDAF53]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#DDAF53] flex items-center gap-1.5">
                <span>Lezzetli Deneyim İçin Çerezler Kullanıyoruz</span>
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Afyon Ev Lezzetleri olarak güvenli alışveriş, sepetinizi hatırlama ve size özel yöresel menüler sunabilmek için yasal çerezler kullanmaktayız.{' '}
                <button
                  onClick={() => onSozlesmeAc('cerez_politikasi')}
                  className="text-[#DDAF53] underline font-medium hover:text-amber-300 cursor-pointer ml-1"
                >
                  Çerez Politikası
                </button>
                'nı inceleyebilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => setDetayModu(!detayModu)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5 border border-purple-900 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tercihler</span>
            </button>
            <button
              onClick={sadeceZorunlulariKabulEt}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-[#521E5C] text-gray-200 text-xs font-semibold cursor-pointer"
            >
              Yalnızca Zorunlular
            </button>
            <button
              onClick={tumunuKabulEt}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Tümünü Kabul Et</span>
            </button>
          </div>

        </div>

        {/* Detaylı Ayar Seçenekleri */}
        {detayModu && (
          <div className="mt-4 pt-4 border-t border-[#3D1445] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#240C28] p-3 rounded-xl border border-purple-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-200 block">Zorunlu Çerezler</span>
                <span className="text-[10px] text-gray-400">Sepet ve Güvenlik</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">
                Her Zaman Aktif
              </span>
            </div>

            <div className="bg-[#240C28] p-3 rounded-xl border border-purple-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-200 block">Analitik Çerezler</span>
                <span className="text-[10px] text-gray-400">Performans ve Hız</span>
              </div>
              <input
                type="checkbox"
                checked={analitikIzin}
                onChange={(e) => setAnalitikIzin(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="bg-[#240C28] p-3 rounded-xl border border-purple-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-200 block">Pazarlama</span>
                <span className="text-[10px] text-gray-400">Özel Kampanyalar</span>
              </div>
              <input
                type="checkbox"
                checked={pazarlamaIzin}
                onChange={(e) => setPazarlamaIzin(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end mt-1">
              <button
                onClick={secimleriKaydet}
                className="px-4 py-1.5 bg-amber-500 text-gray-950 rounded-lg text-xs font-bold cursor-pointer hover:bg-amber-400"
              >
                Tercihlerimi Kaydet
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
