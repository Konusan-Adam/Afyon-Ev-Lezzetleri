import React, { useState, useEffect, useRef } from 'react';
import { Phone, HelpCircle, Lock, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { telefonMaskele, telefonGecerliMi } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { kullaniciGuvenlikSorusuGetir, sifreSifirlaGuvenlikSorusuIle } from '@/src/MalzemeCekmeceleri/kullaniciIslemleri';

interface SifremiUnuttumFormuOzellikleri {
  onGeriDon: () => void;
  onHata: (mesaj: string) => void;
  onBasari: (mesaj: string) => void;
  onOtomatikGiris: (telefon: string, yeniSifre: string) => Promise<boolean>;
}

export const SifremiUnuttumFormu: React.FC<SifremiUnuttumFormuOzellikleri> = ({
  onGeriDon,
  onHata,
  onBasari,
  onOtomatikGiris,
}) => {
  const [adim, setAdim] = useState<1 | 2>(1);
  const [telefon, setTelefon] = useState('');
  const [bulunanSoru, setBulunanSoru] = useState('');
  const [guvenlikCevabi, setGuvenlikCevabi] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [islemde, setIslemde] = useState(false);
  const zamanlayiciRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (zamanlayiciRef.current) {
        window.clearTimeout(zamanlayiciRef.current);
      }
    };
  }, []);

  const soruSorgulaGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    onHata('');
    const telSonuc = telefonGecerliMi(telefon);
    if (!telSonuc.gecerli) {
      onHata(telSonuc.hata || 'Lütfen kayıtlı geçerli bir cep telefonu numarası giriniz.');
      return;
    }

    setIslemde(true);
    const sonuc = await kullaniciGuvenlikSorusuGetir(telefon);
    setIslemde(false);

    if (sonuc.durum === 'bulundu') {
      setBulunanSoru(sonuc.soru);
      setAdim(2);
    } else {
      onHata(sonuc.mesaj);
    }
  };

  const sifreSifirlaGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    onHata('');
    if (!guvenlikCevabi.trim() || !yeniSifre.trim()) {
      onHata('Lütfen güvenlik sorusu cevabını ve yeni şifrenizi giriniz.');
      return;
    }
    if (yeniSifre.trim().length < 4) {
      onHata('Yeni şifreniz en az 4 karakter olmalıdır.');
      return;
    }

    setIslemde(true);
    const basarili = await sifreSifirlaGuvenlikSorusuIle(telefon, guvenlikCevabi, yeniSifre);
    setIslemde(false);

    if (basarili) {
      onBasari('Şifreniz başarıyla yenilendi! Giriş yapılıyor...');
      zamanlayiciRef.current = window.setTimeout(async () => {
        await onOtomatikGiris(telefon, yeniSifre.trim());
      }, 1000);
    } else {
      onHata('Güvenlik sorusu cevabı hatalı veya işlem kaydedilemedi. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onGeriDon}
          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Giriş Ekranına Dön</span>
        </button>
        <span className="text-purple-300 font-medium">Güvenli Şifre Yenileme</span>
      </div>

      {adim === 1 ? (
        <form onSubmit={soruSorgulaGonder} className="space-y-3.5">
          <div className="bg-[#240C28] p-3.5 rounded-xl border border-purple-900/50 text-gray-300 leading-relaxed">
            Kayıtlı telefon numaranızı girerek belirlemiş olduğunuz güvenlik sorusuyla şifrenizi anında yenileyebilirsiniz.
          </div>
          <div>
            <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Kayıtlı Telefon Numarası</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={telefon}
                onChange={(e) => setTelefon(telefonMaskele(e.target.value))}
                placeholder="05XX XXX XX XX"
                maxLength={15}
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53] font-mono text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={islemde}
            className="w-full bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#DDAF53]" />
            <span>{islemde ? 'Sorgulanıyor...' : 'Güvenlik Sorusu Getir'}</span>
          </button>
        </form>
      ) : (
        <form onSubmit={sifreSifirlaGonder} className="space-y-3.5">
          <div className="bg-[#240C28] p-3.5 rounded-xl border border-amber-500/40 space-y-2">
            <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              Kayıtlı Güvenlik Sorunuz:
            </div>
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
                type={sifreGoster ? 'text' : 'password'}
                value={yeniSifre}
                onChange={(e) => setYeniSifre(e.target.value)}
                placeholder="En az 4 karakter..."
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                required
              />
              <button
                type="button"
                onClick={() => setSifreGoster((g) => !g)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white cursor-pointer"
                aria-label="Şifreyi göster veya gizle"
              >
                {sifreGoster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={islemde}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-black" />
            <span>{islemde ? 'Yenileniyor...' : 'Şifremi Yenile ve Giriş Yap'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
