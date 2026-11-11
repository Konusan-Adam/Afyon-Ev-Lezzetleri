import React from 'react';
import { User, Phone, MapPin, Zap, ChevronDown, Store, RefreshCw, Clock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Kullanici, GelAlSubesi, MusteriAdresi } from '@/src/veritabani/VeriTipleri';
import { telefonMaskele, telefonCanliDurumunuGetir } from '@/src/MalzemeCekmeceleri';
import { MisafirProfili } from '@/src/MalzemeCekmeceleri/misafirIslemleri';

export const AFYON_MAHALLELERI = [
  'Selçuklu Mahallesi',
  'Dumlupınar Mahallesi',
  'Marulcu Mahallesi',
  'Yeşilyol / Çarşı',
  'Ali Çetinkaya Mahallesi',
  'Kanlıca Mahallesi',
  'Osmangazi Mahallesi',
  'Karşıyaka Mahallesi',
  'Sahipata Mahallesi',
  'Örnekevler Mahallesi',
  'Dervişpaşa Mahallesi',
  'Cumhuriyet Mahallesi',
  'Erenler / Üniversite',
  'Fatih Mahallesi',
  'Gazi Mahallesi'
];

interface MisafirIletisimKartiProps {
  aktifKullanici: Kullanici | null;
  adSoyad: string;
  onAdSoyadDegis: (deger: string) => void;
  telefon: string;
  onTelefonDegis: (deger: string) => void;
  seciliMahalle: string;
  onMahalleDegis: (mahalle: string) => void;
  acikAdres: string;
  onAcikAdresDegis: (adres: string) => void;
  binaDaireNo: string;
  onBinaDaireNoDegis: (no: string) => void;
  gelAlMi?: boolean;
  seciliGelAlSubesi?: GelAlSubesi | null;
  onGelAlSubesiDegistir?: () => void;
  taninanMisafir?: MisafirProfili | null;
  seciliAdres?: MusteriAdresi | null;
  onHaritaAdresSecimAc?: () => void;
}

