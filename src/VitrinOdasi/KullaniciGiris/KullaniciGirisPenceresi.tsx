import React, { useState } from 'react';
import { X, User, ShieldCheck, Lock, Phone, AlertCircle, CheckCircle2, Check, HelpCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { telefonMaskele, telefonGecerliMi, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { SozlesmePenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { hukukiLogKaydet, type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';
import { kullaniciGuvenlikSorusuGetir, sifreSifirlaGuvenlikSorusuIle } from '@/src/MalzemeCekmeceleri/kullaniciIslemleri';

const GUVENLIK_SORULARI = [
  'En sevdiğin Afyon yemeği nedir?',
  'Çocukluk mahallen neresiydi?',
  'İlk evcil hayvanının adı nedir?',
  'Unutamadığın tatil yerin neresi?'
];

export const KullaniciGirisPenceresi: React.FC = () => {
  const {
    pencereAcik,
    pencereKapat,
    girisYap,
    googleIleGirisYap,
    kayitOl,
    yukleniyor,
    baslangicSekmesi,
  } = kullaniciHafizasiKullan();

  const [sekme, setSekme] = useState<'giris' | 'kayit'>('giris');
  const [hataMesaji, setHataMesaji] = useState<string>('');
  const [basariMesaji, setBasariMesaji] = useState<string>('');

  // Şifremi Unuttum Akış Durumları
  const [sifreUnuttumModu, setSifreUnuttumModu] = useState<boolean>(false);
  const [unuttumAdim, setUnuttumAdim] = useState<1 | 2>(1); // 1: Tel iste, 2: Soru sor & Yeni şifre al
  const [unuttumTelefon, setUnuttumTelefon] = useState<string>('');
  const [bulunanSoru, setBulunanSoru] = useState<string>('');
  const [guvenlikCevabi, setGuvenlikCevabi] = useState<string>('');
  const [yeniSifre, setYeniSifre] = useState<string>('');

  // Pencere açıldığında başlangıç sekmesini otomatik ayarla
  React.useEffect(() => {
    if (pencereAcik) {
      if (baslangicSekmesi) setSekme(baslangicSekmesi);
      setHataMesaji('');
      setBasariMesaji('');
      setSifreUnuttumModu(false);
      setUnuttumAdim(1);
    }
  }, [pencereAcik, baslangicSekmesi]);

  // Form Durumları (Sadece Müşteri)
  const [telefon, setTelefon] = useState<string>('');
  const [sifre, setSifre] = useState<string>('');
  const [adSoyad, setAdSoyad] = useState<string>('');
  const [secilenSoru, setSecilenSoru] = useState<string>(GUVENLIK_SORULARI[0]);
  const [kayitCevap, setKayitCevap] = useState<string>('');

  // Hukuki Sözleşme ve KVKK Onay Kilidi
  const [sozlesmeOnaylandi, setSozlesmeOnaylandi] = useState<boolean>(false);
  const [aktifSozlesmeTuru, setAktifSozlesmeTuru] = useState<SozlesmeTuru | null>(null);

  if (!pencereAcik) return null;

  const girisGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    setBasariMesaji('');
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

  const googleGirisTiklandi = async () => {
    setHataMesaji('');
    setBasariMesaji('');
    const basarili = await googleIleGirisYap();
    if (!basarili) {
      setHataMesaji('Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  const kayitGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    setBasariMesaji('');
    if (!adSoyad.trim() || !telefon.trim() || !sifre.trim() || !kayitCevap.trim()) {
      setHataMesaji('Lütfen tüm zorunlu alanları ve güvenlik sorusu cevabını eksiksiz doldurunuz.');
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
      guvenlik_sorusu: secilenSoru,
      guvenlik_cevabi: kayitCevap.trim(),
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

  const soruSorgulaGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    const telSonuc = telefonGecerliMi(unuttumTelefon);
    if (!telSonuc.gecerli) {
      setHataMesaji('Lütfen kayıtlı geçerli bir cep telefonu numarası giriniz.');
      return;
    }

    const sonuc = await kullaniciGuvenlikSorusuGetir(unuttumTelefon);
    if (sonuc) {
      setBulunanSoru(sonuc.soru);
      setUnuttumAdim(2);
    } else {
      setHataMesaji('Bu telefon numarasına ait aktif bir hesap veya güvenlik sorusu bulunamadı.');
    }
  };

  const sifreSifirlaGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setHataMesaji('');
    if (!guvenlikCevabi.trim() || !yeniSifre.trim()) {
      setHataMesaji('Lütfen güvenlik sorusu cevabını ve yeni şifrenizi giriniz.');
      return;
    }
    if (yeniSifre.length < 4) {
      setHataMesaji('Yeni şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    const basarili = await sifreSifirlaGuvenlikSorusuIle(unuttumTelefon, guvenlikCevabi, yeniSifre);
    if (basarili) {
      setBasariMesaji('Şifreniz başarıyla yenilendi! Giriş yapılıyor...');
      setTimeout(async () => {
        await girisYap(unuttumTelefon, yeniSifre);
      }, 1200);
    } else {
      setHataMesaji('Güvenlik sorusu cevabı hatalı. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Üst Başlık Barı */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-base text-white">
              {sifreUnuttumModu ? 'Şifre Yeniden Oluşturma' : 'Afyon Ev Lezzetleri — Kullanıcı Girişi'}
            </h3>
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

          {/* Başarı Bildirimi */}
          {basariMesaji && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{basariMesaji}</span>
            </div>
          )}

          {/* Şifremi Unuttum Akışı Aktifse */}
          {sifreUnuttumModu ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSifreUnuttumModu(false);
                    setUnuttumAdim(1);
                    setHataMesaji('');
                  }}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Giriş Ekranına Dön</span>
                </button>
                <span className="text-purple-300 font-medium">Güvenli Şifre Yenileme</span>
              </div>

              {unuttumAdim === 1 ? (
                <form onSubmit={soruSorgulaGonder} className="space-y-3.5">
                  <div className="bg-[#240C28] p-3.5 rounded-xl border border-purple-900/50 text-gray-300 leading-relaxed">
                    Kayıtlı telefon numaranızı girerek belirlemiş olduğunuz güvenlik sorusuyla şifrenizi e-posta veya SMS beklemeden anında sıfırlayabilirsiniz.
                  </div>
                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Kayıtlı Telefon Numarası</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={unuttumTelefon}
                        onChange={(e) => setUnuttumTelefon(telefonMaskele(e.target.value))}
                        placeholder="05XX XXX XX XX"
                        maxLength={15}
                        className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53] font-mono text-sm"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#DDAF53]" />
                    <span>Güvenlik Sorusu Getir</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={sifreSifirlaGonder} className="space-y-3.5">
                  <div className="bg-[#240C28] p-3.5 rounded-xl border border-amber-500/40 space-y-2">
                    <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Kayıtlı Güvenlik Sorunuz:</div>
                    <div className="text-sm font-extrabold text-white">{bulunanSoru}</div>
                  </div>

                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Sorunun Cevabı</label>
                    <input
                      type="text"
                      value={guvenlikCevabi}
                      onChange={(e) => setGuvenlikCevabi(e.target.value)}
                      placeholder="Gizli cevabınız..."
                      className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Yeni Şifre Oluştur</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={yeniSifre}
                        onChange={(e) => setYeniSifre(e.target.value)}
                        placeholder="En az 4 karakter..."
                        className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-black" />
                    <span>Şifremi Yenile ve Giriş Yap</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
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
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[#CFA353] font-semibold text-xs">Şifre</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSifreUnuttumModu(true);
                          setHataMesaji('');
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer font-medium"
                      >
                        Şifremi Unuttum?
                      </button>
                    </div>
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

                  {/* Google ile Giriş Butonu */}
                  <div className="pt-1">
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#521E5C]"></div>
                      <span className="flex-shrink mx-3 text-purple-300 text-[10px] font-semibold uppercase tracking-wider">veya</span>
                      <div className="flex-grow border-t border-[#521E5C]"></div>
                    </div>

                    <button
                      type="button"
                      onClick={googleGirisTiklandi}
                      disabled={yukleniyor}
                      className="w-full mt-1 bg-[#240C28] hover:bg-[#35123E] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2.5 border border-[#521E5C] hover:border-amber-400/50 shadow-md transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google ile Devam Et</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Kayıt Formu (Güvenlik Sorusu ve Google Giriş Dahil) */
                <form onSubmit={kayitGonder} className="space-y-3.5">
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

                  {/* 🔑 GÜVENLİK SORUSU ALANI */}
                  <div className="bg-[#240C28] p-3.5 rounded-xl border border-amber-500/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Güvenlik Sorusu (Şifre Kurtarma İçin Çok Önemli!)</span>
                    </div>
                    <p className="text-[10px] text-gray-300 leading-tight">
                      Şifrenizi unutmanız durumunda e-posta veya SMS beklemeden, buraya seçeceğiniz soru ve cevabıyla hesabınızı anında geri alabilirsiniz.
                    </p>
                    <div className="space-y-2 pt-1">
                      <select
                        value={secilenSoru}
                        onChange={(e) => setSecilenSoru(e.target.value)}
                        className="w-full bg-[#1A0A1D] border border-purple-900/70 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {GUVENLIK_SORULARI.map((soru) => (
                          <option key={soru} value={soru}>
                            {soru}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={kayitCevap}
                        onChange={(e) => setKayitCevap(e.target.value)}
                        placeholder="Gizli cevabınız (Örn: Keşkek)..."
                        className="w-full bg-[#1A0A1D] border border-purple-900/70 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

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
                  </div>

                  <button
                    type="submit"
                    disabled={
                      yukleniyor ||
                      !sozlesmeOnaylandi ||
                      !kayitCevap.trim() ||
                      Boolean(telefonCanliDurumunuGetir(telefon).hata) ||
                      telefonCanliDurumunuGetir(telefon).tamamlandiMi === false
                    }
                    className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#DDAF53]" />
                    <span>{yukleniyor ? 'Kaydediliyor...' : 'Kayıt Ol ve Başlat'}</span>
                  </button>

                  {/* Google ile Giriş Butonu */}
                  <div className="pt-1">
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#521E5C]"></div>
                      <span className="flex-shrink mx-3 text-purple-300 text-[10px] font-semibold uppercase tracking-wider">veya</span>
                      <div className="flex-grow border-t border-[#521E5C]"></div>
                    </div>

                    <button
                      type="button"
                      onClick={googleGirisTiklandi}
                      disabled={yukleniyor}
                      className="w-full mt-1 bg-[#240C28] hover:bg-[#35123E] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2.5 border border-[#521E5C] hover:border-amber-400/50 shadow-md transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google ile Devam Et</span>
                    </button>
                  </div>
                </form>
              )}
            </>
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
