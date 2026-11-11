import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Zap,
  Sparkles,
  Utensils
} from 'lucide-react';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { KareReklamKutusu } from '../ReklamVeDuyuru/KareReklamKutusu';
import { kategorileriGetir } from '@/src/MalzemeCekmeceleri/kategorileriGetir';

export const SagFiltreSutunu: React.FC = () => {
  const { 
    aktifFiltreler, 
    filtreleriGuncelle, 
    tumFiltreleriTemizle, 
    aktifFiltreSayisi 
  } = aramaVeFiltreKullan();
  
  const { kategoriler } = kategorileriGetir();
  const { tema } = temaHafizasiKullan();
  const acikMi = tema === 'acik';

  const [dahaFazlaGoster, setDahaFazlaGoster] = useState(false);
  const gorunenKategoriler = useMemo(() => {
    let liste = kategoriler.filter(k => k.id !== 'hepsi' && k.ad !== 'Tümü');
    if (aktifFiltreler.aramaMetni?.trim()) {
      const aranan = aktifFiltreler.aramaMetni.toLocaleLowerCase('tr-TR');
      liste = liste.filter(k => k.ad.toLocaleLowerCase('tr-TR').includes(aranan));
    }
    return dahaFazlaGoster ? liste : liste.slice(0, 6);
  }, [kategoriler, aktifFiltreler.aramaMetni, dahaFazlaGoster]);

  const seciliKategori = aktifFiltreler.kategori || 'Tümü';
  const seciliSiralama = aktifFiltreler.siralama || 'varsayilan';
  const seciliMinPuan = aktifFiltreler.minPuan;

  const siralamaSec = (deger: 'varsayilan' | 'puan_azalan' | 'fiyat_artan' | 'fiyat_azalan') => {
    filtreleriGuncelle({ siralama: deger });
  };

  const kategoriSec = (katAd: string) => {
    if (seciliKategori === katAd) {
      filtreleriGuncelle({ kategori: 'Tümü' });
    } else {
      filtreleriGuncelle({ kategori: katAd });
    }
  };

  const superMutfakDegistir = () => {
    filtreleriGuncelle({ minPuan: seciliMinPuan === 4.5 ? undefined : 4.5 });
  };

  return (
    <aside 
      aria-label="Sağ Filtreleme ve Duyuru Alanı"
      className="w-full max-w-[320px] shrink-0 space-y-4 pb-6 max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar"
    >
      {/* 1. KARE REKLAM / DUYURU ALANI (QR'sız, Yönetim Panelinden Ayarlanabilir) */}
      <KareReklamKutusu />

      {/* FİLTRELEME PANELİ (Yemeksepeti Akış Modeli) */}
      <div
        className={`w-full rounded-2xl border p-4 shadow-lg transition-all duration-200 ${
          acikMi
            ? 'bg-white border-amber-200/80 shadow-amber-900/5 text-gray-900'
            : 'bg-[#200A25] border-purple-900/60 shadow-purple-950/40 text-white'
        }`}
      >
        {/* Panel Başlığı ve Sıfırla Butonu */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/20 dark:border-purple-900/40 mb-3.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span className="font-black text-sm tracking-wide">Filtrele</span>
            {aktifFiltreSayisi > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-purple-950 font-black text-[10px] flex items-center justify-center">
                {aktifFiltreSayisi}
              </span>
            )}
          </div>

          {aktifFiltreSayisi > 0 && (
            <button
              type="button"
              onClick={tumFiltreleriTemizle}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        {/* 1. BÖLÜM: SIRALAMA (Radyo Butonları) */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-300 dark:text-purple-300/80 block">
            Sıralama
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'varsayilan', etiket: 'Önerilen (Varsayılan)' },
              { id: 'puan_azalan', etiket: 'Restoran / Mutfak Puanı' },
              { id: 'fiyat_artan', etiket: 'Fiyat: Düşükten Yükseğe' },
              { id: 'fiyat_azalan', etiket: 'Fiyat: Yüksekten Düşüğe' },
            ].map((sir) => {
              const secili = seciliSiralama === sir.id;
              return (
                <button
                  key={sir.id}
                  type="button"
                  onClick={() => siralamaSec(sir.id as any)}
                  className={`w-full flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    secili
                      ? acikMi 
                        ? 'bg-amber-100/80 text-amber-950 font-black' 
                        : 'bg-purple-900/50 text-amber-300 font-black'
                      : acikMi 
                        ? 'hover:bg-gray-100 text-gray-700' 
                        : 'hover:bg-purple-950/40 text-gray-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      secili
                        ? 'border-amber-500 bg-amber-500'
                        : acikMi
                          ? 'border-gray-300 bg-white'
                          : 'border-purple-800 bg-transparent'
                    }`}
                  >
                    {secili && <span className="w-1.5 h-1.5 rounded-full bg-purple-950" />}
                  </span>
                  <span className="truncate">{sir.etiket}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BÖLÜM: HIZLI FİLTRELER (Pill / Rozet) */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-300 dark:text-purple-300/80 block">
            Hızlı Filtreler
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={superMutfakDegistir}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                seciliMinPuan === 4.5
                  ? 'bg-amber-500 text-purple-950 border-amber-400 shadow-sm'
                  : acikMi
                    ? 'bg-gray-100 text-gray-700 border-gray-200 hover:border-amber-400'
                    : 'bg-[#150718] text-gray-300 border-purple-900/60 hover:border-amber-500/50'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.5+ Süper Mutfaklar</span>
            </button>
          </div>
        </div>

        {/* 3. BÖLÜM: MUTFAK & KATEGORİ (Arama + Checkbox Listesi) */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-purple-300 dark:text-purple-300/80 block">
            Mutfak & Lezzet
          </label>

          {/* Mutfak Arama Kutusu */}
          <div
            className={`w-full h-8 px-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-colors ${
              acikMi
                ? 'bg-gray-50 border-gray-200 focus-within:border-amber-500 text-gray-900'
                : 'bg-[#150718] border-purple-900/60 focus-within:border-amber-400 text-white'
            }`}
          >
            <Search className="w-3 h-3 text-purple-400 shrink-0" />
            <input
              type="text"
              value={aktifFiltreler.aramaMetni || ''}
              onChange={(e) => filtreleriGuncelle({ aramaMetni: e.target.value })}
              placeholder="Mutfak veya yemek arayın..."
              className="w-full bg-transparent text-xs focus:outline-none placeholder-purple-300/40"
            />
          </div>

          {/* Kategori Listesi */}
          <div className="space-y-1 pt-1">
            {/* Tümü Seçeneği */}
            <button
              type="button"
              onClick={() => filtreleriGuncelle({ kategori: 'Tümü' })}
              className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                seciliKategori === 'Tümü'
                  ? acikMi ? 'bg-amber-100 text-amber-950 font-black' : 'bg-purple-900/50 text-amber-300 font-black'
                  : acikMi ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-purple-950/40 text-gray-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  seciliKategori === 'Tümü'
                    ? 'border-amber-500 bg-amber-500 text-purple-950'
                    : acikMi ? 'border-gray-300 bg-white' : 'border-purple-800 bg-transparent'
                }`}
              >
                {seciliKategori === 'Tümü' && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>Tüm Ev Lezzetleri</span>
            </button>

            {/* Dinamik Kategoriler */}
            {gorunenKategoriler.map((kat) => {
              const secili = seciliKategori === kat.ad;
              return (
                <button
                  key={kat.id}
                  type="button"
                  onClick={() => kategoriSec(kat.ad)}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    secili
                      ? acikMi ? 'bg-amber-100 text-amber-950 font-black' : 'bg-purple-900/50 text-amber-300 font-black'
                      : acikMi ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-purple-950/40 text-gray-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      secili
                        ? 'border-amber-500 bg-amber-500 text-purple-950'
                        : acikMi ? 'border-gray-300 bg-white' : 'border-purple-800 bg-transparent'
                    }`}
                  >
                    {secili && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="truncate">{kat.ad}</span>
                </button>
              );
            })}
          </div>

          {/* Daha Fazla Göster Butonu */}
          {!aktifFiltreler.aramaMetni && kategoriler.length > 7 && (
            <button
              type="button"
              onClick={() => setDahaFazlaGoster(!dahaFazlaGoster)}
              className="w-full pt-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>{dahaFazlaGoster ? 'Daha az göster' : 'Daha fazla göster'}</span>
              {dahaFazlaGoster ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