export const MisafirIletisimKarti: React.FC<MisafirIletisimKartiProps> = ({
  adSoyad,
  onAdSoyadDegis,
  telefon,
  onTelefonDegis,
  seciliMahalle,
  onMahalleDegis,
  acikAdres,
  onAcikAdresDegis,
  binaDaireNo,
  onBinaDaireNoDegis,
  gelAlMi = false,
  seciliGelAlSubesi,
  onGelAlSubesiDegistir,
  taninanMisafir,
  seciliAdres,
  onHaritaAdresSecimAc,
}) => {
  const canliTel = telefonCanliDurumunuGetir(telefon);
  const telHataVar = Boolean(canliTel.hata);

  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3.5 shadow-lg">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between border-b border-[#3E1646] pb-2">
        <div className="flex items-center gap-2 text-[#F5D28A] font-bold text-sm">
          <User className="w-4 h-4 text-[#CFA353]" />
          <span>{gelAlMi ? 'Müşteri İletişim Bilgileri' : 'İletişim ve Teslimat Bilgileri'}</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{gelAlMi ? 'Gel Al Sipariş' : 'Hızlı Sipariş'}</span>
        </span>
      </div>

      {/* 🌟 AKILLI MİSAFİR TANIMA BANNERI */}
      {taninanMisafir && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>
              Tekrar hoş geldiniz <strong className="text-white">{taninanMisafir.ad_soyad}</strong>! ({taninanMisafir.toplam_siparis_sayisi}. siparişiniz) Son kayıtlı adresinizi otomatik doldurduk.
            </span>
          </div>
        </div>
      )}

      {/* İsim ve Telefon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-gray-300 block text-xs font-semibold mb-1">
            Ad Soyad <span className="text-amber-400 font-bold">*</span>
          </label>
          <div className="flex items-center gap-2 bg-[#1A081D] px-3 py-2 rounded-xl border border-purple-900 focus-within:border-amber-400 transition-colors">
            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              value={adSoyad}
              onChange={(e) => onAdSoyadDegis(e.target.value)}
              placeholder="Adınız ve Soyadınız"
              className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-300 block text-xs font-semibold mb-1">
            Cep Telefonu <span className="text-amber-400 font-bold">*</span>
          </label>
          <div
            className={`flex items-center gap-2 bg-[#1A081D] px-3 py-2 rounded-xl border transition-colors ${
              telHataVar
                ? 'border-rose-500 bg-rose-950/20'
                : canliTel.gecerliMi
                ? 'border-emerald-500/60'
                : 'border-purple-900 focus-within:border-amber-400'
            }`}
          >
            <Phone
              className={`w-3.5 h-3.5 shrink-0 ${
                telHataVar ? 'text-rose-400' : canliTel.gecerliMi ? 'text-emerald-400' : 'text-gray-400'
              }`}
            />
            <input
              type="tel"
              value={telefon}
              onChange={(e) => onTelefonDegis(telefonMaskele(e.target.value))}
              placeholder="05XX XXX XX XX"
              maxLength={15}
              className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full font-mono"
            />
            {canliTel.operator && !telHataVar && (
              <span className={`text-[10px] font-semibold shrink-0 ${canliTel.operator.renk}`}>
                {canliTel.operator.ad}
              </span>
            )}
          </div>
          {telHataVar && (
            <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{canliTel.hata}</span>
            </p>
          )}
          {canliTel.gecerliMi && !telHataVar && (
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Geçerli {canliTel.operator?.ad || 'Mobil'} Numarası</span>
            </p>
          )}
        </div>
      </div>

      {/* GEL AL SEÇİLİYSE: ŞUBE BİLGİSİ GÖSTERİLİR */}
      {gelAlMi ? (
        <div className="p-3 bg-[#17061A] border border-amber-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Teslim Alınacak Gel-Al Noktası
                </span>
                <h4 className="text-xs font-bold text-white">
                  {seciliGelAlSubesi?.ad || 'Merkez Gel-Al Şubesi'}
                </h4>
              </div>
            </div>

            {onGelAlSubesiDegistir && (
              <button
                type="button"
                onClick={onGelAlSubesiDegistir}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Değiştir</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-gray-300 bg-black/30 p-2 rounded-lg border border-purple-950">
            {seciliGelAlSubesi?.adres || 'Afyonkarahisar Merkez Şube'}
          </p>

          <div className="flex items-center text-[11px] text-purple-200/90 pt-0.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Tahmini Hazırlanma: {seciliGelAlSubesi?.hazirlanma_suresi || '15-20 dk'}
            </span>
          </div>
        </div>
      ) : (
        /* KURYE TESLİMATI SEÇİLİYSE: MAHALLE & AÇIK ADRES FORMU GÖSTERİLİR */
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#F5D28A] font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#CFA353]" />
              <span>Teslimat Adresi <span className="text-amber-400 font-bold">*</span></span>
            </div>
            {onHaritaAdresSecimAc && (
              <button
                type="button"
                onClick={onHaritaAdresSecimAc}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-all"
              >
                <MapPin className="w-3 h-3" />
                <span>{seciliAdres ? 'Haritadan Değiştir' : 'Haritadan Konum Seç'}</span>
              </button>
            )}
          </div>

          {seciliAdres && (
            <div className="bg-[#240C28] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="text-gray-200">
                  <strong className="text-amber-300">{seciliAdres.adres_basligi || 'Seçili Adres'}:</strong> {seciliAdres.mahalle} {seciliAdres.cadde_sokak} No:{seciliAdres.bina_no || '-'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 block text-[11px] mb-1">
                Mahalle <span className="text-amber-400 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={seciliMahalle}
                  onChange={(e) => onMahalleDegis(e.target.value)}
                  className="w-full bg-[#1A081D] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  {AFYON_MAHALLELERI.map((mahalle) => (
                    <option key={mahalle} value={mahalle} className="bg-[#1A081D] text-white">
                      {mahalle}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block text-[11px] mb-1">Bina No / Daire / Kat</label>
              <input
                type="text"
                value={binaDaireNo}
                onChange={(e) => onBinaDaireNoDegis(e.target.value)}
                placeholder="Örn: No: 12 Daire: 4 (Kat 2)"
                className="w-full bg-[#1A081D] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 block text-[11px] mb-1">
              Cadde, Sokak ve Açık Adres <span className="text-amber-400 font-bold">*</span>
            </label>
            <textarea
              rows={2}
              value={acikAdres}
              onChange={(e) => onAcikAdresDegis(e.target.value)}
              placeholder="Cadde, sokak ve adres tarifi yazınız..."
              className="w-full bg-[#1A081D] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
