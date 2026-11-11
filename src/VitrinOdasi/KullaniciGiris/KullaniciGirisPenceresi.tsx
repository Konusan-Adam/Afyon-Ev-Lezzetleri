import React, { useState } from 'react';
import { X, User, ShieldCheck, Lock, Phone, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { telefonMaskele, telefonGecerliMi, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { SozlesmePenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { hukukiLogKaydet, type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';

export const KullaniciGirisPenceresi: React.FC = () => {
  const {
    pencereAcik,
    pencereKapat,
    girisYap,
    kayitOl,
    yukleniyor,
    baslangicSekmesi,
  } = kullaniciHafizasiKullan();

  const [sekme, setSekme] = useState<'giris' | 'kayit'>('giris');
  const [hataMesaji, setHataMesaji] = useState<string>('');

  // Pencere açıldığında başlangıç sekmesini otomatik ayarla
  React.useEffect(() => {
    if (pencereAcik) {
      if (baslangicSekmesi) setSekme(baslangicSekmesi);
      setHataMesaji('');
    }
  }, [pencereAcik, baslangicSekmesi]);

  // Form Durumları (Sadece Müşteri)
  const [telefon, setTelefon] = useState<string>('');
  const [sifre, setSifre] = useState<string>('');
  const [adSoyad, setAdSoyad] = useState<string>('');

  // Hukuki Sözleşme ve KVKK Onay Kilidi
  const [sozlesmeOnaylandi, setSozlesmeOnaylandi] = useState<boolean>(false);
  const [aktifSozlesmeTuru, setAktifSozlesmeTuru] = useState<SozlesmeTuru | null>(null);

  if (!pencereAcik) return null;

  const girisGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    if (!telefon.trim() || !sifre.trim()) {
      setHataMesaji('Lütfen telefon numaranızı ve şifrenizi giriniz.');
      return;
    }

    const telSonuc = telefonGecerliMi(telefon);
    if (!telSonuc.gecerli) {
      setHataMesaji(telSonuc.hata || 'Lütfen geçerli bir cep telefonu numarası giriniz.');
      return;
    }

    const basarili = await girisYap(telefon, sifre);
    if (!basarili) {
      setHataMesaji('Giriş başarısız. Telefon numaranızı veya şifrenizi kontrol ediniz.');
    }
  };

  const kayitGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    if (!adSoyad.trim() || !telefon.trim() || !sifre.trim()) {
      setHataMesaji('Lütfen ad, telefon ve şifre alanlarını eksiksiz doldurunuz.');
      return;
    }

    const telSonuc = telefonGecerliMi(telefon);
    if (!telSonuc.gecerli) {
      setHataMesaji(telSonuc.hata || 'Lütfen geçerli bir cep telefonu numarası giriniz.');
      return;
    }

    if (sifre.length < 4) {
      setHataMesaji('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    if (!sozlesmeOnaylandi) {
      setHataMesaji('Kayıt işlemine devam edebilmek için Kullanıcı Sözleşmesi ve KVKK Metnini onaylamanız zorunludur.');
      return;
    }

    const gonderilecekVeri = {
      ad_soyad: adSoyad.trim(),
      telefon: telefon.trim(),
      rol: 'musteri' as const,
      sifre,
    };

    const basarili = await kayitOl(gonderilecekVeri);

    if (basarili) {
      hukukiLogKaydet({
        sozlesmeTuru: 'kullanici_sozlesmesi',
        sozlesmeVersiyonu: '1.0.0',
        kullaniciTelefon: telefon,
        kullaniciAdSoyad: adSoyad,
        islemTuru: 'kayit',
        onaylandiMi: true
      });
      hukukiLogKaydet({
        sozlesmeTuru: 'kvkk_aydinlatma',
        sozlesmeVersiyonu: '1.0.0',
        kullaniciTelefon: telefon,
        kullaniciAdSoyad: adSoyad,
        islemTuru: 'kayit',
        onaylandiMi: true
      });
    } else {
      setHataMesaji('Kayıt oluşturulamadı. Bu telefon numarası sistemde kayıtlı olabilir.');
    }
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Üst Başlık Barı */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-base text-white">Afyon Ev Lezzetleri — Kullanıcı Girişi</h3>
          </div>
          <button
            type="button"
            onClick={pencereKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ana Gövde */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Hata Bildirimi */}
          {hataMesaji && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{hataMesaji}</span>
            </div>
          )}

          {/* Giriş / Kayıt Sekme Butonları */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#2A102E] border border-[#521E5C] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSekme('giris');
                setHataMesaji('');
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                sekme === 'giris' ? 'bg-[#6D237A] text-white shadow-md' : 'text-[#A872B5] hover:text-white'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setSekme('kayit');
                setHataMesaji('');
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                sekme === 'kayit' ? 'bg-[#6D237A] text-white shadow-md' : 'text-[#A872B5] hover:text-white'
              }`}
            >
              Yeni Kayıt Ol
            </button>
          </div>

          {sekme === 'giris' ? (
            /* Giriş Yap Formu */
            <form onSubmit={girisGonder} className="space-y-3.5">
              <div>
                <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Telefon Numarası</label>
                <div className="relative">
                  <Phone
                    className={`w-4 h-4 absolute left-3 top-3 ${
                      telefonCanliDurumunuGetir(telefon).hata
                        ? 'text-rose-400'
                        : telefonCanliDurumunuGetir(telefon).gecerliMi
                        ? 'text-emerald-400'
                        : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="tel"
                    value={telefon}
                    onChange={(e) => {
                      setHataMesaji('');
                      setTelefon(telefonMaskele(e.target.value));
                    }}
                    placeholder="05XX XXX XX XX"
                    maxLength={15}
                    className={`w-full bg-[#2A102E] border rounded-xl pl-9 pr-24 py-2.5 text-white placeholder-gray-500 focus:outline-none font-mono text-sm transition-colors ${
                      telefonCanliDurumunuGetir(telefon).hata
                        ? 'border-rose-500 bg-rose-950/20'
                        : telefonCanliDurumunuGetir(telefon).gecerliMi
                        ? 'border-emerald-500/60'
                        : 'border-[#521E5C] focus:border-[#DDAF53]'
                    }`}
                    required
                  />
                  {telefonCanliDurumunuGetir(telefon).operator && (
                    <span
                      className={`absolute right-3 top-3 text-[11px] font-semibold pointer-events-none ${
                        telefonCanliDurumunuGetir(telefon).operator?.renk
                      }`}
                    >
                      {telefonCanliDurumunuGetir(telefon).operator?.ad}
                    </span>
                  )}
                </div>
                {telefonCanliDurumunuGetir(telefon).hata && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{telefonCanliDurumunuGetir(telefon).hata}</span>
                  </p>
                )}
                {telefonCanliDurumunuGetir(telefon).gecerliMi && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Geçerli {telefonCanliDurumunuGetir(telefon).operator?.ad || 'Mobil'} Numarası</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={yukleniyor || Boolean(telefonCanliDurumunuGetir(telefon).hata)}
                className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#DDAF53]" />
                <span>{yukleniyor ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
              </button>
            </form>
          ) : (
            /* 4 Rol Seçimli Kayıt Formu */
            <form onSubmit={kayitGonder} className="space-y-3.5">
              {/* Dinamik Alanlar */}
              <div>
                <label className="block text-gray-300 font-medium mb-1 text-xs">Ad Soyad</label>
                <input
                  type="text"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                  placeholder="Örn: Şerife Yılmaz"
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                  required
                />
              </div>


              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-medium mb-1 text-xs">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={telefon}
                    onChange={(e) => {
                      setHataMesaji('');
                      setTelefon(telefonMaskele(e.target.value));
                    }}
                    placeholder="05XX XXX XX XX"
                    maxLength={15}
                    className={`w-full bg-[#2A102E] border rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none font-mono text-xs transition-colors ${
                      telefonCanliDurumunuGetir(telefon).hata
                        ? 'border-rose-500 bg-rose-950/20'
                        : telefonCanliDurumunuGetir(telefon).gecerliMi
                        ? 'border-emerald-500/60'
                        : 'border-[#521E5C] focus:border-[#DDAF53]'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-1 text-xs">Şifre Oluştur</label>
                  <input
                    type="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                    required
                  />
                </div>
              </div>

              {telefonCanliDurumunuGetir(telefon).hata && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{telefonCanliDurumunuGetir(telefon).hata}</span>
                </p>
              )}

              {telefonCanliDurumunuGetir(telefon).gecerliMi && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Geçerli {telefonCanliDurumunuGetir(telefon).operator?.ad || 'Mobil'} Hattı</span>
                </p>
              )}

              {/* Hukuki Sözleşmeler ve KVKK Onay Kutusu (Zorunlu Kilitleme) */}
              <div className="bg-[#240C28] p-3 rounded-xl border border-[#521E5C] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sozlesmeOnaylandi}
                    onChange={(e) => {
                      setHataMesaji('');
                      setSozlesmeOnaylandi(e.target.checked);
                    }}
                    className="mt-0.5 w-4 h-4 accent-[#DDAF53] rounded cursor-pointer shrink-0"
                  />
                  <div className="text-[11px] text-gray-300 leading-snug">
                    <button
                      type="button"
                      onClick={() => setAktifSozlesmeTuru('kullanici_sozlesmesi')}
                      className="text-[#DDAF53] font-semibold underline hover:text-amber-300 cursor-pointer inline"
                    >
                      Kullanıcı ve Üyelik Sözleşmesi
                    </button>
                    'ni ve{' '}
                    <button
                      type="button"
                      onClick={() => setAktifSozlesmeTuru('kvkk_aydinlatma')}
                      className="text-[#DDAF53] font-semibold underline hover:text-amber-300 cursor-pointer inline"
                    >
                      KVKK Aydınlatma Metni
                    </button>
                    'ni okudum, kabul ediyorum. <span className="text-rose-400 font-bold">* (Zorunlu)</span>
                  </div>
                </label>
                {!sozlesmeOnaylandi && (
                  <p className="text-[10px] text-amber-300/80 flex items-center gap-1 pl-6">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>Sözleşmeyi onaylamadan kayıt ol butonu aktifleşmez.</span>
                  </p>
                )}
              </div>


              <button
                type="submit"
                disabled={
                  yukleniyor ||
                  !sozlesmeOnaylandi ||
                  Boolean(telefonCanliDurumunuGetir(telefon).hata) ||
                  telefonCanliDurumunuGetir(telefon).tamamlandiMi === false
                }
                className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#DDAF53]" />
                <span>{yukleniyor ? 'Kaydediliyor...' : 'Kayıt Ol ve Başlat'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Hukuki Sözleşme Okuma Penceresi */}
      <SozlesmePenceresi
        tur={aktifSozlesmeTuru}
        acikMi={Boolean(aktifSozlesmeTuru)}
        onKapat={() => setAktifSozlesmeTuru(null)}
        onOnayla={() => {
          setSozlesmeOnaylandi(true);
          setAktifSozlesmeTuru(null);
        }}
      />
    </div>
  );
};

