import React, { useState, useMemo } from 'react';
import { Store, X } from 'lucide-react';
import { useMutfaklar } from '@/src/MalzemeCekmeceleri/MutfakCekmecesi';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { MutfakAramaBari } from './MutfakAramaBari';
import { MutfakListesiIcerigi } from './MutfakListesiIcerigi';

interface MutfaklarModaliOzellikleri {
  acikMi: boolean;
  onKapat: () => void;
  onMutfakSec: (mutfak: Mutfak) => void;
}

export const MutfaklarModali: React.FC<MutfaklarModaliOzellikleri> = ({
  acikMi,
  onKapat,
  onMutfakSec,
}) => {
  const { mutfaklar, yukleniyor, hata } = useMutfaklar();
  const [aramaMetni, setAramaMetni] = useState<string>('');

  const filtrelenmisMutfaklar = useMemo(() => {
    if (!aramaMetni.trim()) return mutfaklar;
    const aranan = aramaMetni.toLowerCase().trim();
    return mutfaklar.filter((m) => {
      const adEslesir = (m.ad || '').toLowerCase().includes(aranan);
      const mahalleEslesir = (m.mahalle || '').toLowerCase().includes(aranan);
      const adresEslesir = (m.adres || '').toLowerCase().includes(aranan);
      return adEslesir || mahalleEslesir || adresEslesir;
    });
  }, [mutfaklar, aramaMetni]);

  if (!acikMi) return null;

  return (
    <div
      onClick={onKapat}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        className="w-full sm:max-w-2xl bg-[#180A1F] rounded-t-3xl sm:rounded-3xl border border-purple-800/60 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobil Çekme Çubuğu */}
        <div className="w-12 h-1.5 bg-purple-700/50 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Modal Başlığı */}
        <div className="px-4 py-3 border-b border-purple-900/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-purple-900/40 border border-purple-700/40 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-white">Afyon Mutfakları & Şubeler</h2>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="p-1.5 rounded-full bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arama Barı */}
        <div className="px-4 pt-3 pb-2 shrink-0">
          <MutfakAramaBari
            aramaMetni={aramaMetni}
            aramaMetniDegisti={setAramaMetni}
            toplamSayi={filtrelenmisMutfaklar.length}
          />
        </div>

        {/* Mutfak Kartları Listesi (Kaydırılabilir) */}
        <div className="px-4 py-2 overflow-y-auto flex-1 custom-scrollbar">
          <MutfakListesiIcerigi
            mutfaklar={filtrelenmisMutfaklar}
            yukleniyor={yukleniyor}
            hata={hata}
            aramaMetni={aramaMetni}
            onMutfakSec={(m) => {
              onMutfakSec(m);
              onKapat();
            }}
          />
        </div>
      </div>
    </div>
  );
};
