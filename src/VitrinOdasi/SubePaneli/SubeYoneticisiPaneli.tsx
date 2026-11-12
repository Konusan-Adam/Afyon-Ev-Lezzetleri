import React, { useState, useEffect } from 'react';
import { Store, LogOut, Package, ShoppingBag, ShieldAlert, TrendingUp } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { gelAlSubeleriGetir } from '@/src/MalzemeCekmeceleri/gelAlSubeleriGetir';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';
import { subeSiparisleriniCanliDinle } from '@/src/MalzemeCekmeceleri/Sube/subeSiparisServisi';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { SubeBilgiKarti } from './SubeBilgiKarti';
import { SubeStokYonetimi } from './SubeStokYonetimi';
import { SubeSiparisYonetimi } from './SubeSiparisYonetimi';
import { SubeTedarikVeKazanc } from './SubeTedarikVeKazanc';

import { SubeZilButonu } from './SubeZilButonu';
import { subeSiparisZiliCal } from '@/src/MalzemeCekmeceleri/Sube/subeZilServisi';
import { subeVitriniAc } from '@/src/MalzemeCekmeceleri/Sube/subeVitrinYonlendirici';

export const SubeYoneticisiPaneli: React.FC = () => {
  const { aktifKullanici, cikisYap, panelDegistir } = kullaniciHafizasiKullan();
  const { subeler, subeGuncelle } = gelAlSubeleriGetir();
  const { urunler } = useSubeUrunleri();
  const [siparisler, setSiparisler] = useState<SubeSiparisi[]>([]);
  const [aktifSekme, setAktifSekme] = useState<'stoklar' | 'siparisler' | 'tedarik_kazanc'>('tedarik_kazanc');
  const oncekiSayiRef = React.useRef<number | null>(null);

  const atananSubeId = aktifKullanici?.sube_id || 'sube-1';
  const aktifSube = subeler.find((s) => s.id === atananSubeId || s.kimlik === atananSubeId) || subeler[0];

  useEffect(() => {
    if (!aktifSube?.id) return;
    const durdur = subeSiparisleriniCanliDinle(aktifSube.id, (liste) => {
      if (oncekiSayiRef.current !== null && liste.length > oncekiSayiRef.current) {
        subeSiparisZiliCal();
      }
      oncekiSayiRef.current = liste.length;
      setSiparisler(liste);
    });
    return () => durdur();
  }, [aktifSube?.id]);

  const canliYayinToggle = async () => {
    if (!aktifSube || !aktifSube.id) return;
    const yeniDurum = !aktifSube.canli_yayin_aktif_mi;
    await subeGuncelle(aktifSube.id, { canli_yayin_aktif_mi: yeniDurum });
  };

  if (!aktifKullanici || (aktifKullanici.rol !== 'sube_admin' && aktifKullanici.rol !== 'yonetici')) {
    return (
      <div className="min-h-screen bg-[#180A1F] text-white flex items-center justify-center p-4">
        <div className="bg-[#220E29] border border-rose-500/50 rounded-2xl p-6 text-center max-w-md space-y-4 shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Yetkisiz Erişim</h2>
          <p className="text-xs text-stone-300">Bu panele yalnızca yetkili Şube Müdürleri (`sube_admin`) erişebilir. Lütfen giriş yapınız.</p>
          <button
            onClick={() => panelDegistir('vitrin')}
            className="w-full py-3 bg-[#6D237A] hover:bg-[#521E5C] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Müşteri Vitrinine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#180A1F] text-white flex flex-col">
      <header className="bg-[#220E29] border-b border-[#3E1646] px-3 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#6D237A] flex items-center justify-center text-[#DDAF53] font-bold text-xs sm:text-base shadow-md shrink-0">
            ŞM
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xs sm:text-sm text-white truncate">
              {aktifSube?.ad || 'Şube Yönetim Paneli'}
            </h1>
            <p className="text-[10px] sm:text-xs text-[#A872B5] truncate">
              Müdür: <strong className="text-white">{aktifKullanici.ad_soyad}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <SubeZilButonu />
          <button
            type="button"
            onClick={() => subeVitriniAc(atananSubeId)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#DDAF53] text-xs font-bold border border-amber-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Şubemin Vitrinini Müşteri Gözüyle Gör"
          >
            <Store className="w-3.5 h-3.5 text-[#DDAF53]" />
            <span className="hidden md:inline">Şube Vitrinini Gör</span>
          </button>
          <button
            type="button"
            onClick={() => {
              cikisYap();
              panelDegistir('vitrin');
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/50 transition-colors cursor-pointer flex items-center gap-1"
            title="Güvenli Çıkış Yap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {aktifSube && (
          <SubeBilgiKarti 
            sube={aktifSube} 
            onCanliYayinToggle={canliYayinToggle} 
            onKapakGuncelle={async (yeniUrl) => {
              if (aktifSube.id) {
                await subeGuncelle(aktifSube.id, { gorsel: yeniUrl });
              }
            }}
          />
        )}

        {/* Sekme Seçici - Mobilde 3 eşit sütun, masaüstünde esnek */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 p-1.5 bg-[#220E29] border border-[#521E5C] rounded-2xl w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setAktifSekme('tedarik_kazanc')}
            className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer text-center ${
              aktifSekme === 'tedarik_kazanc'
                ? 'bg-[#6D237A] text-white shadow-md border border-[#9633A7]'
                : 'text-[#A872B5] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#DDAF53]" />
            <span className="text-[10px] sm:text-xs">Kazanç & Tedarik</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifSekme('stoklar')}
            className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer text-center ${
              aktifSekme === 'stoklar'
                ? 'bg-[#6D237A] text-white shadow-md border border-[#9633A7]'
                : 'text-[#A872B5] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 text-[#DDAF53]" />
            <span className="text-[10px] sm:text-xs">Tezgah Stokları</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifSekme('siparisler')}
            className={`px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer text-center ${
              aktifSekme === 'siparisler'
                ? 'bg-[#6D237A] text-white shadow-md border border-[#9633A7]'
                : 'text-[#A872B5] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#DDAF53]" />
            <span className="text-[10px] sm:text-xs">
              Siparişler {siparisler.length > 0 && `(${siparisler.length})`}
            </span>
          </button>
        </div>

        {/* Aktif Sekme Görünümü */}
        {aktifSekme === 'tedarik_kazanc' && aktifSube && (
          <SubeTedarikVeKazanc
            subeId={aktifSube.id || 'sube-1'}
            subeAdi={aktifSube.ad}
            urunler={urunler}
            siparisler={siparisler}
            onYenile={() => {}}
          />
        )}

        {aktifSekme === 'stoklar' && aktifSube && (
          <SubeStokYonetimi subeId={aktifSube.id || 'sube-1'} urunler={urunler} onStokGuncellendi={() => {}} />
        )}

        {aktifSekme === 'siparisler' && aktifSube && (
          <SubeSiparisYonetimi subeId={aktifSube.id || 'sube-1'} />
        )}
      </main>
    </div>
  );
};

