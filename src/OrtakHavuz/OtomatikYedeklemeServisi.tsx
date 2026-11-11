import React, { useEffect, useRef } from 'react';
import { 
  yedeklemeAyarlariniGetir, 
  otomatikYedeklemeGerekiyorMu, 
  bulutaYedekGonder 
} from '@/src/MalzemeCekmeceleri/yedeklemeServisi';

/**
 * 🦁 Afyon Ev Lezzetleri — 7/24 Arka Plan Otomatik Veritabanı Yedekleme İşçisi
 * Kullanıcı hangi sayfada olursa olsun, belirlenen periyotta (saatlik/günlük/haftalık)
 * veritabanı yedeğini arka planda DirectAdmin / cPanel arşiv sunucusuna aktarır.
 */
export const OtomatikYedeklemeServisi: React.FC = () => {
  const calisiyorRef = useRef(false);

  useEffect(() => {
    const gorevKontrolEt = async () => {
      if (calisiyorRef.current) return;
      const ayarlar = yedeklemeAyarlariniGetir();

      if (otomatikYedeklemeGerekiyorMu(ayarlar)) {
        calisiyorRef.current = true;
        try {
          const sonuc = await bulutaYedekGonder(ayarlar.hedefUrl, ayarlar.apiKey);
          if (sonuc.basarili) {
            console.log('[OTOMATİK YEDEKLEME] Başarıyla tamamlandı:', new Date().toLocaleString('tr-TR'));
          } else {
            console.warn('[OTOMATİK YEDEKLEME UYARISI]:', sonuc.mesaj);
          }
        } catch (hata) {
          console.error('[OTOMATİK YEDEKLEME HATASI]:', hata);
        } finally {
          calisiyorRef.current = false;
        }
      }
    };

    // İlk açılışta gecikmeli kontrol et (sayfa yükünü hafifletmek için 3 saniye sonra)
    const ilkZamanlayici = setTimeout(gorevKontrolEt, 3000);

    // Her 10 dakikada bir periyot kontrolü yap
    const periyodikZamanlayici = setInterval(gorevKontrolEt, 1000 * 60 * 10);

    return () => {
      clearTimeout(ilkZamanlayici);
      clearInterval(periyodikZamanlayici);
    };
  }, []);

  return null;
};
