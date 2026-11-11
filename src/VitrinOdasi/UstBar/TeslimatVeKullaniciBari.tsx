import React, { useState, useRef, useEffect } from 'react';
import { 
  Bike, 
  Store, 
  MapPin, 
  ChevronDown, 
  Users, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChefHat, 
  UserCircle,
  LayoutDashboard,
  ShoppingBag
} from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { ortakSepetHafizasiKullan } from '@/src/OrtakHavuz';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { yerelSiparisleriGetir } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { subeVitriniAc } from '@/src/MalzemeCekmeceleri/Sube/subeVitrinYonlendirici';

export interface TeslimatVeKullaniciBariOzellikleri {
  teslimatTipi?: 'teslimat' | 'gel_al';
  teslimatTipiDegistir?: (tip: 'teslimat' | 'gel_al') => void;
  seciliAdresMetni?: string;
  adresSecTiklandi?: () => void;
  ortakSepetTiklandi?: () => void;
  girisKayitTiklandi?: () => void;
}

export const TeslimatVeKullaniciBari: React.FC<TeslimatVeKullaniciBariOzellikleri> = (props) => {
  const teslimatHafizasi = teslimatHafizasiKullan();
  const ortakSepetHafizasi = ortakSepetHafizasiKullan();
  const kullaniciHafizasi = kullaniciHafizasiKullan();
  
  const [profilMenuAcik, setProfilMenuAcik] = useState(false);
  const profilMenuRef = useRef<HTMLDivElement>(null);

  const aktifTeslimatTipi = props.teslimatTipi || teslimatHafizasi.teslimatTipi;
  const teslimatTipiDegistir = props.teslimatTipiDegistir || teslimatHafizasi.teslimatTipiDegistir;
  const adresSecTiklandi = props.adresSecTiklandi || teslimatHafizasi.adresSecimPenceresiAc;
  const ortakSepetTiklandi = props.ortakSepetTiklandi || ortakSepetHafizasi.pencereAc;
  const girisKayitTiklandi = props.girisKayitTiklandi || (() => kullaniciHafizasi.pencereAc());

  // Dışarı tıklayınca profil menüsünü kapat
  useEffect(() => {
    function disinaTiklandi(event: MouseEvent) {
      if (profilMenuRef.current && !profilMenuRef.current.contains(event.target as Node)) {
        setProfilMenuAcik(false);
      }
    }
    document.addEventListener('mousedown', disinaTiklandi);
    return () => document.removeEventListener('mousedown', disinaTiklandi);
  }, []);

  let gorunenAdresMetni = 'Lütfen teslimat adresi seçiniz...';
  if (aktifTeslimatTipi === 'gel_al') {
    gorunenAdresMetni = teslimatHafizasi.seciliGelAlSubesi
      ? `Gel Al: ${teslimatHafizasi.seciliGelAlSubesi.ad}`
      : 'Gel Al Noktası Seçiniz...';
  } else if (props.seciliAdresMetni) {
    gorunenAdresMetni = props.seciliAdresMetni;
  } else if (teslimatHafizasi.seciliAdres) {
    gorunenAdresMetni = `${teslimatHafizasi.seciliAdres.adres_basligi} (${teslimatHafizasi.seciliAdres.ilce}) • ${teslimatHafizasi.seciliAdres.mahalle} ${teslimatHafizasi.seciliAdres.cadde_sokak}`;
  }

  const rolBilgisiGetir = (rol?: string) => {
    switch (rol) {
      case 'yonetici':
        return { metin: 'Süper Admin (Patron)', renk: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
      case 'sube_admin':
        return { metin: 'Şube Müdürü', renk: 'text-[#DDAF53] bg-amber-500/20 border-amber-500/40' };
      case 'ev_mutfagi':
        return { metin: 'Ev Mutfağı & Aşçı', renk: 'text-purple-300 bg-purple-500/20 border-purple-500/40' };
      case 'ticari_restoran':
        return { metin: 'Ticari Restoran', renk: 'text-blue-300 bg-blue-500/20 border-blue-500/40' };
      case 'kurye':
        return { metin: 'Motorlu Kurye', renk: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
      default:
        return { metin: 'Müşteri', renk: 'text-gray-300 bg-gray-500/20 border-gray-500/40' };
    }
  };

  const rolInfo = rolBilgisiGetir(kullaniciHafizasi.aktifKullanici?.rol);

  return (
    <div className="w-full bg-[#130713] border-b border-[#2D1233] text-white select-none py-1.5">
      <div className="anasayfa-genislik px-4 flex items-center justify-between gap-3">
        
        {/* Sol Taraf: Teslimat Tipi Switcher & Adres Seçimi */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Adrese Teslimat / Şubeden Gel Al Anahtarı */}
          <div className="bg-[#2A102E] border border-[#521E5C] rounded-xl p-0.5 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => teslimatTipiDegistir('teslimat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                aktifTeslimatTipi === 'teslimat'
                  ? 'bg-[#4D1857] text-white shadow-sm border border-[#6D237A]'
                  : 'text-[#A872B5] hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adrese Teslimat</span>
              <span className="sm:hidden">Teslimat</span>
            </button>

            <button
              type="button"
              onClick={() => teslimatTipiDegistir('gel_al')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                aktifTeslimatTipi === 'gel_al'
                  ? 'bg-[#4D1857] text-white shadow-sm border border-[#6D237A]'
                  : 'text-[#A872B5] hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Gel Al</span>
              <span className="bg-[#8C1D9C] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                %10
              </span>
            </button>
          </div>

          {/* Adres / Şube Seçim Butonu */}
          <button
            type="button"
            onClick={aktifTeslimatTipi === 'gel_al' ? teslimatHafizasi.gelAlPenceresiAc : adresSecTiklandi}
            className="bg-[#2A102E] hover:bg-[#3D1843] border border-[#521E5C] px-3 py-1.5 rounded-xl text-xs font-medium text-white flex items-center gap-2 transition-all cursor-pointer max-w-sm truncate"
          >
            {aktifTeslimatTipi === 'gel_al' ? (
              <Store className="w-3.5 h-3.5 text-[#CFA353] shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#CFA353] shrink-0" />
            )}
            <span className="truncate text-gray-200 font-semibold">{gorunenAdresMetni}</span>
            <ChevronDown className="w-3 h-3 text-[#A872B5] shrink-0 ml-auto" />
          </button>
        </div>

        {/* Sağ Taraf: Ortak Sepet & Açılır "Panelim" Merkezi */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Ortak Sepet Butonu */}
          <button
            type="button"
            onClick={ortakSepetTiklandi}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              ortakSepetHafizasi.aktifOrtakSepet
                ? 'bg-[#6D237A] text-white border-[#DDAF53] font-bold shadow-md'
                : 'bg-[#2A102E] hover:bg-[#3D1843] border-[#521E5C] text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#DDAF53]" />
            <span className="hidden sm:inline">
              {ortakSepetHafizasi.aktifOrtakSepet
                ? `Grup (${ortakSepetHafizasi.aktifOrtakSepet.sepet_kodu})`
                : 'Grup Siparişi'}
            </span>
          </button>

          {/* Kullanıcı Giriş VEYA Birleştirilmiş "Panelim" Merkezi */}
          {kullaniciHafizasi.aktifKullanici ? (
            <div className="relative" ref={profilMenuRef}>
              <button
                type="button"
                onClick={() => setProfilMenuAcik(!profilMenuAcik)}
                className="flex items-center gap-2 bg-[#2A102E] hover:bg-[#3D1843] border border-[#521E5C] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#8C1D9C] flex items-center justify-center text-white text-[11px] font-bold">
                  {kullaniciHafizasi.aktifKullanici.rol === 'yonetici' ? '👑' : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight max-w-[130px] truncate">
                    {kullaniciHafizasi.aktifKullanici.isletme_adi || kullaniciHafizasi.aktifKullanici.ad_soyad}
                  </span>
                  <span className="text-[9px] text-[#DDAF53] font-semibold">
                    Panelim
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#A872B5] ml-0.5" />
              </button>

              {/* Birleştirilmiş Tek Çatı "Panelim" Kontrol Merkezi */}
              {profilMenuAcik && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#180A1F] border border-[#521E5C] rounded-2xl shadow-2xl p-3.5 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                  
                  {/* Başlık ve Profil Bilgisi */}
                  <div className="p-3 rounded-xl bg-[#250D2D] border border-purple-900/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <LayoutDashboard className="w-3 h-3" />
                        PANELİM (KONTROL MERKEZİ)
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs truncate pt-1">
                      {kullaniciHafizasi.aktifKullanici.ad_soyad}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {kullaniciHafizasi.aktifKullanici.telefon}
                    </div>
                    <div className="pt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border inline-block ${rolInfo.renk}`}>
                        {rolInfo.metin}
                      </span>
                    </div>
                  </div>

                  {/* Müşteri ve Yönetici İşlemleri */}
                  <div className="space-y-1">
                    {kullaniciHafizasi.aktifKullanici?.rol === 'sube_admin' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            kullaniciHafizasi.panelDegistir('sube');
                            setProfilMenuAcik(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#6D237A] hover:bg-[#852C94] text-white text-xs font-bold transition-all cursor-pointer border border-[#9633A7] shadow-sm"
                        >
                          <Store className="w-4 h-4 text-[#DDAF53]" />
                          <span className="text-[#DDAF53]">Şube Yönetim Paneli</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            subeVitriniAc(kullaniciHafizasi.aktifKullanici?.sube_id);
                            setProfilMenuAcik(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2B0E33] text-[#DDAF53] text-xs font-bold transition-all cursor-pointer border border-transparent hover:border-amber-500/40"
                        >
                          <Store className="w-4 h-4 text-[#DDAF53]" />
                          <span>Şubemin Vitrinini Gör</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {kullaniciHafizasi.aktifKullanici?.rol === 'yonetici' && (
                          <button
                            type="button"
                            onClick={() => {
                              kullaniciHafizasi.panelDegistir('patron');
                              setProfilMenuAcik(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 text-xs font-bold transition-all cursor-pointer border border-amber-500/50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>Patron Masası</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            kullaniciHafizasi.panelDegistir('musteri');
                            setProfilMenuAcik(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2B0E33] text-gray-200 text-xs font-semibold transition-all cursor-pointer border border-transparent hover:border-purple-800/40"
                        >
                          <UserCircle className="w-4 h-4 text-blue-400" />
                          <span>Siparişlerim & Hesabım</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Çıkış Butonu */}
                  <div className="pt-2 border-t border-purple-950">
                    <button
                      type="button"
                      onClick={() => {
                        kullaniciHafizasi.cikisYap();
                        setProfilMenuAcik(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Güvenli Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {yerelSiparisleriGetir().filter(s => s.durum !== 'iptal' && s.durum !== 'teslim_edildi').length > 0 && (
                <button
                  type="button"
                  onClick={() => kullaniciHafizasi.panelDegistir('musteri')}
                  className="bg-amber-600/25 hover:bg-amber-600/40 border border-amber-500/50 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Siparişlerim ({yerelSiparisleriGetir().filter(s => s.durum !== 'iptal' && s.durum !== 'teslim_edildi').length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={girisKayitTiklandi}
                className="bg-[#6D237A] hover:bg-[#852C94] border border-[#9633A7] px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>Giriş / Kayıt</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
