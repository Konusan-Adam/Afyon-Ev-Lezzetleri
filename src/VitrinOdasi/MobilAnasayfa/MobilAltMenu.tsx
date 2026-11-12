import React, { useState, useEffect, useRef } from 'react';
import { Compass, ShoppingBag, User, UserCheck, LogOut, ArrowRight, X, Bike, Store, Building2, ChefHat, Heart } from 'lucide-react';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { aktifMisafirSiparisSayisiGetir } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { subeVitriniAc } from '@/src/MalzemeCekmeceleri/Sube/subeVitrinYonlendirici';
import { MobilKesfetPenceresi } from './MobilKesfetPenceresi';

interface MobilAltMenuOzellikleri {
  anasayfayaDon?: () => void;
  subelerTiklandi?: () => void;
  mutfaklarTiklandi?: () => void;
  aktifSekme?: 'kesfet' | 'subeler' | 'mutfaklar' | 'sepet' | 'hesap';
}

export const MobilAltMenu: React.FC<MobilAltMenuOzellikleri> = ({
  anasayfayaDon,
  subelerTiklandi,
  mutfaklarTiklandi,
  aktifSekme = 'kesfet',
}) => {
  const { toplamUrunSayisi, sepetPaneliAc } = sepetHafizasiKullan();
  const { aktifKullanici, pencereAc, panelDegistir, cikisYap } = kullaniciHafizasiKullan();
  const { } = aramaVeFiltreKullan();

  const [gorunur, setGorunur] = useState<boolean>(true);
  const [kesfetAcik, setKesfetAcik] = useState<boolean>(false);
  const [hesapMenusuAcik, setHesapMenusuAcik] = useState<boolean>(false);
  const [aktifSiparisSayisi, setAktifSiparisSayisi] = useState<number>(aktifMisafirSiparisSayisiGetir());
  const sonKaydirmaYRef = useRef<number>(0);

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
    const kaydirmaKontrol = () => {
      const simdikiY = window.scrollY;
      const fark = simdikiY - sonKaydirmaYRef.current;

      if (simdikiY < 30) {
        setGorunur(true);
      } else if (fark > 8) {
        setGorunur(false);
      } else if (fark < -8) {
        setGorunur(true);
      }

      sonKaydirmaYRef.current = simdikiY;
    };

    window.addEventListener('scroll', kaydirmaKontrol, { passive: true });
    return () => window.removeEventListener('scroll', kaydirmaKontrol);
  }, []);

  const kesfetTiklandi = () => {
    setKesfetAcik(true);
    if (anasayfayaDon) {
      anasayfayaDon();
    }
  };

  const subelerSekmesiTiklandi = () => {
    setKesfetAcik(false);
    if (subelerTiklandi) {
      subelerTiklandi();
    }
  };

  const mutfaklarSekmesiTiklandi = () => {
    setKesfetAcik(false);
    if (mutfaklarTiklandi) {
      mutfaklarTiklandi();
    }
  };

  const siparislerimTiklandi = () => {
    panelDegistir('musteri');
  };

  const hesapTiklandi = () => {
    if (!aktifKullanici) {
      pencereAc();
      return;
    }
    setHesapMenusuAcik(true);
  };

  const paneleGit = () => {
    setHesapMenusuAcik(false);
    if (aktifKullanici?.rol === 'sube_admin') {
      panelDegistir('sube');
    } else if (aktifKullanici?.rol === 'yonetici') {
      panelDegistir('patron');
    } else if (aktifKullanici?.rol === 'asci' || aktifKullanici?.rol === 'ev_mutfagi') {
      panelDegistir('mutfak');
    } else if (aktifKullanici?.rol === 'kurye') {
      panelDegistir('kurye');
    } else {
      panelDegistir('musteri');
    }
  };

  const guvenliCikisYap = () => {
    setHesapMenusuAcik(false);
    cikisYap();
    panelDegistir('vitrin');
  };

  return (
    <>
      <nav
        aria-label="Mobil Alt Gezinti Menüsü"
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#180A1F]/95 backdrop-blur-md border-t border-purple-900/40 px-6 py-2 shadow-2xl flex items-center justify-around transition-transform duration-300 ease-in-out ${
          gorunur ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        {/* 1. Keşfet Butonu */}
        <button
          type="button"
          onClick={kesfetTiklandi}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1 px-2.5 ${
            aktifSekme === 'kesfet' ? 'text-amber-400 font-bold' : 'text-purple-200 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-wide">Keşfet</span>
        </button>

        {/* 2. Şubeler Butonu */}
        <button
          type="button"
          onClick={subelerSekmesiTiklandi}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1 px-2.5 ${
            aktifSekme === 'subeler' ? 'text-amber-400 font-bold' : 'text-purple-200 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-wide">Şubeler</span>
        </button>

        {/* 3. Mutfaklar Butonu */}
        <button
          type="button"
          onClick={mutfaklarSekmesiTiklandi}
          className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1 px-2.5 ${
            aktifSekme === 'mutfaklar' ? 'text-amber-400 font-bold' : 'text-purple-200 hover:text-white'
          }`}
        >
          <ChefHat className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-wide">Mutfaklar</span>
        </button>

        {/* 3. Sepet Butonu */}
        <button
          type="button"
          onClick={sepetPaneliAc}
          className="relative flex flex-col items-center justify-center gap-1 text-purple-200 hover:text-white transition-colors cursor-pointer py-1 px-3"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {toplamUrunSayisi > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-amber-400 text-[#180A1F] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {toplamUrunSayisi > 99 ? '99+' : toplamUrunSayisi}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Sepetim</span>
        </button>

        {/* 3. Siparişlerim Butonu (Sadece misafirken ve aktif sipariş varsa görünür) */}
        {!aktifKullanici && aktifSiparisSayisi > 0 && (
          <button
            type="button"
            onClick={siparislerimTiklandi}
            className="flex flex-col items-center justify-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer py-1 px-3"
          >
            <div className="relative">
              <Bike className="w-5 h-5 stroke-[2.2] animate-bounce" />
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-[#180A1F] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {aktifSiparisSayisi}
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-wide">Siparişlerim</span>
          </button>
        )}

        {/* 4. Kullanıcı / Şube Paneli Butonu */}
        <button
          type="button"
          onClick={hesapTiklandi}
          className="flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer py-1 px-3"
        >
          {aktifKullanici ? (
            aktifKullanici.rol === 'sube_admin' ? (
              <>
                <Store className="w-5 h-5 text-[#DDAF53] stroke-[2.2]" />
                <span className="text-[10px] font-bold text-[#DDAF53] tracking-wide truncate max-w-[65px]">
                  Şube Paneli
                </span>
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
                <span className="text-[10px] font-semibold text-emerald-400 tracking-wide truncate max-w-[65px]">
                  {aktifKullanici.ad_soyad.split(' ')[0]}
                </span>
              </>
            )
          ) : (
            <>
              <User className="w-5 h-5 stroke-[2] text-purple-200" />
              <span className="text-[10px] font-semibold text-purple-200 tracking-wide">Giriş Yap</span>
            </>
          )}
        </button>
      </nav>

      {/* 📱 HESAP ÇEKMECESİ */}
      {hesapMenusuAcik && aktifKullanici && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1C0A23] border border-purple-800/60 rounded-3xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-800 flex items-center justify-center text-white shadow-md">
                  {aktifKullanici.rol === 'sube_admin' ? (
                    <Store className="w-5 h-5 text-amber-300" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-emerald-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">{aktifKullanici.ad_soyad}</h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[11px] text-purple-300">{aktifKullanici.telefon}</span>
                    {aktifKullanici.rol === 'sube_admin' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-[#DDAF53] font-bold border border-amber-500/40">
                        Şube Müdürü
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHesapMenusuAcik(false)}
                className="p-1.5 rounded-xl bg-purple-950/60 text-purple-300 hover:text-white border border-purple-800/40 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {aktifKullanici.rol === 'sube_admin' ? (
                <>
                  <button
                    type="button"
                    onClick={paneleGit}
                    className="w-full py-3 px-4 rounded-2xl bg-[#6D237A] hover:bg-[#852C94] text-white font-bold text-xs flex items-center justify-between border border-[#9633A7] shadow-lg cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#DDAF53]" />
                      <span className="text-[#DDAF53]">Şube Yönetim Paneli</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHesapMenusuAcik(false);
                      subeVitriniAc(aktifKullanici?.sube_id);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-[#DDAF53] font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/40 cursor-pointer transition-all"
                  >
                    <Store className="w-4 h-4 text-[#DDAF53]" />
                    <span>Şubemin Vitrinini Gör (Müşteri Gözüyle)</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={paneleGit}
                    className="w-full py-3 px-4 rounded-2xl bg-[#6D237A] hover:bg-[#852C94] text-white font-bold text-xs flex items-center justify-between border border-[#9633A7] shadow-lg cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-300" />
                      <span>Siparişlerim & Profilim</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setHesapMenusuAcik(false);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('afyon_musteri_paneli_sekme', 'favoriler');
                      }
                      panelDegistir('musteri');
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#2A0E32] hover:bg-[#3D1448] text-white font-bold text-xs flex items-center justify-between border border-purple-800/60 shadow-md cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Favori Lezzetlerim</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={guvenliCikisYap}
                className="w-full py-2.5 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-900/50 cursor-pointer transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Güvenli Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {kesfetAcik && <MobilKesfetPenceresi acik={kesfetAcik} kapat={() => setKesfetAcik(false)} />}
    </>
  );
};
