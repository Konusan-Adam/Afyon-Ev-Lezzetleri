import React, { useState } from 'react';
import { FiltreKriterleri } from '@/src/veritabani/VeriTipleri';
import { X, SlidersHorizontal, RotateCcw, Check, Star } from 'lucide-react';

interface FiltrePaneliOzellikleri {
  acik: boolean;
  mevcutFiltreler: FiltreKriterleri;
  kapat: () => void;
  uygula: (yeniFiltreler: FiltreKriterleri) => void;
}

const kategoriler = ['Tümü', 'Hamur İşleri', 'Tatlılar', 'Çorbalar', 'Et Yemekleri', 'Yöresel Lezzetler'];

export const FiltrePaneli: React.FC<FiltrePaneliOzellikleri> = ({
  acik,
  mevcutFiltreler,
  kapat,
  uygula,
}) => {
  const [geciciFiltreler, setGeciciFiltreler] = useState<FiltreKriterleri>(mevcutFiltreler);

  if (!acik) return null;

  const sifirla = () => {
    const bosFiltre: FiltreKriterleri = {
      kategori: 'Tümü',
      minFiyat: undefined,
      maxFiyat: undefined,
      minPuan: undefined,
      siralama: 'varsayilan',
    };
    setGeciciFiltreler(bosFiltre);
    uygula(bosFiltre);
  };

  const kaydetVeUygula = () => {
    uygula(geciciFiltreler);
    kapat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#19091C] border border-[#521E5C] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Panel Başlığı */}
        <div className="px-6 py-4 border-b border-[#2D1233] flex items-center justify-between bg-[#130713]">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-serif text-lg font-bold text-[#DDAF53]">Lezzet Filtreleme Paneli</h3>
          </div>
          <button
            type="button"
            onClick={kapat}
            className="p-1.5 rounded-lg text-[#A872B5] hover:text-white hover:bg-[#2D1233] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Gövdesi */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Kategoriler */}
          <div>
            <label className="block text-xs font-semibold text-[#A872B5] uppercase tracking-wider mb-3">
              Yemek Kategorisi
            </label>
            <div className="flex flex-wrap gap-2">
              {kategoriler.map((kat) => {
                const secili = (geciciFiltreler?.kategori || 'Tümü') === kat;
                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setGeciciFiltreler({ ...geciciFiltreler, kategori: kat })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      secili
                        ? 'bg-[#DDAF53] text-[#130713] border-[#DDAF53] font-bold shadow-md'
                        : 'bg-[#2A102E] text-[#DDAF53]/90 border-[#521E5C] hover:border-[#DDAF53]/50'
                    }`}
                  >
                    {kat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Fiyat Aralığı */}
          <div>
            <label className="block text-xs font-semibold text-[#A872B5] uppercase tracking-wider mb-3">
              Fiyat Aralığı (₺)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min ₺"
                value={geciciFiltreler.minFiyat ?? ''}
                onChange={(e) =>
                  setGeciciFiltreler({
                    ...geciciFiltreler,
                    minFiyat: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-4 py-2 text-xs text-white placeholder-[#8B5699] focus:outline-none focus:border-[#DDAF53]"
              />
              <span className="text-[#A872B5] text-xs font-bold">-</span>
              <input
                type="number"
                placeholder="Max ₺"
                value={geciciFiltreler.maxFiyat ?? ''}
                onChange={(e) =>
                  setGeciciFiltreler({
                    ...geciciFiltreler,
                    maxFiyat: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-4 py-2 text-xs text-white placeholder-[#8B5699] focus:outline-none focus:border-[#DDAF53]"
              />
            </div>
          </div>

          {/* 3. Puan Süzgeci */}
          <div>
            <label className="block text-xs font-semibold text-[#A872B5] uppercase tracking-wider mb-3">
              Minimum Lezzet Puanı
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { etiket: 'Tümü', deger: undefined },
                { etiket: '4.0+ Yıldız', deger: 4.0 },
                { etiket: '4.5+ Yıldız', deger: 4.5 },
              ].map((puanOption) => {
                const secili = geciciFiltreler.minPuan === puanOption.deger;
                return (
                  <button
                    key={puanOption.etiket}
                    type="button"
                    onClick={() => setGeciciFiltreler({ ...geciciFiltreler, minPuan: puanOption.deger })}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      secili
                        ? 'bg-[#481852] border-[#DDAF53] text-[#DDAF53] font-bold'
                        : 'bg-[#2A102E] border-[#521E5C] text-[#A872B5] hover:border-[#521E5C]/80'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-[#DDAF53] text-[#DDAF53]" />
                    <span>{puanOption.etiket}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Sıralama */}
          <div>
            <label className="block text-xs font-semibold text-[#A872B5] uppercase tracking-wider mb-3">
              Sıralama Ölçütü
            </label>
            <select
              value={geciciFiltreler.siralama || 'varsayilan'}
              onChange={(e) =>
                setGeciciFiltreler({
                  ...geciciFiltreler,
                  siralama: e.target.value as FiltreKriterleri['siralama'],
                })
              }
              className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#DDAF53] cursor-pointer"
            >
              <option value="varsayilan">Varsayılan Sıralama</option>
              <option value="fiyat_artan">Fiyat (Düşükten Yükseğe)</option>
              <option value="fiyat_azalan">Fiyat (Yüksekten Düşüğe)</option>
              <option value="puan_azalan">En Yüksek Puanlılar</option>
            </select>
          </div>

        </div>

        {/* Panel Alt Butonlar */}
        <div className="px-6 py-4 border-t border-[#2D1233] bg-[#130713] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={sifirla}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A872B5] hover:text-white bg-[#2A102E] hover:bg-[#3D1843] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
          <button
            type="button"
            onClick={kaydetVeUygula}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#130713] bg-[#DDAF53] hover:bg-[#F5D28A] transition-colors shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Filtreleri Uygula</span>
          </button>
        </div>

      </div>
    </div>
  );
};
