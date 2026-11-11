import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Sun, Moon, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { yemekArama } from '@/src/MalzemeCekmeceleri/yemekArama';
import { AramaSonuclariKutusu } from '../AramaFiltre/AramaSonuclariKutusu';
import { AramaKategoriPaneli } from './AramaKategoriPaneli';
import { UstBarProfilMenusu } from './UstBarProfilMenusu';
import { UstBarSubeMenusu } from './UstBarSubeMenusu';
import { Yemek, Mutfak, GelAlSubesi } from '@/src/veritabani/VeriTipleri';

export interface UstBarOzellikleri {
  aramaMetni: string;
  aramaMetniniDegistir: (metin: string) => void;
  anasayfayaGitTiklandi?: () => void;
  filtreleTiklandi?: () => void;
  sepetiAcTiklandi?: () => void;
  yemekSecildi?: (yemek: Yemek) => void;
  mutfakSecildi?: (mutfak: Mutfak) => void;
  subeSecildi?: (sube: GelAlSubesi) => void;
  sepetSayisi?: number;
}

export const UstBar: React.FC<UstBarOzellikleri> = ({
  aramaMetni,
  aramaMetniniDegistir,
  anasayfayaGitTiklandi,
  filtreleTiklandi,
  sepetiAcTiklandi,
  yemekSecildi,
  mutfakSecildi,
  subeSecildi,
  sepetSayisi,
}) => {
  const [odaklandi, setOdaklandi] = useState<boolean>(false);
  const aramaKutusuRef = useRef<HTMLDivElement>(null);

  const { seciliAdres, adresSecimPenceresiAc } = teslimatHafizasiKullan();
  const { tema, temaDegistir } = temaHafizasiKullan();
  const { filtreleriUygula, aktifFiltreler, aktifFiltreSayisi } = aramaVeFiltreKullan();
  const { toplamUrunSayisi, sepetPaneliAc } = sepetHafizasiKullan();
  const { sonuclar, mutfakSonuclar, kategoriSonuclar, yukleniyor, hata } = yemekArama(aramaMetni);

  const gorunenSepetSayisi = sepetSayisi !== undefined ? sepetSayisi : toplamUrunSayisi;
  const acikMi = tema === 'acik';

  useEffect(() => {
    function disinaTiklandi(event: MouseEvent) {
      if (aramaKutusuRef.current && !aramaKutusuRef.current.contains(event.target as Node)) {
        setOdaklandi(false);
      }
    }
    document.addEventListener('mousedown', disinaTiklandi);
    return () => document.removeEventListener('mousedown', disinaTiklandi);
  }, []);

  // Çift "Mah." hatasını önleyen temiz mahalle metni
  const mahalleAdi = seciliAdres?.mahalle
    ? seciliAdres.mahalle.replace(/\s*Mah(alle)?\.?/gi, '').trim() + ' Mah.'
    : 'Teslimat Adresi Seçiniz';

  return (
    <header
      className={`w-full select-none py-2.5 transition-colors duration-200 border-b ${
        acikMi
          ? 'bg-[#FAF4EB] border-[#E2D2C0] text-gray-900 shadow-xs'
          : 'bg-[#130713] border-[#2D1233] text-white'
      }`}
    >
      <div className="anasayfa-genislik px-4 flex items-center gap-3.5">
        
        {/* 1. Sadece Yuvarlak Marka Logosu (Yazı tamamen kaldırıldı) */}
        <button
          type="button"
          onClick={anasayfayaGitTiklandi}
          className="shrink-0 cursor-pointer group border-0 bg-transparent p-0 focus:outline-none transition-transform hover:scale-105"
          title="Ana Sayfaya Dön"
        >
          <div className="w-11 h-11 rounded-full ring-2 ring-[#CFA353] p-0.5 bg-white overflow-hidden flex items-center justify-center shadow-md">
            <img
              src="/marka_logosu.jpg"
              alt="Afyon Ev Lezzetleri"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </button>

        {/* 2. Sadece Teslimat Adresi Seçimi (Çift Mah. yazısı düzeltildi) */}
        <button
          type="button"
          onClick={adresSecimPenceresiAc}
          className={`h-11 px-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shrink-0 max-w-[210px] ${
            acikMi
              ? 'bg-white hover:bg-amber-50 border-amber-200 text-gray-800 shadow-xs'
              : 'bg-[#230C28] hover:bg-[#35123E] border-purple-900/60 text-gray-200 hover:text-white'
          }`}
          title="Teslimat Adresini Değiştir"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{mahalleAdi}</span>
          <ChevronDown className="w-3 h-3 text-purple-300 shrink-0 ml-auto" />
        </button>

        {/* 2.1 Şubeler Açılır Menüsü */}
        <UstBarSubeMenusu tema={tema} onSubeSecildi={subeSecildi} />

        {/* 3. Arama Çubuğu + İçinde Filtrele Butonu + Yemeksepeti Modeli Sere Serpe Panel */}
        <div ref={aramaKutusuRef} className="flex-1 relative min-w-[240px]">
          <div
            className={`w-full h-11 rounded-xl px-3.5 flex items-center gap-2.5 transition-all border ${
              acikMi
                ? 'bg-white border-amber-300 shadow-xs focus-within:border-amber-500'
                : 'bg-[#230C28] border-purple-900/60 shadow-inner focus-within:border-amber-400'
            }`}
          >
            <Search className={`w-4 h-4 shrink-0 ${acikMi ? 'text-amber-600' : 'text-purple-400'}`} />
            <input
              type="text"
              value={aramaMetni}
              onFocus={() => setOdaklandi(true)}
              onChange={(e) => {
                aramaMetniniDegistir(e.target.value);
                setOdaklandi(true);
              }}
              placeholder="Yemek, mutfak veya lezzet arayın..."
              className={`w-full bg-transparent text-xs focus:outline-none ${
                acikMi ? 'text-gray-900 placeholder-gray-500' : 'text-white placeholder-purple-300/60'
              }`}
            />

            {/* Metin Temizleme X Butonu */}
            {aramaMetni && (
              <button
                type="button"
                onClick={() => aramaMetniniDegistir('')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* 🎯 Arama İçindeki Filtrele Butonu (Geri Geldi!) */}
            <button
              type="button"
              onClick={filtreleTiklandi}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                aktifFiltreSayisi > 0
                  ? 'bg-amber-500 text-black border-amber-400 shadow-xs'
                  : acikMi
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                  : 'bg-[#3D1843] hover:bg-[#521E5C] text-amber-300 border-purple-700/50'
              }`}
              title="Filtreleri Aç"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrele</span>
              {aktifFiltreSayisi > 0 && (
                <span className="bg-black text-amber-400 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {aktifFiltreSayisi}
                </span>
              )}
            </button>
          </div>

          {/* Odaklanınca Açılan Yemeksepeti Modeli Sere Serpe Kategori Paneli */}
          {odaklandi && !aramaMetni.trim() && (
            <AramaKategoriPaneli
              acik={odaklandi}
              kapat={() => setOdaklandi(false)}
              kategoriSec={(katAd) => {
                filtreleriUygula({ ...(aktifFiltreler || {}), kategori: katAd, altKategori: undefined });
              }}
              aramaSec={(metin) => {
                aramaMetniniDegistir(metin);
                setOdaklandi(false);
              }}
              tema={tema}
            />
          )}

          {/* Arama Metni Varken Açılan Mutfak, Kategori ve Yemek Sonuçları */}
          {odaklandi && aramaMetni.trim() && (
            <AramaSonuclariKutusu
              aramaMetni={aramaMetni}
              sonuclar={sonuclar}
              mutfakSonuclar={mutfakSonuclar}
              kategoriSonuclar={kategoriSonuclar}
              yukleniyor={yukleniyor}
              hata={hata}
              secildi={(yemek: Yemek) => {
                if (yemekSecildi) yemekSecildi(yemek);
                setOdaklandi(false);
              }}
              mutfakSecildi={(mutfak) => {
                if (mutfakSecildi) mutfakSecildi(mutfak as unknown as Mutfak);
                aramaMetniniDegistir('');
                setOdaklandi(false);
              }}
              kategoriSecildi={(kat) => {
                filtreleriUygula({ ...(aktifFiltreler || {}), kategori: kat.ad, altKategori: undefined });
                setOdaklandi(false);
                aramaMetniniDegistir('');
              }}
              etiketSecildi={(etiket: string) => {
                aramaMetniniDegistir(etiket);
                setOdaklandi(true);
              }}
              kapandi={() => setOdaklandi(false)}
            />
          )}
        </div>

        {/* 4. Tema Değiştirici (SADECE İKON - YAZISIZ) */}
        <button
          type="button"
          onClick={temaDegistir}
          className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            acikMi
              ? 'bg-white hover:bg-amber-50 border-amber-200 text-amber-600 shadow-xs'
              : 'bg-[#230C28] hover:bg-[#35123E] border-purple-900/60 text-amber-400'
          }`}
          title={tema === 'koyu' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        >
          {tema === 'koyu' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600" />
          )}
        </button>

        {/* 5. Giriş Yap / Profil Menüsü */}
        <div className="shrink-0">
          <UstBarProfilMenusu tema={tema} />
        </div>

        {/* 6. Sadece Çoklu Sepet İkonu */}
        <button
          type="button"
          onClick={sepetiAcTiklandi || sepetPaneliAc}
          className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold flex items-center gap-2 shadow-md hover:shadow-amber-500/20 cursor-pointer shrink-0 transition-transform active:scale-95 relative"
          title="Çoklu Sepetim"
        >
          <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
          {gorunenSepetSayisi > 0 && (
            <span className="bg-black text-amber-400 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {gorunenSepetSayisi}
            </span>
          )}
        </button>

      </div>
    </header>
  );
};
