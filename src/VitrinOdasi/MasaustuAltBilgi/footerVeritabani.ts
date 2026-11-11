export interface FooterAvantaj {
  id: string;
  baslik: string;
  altBaslik: string;
  ikonAdi: 'ChefHat' | 'Heart' | 'ShieldCheck' | 'Sparkles' | 'UtensilsCrossed' | 'Bike' | 'Flame' | 'Award' | string;
  renk?: 'amber' | 'purple' | 'emerald' | 'rose' | 'blue';
}

export interface FooterBaglanti {
  id?: string;
  baslik: string;
  link: string;
  kategoriSlug?: string;
}

export interface FooterKolon {
  id: string;
  baslik: string;
  noktaRengi?: string;
  baglantilar: FooterBaglanti[];
}

export interface FooterSosyalMedya {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'tiktok' | 'whatsapp';
  url: string;
  aktif: boolean;
}

export interface FooterOzelHizmetler {
  baslik: string;
  noktaRengi: string;
  ihaleAktif: boolean;
  ihaleMetni: string;
  abonelikAktif: boolean;
  abonelikMetni: string;
  kombinAktif: boolean;
  kombinMetni: string;
  davetKutusuAktif: boolean;
  davetKutusuBaslik: string;
  davetKutusuAltMetin: string;
}

export interface FooterIletisim {
  baslik: string;
  noktaRengi: string;
  telefon: string;
  calismaSaatleri: string;
  adres: string;
  canliDurumAktif: boolean;
  canliDurumMetni: string;
}

export interface FooterAltSozlesme {
  id: string;
  baslik: string;
  tur: string;
}

export interface FooterAyar {
  sirketUnvani: string;
  altBaslik: string;
  aciklama: string;
  logoUrl: string;
  avantajlar: FooterAvantaj[];
  sosyalMedya: FooterSosyalMedya[];
  kolonlar: FooterKolon[];
  ozelHizmetler: FooterOzelHizmetler;
  iletisim: FooterIletisim;
  telifMetni: string;
  altSozlesmeLinkleri: FooterAltSozlesme[];
}

const FOOTER_DEPO_KEY = 'afyon_footer_ozel_ayarlari_v2';

