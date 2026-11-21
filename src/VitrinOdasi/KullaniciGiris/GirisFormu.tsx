import React, { useState } from 'react';
import { ShieldCheck, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { telefonMaskele, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { GoogleGirisButonu } from './GoogleGirisButonu';

interface GirisFormuOzellikleri {
  telefon: string;
  sifre: string;
  yukleniyor: boolean;
  onTelefonDegis: (deger: string) => void;
  onSifreDegis: (deger: string) => void;
  onGonder: (e: React.FormEvent) => void;
  onSifremiUnuttum: () => void;
  onGoogleTikla: () => void;
}

export const GirisFormu: React.FC<GirisFormuOzellikleri> = ({
  telefon,
  sifre,
  yukleniyor,
  onTelefonDegis,
  onSifreDegis,
  onGonder,
  onSifremiUnuttum,
  onGoogleTikla,
}) => {
  const [sifreGoster, setSifreGoster] = useState(false);
  const telDurum = telefonCanliDurumunuGetir(telefon);

  return (
    <form onSubmit={onGonder} className="space-y-3.5">
      <div>
        <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Telefon Numarası</label>
        <div className="relative">
          <Phone
            className={`w-4 h-4 absolute left-3 top-3 ${
              telDurum.hata ? 'text-rose-400' : telDurum.gecerliMi ? 'text-emerald-400' : 'text-gray-400'
            }`}
          />
          <input
            type="tel"
            value={telefon}
            onChange={(e) => onTelefonDegis(telefonMaskele(e.target.value))}
            placeholder="05XX XXX XX XX"
            maxLength={15}
            className={`w-full bg-[#2A102E] border rounded-xl pl-9 pr-24 py-2.5 text-white placeholder-gray-500 focus:outline-none font-mono text-sm transition-colors ${
              telDurum.hata
                ? 'border-rose-500 bg-rose-950/20'
                : telDurum.gecerliMi
                ? 'border-emerald-500/60'
                : 'border-[#521E5C] focus:border-[#DDAF53]'
            }`}
            required
          />
          {telDurum.operator && (
            <span
              className={`absolute right-3 top-3 text-[11px] font-semibold pointer-events-none ${telDurum.operator.renk}`}
            >
              {telDurum.operator.ad}
            </span>
          )}
        </div>
        {telDurum.hata && <p className="text-[11px] text-rose-400 mt-1">{telDurum.hata}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[#CFA353] font-semibold text-xs">Şifre</label>
          <button
            type="button"
            onClick={onSifremiUnuttum}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer font-medium"
          >
            Şifremi Unuttum?
          </button>
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type={sifreGoster ? 'text' : 'password'}
            value={sifre}
            onChange={(e) => onSifreDegis(e.target.value)}
            placeholder="••••••••"
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
        disabled={yukleniyor || Boolean(telDurum.hata)}
        className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
      >
        <ShieldCheck className="w-4 h-4 text-[#DDAF53]" />
        <span>{yukleniyor ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
      </button>

      <GoogleGirisButonu yukleniyor={yukleniyor} onTikla={onGoogleTikla} />
    </form>
  );
};
