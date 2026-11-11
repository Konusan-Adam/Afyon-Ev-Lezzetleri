import { kuryeAyarlariniGetir } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

// Çoklu Mutfak Rota Konsolidasyon ve İndirim Motoru

export interface KuryeUcretHesapSonucu {
  mutfakSayisi: number;
  hamToplamTeslimatUcreti: number;
  konsolidasyonIndirimi: number;
  nihaiTeslimatUcreti: number;
  ucretsizMi: boolean;
  aciklama: string;
}

export function akilliKuryeUcretiHesapla(
  mutfakSayisi: number,
  bazUcret: number,
  sepetToplamTutari: number
): KuryeUcretHesapSonucu {
  if (mutfakSayisi <= 0 || sepetToplamTutari <= 0) {
    return {
      mutfakSayisi: 0,
      hamToplamTeslimatUcreti: 0,
      konsolidasyonIndirimi: 0,
      nihaiTeslimatUcreti: 0,
      ucretsizMi: false,
      aciklama: 'Sepetiniz boş.',
    };
  }

  // Patron Masası Kontrolü: Yalnızca Patron bizzat aktif ettiyse ve belirlenen eşiğe ulaşıldıysa ücretsiz olur!
  const ayarlar = kuryeAyarlariniGetir();
  const ucretsizAktif = Boolean(ayarlar.ucretsiz_teslimat_aktif);
  const esikTutar = Number(ayarlar.ucretsiz_teslimat_esigi) || 500;

  if (ucretsizAktif && sepetToplamTutari >= esikTutar) {
    const ham = bazUcret * mutfakSayisi;
    return {
      mutfakSayisi,
      hamToplamTeslimatUcreti: ham,
      konsolidasyonIndirimi: ham,
      nihaiTeslimatUcreti: 0,
      ucretsizMi: true,
      aciklama: `${esikTutar} ₺ üzeri sepetinizde Patron Kampanyası ile Teslimat ÜCRETSİZ!`,
    };
  }

  let nihaiUcret = bazUcret; // İlk mutfak tam ücret
  let hamToplam = bazUcret * mutfakSayisi;

  if (mutfakSayisi === 2) {
    // 2. mutfak için %50 indirimli ek uğrama ücreti (bazUcret * 0.5)
    const ikinciMutfakUcreti = Math.round(bazUcret * 0.5);
    nihaiUcret = bazUcret + ikinciMutfakUcreti;
  } else if (mutfakSayisi >= 3) {
    // 1. mutfak tam, 2. mutfak %50, 3 ve sonrakiler %75 indirimli (+10 TL)
    const ikinciMutfakUcreti = Math.round(bazUcret * 0.5);
    const digerMutfaklarUcreti = (mutfakSayisi - 2) * 10;
    nihaiUcret = bazUcret + ikinciMutfakUcreti + digerMutfaklarUcreti;
  }

  const indirim = Math.max(0, hamToplam - nihaiUcret);

  return {
    mutfakSayisi,
    hamToplamTeslimatUcreti: hamToplam,
    konsolidasyonIndirimi: indirim,
    nihaiTeslimatUcreti: nihaiUcret,
    ucretsizMi: false,
    aciklama: mutfakSayisi > 1
      ? `${mutfakSayisi} farklı mutfaktan tek kuryede birleştirildi, ${indirim} TL Rota Konsolidasyon İndirimi uygulandı!`
      : 'Akıllı rota kurye ücreti hesaplandı.',
  };
}
