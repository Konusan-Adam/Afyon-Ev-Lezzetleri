import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ShieldCheck, UserCircle, ChefHat, Bike, ChevronDown, Store } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { aktifMisafirSiparisSayisiGetir } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { subeVitriniAc } from '@/src/MalzemeCekmeceleri/Sube/subeVitrinYonlendirici';

interface UstBarProfilMenusuProps {
  tema?: 'koyu' | 'acik';
}

export const UstBarProfilMenusu: React.FC<UstBarProfilMenusuProps> = ({ tema = 'koyu' }) => {
  const { aktifKullanici, pencereAc, panelDegistir, cikisYap } = kullaniciHafizasiKullan();
  const [acik, setAcik] = useState(false);
  const [aktifSiparisSayisi, setAktifSiparisSayisi] = useState<number>(aktifMisafirSiparisSayisiGetir());
  const ref = useRef<HTMLDivElement>(null);
  const acikMi = tema === 'acik';

  useEffect(() => {
    const siparisGuncelle = () => {
      setAktifSiparisSayisi(aktifMisafirSiparisSayisiGetir());
    };
    window.addEventListener('afyon_siparis_durum_degisti', siparisGuncelle);
    window.addEventListener('afyon_siparis_eklendi', siparisGuncelle);
    window.addEventListener('storage', siparisGuncelle);

    return () => {
      window.removeEventListener('afyon_siparis_durum_degisti', siparisGuncelle);
      window.removeEventListener('afyon_siparis_eklendi', siparisGuncelle);
      window.removeEventListener('storage', siparisGuncelle);
    };
  }, []);

  useEffect(() => {
    const disariTiklandi = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAcik(false);
      }
    };
    document.addEventListener('mousedown', disariTiklandi);
    return () => document.removeEventListener('mousedown', disariTiklandi);
  }, []);

  if (!aktifKullanici) {
    return (
      <div className="flex items-center gap-2">
        {aktifSiparisSayisi > 0 && (
          <button
            type="button"
            onClick={() => panelDegistir('musteri')}
            className={`h-10 px-3.5 rounded-xl border flex items-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              acikMi
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
            }`}
            title="Misafir Sipariş Takibi"
          >
            <Bike className="w-4 h-4 text-amber-400 stroke-[2.2]" />
            <span className="text-xs font-bold">Siparişlerim</span>
            <span className="bg-amber-400 text-purple-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
              {aktifSiparisSayisi}
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => pencereAc()}
          className="h-10 px-4 rounded-xl bg-[#6D237A] hover:bg-[#852C94] text-white text-xs font-bold flex items-center gap-2 border border-[#9633A7] shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <User className="w-3.5 h-3.5 text-white" />
          <span>Giriş Yap</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className={`h-10 px-3 rounded-xl border flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
          acikMi
            ? 'bg-white hover:bg-amber-50 border-amber-200 text-gray-900'
            : 'bg-[#230C28] hover:bg-[#35123E] border-purple-900/60 text-white'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-purple-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          {aktifKullanici.ad_soyad.charAt(0)}
        </div>
        <span className="text-xs font-bold max-w-[90px] truncate">
          {aktifKullanici.ad_soyad.split(' ')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-purple-300 shrink-0" />
      </button>

      {acik && (
        <div
          className={`absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl p-2.5 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 border ${
            acikMi
              ? 'bg-[#FAF4EB] border-amber-200 text-gray-900'
              : 'bg-[#180A1F] border-[#521E5C] text-white'
          }`}
        >
          <div
            className={`p-2 rounded-xl text-xs border ${
              acikMi
                ? 'bg-white border-amber-200'
                : 'bg-[#250D2D] border-purple-900/40'
            }`}
          >
            <div className="font-bold truncate">{aktifKullanici.ad_soyad}</div>
            <div className={`text-[10px] truncate ${acikMi ? 'text-gray-500' : 'text-purple-300'}`}>
              {aktifKullanici.telefon}
            </div>
          </div>

          {aktifKullanici.rol === 'sube_admin' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  panelDegistir('sube');
                  setAcik(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#6D237A] hover:bg-[#852C94] text-white shadow-sm border border-[#9633A7] cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#DDAF53]" />
                <span className="text-[#DDAF53]">Şube Yönetim Paneli</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  subeVitriniAc(aktifKullanici.sube_id);
                  setAcik(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  acikMi ? 'hover:bg-amber-100 text-amber-800' : 'hover:bg-[#2B0E33] text-[#DDAF53]'
                }`}
              >
                <Store className="w-4 h-4 text-[#DDAF53]" />
                <span>Şubemin Vitrinini Gör</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                panelDegistir('musteri');
                setAcik(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                acikMi ? 'hover:bg-amber-100 text-gray-800' : 'hover:bg-[#2B0E33] text-gray-200'
              }`}
            >
              <UserCircle className="w-4 h-4 text-blue-400" />
              <span>Siparişlerim & Profilim</span>
            </button>
          )}

          <div className={`pt-1 border-t ${acikMi ? 'border-amber-200' : 'border-purple-900/40'}`}>
            <button
              type="button"
              onClick={() => {
                cikisYap();
                panelDegistir('vitrin');
                setAcik(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
