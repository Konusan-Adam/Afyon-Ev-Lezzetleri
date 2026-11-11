import React, { useState } from 'react';
import { Package, Plus, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';

interface Props {
  subeId: string;
  urunler: SubeUrunu[];
  onStokGuncellendi: () => void;
}

export const SubeStokYonetimi: React.FC<Props> = ({ subeId, urunler, onStokGuncellendi }) => {
  const [islemdeId, setIslemdeId] = useState<string | null>(null);

  const stokDegistir = async (urun: SubeUrunu, miktarDegisimi: number) => {
    const yeniStok = Math.max(0, urun.stok_adedi + miktarDegisimi);
    setIslemdeId(urun.id);
    try {
      if (canliFirebaseAktifMi()) {
        await belgeKaydet('sube_stoklari', urun.id, { stok_adedi: yeniStok });
      }
      onStokGuncellendi();
    } catch (err) {
      console.warn('Stok güncellenemedi:', err);
    } finally {
      setIslemdeId(null);
    }
  };

  const subeUrunleri = urunler.filter((u) => u.sube_id === subeId);

  return (
    <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-3.5 sm:p-5 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#3E1646] pb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#DDAF53]" />
          <h3 className="font-bold text-sm sm:text-base text-white">Anlık Şube Tezgah Stokları</h3>
        </div>
        <span className="text-[10px] sm:text-xs text-[#A872B5] bg-[#180A1F] px-2.5 sm:px-3 py-1 rounded-full border border-[#3E1646]">
          {subeUrunleri.length} Ürün
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subeUrunleri.map((urun) => {
          const kritikStok = urun.stok_adedi <= 5;
          return (
            <div
              key={urun.id}
              className={`bg-[#180A1F] border rounded-xl p-4 flex flex-col justify-between gap-3 transition-all ${
                kritikStok ? 'border-amber-500/60 bg-amber-950/20' : 'border-[#3E1646]'
              }`}
            >
              <div className="flex items-start gap-3">
                {urun.gorsel_url ? (
                  <img src={urun.gorsel_url} alt={urun.ad} className="w-14 h-14 rounded-lg object-cover shrink-0 border border-[#521E5C]" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[#2A102E] flex items-center justify-center text-stone-400 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#A872B5] font-medium uppercase tracking-wider">{urun.kategori}</span>
                  <h4 className="font-bold text-sm text-white truncate">{urun.ad}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#DDAF53] font-bold text-xs">{urun.fiyat} ₺</span>
                    {kritikStok && (
                      <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Son {urun.stok_adedi} Adet!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#2A102E]">
                <div className="text-xs text-stone-300">
                  Stok: <strong className="text-white text-sm">{urun.stok_adedi}</strong> adet
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={islemdeId === urun.id || urun.stok_adedi <= 0}
                    onClick={() => stokDegistir(urun, -1)}
                    className="w-8 h-8 rounded-lg bg-[#2A102E] hover:bg-[#4D1857] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C] disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={islemdeId === urun.id}
                    onClick={() => stokDegistir(urun, 1)}
                    className="w-8 h-8 rounded-lg bg-[#2A102E] hover:bg-[#4D1857] text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C] disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
