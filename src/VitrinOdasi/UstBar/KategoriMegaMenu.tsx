import React, { useState, useRef, useEffect } from 'react';
import { Utensils, ChevronDown, Check, ChevronRight, Sparkles, Layers, ArrowRight, X } from 'lucide-react';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { kategorileriGetir } from '@/src/MalzemeCekmeceleri/kategorileriGetir';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

export const KategoriMegaMenu: React.FC = () => {
  const [menuAcik, setMenuAcik] = useState<boolean>(false);
  const { aktifFiltreler, filtreleriUygula, altKategoriFiltresiniTemizle } = aramaVeFiltreKullan();
  const { kategoriler, altKategoriler } = kategorileriGetir();
  const menuKutusuRef = useRef<HTMLDivElement>(null);

  // Filtrelenmiş kategori listesi (Tümü hariç ana kategoriler)
  const gosterilenKategoriler = kategoriler.filter(k => k.id !== 'hepsi');

  // Menü açıkken fareyle üzerine gelinen ya da seçili olan aktif kategori
  const [vurgulananKategoriId, setVurgulananKategoriId] = useState<string>(
    gosterilenKategoriler[0]?.id || 'kat-hamur'
  );

  const seciliKategoriAd = aktifFiltreler?.kategori || 'Tümü';
  const seciliAltKategoriAd = aktifFiltreler?.altKategori;

  // Dışarı tıklanınca menüyü kapat
  useEffect(() => {
    const disariTiklama = (e: MouseEvent) => {
      if (menuKutusuRef.current && !menuKutusuRef.current.contains(e.target as Node)) {
        setMenuAcik(false);
      }
    };
    document.addEventListener('mousedown', disariTiklama);
    return () => document.removeEventListener('mousedown', disariTiklama);
  }, []);

  // Vurgulanan kategorinin detayları ve alt kategorileri
  const aktifKategoriNesnesi = kategoriler.find(k => k.id === vurgulananKategoriId) || gosterilenKategoriler[0];
  const aktifKategoriAltDallari = aktifKategoriNesnesi
    ? altKategoriler.filter(a => a.ust_kategori_id === aktifKategoriNesnesi.id)
    : [];

  const tumKategoriyiSec = (katAd: string) => {
    filtreleriUygula({
      ...(aktifFiltreler || {}),
      kategori: katAd === 'Tümü' ? 'Tümü' : katAd,
      altKategori: undefined
    });
    setMenuAcik(false);
  };

  const altKategoriSec = (anaKatAd: string, altAd: string) => {
    filtreleriUygula({
      ...(aktifFiltreler || {}),
      kategori: anaKatAd,
      altKategori: altAd
    });
    setMenuAcik(false);
  };

  return (
    <div className="relative w-full" ref={menuKutusuRef}>
      {/* Mega Menü Tetikleme Butonu */}
      <button
        type="button"
        onClick={() => setMenuAcik(!menuAcik)}
        className={`w-full h-11 px-3 py-1.5 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-left shadow-sm group border ${
          menuAcik
            ? 'bg-[#35123E] border-amber-400/90 shadow-amber-500/20'
            : 'bg-[#210D27] hover:bg-[#33143C] border-purple-800/60 hover:border-amber-400/60'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-[#3D1843] flex items-center justify-center border border-amber-400/30 group-hover:scale-105 transition-transform shrink-0">
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-between leading-tight">
            <span className="truncate">Tüm Lezzetler</span>
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 flex items-center gap-0.5">
              Menü
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${menuAcik ? 'rotate-180 text-amber-300' : 'text-amber-400'}`} />
            </span>
          </div>
          <div className="text-[10px] text-purple-300/90 font-medium truncate flex items-center gap-1 mt-0.5">
            <span>{seciliKategoriAd === 'Tümü' ? 'Kategorileri Keşfet' : seciliKategoriAd}</span>
            {seciliAltKategoriAd && (
              <>
                <span>›</span>
                <span className="text-amber-300 font-bold truncate">{seciliAltKategoriAd}</span>
              </>
            )}
          </div>
        </div>
      </button>

      {/* 🌟 ÇİFT SÜTUNLU ZENGİN MEGA MENÜ MODALI (DESKTOP) */}
      {menuAcik && (
        <div className="absolute top-full left-0 mt-2.5 w-[680px] bg-[#140618] border border-amber-500/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          
          {/* Üst Başlık Barı */}
          <div className="px-5 py-3 bg-[#1D0823] border-b border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold text-white tracking-wide">
                Afyonkarahisar Anne Eli Mutfak Rehberi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => tumKategoriyiSec('Tümü')}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Tüm Menüyü Göster
              </button>
              <button
                type="button"
                onClick={() => setMenuAcik(false)}
                className="p-1 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Çift Sütunlu Gövde */}
          <div className="grid grid-cols-12 min-h-[380px]">
            
            {/* SOL SÜTUN: Ana Kategoriler Listesi (5 Kolon) */}
            <div className="col-span-5 bg-[#180A1F] border-r border-purple-900/40 p-2.5 space-y-1 overflow-y-auto max-h-[420px] no-scrollbar">
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">
                Ana Kategoriler
              </div>

              {gosterilenKategoriler.map((kat) => {
                const vurguluMu = kat.id === vurgulananKategoriId;
                const seciliMi = seciliKategoriAd === kat.ad;
                const altSayisi = altKategoriler.filter(a => a.ust_kategori_id === kat.id).length;

                return (
                  <button
                    key={kat.id}
                    type="button"
                    onMouseEnter={() => setVurgulananKategoriId(kat.id)}
                    onClick={() => tumKategoriyiSec(kat.ad)}
                    className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer group ${
                      vurguluMu
                        ? 'bg-gradient-to-r from-[#50195C] to-[#6A217A] text-white shadow-md border border-amber-400/40'
                        : 'text-gray-300 hover:bg-[#250E2C] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center shrink-0">
                        {kat.resim_url ? (
                          <img src={gorselUrlGuvenliYap(kat.resim_url)} alt={kat.ad} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className="text-base">{kat.ikon}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate leading-snug">{kat.ad}</div>
                        <div className="text-[10px] text-purple-300/80 truncate">
                          {altSayisi} alt çeşit
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${vurguluMu ? 'text-amber-400 translate-x-0.5' : 'text-purple-600 group-hover:text-purple-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* SAĞ SÜTUN: Vurgulanan Kategoriye Ait Zengin Alt Çeşitler & Vitrin Görseli (7 Kolon) */}
            <div className="col-span-7 p-5 bg-[#120515] flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Vurgulanan Kategori Başlığı ve Tabağı */}
                <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                  <div className="flex items-center gap-3">
                    {aktifKategoriNesnesi?.resim_url && (
                      <img 
                        src={gorselUrlGuvenliYap(aktifKategoriNesnesi.resim_url)} 
                        alt={aktifKategoriNesnesi.ad} 
                        className="w-12 h-12 object-contain drop-shadow-[0_4px_12px_rgba(251,191,36,0.35)]"
                      />
                    )}
                    <div>
                      <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                        {aktifKategoriNesnesi?.ad}
                      </div>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <span>Tüm Çeşitler & Alt Menü</span>
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => tumKategoriyiSec(aktifKategoriNesnesi?.ad || 'Tümü')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 cursor-pointer transition-all"
                  >
                    <span>Hepsini Gör</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Alt Kategori Düğmeleri Izgarası */}
                <div>
                  <div className="text-[11px] text-purple-300 font-semibold mb-2.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Özel Alt Lezzetler:</span>
                  </div>

                  {aktifKategoriAltDallari.length === 0 ? (
                    <div className="py-8 text-center text-xs text-purple-400 border border-dashed border-purple-900/40 rounded-2xl">
                      Bu kategoriye ait doğrudan lezzetler listeleniyor.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {aktifKategoriAltDallari.map((alt) => {
                        const buAltSecili = seciliKategoriAd === aktifKategoriNesnesi.ad && seciliAltKategoriAd === alt.ad;

                        return (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => altKategoriSec(aktifKategoriNesnesi.ad, alt.ad)}
                            className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between group border ${
                              buAltSecili
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 border-amber-300 shadow-md font-extrabold'
                                : 'bg-[#1D0A24] hover:bg-[#2F103A] text-gray-200 hover:text-white border-purple-900/50 hover:border-amber-400/50'
                            }`}
                          >
                            <span className="text-xs font-bold truncate group-hover:translate-x-0.5 transition-transform">
                              {alt.ad}
                            </span>
                            {buAltSecili ? (
                              <Check className="w-4 h-4 text-purple-950 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-purple-500 group-hover:text-amber-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Alt Bilgi Rozeti */}
              <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-purple-400">
                <span>Afyonkarahisar Yöresel Ev Mutfakları</span>
                <span className="text-amber-300/80 font-medium">Katkısız & Günlük Pişirilir</span>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
