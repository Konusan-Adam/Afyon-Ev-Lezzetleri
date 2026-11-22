import React, { useMemo } from 'react';
import { Yemek, MutfakTipi, KategoriTipi, GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';
import { Loader2, Utensils, ArrowRight, Store, Layers, MapPin, Sparkles } from 'lucide-react';

interface AramaSonuclariKutusuOzellikleri {
  aramaMetni: string;
  sonuclar: Yemek[];
  mutfakSonuclar?: MutfakTipi[];
  kategoriSonuclar?: KategoriTipi[];
  subeSonuclar?: GelAlSubesi[];
  subeUrunSonuclar?: SubeUrunu[];
  yukleniyor: boolean;
  hata: string | null;
  secildi: (yemek: Yemek) => void;
  mutfakSecildi?: (mutfak: MutfakTipi) => void;
  kategoriSecildi?: (kategori: KategoriTipi) => void;
  subeSecildi?: (sube: GelAlSubesi) => void;
  subeUrunSecildi?: (urun: SubeUrunu) => void;
  etiketSecildi: (etiket: string) => void;
  kapandi: () => void;
}

const populerEtiketler = ['Bükme', 'Ekmek Kadayıfı', 'Afyon Mantısı', 'Keşkek', 'Zafer Meydanı', 'Park Afyon'];

export const AramaSonuclariKutusu: React.FC<AramaSonuclariKutusuOzellikleri> = ({
  aramaMetni,
  sonuclar,
  mutfakSonuclar = [],
  kategoriSonuclar = [],
  subeSonuclar = [],
  subeUrunSonuclar = [],
  yukleniyor,
  secildi,
  mutfakSecildi,
  kategoriSecildi,
  subeSecildi,
  subeUrunSecildi,
  etiketSecildi,
}) => {
  const { gelAlSubeleri } = teslimatHafizasiKullan();
  const anlikDakika = useCanliDakika();

  const subeHaritasi = useMemo(() => {
    const harita = new Map<string, GelAlSubesi>();
    gelAlSubeleri.forEach((s) => {
      if (s.id) harita.set(s.id, s);
      if (s.kimlik) harita.set(s.kimlik, s);
    });
    subeSonuclar.forEach((s) => {
      if (s.id) harita.set(s.id, s);
      if (s.kimlik) harita.set(s.kimlik, s);
    });
    return harita;
  }, [gelAlSubeleri, subeSonuclar]);

  const metinVar = aramaMetni.trim().length > 0;
  const toplamSonucSayisi =
    sonuclar.length +
    mutfakSonuclar.length +
    kategoriSonuclar.length +
    subeSonuclar.length +
    subeUrunSonuclar.length;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C0920] border border-[#521E5C] rounded-2xl shadow-2xl overflow-hidden z-50 text-white animate-in fade-in slide-in-from-top-2 duration-200">
      {/* 1. Yükleniyor Durumu */}
      {yukleniyor && (
        <div className="p-6 flex items-center justify-center gap-3 text-[#DDAF53]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">Afyon Mutfağında ve Şubelerde Aranıyor...</span>
        </div>
      )}

      {/* 2. Arama Metni Varken ve Yükleme Bitmişken */}
      {!yukleniyor && metinVar && (
        <div className="p-2 space-y-3 max-h-96 overflow-y-auto no-scrollbar">
          {toplamSonucSayisi > 0 ? (
            <div className="flex flex-col gap-2">
              {/* Şube Sonuçları */}
              {subeSonuclar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Gel-Al Şubeleri ({subeSonuclar.length})
                  </div>
                  {subeSonuclar.map((sube) => {
                    const subeAcik = calismaSaatiDurumuHesapla(sube, anlikDakika).acikMi;
                    return (
                      <div
                        key={sube.id || sube.kimlik}
                        onClick={() => subeSecildi && subeSecildi(sube)}
                        className="flex items-center justify-between p-2.5 hover:bg-[#2D1033] rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={sube.gorsel || '/marka_logosu.jpg'}
                            alt={sube.ad}
                            className="w-10 h-10 object-cover rounded-lg bg-[#290F30] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                {sube.ad}
                              </h4>
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                                  subeAcik
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                                    : 'bg-rose-950 text-rose-300 border border-rose-600/40'
                                }`}
                              >
                                {subeAcik ? 'Açık' : 'Kapalı'}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">
                              {sube.mahalle || sube.adres || 'Afyonkarahisar'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Şube Hazır Menüleri */}
              {subeUrunSonuclar.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Şube Hazır Menüler ({subeUrunSonuclar.length})
                  </div>
                  {subeUrunSonuclar.map((urun) => {
                    const bagliSube = subeHaritasi.get(urun.sube_id);
                    const subeAcik = calismaSaatiDurumuHesapla(bagliSube, anlikDakika).acikMi;
                    return (
                      <div
                        key={urun.id}
                        onClick={() => {
                          if (subeUrunSecildi) {
                            subeUrunSecildi(urun);
                          } else if (bagliSube && subeSecildi) {
                            subeSecildi(bagliSube);
                          }
                        }}
                        className="flex items-center justify-between p-2.5 hover:bg-[#2D1033] rounded-xl cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={urun.gorsel_url || '/marka_logosu.jpg'}
                            alt={urun.ad}
                            className="w-10 h-10 object-cover rounded-lg ring-1 ring-amber-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                              {urun.ad}
                            </h4>
                            <p className="text-[11px] text-purple-300/80 truncate">
                              {bagliSube ? bagliSube.ad.replace(/(Gel-Al.*|Dağıtım.*|Teslimat.*)/gi, '').trim() : urun.kategori}
                              {!subeAcik ? ' • Şube Kapalı' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-[#E0B25B]">{urun.fiyat} ₺</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
                          src="/marka_logosu.jpg"
                          alt={mutfak.ad || mutfak.mutfak_adi}
                          className="w-10 h-10 object-cover rounded-lg bg-[#290F30]"
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
                "{aramaMetni}" kelimesine uygun şube, mutfak, kategori veya lezzet bulunamadı.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Arama Metni Boşken Gösterilecek Popüler Etiketler */}
      {!yukleniyor && !metinVar && (
        <div className="p-4">
          <p className="text-[11px] font-semibold text-[#A872B5] uppercase tracking-wider mb-2.5">
            En Çok Aranan Afyon Lezzetleri & Şubeler
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
