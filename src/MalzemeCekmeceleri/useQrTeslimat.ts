/**
 * 🦁 AFYON EV LEZZETLERİ - QR TESLİMAT MALZEME ÇEKMECESİ
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

import { useState, useCallback } from 'react';
import { QrTeslimatVerisi, QrDogrulamaSonucu } from '@/src/MalzemeCekmeceleri/QrTeslimat/QrTeslimatTipleri';

export function useQrTeslimat(siparisKodu?: string, girilenGercekPin?: string) {
  // Müşteriye özel teslimat QR verisi üretir
  const teslimatQrVerisiUret = useCallback((kod: string, musteriAdi: string = 'Müşteri', gercekPin?: string): QrTeslimatVerisi => {
    let pinKodu = (gercekPin || girilenGercekPin || '').trim();
    if (!pinKodu) {
      // 🛡️ Asla sipariş kodunun rakamlarından şifre üretilemez!
      pinKodu = '0000';
    }
    const zaman = new Date().toISOString();
    
    return {
      siparis_id: `sip-${kod}`,
      siparis_kodu: kod,
      teslimat_kodu: pinKodu,
      guvenlik_imzasi: `AFYON-TESLIMAT-${kod}-${pinKodu}`,
      olusturulma_zamani: zaman,
      son_gecerlilik_zamani: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      musteri_adi: musteriAdi,
      teslim_edildi_mi: false
    };
  }, [girilenGercekPin]);

  const [aktifQr, setAktifQr] = useState<QrTeslimatVerisi | null>(() => {
    return siparisKodu ? teslimatQrVerisiUret(siparisKodu, 'Müşteri', girilenGercekPin) : null;
  });

  // Kurye tarafından gelen QR verisini veya PIN'i doğrular
  const qrVeyaPinDogrula = useCallback((girilenDeger: string, beklenenVeri?: QrTeslimatVerisi): QrDogrulamaSonucu => {
    const temizDeger = girilenDeger.trim().toUpperCase();
    const hedef = beklenenVeri || aktifQr;

    if (!hedef) {
      return { basarili_mi: false, mesaj: 'Doğrulanacak aktif sipariş bulunamadı.' };
    }

    if (!hedef.teslimat_kodu || hedef.teslimat_kodu === '0000') {
      return { basarili_mi: false, mesaj: 'Bu siparişin teslimat PIN kodu henüz tanımlanmamış.' };
    }

    // 1. PIN ile doğrulama (Müşterinin kapıda söylediği gerçek 4 Haneli Kod)
    if (temizDeger === hedef.teslimat_kodu) {
      return {
        basarili_mi: true,
        mesaj: `Teslimat PIN kodu doğrulandı! Sipariş #${hedef.siparis_kodu} başarıyla teslim edildi.`,
        siparis_kodu: hedef.siparis_kodu,
        teslim_zamani: new Date().toLocaleTimeString('tr-TR')
      };
    }

    // 2. QR Güvenlik İmzası ile doğrulama (Müşterinin telefonundaki güvenli imzayı ve sipariş kodunu içerir)
    const qrGecerli = temizDeger === hedef.guvenlik_imzasi.toUpperCase() || 
      (temizDeger.length > 4 && temizDeger.includes(hedef.teslimat_kodu) && temizDeger.includes(hedef.siparis_kodu.toUpperCase()));

    if (qrGecerli) {
      return {
        basarili_mi: true,
        mesaj: `QR Kod başarıyla tarandı! Sipariş #${hedef.siparis_kodu} kurye tarafından teslim edildi.`,
        siparis_kodu: hedef.siparis_kodu,
        teslim_zamani: new Date().toLocaleTimeString('tr-TR')
      };
    }

    return {
      basarili_mi: false,
      mesaj: 'Hatalı teslimat kodu veya geçersiz QR! Lütfen müşterinin ekranındaki kodu kontrol ediniz.'
    };
  }, [aktifQr]);

  return {
    aktifQr,
    setAktifQr,
    teslimatQrVerisiUret,
    qrVeyaPinDogrula
  };
}
