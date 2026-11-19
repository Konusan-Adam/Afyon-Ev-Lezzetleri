import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, ShoppingBag, Clock, Store, Layers, Check, Ban } from 'lucide-react';
import { CokluMenuTipi } from '@/src/veritabani/VeriTipleri';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { gorselUrlGuvenliYap } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';
import { CokluMenuKalemSatiri } from './CokluMenuKalemSatiri';
import { mutfakMolaDurumuGetir } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';

interface CokluMenuDetayModaliProps {
  menu: CokluMenuTipi;
  onKapat: () => void;
}

export const CokluMenuDetayModali: React.FC<CokluMenuDetayModaliProps> = ({ menu, onKapat }) => {
  const { sepeteEkle, mutfaklarListesi } = sepetHafizasiKullan();
  const [secilenAdet, setSecilenAdet] = useState(1);
  const [kalemNotlari, setKalemNotlari] = useState<Record<string, string>>({});
  const [ekleniyor, setEkleniyor] = useState(false);
  const [eklendi, setEklendi] = useState(false);

  const bagliMutfak = mutfaklarListesi.find(
    (m) => m.id === menu.mutfak_id || m.kimlik === menu.mutfak_id
  );
  const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak);

  const siraliKalemler = useMemo(() => {
    return [...(menu.kalemler || [])].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
  }, [menu.kalemler]);

  const etkinFiyat = useMemo(() => {
    if (Number(menu.fiyat) > 0) return Number(menu.fiyat);
    return siraliKalemler.reduce((t, k) => t + (Number(k.fiyat) || 0), 0);
  }, [menu.fiyat, siraliKalemler]);

  const notDegistir = (kalemId: string, yeniNot: string) => {
    setKalemNotlari((onceki) => ({ ...onceki, [kalemId]: yeniNot }));
  };

  const sepeteAktar = async () => {
    if (ekleniyor || molaBilgisi.siparisEngelliMi) return;
    setEkleniyor(true);

    const secilenOgeler = siraliKalemler.map((k) => {
      const musteriNotu = (kalemNotlari[k.id] || '').trim();
      return {
        id: k.id,
        baslik: musteriNotu ? `${k.ad} [Not: ${musteriNotu}]` : k.ad,
        ...(musteriNotu ? { not: musteriNotu } : {}),
      };
    });

    const varyasyonMetni = siraliKalemler
      .map((k) => {
        const musteriNotu = (kalemNotlari[k.id] || '').trim();
        return musteriNotu ? `${k.ad} (${musteriNotu})` : k.ad;
      })
      .join(', ');

    const ilkGorsel =
      gorselUrlGuvenliYap(
        siraliKalemler.find((k) => k.gorsel_url?.trim())?.gorsel_url || menu.kapak_gorselleri?.[0]
      ) || '/marka_logosu.jpg';

    await sepeteEkle(menu.mutfak_id, menu.id, secilenAdet, etkinFiyat, {
      coklu_menu_mu: true,
      coklu_menu_baslik: `${menu.baslik} (${siraliKalemler.length} Çeşit)`,
      coklu_menu_gorsel: ilkGorsel,
      secilen_ogeler: secilenOgeler,
      varyasyon: varyasyonMetni,
    });

    setEkleniyor(false);
    setEklendi(true);
    setTimeout(() => {
      onKapat();
    }, 600);
  };

  const modalIcerigi = (
    <div
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 select-none"
      onClick={onKapat}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl bg-[#180A1F] border-t sm:border border-[#521E5C] rounded-t-3xl sm:rounded-3xl text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        <div className="p-4 sm:p-5 border-b border-purple-900/50 bg-[#220B2B] flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-amber-500 text-[#1A0A1D] text-[10px] font-black px-2 py-0.5 rounded-md">
                <Layers className="w-3 h-3" />
                {siraliKalemler.length} Çeşit Paket
              </span>
              {menu.mutfak_adi && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                  <Store className="w-3 h-3" />
                  {menu.mutfak_adi}
                </span>
              )}
              {menu.hazirlanma_suresi && (
                <span className="inline-flex items-center gap-1 text-[11px] text-purple-300">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {menu.hazirlanma_suresi}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {menu.baslik}
            </h2>
            {menu.aciklama && (
              <p className="text-xs text-purple-200/80 leading-relaxed">{menu.aciklama}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-[#2D1233] hover:bg-[#4D1857] text-purple-200 hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {molaBilgisi.siparisEngelliMi && (
            <div className="bg-amber-950/70 border border-amber-500/60 p-3 rounded-xl flex items-center gap-2.5 text-amber-200 text-xs font-semibold">
              <Ban className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{molaBilgisi.uyariMetni}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-purple-300/80 px-1">
            <span className="font-bold text-amber-300">Paket İçeriği ({siraliKalemler.length} Yemek)</span>
            <span>İstediğiniz yemeğe not ekleyebilirsiniz</span>
          </div>

          {siraliKalemler.map((kalem, idx) => (
            <CokluMenuKalemSatiri
              key={kalem.id}
              kalem={kalem}
              siraNumarasi={idx + 1}
              notDegeri={kalemNotlari[kalem.id] || ''}
              onNotDegistir={notDegistir}
            />
          ))}
        </div>

        <div className="p-4 border-t border-purple-900/50 bg-[#1C0922] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center bg-[#120415] border border-purple-800/60 rounded-xl overflow-hidden">
            <button
              type="button"
              disabled={molaBilgisi.siparisEngelliMi || secilenAdet <= 1}
              onClick={() => setSecilenAdet((a) => Math.max(1, a - 1))}
              className="w-9 h-9 flex items-center justify-center text-amber-400 hover:bg-purple-900/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Adet Azalt"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-sm text-white">{secilenAdet}</span>
            <button
              type="button"
              disabled={molaBilgisi.siparisEngelliMi}
              onClick={() => setSecilenAdet((a) => a + 1)}
              className="w-9 h-9 flex items-center justify-center text-amber-400 hover:bg-purple-900/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Adet Artır"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            disabled={ekleniyor || eklendi || molaBilgisi.siparisEngelliMi}
            onClick={sepeteAktar}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              molaBilgisi.siparisEngelliMi
                ? 'bg-stone-800 text-stone-400 border border-stone-700 cursor-not-allowed'
                : eklendi
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-[#1A0A1D] active:scale-[0.99] cursor-pointer'
            }`}
          >
            {molaBilgisi.siparisEngelliMi ? (
              <>
                <Ban className="w-4 h-4" />
                <span>{molaBilgisi.moladaMi ? 'Mutfak Molada' : 'Mutfak Kapalı'}</span>
              </>
            ) : eklendi ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Sepete Eklendi!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {ekleniyor
                    ? 'Ekleniyor...'
                    : `Sepete Ekle • ${etkinFiyat * secilenAdet} ₺`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modalIcerigi;
  return createPortal(modalIcerigi, document.body);
};
