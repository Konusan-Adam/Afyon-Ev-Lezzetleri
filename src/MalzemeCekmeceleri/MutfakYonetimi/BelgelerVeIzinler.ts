/**
 * 🦁 Afyon Ev Lezzetleri — Ev Aşçısı Yasal Belgeler ve İzinler Modülü
 * 
 * Yasal Dayanaklar:
 * 1. 1593 Sayılı Umumi Hıfzıssıhha Kanunu & Hijyen Eğitimi Yönetmeliği (MEB / Halk Eğitim)
 * 2. 193 Sayılı Gelir Vergisi Kanunu Madde 9/10 ve 9/6 (Evde İmal Edilen Malların Satışında Esnaf Muafiyeti)
 */

export type BelgeOnayDurumu = 'onay_bekliyor' | 'onaylandi' | 'reddedildi' | 'yuklenmedi';

export interface AsciYasalBelgeleri {
  // 1. Hijyen Belgesi
  hijyenBelgesiVarMi: boolean;
  hijyenBarkodNo?: string;
  hijyenBelgeGorseliUrl?: string;
  hijyenVerilisTarihi?: string;
  hijyenKurum?: string; // Örn: Afyonkarahisar Halk Eğitimi Merkezi
  hijyenOnayDurumu: BelgeOnayDurumu;
  hijyenRedSebebi?: string;

  // 2. Esnaf Vergi Muafiyet Belgesi
  esnafMuafiyetVarMi: boolean;
  vergiMuafiyetNo?: string;
  vergiDairesi?: string; // Örn: Afyonkarahisar Kocatepe Vergi Dairesi
  muafiyetBelgeGorseliUrl?: string;
  muafiyetVerilisTarihi?: string;
  muafiyetOnayDurumu: BelgeOnayDurumu;
  muafiyetRedSebebi?: string;

  // 3. Genel Uyumluluk
  sonGuncellemeTarihi: string;
}

export const RESMI_BELGE_REHBERI = {
  hijyen: {
    baslik: 'MEB Onaylı Hijyen Eğitimi Belgesi',
    kanun: '1593 Sayılı Umumi Hıfzıssıhha Kanunu & Hijyen Eğitimi Yönetmeliği',
    nasilAlinir: 'Afyonkarahisar Merkez ve İlçe Halk Eğitimi Merkezlerinden veya e-Yaygın sistemi üzerinden 8 saatlik eğitimi tamamlayarak e-Devlet onaylı barkodlu belgenizi hemen alabilirsiniz.',
    eDevletLink: 'https://www.turkiye.gov.tr/meb-sertifika-bilgileri-sorgulama',
    zorunluMu: true,
  },
  esnafMuafiyeti: {
    baslik: 'Evden Satış Esnaf Vergi Muafiyet Belgesi',
    kanun: '193 Sayılı Gelir Vergisi Kanunu 9. Madde (6 ve 10 Nolu Bentler)',
    nasilAlinir: 'İnteraktif Vergi Dairesi (ivd.gib.gov.tr) veya e-Devlet üzerinden hiçbir harç veya vergi ödemeden "Evde İmal Edilen Malların İnternetten Satışına İlişkin Esnaf Muafiyeti Belgesi" talebinde bulunup anında alabilirsiniz.',
    eDevletLink: 'https://dijital.gib.gov.tr',
    zorunluMu: true,
  }
};
