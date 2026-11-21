import React, { useState, useEffect } from 'react';
import { X, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { kullaniciHafizasiKullan, type GoogleKullaniciTaslagi } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { telefonGecerliMi } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { SozlesmePenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { hukukiLogKaydet, type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';
import { GirisFormu } from './GirisFormu';
import { KayitFormu, GUVENLIK_SORULARI } from './KayitFormu';
import { SifremiUnuttumFormu } from './SifremiUnuttumFormu';
import { GoogleKayitTamamlaFormu } from './GoogleKayitTamamlaFormu';

export const KullaniciGirisPenceresi: React.FC = () => {
  const {
    pencereAcik,
    pencereKapat,
    girisYap,
    googleIleGirisYap,
    googleKayitTamamla,
    kayitOl,
    yukleniyor,
    baslangicSekmesi,
  } = kullaniciHafizasiKullan();

  const [sekme, setSekme] = useState<'giris' | 'kayit'>('giris');
  const [hataMesaji, setHataMesaji] = useState('');
  const [basariMesaji, setBasariMesaji] = useState('');
  const [sifreUnuttumModu, setSifreUnuttumModu] = useState(false);
  const [googleTaslak, setGoogleTaslak] = useState<GoogleKullaniciTaslagi | null>(null);

  const [telefon, setTelefon] = useState('');
  const [sifre, setSifre] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [secilenSoru, setSecilenSoru] = useState(GUVENLIK_SORULARI[0]);
  const [kayitCevap, setKayitCevap] = useState('');
  const [sozlesmeOnaylandi, setSozlesmeOnaylandi] = useState(false);
  const [aktifSozlesmeTuru, setAktifSozlesmeTuru] = useState<SozlesmeTuru | null>(null);

  useEffect(() => {
    if (pencereAcik) {
      if (baslangicSekmesi) setSekme(baslangicSekmesi);
      setHataMesaji('');
      setBasariMesaji('');
      setSifreUnuttumModu(false);
      setGoogleTaslak(null);
    }
  }, [pencereAcik, baslangicSekmesi]);

  if (!pencereAcik) return null;

  const hukukiOnaylariKaydet = (tel: string, ad: string) => {
    (['kullanici_sozlesmesi', 'kvkk_aydinlatma'] as const).forEach((tur) => {
      hukukiLogKaydet({
        sozlesmeTuru: tur,
        sozlesmeVersiyonu: '1.0.0',
        kullaniciTelefon: tel,
        kullaniciAdSoyad: ad,
        islemTuru: 'kayit',
        onaylandiMi: true,
      });
    });
  };

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
    const sonuc = await googleIleGirisYap();
    if (sonuc.durum === 'telefon_gerekli') {
      setGoogleTaslak(sonuc.taslak);
    } else if (sonuc.durum === 'hata') {
      setHataMesaji(sonuc.hataMesaji);
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
    if (sifre.trim().length < 4) {
      setHataMesaji('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }
    if (!sozlesmeOnaylandi) {
      setHataMesaji('Kayıt işlemine devam edebilmek için Kullanıcı Sözleşmesi ve KVKK Metnini onaylamanız zorunludur.');
      return;
    }
    const basarili = await kayitOl({
      ad_soyad: adSoyad.trim(),
      telefon: telefon.trim(),
      rol: 'musteri',
      sifre: sifre.trim(),
      guvenlik_sorusu: secilenSoru,
      guvenlik_cevabi: kayitCevap.trim(),
    });
    if (basarili) {
      hukukiOnaylariKaydet(telefon, adSoyad);
    } else {
      setHataMesaji('Kayıt oluşturulamadı. Bu telefon numarası sistemde kayıtlı olabilir.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-base text-white">
              {googleTaslak
                ? 'Google Hesabını Tamamla'
                : sifreUnuttumModu
                ? 'Şifre Yeniden Oluşturma'
                : 'Afyon Ev Lezzetleri — Kullanıcı Girişi'}
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

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {hataMesaji && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{hataMesaji}</span>
            </div>
          )}
          {basariMesaji && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{basariMesaji}</span>
            </div>
          )}

          {googleTaslak ? (
            <GoogleKayitTamamlaFormu
              taslak={googleTaslak}
              sozlesmeOnaylandi={sozlesmeOnaylandi}
              yukleniyor={yukleniyor}
              onSozlesmeOnayDegis={(onay) => {
                setHataMesaji('');
                setSozlesmeOnaylandi(onay);
              }}
              onSozlesmeAc={setAktifSozlesmeTuru}
              onGeriDon={() => {
                setGoogleTaslak(null);
                setHataMesaji('');
              }}
              onHata={setHataMesaji}
              onTamamla={async (bilgiler) => {
                const ok = await googleKayitTamamla(bilgiler);
                if (ok) {
                  hukukiOnaylariKaydet(bilgiler.telefon, bilgiler.adSoyad);
                } else {
                  setHataMesaji('Kayıt tamamlanamadı. Bu telefon numarası başka bir hesaba ait olabilir.');
                }
              }}
            />
          ) : sifreUnuttumModu ? (
            <SifremiUnuttumFormu
              onGeriDon={() => {
                setSifreUnuttumModu(false);
                setHataMesaji('');
                setBasariMesaji('');
              }}
              onHata={setHataMesaji}
              onBasari={setBasariMesaji}
              onOtomatikGiris={girisYap}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#2A102E] border border-[#521E5C] rounded-xl text-xs font-bold">
                {(['giris', 'kayit'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSekme(s);
                      setHataMesaji('');
                    }}
                    className={`py-2 rounded-lg transition-all cursor-pointer ${
                      sekme === s ? 'bg-[#6D237A] text-white shadow-md' : 'text-[#A872B5] hover:text-white'
                    }`}
                  >
                    {s === 'giris' ? 'Giriş Yap' : 'Yeni Kayıt Ol'}
                  </button>
                ))}
              </div>

              {sekme === 'giris' ? (
                <GirisFormu
                  telefon={telefon}
                  sifre={sifre}
                  yukleniyor={yukleniyor}
                  onTelefonDegis={(val) => {
                    setHataMesaji('');
                    setTelefon(val);
                  }}
                  onSifreDegis={setSifre}
                  onGonder={girisGonder}
                  onSifremiUnuttum={() => {
                    setSifreUnuttumModu(true);
                    setHataMesaji('');
                  }}
                  onGoogleTikla={googleGirisTiklandi}
                />
              ) : (
                <KayitFormu
                  adSoyad={adSoyad}
                  telefon={telefon}
                  sifre={sifre}
                  secilenSoru={secilenSoru}
                  kayitCevap={kayitCevap}
                  sozlesmeOnaylandi={sozlesmeOnaylandi}
                  yukleniyor={yukleniyor}
                  onAdSoyadDegis={setAdSoyad}
                  onTelefonDegis={(val) => {
                    setHataMesaji('');
                    setTelefon(val);
                  }}
                  onSifreDegis={setSifre}
                  onSecilenSoruDegis={setSecilenSoru}
                  onKayitCevapDegis={setKayitCevap}
                  onSozlesmeOnayDegis={(onay) => {
                    setHataMesaji('');
                    setSozlesmeOnaylandi(onay);
                  }}
                  onSozlesmeAc={setAktifSozlesmeTuru}
                  onGonder={kayitGonder}
                  onGoogleTikla={googleGirisTiklandi}
                />
              )}
            </>
          )}
        </div>
      </div>

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
