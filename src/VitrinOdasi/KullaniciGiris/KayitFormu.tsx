import React, { useState } from 'react';
import { ShieldCheck, Check, Eye, EyeOff } from 'lucide-react';
import { telefonMaskele, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';
import { GoogleGirisButonu } from './GoogleGirisButonu';

export const GUVENLIK_SORULARI = [
  'En sevdiğin Afyon yemeği nedir?',
  'Çocukluk mahallen neresiydi?',
  'İlk evcil hayvanının adı nedir?',
  'Unutamadığın tatil yerin neresi?',
];

interface KayitFormuOzellikleri {
  adSoyad: string;
  telefon: string;
  sifre: string;
  secilenSoru: string;
  kayitCevap: string;
  sozlesmeOnaylandi: boolean;
  yukleniyor: boolean;
  onAdSoyadDegis: (deger: string) => void;
  onTelefonDegis: (deger: string) => void;
  onSifreDegis: (deger: string) => void;
  onSecilenSoruDegis: (deger: string) => void;
  onKayitCevapDegis: (deger: string) => void;
  onSozlesmeOnayDegis: (onay: boolean) => void;
  onSozlesmeAc: (tur: SozlesmeTuru) => void;
  onGonder: (e: React.FormEvent) => void;
  onGoogleTikla: () => void;
}

export const KayitFormu: React.FC<KayitFormuOzellikleri> = ({
  adSoyad,
  telefon,
  sifre,
  secilenSoru,
  kayitCevap,
  sozlesmeOnaylandi,
  yukleniyor,
  onAdSoyadDegis,
  onTelefonDegis,
  onSifreDegis,
  onSecilenSoruDegis,
  onKayitCevapDegis,
  onSozlesmeOnayDegis,
  onSozlesmeAc,
  onGonder,
  onGoogleTikla,
}) => {
  const [sifreGoster, setSifreGoster] = useState(false);
  const telDurum = telefonCanliDurumunuGetir(telefon);

  return (
    <form onSubmit={onGonder} className="space-y-3.5">
      <div>
        <label className="block text-gray-300 font-medium mb-1 text-xs">Ad Soyad</label>
        <input
          type="text"
          value={adSoyad}
          onChange={(e) => onAdSoyadDegis(e.target.value)}
          placeholder="Örn: Şerife Yılmaz"
          className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-gray-300 font-medium mb-1 text-xs">Telefon Numarası</label>
          <input
            type="tel"
            value={telefon}
            onChange={(e) => onTelefonDegis(telefonMaskele(e.target.value))}
            placeholder="05XX XXX XX XX"
            maxLength={15}
            className={`w-full bg-[#2A102E] border rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none font-mono text-xs transition-colors ${
              telDurum.hata
                ? 'border-rose-500 bg-rose-950/20'
                : telDurum.gecerliMi
                ? 'border-emerald-500/60'
                : 'border-[#521E5C] focus:border-[#DDAF53]'
            }`}
            required
          />
          {telDurum.hata && <p className="text-[10px] text-rose-400 mt-1">{telDurum.hata}</p>}
          {!telDurum.hata && telDurum.gecerliMi && telDurum.operator && (
            <p className={`text-[10px] mt-1 font-medium ${telDurum.operator.renk}`}>
              ✓ Geçerli {telDurum.operator.ad} numarası
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-1 text-xs">Şifre Oluştur</label>
          <div className="relative">
            <input
              type={sifreGoster ? 'text' : 'password'}
              value={sifre}
              onChange={(e) => onSifreDegis(e.target.value)}
              placeholder="En az 4 karakter"
              className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl pl-3 pr-9 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
              required
            />
            <button
              type="button"
              onClick={() => setSifreGoster((g) => !g)}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-white cursor-pointer"
              aria-label="Şifreyi göster veya gizle"
            >
              {sifreGoster ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#240C28] p-3.5 rounded-xl border border-amber-500/40 space-y-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Güvenlik Sorusu (Şifre Kurtarma)</span>
        </div>
        <p className="text-[10px] text-gray-300 leading-tight">
          Şifrenizi unutmanız durumunda e-posta veya SMS beklemeden, seçtiğiniz soruyla hesabınızı geri alabilirsiniz.
        </p>
        <div className="space-y-2 pt-1">
          <select
            value={secilenSoru}
            onChange={(e) => onSecilenSoruDegis(e.target.value)}
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
            onChange={(e) => onKayitCevapDegis(e.target.value)}
            placeholder="Gizli cevabınız (Örn: Keşkek)..."
            className="w-full bg-[#1A0A1D] border border-purple-900/70 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400"
            required
          />
        </div>
      </div>

      <div className="bg-[#240C28] p-3 rounded-xl border border-[#521E5C] space-y-2">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sozlesmeOnaylandi}
            onChange={(e) => onSozlesmeOnayDegis(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#DDAF53] rounded cursor-pointer shrink-0"
          />
          <div className="text-[11px] text-gray-300 leading-snug">
            <button
              type="button"
              onClick={() => onSozlesmeAc('kullanici_sozlesmesi')}
              className="text-[#DDAF53] font-semibold underline hover:text-amber-300 cursor-pointer inline"
            >
              Kullanıcı ve Üyelik Sözleşmesi
            </button>
            'ni ve{' '}
            <button
              type="button"
              onClick={() => onSozlesmeAc('kvkk_aydinlatma')}
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
          Boolean(telDurum.hata) ||
          telDurum.tamamlandiMi === false
        }
        className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
      >
        <Check className="w-4 h-4 text-[#DDAF53]" />
        <span>{yukleniyor ? 'Kaydediliyor...' : 'Kayıt Ol ve Başlat'}</span>
      </button>

      <GoogleGirisButonu yukleniyor={yukleniyor} onTikla={onGoogleTikla} />
    </form>
  );
};