export const VARSAYILAN_FOOTER_AYARI: FooterAyar = {
  sirketUnvani: 'AFYON EV LEZZETLERİ',
  altBaslik: 'Yöresel Ev Yemekleri Pazarı',
  aciklama: "Afyonkarahisar'ın maharetli ev hanımlarının fırından yeni çıkmış bükmelerini, çömlek yemeklerini ve unutulmaz tatlılarını kapınıza ulaştırıyoruz.",
  logoUrl: '/marka_logosu.jpg',
  avantajlar: [
    { id: 'av-1', baslik: 'Doğrulanmış Ev Aşçıları', altBaslik: 'Titiz hijyen ve lezzet kontrolü', ikonAdi: 'ChefHat', renk: 'amber' },
    { id: 'av-2', baslik: '%100 Anne Eli Sıcaklığı', altBaslik: 'Fabrikasyon değil, tencere yemeği', ikonAdi: 'Heart', renk: 'purple' },
    { id: 'av-3', baslik: 'Güvenli ve Sıcak Teslimat', altBaslik: 'Özel termal kutulu kurye ağı', ikonAdi: 'ShieldCheck', renk: 'emerald' },
    { id: 'av-4', baslik: 'Özel Menü & İhale', altBaslik: 'Toplu davet ve gün sofraları', ikonAdi: 'Sparkles', renk: 'rose' }
  ],
  sosyalMedya: [
    { id: 'sos-1', platform: 'instagram', url: 'https://instagram.com', aktif: true },
    { id: 'sos-2', platform: 'facebook', url: 'https://facebook.com', aktif: true },
    { id: 'sos-3', platform: 'twitter', url: 'https://twitter.com', aktif: true },
    { id: 'sos-4', platform: 'youtube', url: 'https://youtube.com', aktif: false },
    { id: 'sos-5', platform: 'tiktok', url: 'https://tiktok.com', aktif: false },
    { id: 'sos-6', platform: 'whatsapp', url: 'https://whatsapp.com', aktif: false }
  ],
  kolonlar: [
    {
      id: 'kol-1',
      baslik: 'MEŞHUR LEZZETLER',
      noktaRengi: '#FFB703',
      baglantilar: [
        { id: 'bg-1', baslik: 'Mercimekli & Haşhaşlı Bükme', link: '#', kategoriSlug: 'Bükme & Hamur' },
        { id: 'bg-2', baslik: 'Çömlek Keşkek & Dana Güveç', link: '#', kategoriSlug: 'Yöresel Ev Yemekleri' },
        { id: 'bg-3', baslik: 'Afyon Mantısı & İlibada Sarması', link: '#', kategoriSlug: 'Mantı & Sarma' },
        { id: 'bg-4', baslik: 'Kaymaklı Ekmek Kadayıfı', link: '#', kategoriSlug: 'Tatlılar' },
        { id: 'bg-5', baslik: 'Köz Patlıcan & Arabaşı Çorbası', link: '#', kategoriSlug: 'Çorbalar' }
      ]
    }
  ],
  ozelHizmetler: {
    baslik: 'ÖZEL HİZMETLER',
    noktaRengi: '#A855F7',
    ihaleAktif: true,
    ihaleMetni: 'Özel Menü İhalesi (Toplu Davetler)',
    abonelikAktif: true,
    abonelikMetni: 'Haftalık / Aylık Ev Yemeği Aboneliği',
    kombinAktif: true,
    kombinMetni: 'Akıllı Hızlı Yemek Kombini',
    davetKutusuAktif: true,
    davetKutusuBaslik: 'Ev Aşçısı mısınız?',
    davetKutusuAltMetin: 'Dükkanınızı açın, kazanın.'
  },
  iletisim: {
    baslik: 'İLETİŞİM & SİPARİŞ HATTI',
    noktaRengi: '#10B981',
    telefon: '0850 303 03 03',
    calismaSaatleri: 'Her Gün: 09:00 - 22:30',
    adres: 'Dumlupınar Mah. Yeşilyol Cad. No:14/A Afyonkarahisar',
    canliDurumAktif: true,
    canliDurumMetni: 'Kuryelerimiz ve fırınlarımız şu an aktif serviste'
  },
  telifMetni: '© 2026 Afyon Ev Lezzetleri A.Ş. • Tüm Hakları Saklıdır.',
  altSozlesmeLinkleri: [
    { id: 'soz-1', baslik: 'Kullanım Koşulları', tur: 'kullanim_kosullari' },
    { id: 'soz-2', baslik: 'Gizlilik & KVKK', tur: 'kvkk_aydinlatma' },
    { id: 'soz-3', baslik: 'Aşçı Hijyen Sözleşmesi', tur: 'hijyen_sozlesmesi' }
  ]
};

export function footerAyariniGetir(): FooterAyar {
  try {
    const kayit = localStorage.getItem(FOOTER_DEPO_KEY);
    if (kayit) {
      const ayr = JSON.parse(kayit);
      return {
        ...VARSAYILAN_FOOTER_AYARI,
        ...ayr,
        ozelHizmetler: {
          ...VARSAYILAN_FOOTER_AYARI.ozelHizmetler,
          ...(ayr.ozelHizmetler || {})
        },
        iletisim: {
          ...VARSAYILAN_FOOTER_AYARI.iletisim,
          ...(ayr.iletisim || {})
        },
        sosyalMedya: ayr.sosyalMedya && ayr.sosyalMedya.length > 0 
          ? ayr.sosyalMedya 
          : VARSAYILAN_FOOTER_AYARI.sosyalMedya,
        avantajlar: ayr.avantajlar && ayr.avantajlar.length > 0 
          ? ayr.avantajlar 
          : VARSAYILAN_FOOTER_AYARI.avantajlar,
        kolonlar: ayr.kolonlar && ayr.kolonlar.length > 0 
          ? ayr.kolonlar 
          : VARSAYILAN_FOOTER_AYARI.kolonlar,
        altSozlesmeLinkleri: ayr.altSozlesmeLinkleri && ayr.altSozlesmeLinkleri.length > 0 
          ? ayr.altSozlesmeLinkleri 
          : VARSAYILAN_FOOTER_AYARI.altSozlesmeLinkleri
      };
    }
  } catch {}
  return VARSAYILAN_FOOTER_AYARI;
}

export function footerAyariniKaydet(ayar: FooterAyar): void {
  try {
    localStorage.setItem(FOOTER_DEPO_KEY, JSON.stringify(ayar));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_footer_guncellendi', { detail: ayar }));
    }
  } catch {}
}
