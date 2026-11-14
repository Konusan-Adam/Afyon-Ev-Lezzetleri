import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  UtensilsCrossed, 
  PhoneCall, 
  Clock, 
  MapPin, 
  ChefHat, 
  Bike, 
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Flame,
  Award,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';
import { aramaVeFiltreKullan } from '@/src/OrtakHavuz/AramaVeFiltreHafizasi';
import { temaHafizasiKullan } from '@/src/OrtakHavuz/TemaHafizasi';
import { footerAyariniGetir, FooterAyar } from './footerVeritabani';
import { PaytrGuvenlikRozeti } from './PaytrGuvenlikRozeti';

export const MasaustuAltBilgi: React.FC = () => {
  const { pencereAc } = ozelOzelliklerHafizasiKullan();
  const { filtreleriUygula } = aramaVeFiltreKullan();
  const { tema } = temaHafizasiKullan();
  const acikMi = tema === 'acik';

  const [ayar, setAyar] = useState<FooterAyar>(footerAyariniGetir());

  useEffect(() => {
    const handleFooterGuncelleme = (e: Event) => {
      const customEvent = e as CustomEvent<FooterAyar>;
      if (customEvent.detail) {
        setAyar(customEvent.detail);
      } else {
        setAyar(footerAyariniGetir());
      }
    };

    window.addEventListener('afyon_footer_guncellendi', handleFooterGuncelleme);
    return () => {
      window.removeEventListener('afyon_footer_guncellendi', handleFooterGuncelleme);
    };
  }, []);

  const kategoriSec = (kategoriSlug?: string, kategoriBaslik?: string) => {
    if (kategoriSlug && kategoriSlug !== '#') {
      filtreleriUygula({ kategori: kategoriSlug });
    } else if (kategoriBaslik) {
      filtreleriUygula({ kategori: kategoriBaslik });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ikonGetir = (ikonAdi: string) => {
    switch (ikonAdi) {
      case 'Heart': return <Heart className="w-5 h-5 text-purple-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-rose-400" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-amber-400" />;
      case 'Bike': return <Bike className="w-5 h-5 text-cyan-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Award': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'ChefHat':
      default:
        return <ChefHat className="w-5 h-5 text-amber-400" />;
    }
  };

  const renkSinifiGetir = (renk?: string, index?: number) => {
    const seciliRenk = renk || ['amber', 'purple', 'emerald', 'rose'][(index || 0) % 4];
    switch (seciliRenk) {
      case 'amber': return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'purple': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'rose': return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'blue': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
  };

  const sosyalIkonGetir = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Dinamik Kolon Sayısı Hesaplama
  const toplamKolon = 2 + ayar.kolonlar.length + (ayar.ozelHizmetler.ihaleAktif || ayar.ozelHizmetler.abonelikAktif || ayar.ozelHizmetler.kombinAktif || ayar.ozelHizmetler.davetKutusuAktif ? 1 : 0);

  return (
    <footer
      className={`hidden lg:block w-full border-t pt-12 pb-8 select-none transition-colors duration-200 ${
        acikMi
          ? 'bg-[#F2E7D8] border-[#DECFC0] text-gray-800'
          : 'bg-[#0F0411] border-[#3A1642] text-gray-300'
      }`}
    >
      <div className="anasayfa-genislik px-4">
        
        {/* Üst Vurgu Rozetleri (Dinamik 4'lü Avantaj Şeridi) */}
        {ayar.avantajlar.length > 0 && (
          <div
            className={`grid grid-cols-${Math.min(4, Math.max(1, ayar.avantajlar.length))} gap-4 p-4 rounded-2xl border mb-10 shadow-lg ${
              acikMi
                ? 'bg-white border-[#E0D0C0]'
                : 'bg-gradient-to-r from-[#2A0E30] via-[#1D0822] to-[#2A0E30] border-[#521E5C]/60'
            }`}
          >
            {ayar.avantajlar.map((av, index) => {
              const stil = renkSinifiGetir(av.renk, index);
              return (
                <div key={av.id || index} className={`flex items-center gap-3 p-2 ${index > 0 ? 'border-l border-purple-900/40' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stil}`}>
                    {ikonGetir(av.ikonAdi)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{av.baslik}</div>
                    <div className="text-[10px] text-gray-400">{av.altBaslik}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Ana Kolonlu Bilgi Vitrini */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(5, Math.max(2, toplamKolon))} gap-8 pb-10 border-b border-[#2D1233]`}>
          
          {/* 1. Kolon: Logo & Şirket Bilgisi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl ring-2 ring-[#CFA353]/50 p-0.5 bg-white overflow-hidden flex items-center justify-center shadow-md shadow-purple-950/50 shrink-0">
                <img
                  src={ayar.logoUrl || '/marka_logosu.jpg'}
                  alt={ayar.sirketUnvani}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    // Fallback to default if image fails to load
                    (e.target as HTMLImageElement).src = '/marka_logosu.jpg';
                  }}
                />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-base tracking-wide flex items-center gap-1.5">
                  {ayar.sirketUnvani.split(' ')[0]} <span className="text-[#FFB703]">{ayar.sirketUnvani.split(' ').slice(1).join(' ')}</span>
                </h4>
                <p className="text-[11px] text-purple-300/80 font-medium">
                  {ayar.altBaslik}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              {ayar.aciklama}
            </p>

            {/* Sosyal Medya İkonları */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {ayar.sosyalMedya.filter(s => s.aktif).map((sosyal) => (
                <a 
                  key={sosyal.id} 
                  href={sosyal.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#210D27] hover:bg-[#3E1649] border border-[#481B54] flex items-center justify-center text-purple-300 hover:text-white transition-colors"
                  title={sosyal.platform}
                >
                  {sosyalIkonGetir(sosyal.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Dinamik Kolonlar (Meşhur Lezzetler vb.) */}
          {ayar.kolonlar.map((kolon) => (
            <div key={kolon.id}>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: kolon.noktaRengi || '#FFB703' }}
                />
                <span>{kolon.baslik}</span>
              </h5>
              <ul className="space-y-2 text-xs text-gray-400 font-medium">
                {kolon.baglantilar.map((baglanti, bIdx) => (
                  <li key={baglanti.id || bIdx}>
                    <button 
                      onClick={() => kategoriSec(baglanti.kategoriSlug, baglanti.baslik)} 
                      className="hover:text-[#FFB703] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{baglanti.baslik}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. Kolon: Özel Hizmetler & Ev Aşçısı mısınız? */}
          {(ayar.ozelHizmetler.ihaleAktif || ayar.ozelHizmetler.abonelikAktif || ayar.ozelHizmetler.kombinAktif || ayar.ozelHizmetler.davetKutusuAktif) && (
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: ayar.ozelHizmetler.noktaRengi || '#A855F7' }}
                />
                <span>{ayar.ozelHizmetler.baslik}</span>
              </h5>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
                {ayar.ozelHizmetler.ihaleAktif && (
                  <li>
                    <button 
                      onClick={() => pencereAc('ihale')} 
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{ayar.ozelHizmetler.ihaleMetni}</span>
                    </button>
                  </li>
                )}
                {ayar.ozelHizmetler.abonelikAktif && (
                  <li>
                    <button 
                      onClick={() => pencereAc('abonelik')} 
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{ayar.ozelHizmetler.abonelikMetni}</span>
                    </button>
                  </li>
                )}
                {ayar.ozelHizmetler.kombinAktif && (
                  <li>
                    <button 
                      onClick={() => pencereAc('hizli_kombin')} 
                      className="hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                      <span>{ayar.ozelHizmetler.kombinMetni}</span>
                    </button>
                  </li>
                )}
                {ayar.ozelHizmetler.davetKutusuAktif && (
                  <li className="pt-2">
                    <div className="bg-[#240E2A] p-2.5 rounded-xl border border-purple-800/40 flex items-center gap-2.5">
                      <ChefHat className="w-5 h-5 text-[#FFB703] shrink-0" />
                      <div>
                        <div className="text-[11px] font-bold text-white">{ayar.ozelHizmetler.davetKutusuBaslik}</div>
                        <div className="text-[10px] text-purple-300">{ayar.ozelHizmetler.davetKutusuAltMetin}</div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* 4. Kolon: İletişim & Canlı Destek */}
          <div className="space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full shrink-0" 
                style={{ backgroundColor: ayar.iletisim.noktaRengi || '#10B981' }}
              />
              <span>{ayar.iletisim.baslik}</span>
            </h5>
            
            <div className="bg-[#1C0922] p-3 rounded-xl border border-[#3E1649] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <PhoneCall className="w-4 h-4 text-[#FFB703] shrink-0" />
                <span>{ayar.iletisim.telefon}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{ayar.iletisim.calismaSaatleri}</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-gray-400 pt-1 border-t border-purple-950">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{ayar.iletisim.adres}</span>
              </div>
            </div>

            {ayar.iletisim.canliDurumAktif && (
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>{ayar.iletisim.canliDurumMetni}</span>
              </div>
            )}
          </div>

        </div>

        {/* PayTR Güvenli Ödeme Rozet Şeridi */}
        <PaytrGuvenlikRozeti />

        {/* En Alt İmza & Telif Satırı */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>{ayar.telifMetni}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-400 flex-wrap">
            {ayar.altSozlesmeLinkleri.map((sozlesme, sIdx) => (
              <React.Fragment key={sozlesme.id || sIdx}>
                {sIdx > 0 && <span>•</span>}
                <span onClick={() => pencereAc(sozlesme.tur as any)} className="hover:text-gray-300 cursor-pointer">
                  {sozlesme.baslik}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
