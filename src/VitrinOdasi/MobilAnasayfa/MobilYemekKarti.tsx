import React, { useState, useEffect } from 'react';
import { Star, Clock, Plus, Sparkles, Check, Flame, CreditCard } from 'lucide-react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { UrunOzellestirmePenceresi } from '../Bilesenler/UrunSecenekleri/UrunOzellestirmePenceresi';
import { SecilenUrunKonfigurasyonu } from '@/src/MalzemeCekmeceleri/UrunSecenekleri/UrunSecenekleriTipleri';
import { PorsiyonRozeti } from '../Bilesenler/OnSiparisVePorsiyon/PorsiyonRozeti';
import { yemekPorsiyonGetir, porsiyonDusur } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonServisi';
import { PorsiyonBilgisi } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/PorsiyonTipleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface YemekKartiOzellikleri {
  yemek: Yemek;
  onSec?: (yemek: Yemek) => void;
}

export const MobilYemekKarti: React.FC<YemekKartiOzellikleri> = ({ yemek, onSec }) => {
  const { sepeteEkle } = sepetHafizasiKullan();
  const [seceneklerAcik, setSeceneklerAcik] = useState<boolean>(false);
  const [eklendiAnimasyonu, setEklendiAnimasyonu] = useState<boolean>(false);
  const [porsiyon, setPorsiyon] = useState<PorsiyonBilgisi>(() => 
    yemekPorsiyonGetir(yemek.id, yemek.gunluk_stok, yemek.birim, yemek.sinirsiz_stok)
  );

  useEffect(() => {
    const porsiyonTakip = () => {
      setPorsiyon(yemekPorsiyonGetir(yemek.id, yemek.gunluk_stok, yemek.birim, yemek.sinirsiz_stok));
    };
    window.addEventListener('afyon_porsiyon_guncellendi', porsiyonTakip);
    return () => window.removeEventListener('afyon_porsiyon_guncellendi', porsiyonTakip);
  }, [yemek.id, yemek.gunluk_stok, yemek.birim, yemek.sinirsiz_stok]);

  // Mutfak bu yemek için özel seçenek tanımlamış mı?
  const ozelSecenekleriVarMi = Boolean(
    yemek.secenek_gruplari && 
    Array.isArray(yemek.secenek_gruplari) && 
    yemek.secenek_gruplari.length > 0
  );

  const dogrudanSepeteEkle = async () => {
    if (porsiyon.tukendiMi) return;
    await sepeteEkle(
      yemek.mutfak_id || '',
      yemek.id,
      1,
      yemek.fiyat
    );
    porsiyonDusur(yemek.id, 1);
    setEklendiAnimasyonu(true);
    setTimeout(() => setEklendiAnimasyonu(false), 1200);
  };

  const ozellestirerekSepeteEkle = async (konfig: SecilenUrunKonfigurasyonu) => {
    if (porsiyon.tukendiMi) return;
    await sepeteEkle(
      yemek.mutfak_id || '',
      yemek.id,
      konfig.adet,
      konfig.birim_fiyat
    );
    porsiyonDusur(yemek.id, konfig.adet);
    setEklendiAnimasyonu(true);
    setTimeout(() => setEklendiAnimasyonu(false), 1200);
  };

  const aksiyonBaslat = () => {
    if (porsiyon.tukendiMi) return;
    if (onSec) {
      onSec(yemek);
      return;
    }
    if (ozelSecenekleriVarMi) {
      setSeceneklerAcik(true);
    } else {
      dogrudanSepeteEkle();
    }
  };

  const gorsel = gorselUrlGuvenliYap(yemek.gorsel_url?.trim()) || '/favicon.png';

  return (
    <>
      <article
        onClick={aksiyonBaslat}
        className={`bg-[#240E2A] rounded-2xl border transition-all duration-300 shadow-lg flex flex-col justify-between overflow-hidden h-full ${
          porsiyon.tukendiMi
            ? 'opacity-70 border-rose-950/40 cursor-not-allowed'
            : 'border-purple-900/40 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/60 cursor-pointer group active:scale-[0.98]'
        }`}
      >
        {/* Üst Kısım: Büyük ve Geniş Sinematik Yemek Görseli */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-purple-950/80">
          <img
            src={gorsel}
            alt={yemek.baslik}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              porsiyon.tukendiMi ? 'grayscale-40' : 'group-hover:scale-108'
            }`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/favicon.png';
            }}
          />

          {/* Karartma Gradyanı */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-black/40 pointer-events-none" />

          {/* Sol Üst: Popülerlik VEYA Kalan Porsiyon Rozeti */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            <PorsiyonRozeti 
              yemekId={yemek.id} 
              birim={yemek.birim} 
              sinirsizMi={yemek.sinirsiz_stok} 
            />

          </div>

          {/* Sağ Üst: Puan Rozeti */}
          <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-md border border-amber-400/40 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-extrabold text-amber-300 shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{yemek.puan?.toFixed(1) || '4.9'}</span>
          </div>


        </div>

        {/* Alt Kısım: Detay Bilgileri & Aksiyon Alanı */}
        <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h4 className="text-white text-sm sm:text-base font-extrabold line-clamp-1 group-hover:text-amber-400 transition-colors">
              {yemek.baslik}
            </h4>
            <p className="text-xs text-purple-200/75 line-clamp-2 mt-1 leading-relaxed">
              {yemek.aciklama || 'Anne eliyle taze pişirilmiş meşhur Afyon ev lezzeti.'}
            </p>
          </div>

          {/* Fiyat ve Sipariş Butonu */}
          <div className="flex items-center justify-between pt-2.5 border-t border-purple-900/40">
            <div>
              <span className="text-[10px] text-purple-300/70 block -mb-0.5">{yemek.birim || 'Porsiyon'}</span>
              <span className="text-amber-400 font-black text-base sm:text-lg tracking-tight">
                {yemek.fiyat} ₺
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                aksiyonBaslat();
              }}
              disabled={eklendiAnimasyonu || porsiyon.tukendiMi}
              className={`flex items-center gap-1.5 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all ${
                porsiyon.tukendiMi
                  ? 'bg-rose-950/60 border border-rose-800 text-rose-300 cursor-not-allowed'
                  : eklendiAnimasyonu
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-gray-950 shadow-amber-500/20 active:scale-95 cursor-pointer'
              }`}
            >
              {porsiyon.tukendiMi ? (
                <span>Tükendi</span>
              ) : eklendiAnimasyonu ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Eklendi</span>
                </>
              ) : ozelSecenekleriVarMi ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Seç & Ekle</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Ekle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Özelleştirme Modalı (Sadece mutfak seçenek tanımlamışsa açılır) */}
      {seceneklerAcik && (
        <UrunOzellestirmePenceresi
          yemek={yemek}
          onKapat={() => setSeceneklerAcik(false)}
          onSepeteEkle={ozellestirerekSepeteEkle}
        />
      )}
    </>
  );
};
