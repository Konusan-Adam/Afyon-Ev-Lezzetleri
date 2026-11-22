import React, { useState } from 'react';
import { Plus, Check, Star, Sparkles, AlertTriangle, Ban } from 'lucide-react';
import { Yemek } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { UrunOzellestirmePenceresi, PorsiyonRozeti } from '@/src/VitrinOdasi/Bilesenler';
import { type SecilenUrunKonfigurasyonu } from '@/src/MalzemeCekmeceleri';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { mutfakMolaDurumuGetir, yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';

interface MutfakYemekKartiOzellikleri {
  yemek: Yemek;
}

export const MutfakYemekKarti: React.FC<MutfakYemekKartiOzellikleri> = ({ yemek }) => {
  const { sepeteEkle, sepetElemanlari, mutfaklarListesi } = sepetHafizasiKullan();
  const [eklendiAnimasyonu, setEklendiAnimasyonu] = useState<boolean>(false);
  const [seceneklerAcik, setSeceneklerAcik] = useState<boolean>(false);

  const anlikDakika = useCanliDakika();
  const bagliMutfak = mutfaklarListesi.find((m) => m.id === yemek.mutfak_id || m.kimlik === yemek.mutfak_id);
  const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak, anlikDakika);
  const stokBilgisi = yemekStokDurumuHesapla(yemek, bagliMutfak);

  const sepettekiToplamAdet = sepetElemanlari
    .filter((e) => e.yemek_id === yemek.id)
    .reduce((t, e) => t + e.adet, 0);

  const stokSinirinaUlasildi =
    stokBilgisi.stokTakibiVarMi &&
    stokBilgisi.kalanStok !== undefined &&
    sepettekiToplamAdet >= stokBilgisi.kalanStok;

  const ozelSecenekleriVarMi = Boolean(
    yemek.secenek_gruplari &&
      Array.isArray(yemek.secenek_gruplari) &&
      yemek.secenek_gruplari.length > 0
  );

  const eklemeEngelli = stokBilgisi.tukendiMi || molaBilgisi.siparisEngelliMi || stokSinirinaUlasildi;

  const dogrudanSepeteEkle = async () => {
    if (eklemeEngelli) return;
    await sepeteEkle(yemek.mutfak_id || 'm1', yemek.id, 1, yemek.fiyat);
    setEklendiAnimasyonu(true);
    setTimeout(() => setEklendiAnimasyonu(false), 1200);
  };

  const ozellestirerekSepeteEkle = async (konfig: SecilenUrunKonfigurasyonu) => {
    if (eklemeEngelli) return;
    await sepeteEkle(yemek.mutfak_id || 'm1', yemek.id, konfig.adet, konfig.birim_fiyat);
    setEklendiAnimasyonu(true);
    setTimeout(() => setEklendiAnimasyonu(false), 1200);
  };

  const kartVeyaButonTiklandi = () => {
    if (stokBilgisi.tukendiMi || molaBilgisi.siparisEngelliMi) return;
    if (ozelSecenekleriVarMi) {
      setSeceneklerAcik(true);
    } else if (!stokSinirinaUlasildi) {
      dogrudanSepeteEkle();
    }
  };

  const gorsel = gorselUrlGuvenliYap(yemek.gorsel_url?.trim()) || '/marka_logosu.jpg';

  return (
    <>
      <article
        onClick={kartVeyaButonTiklandi}
        className={`bg-[#240E2A] rounded-2xl border transition-all duration-300 shadow-lg flex flex-col justify-between overflow-hidden h-full ${
          stokBilgisi.tukendiMi || molaBilgisi.siparisEngelliMi
            ? 'opacity-70 border-rose-950/40 cursor-not-allowed'
            : 'border-purple-900/40 hover:border-amber-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/60 cursor-pointer group active:scale-[0.98]'
        }`}
      >
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-purple-950/80">
          <img
            src={gorsel}
            alt={yemek.baslik}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              stokBilgisi.tukendiMi ? 'grayscale-40' : 'group-hover:scale-108'
            }`}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/marka_logosu.jpg';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#240E2A] via-transparent to-black/40 pointer-events-none" />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            <PorsiyonRozeti
              yemekId={yemek.id}
              birim={yemek.birim}
              sinirsizMi={yemek.sinirsiz_stok}
              kalanStok={yemek.kalan_stok}
              stoktaVarMi={yemek.stokta_var_mi}
              tukendiMiProp={yemek.tukendi_mi}
            />
          </div>

          <div className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-md border border-amber-400/40 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-extrabold text-amber-300 shadow-md">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{yemek.puan?.toFixed(1) || '4.9'}</span>
          </div>

          {molaBilgisi.siparisEngelliMi && !stokBilgisi.tukendiMi && (
            <div className="absolute bottom-2.5 left-2.5 bg-rose-950/90 border border-rose-500/60 px-2 py-0.5 rounded-full flex items-center gap-1 text-rose-200 text-[10px] font-bold shadow-md">
              <Ban className="w-3 h-3 text-rose-400 shrink-0" />
              <span>{molaBilgisi.moladaMi ? 'Mutfak Molada' : molaBilgisi.kapaliEtiketi}</span>
            </div>
          )}
        </div>

        <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
          <div>
            <h3 className="text-white text-sm sm:text-base font-extrabold line-clamp-1 group-hover:text-amber-400 transition-colors">
              {yemek.baslik}
            </h3>
            <p className="text-xs text-purple-200/75 line-clamp-2 mt-1 leading-relaxed">
              {yemek.aciklama || 'Anne eliyle taze pişirilmiş meşhur Afyon ev lezzeti.'}
            </p>
            {stokBilgisi.minTutarUyariMetni && (
              <p className="mt-2 text-[10px] leading-snug text-amber-200 bg-amber-950/60 border border-amber-700/50 rounded-lg px-2 py-1 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{stokBilgisi.minTutarUyariMetni}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-purple-900/40">
            <div>
              <span className="text-[10px] text-purple-300/70 block -mb-0.5">{stokBilgisi.birim}</span>
              <span className="text-amber-400 font-black text-base sm:text-lg tracking-tight">
                {yemek.fiyat} ₺
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                kartVeyaButonTiklandi();
              }}
              disabled={eklendiAnimasyonu || eklemeEngelli}
              className={`flex items-center gap-1.5 font-black px-4 py-2 rounded-xl text-xs shadow-md transition-all ${
                stokBilgisi.tukendiMi
                  ? 'bg-rose-950/60 border border-rose-800 text-rose-300 cursor-not-allowed'
                  : molaBilgisi.siparisEngelliMi
                  ? 'bg-stone-800/80 border border-stone-700 text-stone-300 cursor-not-allowed'
                  : stokSinirinaUlasildi
                  ? 'bg-purple-950/80 border border-purple-700 text-purple-300 cursor-not-allowed'
                  : eklendiAnimasyonu
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-gray-950 shadow-amber-500/20 active:scale-95 cursor-pointer'
              }`}
            >
              {stokBilgisi.tukendiMi ? (
                <span>Tükendi</span>
              ) : molaBilgisi.siparisEngelliMi ? (
                <>
                  <Ban className="w-3.5 h-3.5" />
                  <span>{molaBilgisi.moladaMi ? 'Molada' : 'Kapalı'}</span>
                </>
              ) : stokSinirinaUlasildi ? (
                <span>Maks. ({sepettekiToplamAdet})</span>
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
