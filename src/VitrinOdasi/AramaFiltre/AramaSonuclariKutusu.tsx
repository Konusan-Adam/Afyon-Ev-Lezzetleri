import React from 'react';
import { Yemek, MutfakTipi, KategoriTipi } from '@/src/veritabani/VeriTipleri';
import { Loader2, Utensils, ArrowRight, Store, Layers } from 'lucide-react';

interface AramaSonuclariKutusuOzellikleri {
  aramaMetni: string;
  sonuclar: Yemek[];
  mutfakSonuclar?: MutfakTipi[];
  kategoriSonuclar?: KategoriTipi[];
  yukleniyor: boolean;
  hata: string | null;
  secildi: (yemek: Yemek) => void;
  mutfakSecildi?: (mutfak: MutfakTipi) => void;
  kategoriSecildi?: (kategori: KategoriTipi) => void;
  etiketSecildi: (etiket: string) => void;
  kapandi: () => void;
}

const populerEtiketler = ['Bükme', 'Ekmek Kadayıfı', 'Afyon Mantısı', 'Keşkek', 'Ağzıaçık', 'Haşhaşlı Çörek'];

export const AramaSonuclariKutusu: React.FC<AramaSonuclariKutusuOzellikleri> = ({
  aramaMetni,
  sonuclar,
  mutfakSonuclar = [],
  kategoriSonuclar = [],
  yukleniyor,
  secildi,
  mutfakSecildi,
  kategoriSecildi,
  etiketSecildi,
}) => {
  const metinVar = aramaMetni.trim().length > 0;
  const toplamSonucSayisi = sonuclar.length + mutfakSonuclar.length + kategoriSonuclar.length;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C0920] border border-[#521E5C] rounded-2xl shadow-2xl overflow-hidden z-50 text-white animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* 1. Yükleniyor Durumu */}
      {yukleniyor && (
        <div className="p-6 flex items-center justify-center gap-3 text-[#DDAF53]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Afyon Mutfağında Aranıyor...</span>
        </div>
      )}

      {/* 2. Arama Metni Varken ve Yükleme Bitmişken */}
      {!yukleniyor && metinVar && (
        <div className="p-2 space-y-3 max-h-96 overflow-y-auto no-scrollbar">
          {toplamSonucSayisi > 0 ? (
            <div className="flex flex-col gap-2">
              
              {/* Mutfak Sonuçları */}
              {mutfakSonuclar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" /> Mutfaklar ({mutfakSonuclar.length})
                  </div>
                  {mutfakSonuclar.map((mutfak) => (
                    <div
                      key={mutfak.id}
                      onClick={() => mutfakSecildi && mutfakSecildi(mutfak)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#2D1033] rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={mutfak.gorsel_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80'}
                          alt={mutfak.ad || mutfak.mutfak_adi}
                          className="w-10 h-10 object-cover rounded-lg ring-1 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {mutfak.ad || mutfak.mutfak_adi}
                          </h4>
                          <p className="text-[11px] text-gray-400">{mutfak.adres || 'Afyonkarahisar'}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Kategori Sonuçları */}
              {kategoriSonuclar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Kategoriler ({kategoriSonuclar.length})
                  </div>
                  {kategoriSonuclar.map((kat) => (
                    <div
                      key={kat.id}
                      onClick={() => kategoriSecildi && kategoriSecildi(kat)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#2D1033] rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-900/40 flex items-center justify-center text-lg">
                          {kat.ikon || '🍽️'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {kat.ad}
                          </h4>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Yemek Sonuçları */}
              {sonuclar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#A872B5] uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Yemekler & Lezzetler ({sonuclar.length})
                  </div>
                  {sonuclar.map((yemek) => (
                    <div
                      key={yemek.id}
                      onClick={() => secildi(yemek)}
                      className="flex items-center justify-between p-2.5 hover:bg-[#2D1033] rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={yemek.gorsel_url || '/marka_logosu.jpg'}
                          alt={yemek.baslik}
                          className="w-10 h-10 object-cover rounded-lg ring-1 ring-[#521E5C] group-hover:ring-[#DDAF53] transition-all"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-[#DDAF53] transition-colors">
                            {yemek.baslik}
                          </h4>
                          <p className="text-[11px] text-[#A872B5]">{yemek.kategori}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#E0B25B]">{yemek.fiyat} ₺</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A872B5] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-6 text-center">
              <Utensils className="w-8 h-8 text-[#521E5C] mx-auto mb-2" />
              <p className="text-xs text-[#A872B5]">
                "{aramaMetni}" kelimesine uygun mutfak, kategori veya lezzet bulunamadı.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Arama Metni Boşken Gösterilecek Popüler Etiketler */}
      {!yukleniyor && !metinVar && (
        <div className="p-4">
          <p className="text-[11px] font-semibold text-[#A872B5] uppercase tracking-wider mb-2.5">
            En Çok Aranan Afyon Lezzetleri & Mutfakları
          </p>
          <div className="flex flex-wrap gap-2">
            {populerEtiketler.map((etiket) => (
              <button
                key={etiket}
                type="button"
                onClick={() => etiketSecildi(etiket)}
                className="bg-[#2A102E] hover:bg-[#481852] border border-[#521E5C] text-xs text-[#E0B25B] px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {etiket}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
