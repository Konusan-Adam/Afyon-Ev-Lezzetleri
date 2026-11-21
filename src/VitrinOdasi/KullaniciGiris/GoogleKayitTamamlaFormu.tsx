import React, { useState } from 'react';
import { ArrowLeft, Check, Phone, ShieldCheck } from 'lucide-react';
import { telefonMaskele, telefonGecerliMi, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { type GoogleKullaniciTaslagi, type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';

interface GoogleKayitTamamlaFormuOzellikleri {
  taslak: GoogleKullaniciTaslagi;
  sozlesmeOnaylandi: boolean;
  yukleniyor: boolean;
  onSozlesmeOnayDegis: (onay: boolean) => void;
  onSozlesmeAc: (tur: SozlesmeTuru) => void;
  onGeriDon: () => void;
  onHata: (mesaj: string) => void;
  onTamamla: (bilgiler: { uid: string; adSoyad: string; eposta: string; telefon: string }) => Promise<void>;
}

export const GoogleKayitTamamlaFormu: React.FC<GoogleKayitTamamlaFormuOzellikleri> = ({
  taslak,
  sozlesmeOnaylandi,
  yukleniyor,
  onSozlesmeOnayDegis,
  onSozlesmeAc,
  onGeriDon,
  onHata,
  onTamamla,
}) => {
  const [adSoyad, setAdSoyad] = useState(taslak.adSoyad || '');
  const [telefon, setTelefon] = useState(taslak.telefon ? telefonMaskele(taslak.telefon) : '');
  const telDurum = telefonCanliDurumunuGetir(telefon);

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    onHata('');
    if (!adSoyad.trim()) {
      onHata('Lütfen ad soyad bilginizi giriniz.');
      return;
    }
    const telSonuc = telefonGecerliMi(telefon);
    if (!telSonuc.gecerli) {
      onHata(telSonuc.hata || 'Lütfen geçerli bir cep telefonu numarası giriniz.');
      return;
    }
    if (!sozlesmeOnaylandi) {
      onHata('Devam edebilmek için Kullanıcı Sözleşmesi ve KVKK Metnini onaylamanız zorunludur.');
      return;
    }
    await onTamamla({
      uid: taslak.uid,
      adSoyad: adSoyad.trim(),
      eposta: taslak.eposta,
      telefon: telefon.trim(),
    });
  };

  return (
    <form onSubmit={gonder} className="space-y-3.5">
      <button
        type="button"
        onClick={onGeriDon}
        className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Giriş Ekranına Dön</span>
      </button>

      <div className="bg-[#240C28] p-3.5 rounded-xl border border-emerald-500/40 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Google Hesabınız Doğrulandı ({taslak.eposta})</span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          Sipariş ve kurye iletişimi için gerçek cep telefonu numaranızı girip sözleşmeyi onaylayarak kaydınızı tamamlayın.
        </p>
      </div>

      <div>
        <label className="block text-gray-300 font-medium mb-1 text-xs">Ad Soyad</label>
        <input
          type="text"
          value={adSoyad}
          onChange={(e) => setAdSoyad(e.target.value)}
          placeholder="Adınız Soyadınız"
          className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
          required
        />
      </div>

      <div>
        <label className="block text-[#CFA353] font-semibold mb-1 text-xs">Cep Telefonu Numarası</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(telefonMaskele(e.target.value))}
            placeholder="05XX XXX XX XX"
            maxLength={15}
            className={`w-full bg-[#2A102E] border rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none font-mono text-sm ${
              telDurum.hata
                ? 'border-rose-500 bg-rose-950/20'
                : telDurum.gecerliMi
                ? 'border-emerald-500/60'
                : 'border-[#521E5C] focus:border-[#DDAF53]'
            }`}
            required
          />
        </div>
        {telDurum.hata && <p className="text-[11px] text-rose-400 mt-1">{telDurum.hata}</p>}
      </div>

      <div className="bg-[#240C28] p-3 rounded-xl border border-[#521E5C]">
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
            'ni kabul ediyorum. <span className="text-rose-400 font-bold">*</span>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={yukleniyor || !sozlesmeOnaylandi || Boolean(telDurum.hata) || !telDurum.tamamlandiMi}
        className="w-full bg-[#6D237A] hover:bg-[#852C94] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
      >
        <Check className="w-4 h-4 text-[#DDAF53]" />
        <span>{yukleniyor ? 'Tamamlanıyor...' : 'Google Kaydını Tamamla'}</span>
      </button>
    </form>
  );
};
