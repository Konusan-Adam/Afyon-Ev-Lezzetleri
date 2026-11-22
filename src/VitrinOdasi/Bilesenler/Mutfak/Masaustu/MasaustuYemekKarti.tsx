import React, { useState } from 'react';
import { Plus, Check, Star, AlertTriangle, Flame, Ban } from 'lucide-react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { mutfakMolaDurumuGetir, yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';

export const MasaustuYemekKarti: React.FC<{ yemek: Yemek }> = ({ yemek }) => {
  const { sepeteEkle, sepetElemanlari, adetGuncelle, mutfaklarListesi } = sepetHafizasiKullan();
  const [eklendi, setEklendi] = useState(false);

  const anlikDakika = useCanliDakika();
  const bagliMutfak = mutfaklarListesi.find((m) => m.id === yemek.mutfak_id || m.kimlik === yemek.mutfak_id);
  const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak, anlikDakika);
  const stokBilgisi = yemekStokDurumuHesapla(yemek, bagliMutfak);

  const sepettekiToplamAdet = sepetElemanlari
    .filter((e) => e.yemek_id === yemek.id)
    .reduce((t, e) => t + e.adet, 0);
  const sepetElemani = sepetElemanlari.find((e) => e.yemek_id === yemek.id);

  const stokSinirinaUlasildi =
    stokBilgisi.stokTakibiVarMi &&
    stokBilgisi.kalanStok !== undefined &&
    sepettekiToplamAdet >= stokBilgisi.kalanStok;

  const eklemeEngelli = stokBilgisi.tukendiMi || molaBilgisi.siparisEngelliMi || stokSinirinaUlasildi;

  const gorselSrc = gorselUrlGuvenliYap(yemek.gorsel_url?.trim()) || '/marka_logosu.jpg';
  const [gorselHatali, setGorselHatali] = useState(!yemek.gorsel_url?.trim());

  const ekle = async () => {
    if (eklemeEngelli) return;
    if (sepetElemani) {
      await adetGuncelle(sepetElemani.id, sepetElemani.adet + 1);
    } else {
      await sepeteEkle(yemek.mutfak_id || 'm1', yemek.id, 1, yemek.fiyat);
    }
    setEklendi(true);
    setTimeout(() => setEklendi(false), 900);
  };

  return (
    <article className={`bg-[#240E2A] rounded-2xl p-4 border transition-all duration-300 shadow-md flex gap-4 group justify-between ${
      stokBilgisi.tukendiMi ? 'opacity-70 border-rose-950/40' : 'border-purple-900/40 hover:border-amber-500/50 hover:shadow-xl'
    }`}>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5 min-w-0">
            <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 min-w-0 group-hover:text-amber-300 transition-colors">
              {yemek.baslik}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              {stokBilgisi.sonKalanRozetMetni && (
                <span className="bg-amber-950/90 border border-amber-500/60 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1 whitespace-nowrap">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {stokBilgisi.sonKalanRozetMetni}
                </span>
              )}
              {yemek.populer && !stokBilgisi.sonKalanRozetMetni && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                  Yıldız Lezzet
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-purple-200/70 line-clamp-2 leading-relaxed">
            {yemek.aciklama}
          </p>

          {stokBilgisi.minTutarUyariMetni && (
            <p className="mt-2 text-[10px] leading-snug text-amber-200 bg-amber-950/60 border border-amber-700/50 rounded-lg px-2 py-1 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{stokBilgisi.minTutarUyariMetni}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-purple-900/30 gap-2">
          <div>
            <span className="text-[10px] text-purple-300/70 block -mb-0.5">{stokBilgisi.birim}</span>
            <span className="text-amber-400 font-extrabold text-base">{yemek.fiyat} ₺</span>
          </div>
          <button
            type="button"
            onClick={ekle}
            disabled={eklemeEngelli}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              stokBilgisi.tukendiMi
                ? 'bg-rose-950/60 border border-rose-800 text-rose-300 cursor-not-allowed'
                : molaBilgisi.siparisEngelliMi
                ? 'bg-stone-800/80 border border-stone-700 text-stone-300 cursor-not-allowed'
                : stokSinirinaUlasildi
                ? 'bg-purple-950/80 border border-purple-700 text-purple-300 cursor-not-allowed'
                : eklendi
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-amber-500 hover:bg-amber-400 text-[#1A0A1D] active:scale-95 cursor-pointer'
            }`}
          >
            {molaBilgisi.siparisEngelliMi && !stokBilgisi.tukendiMi ? (
              <>
                <Ban className="w-3.5 h-3.5" />
                <span>{molaBilgisi.moladaMi ? 'Molada' : 'Kapalı'}</span>
              </>
            ) : !stokBilgisi.tukendiMi && !stokSinirinaUlasildi ? (
              eklendi ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />
            ) : null}
            {!(molaBilgisi.siparisEngelliMi && !stokBilgisi.tukendiMi) && (
              <span>
                {stokBilgisi.tukendiMi
                  ? 'Tükendi'
                  : stokSinirinaUlasildi
                  ? `Maks. (${sepettekiToplamAdet})`
                  : eklendi
                  ? 'Eklendi'
                  : sepetElemani
                  ? `+ Ekle (${sepetElemani.adet})`
                  : 'Sepete Ekle'}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-[#290F30] border border-purple-900/40">
        <img
          src={gorselHatali ? '/marka_logosu.jpg' : gorselSrc}
          alt={yemek.baslik}
          className={`w-full h-full ${gorselHatali ? 'object-contain p-1.5' : 'object-cover'} transition-transform duration-500 ${stokBilgisi.tukendiMi ? 'grayscale-40' : 'group-hover:scale-105'}`}
          loading="lazy"
          onError={() => {
            if (!gorselHatali) {
              setGorselHatali(true);
            }
          }}
        />
        <div className="absolute top-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-amber-300 text-[10px] font-bold">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span>{yemek.puan?.toFixed(1) || '4.9'}</span>
        </div>
      </div>
    </article>
  );
};
