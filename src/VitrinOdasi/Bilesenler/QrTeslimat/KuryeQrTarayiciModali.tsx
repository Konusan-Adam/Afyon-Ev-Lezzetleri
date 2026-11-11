/**
 * 🦁 AFYON EV LEZZETLERİ - KURYE QR & PIN DOĞRULAMA MODALI
 * Kuryenin kapıda müşterinin QR kodunu canlı kamerayla tarayacağı veya PIN onaylayacağı ekran
 * Canlı Kamera Tarayıcı (jsQR) + Anında Güvenlik Doğrulaması + Otomatik Kapanış
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

import React, { useState, useCallback } from 'react';
import { X, QrCode, AlertCircle } from 'lucide-react';
import { useCanliKameraTarayici } from '@/src/MalzemeCekmeceleri/QrTeslimat/useCanliKameraTarayici';
import { KameraTaramaCercesi } from '@/src/VitrinOdasi/Bilesenler/QrTeslimat/KameraTaramaCercesi';
import { TeslimatBasariEkrani } from '@/src/VitrinOdasi/Bilesenler/QrTeslimat/TeslimatBasariEkrani';
import { ManuelPinGirisKutusu } from '@/src/VitrinOdasi/Bilesenler/QrTeslimat/ManuelPinGirisKutusu';

interface KuryeQrTarayiciModaliProps {
  siparisKodu: string;
  onKapat: () => void;
  onTeslimatTamamlandi: (kod: string, pinVeyaQr: string) => Promise<{ basarili: boolean; mesaj: string } | any> | void;
}

export const KuryeQrTarayiciModali: React.FC<KuryeQrTarayiciModaliProps> = ({
  siparisKodu,
  onKapat,
  onTeslimatTamamlandi
}) => {
  const [girilenPin, setGirilenPin] = useState('');
  const [hataMesaji, setHataMesaji] = useState<string | null>(null);
  const [islemde, setIslemde] = useState(false);
  const [basariliMi, setBasariliMi] = useState(false);

  // Canlı kamera kancası (QR algılandığı an çalışır)
  const {
    videoRef,
    kameraDurumu,
    hataMesaji: kameraHatasi,
    fenerDestegi,
    fenerAcik,
    feneriDegistir,
    kamerayiBaslat,
    kamerayiDurdur,
    sonKoduSifirla
  } = useCanliKameraTarayici({
    aktifMi: !basariliMi,
    onKodBulundu: (okunanKod) => koduDogrulaVeTeslimEt(okunanKod)
  });

  // Doğrulama işlemi (Hem QR hem de PIN için ortak ve sıkı)
  const koduDogrulaVeTeslimEt = useCallback(async (deger: string) => {
    if (islemde || basariliMi) return;
    setIslemde(true);
    setHataMesaji(null);

    try {
      const sonuc = await onTeslimatTamamlandi(siparisKodu, deger.trim());
      if (sonuc && sonuc.basarili === false) {
        setHataMesaji(sonuc.mesaj || 'Geçersiz kod! Lütfen müşterinin ekranındaki kodu kontrol ediniz.');
        // 2 saniye sonra yeni taramaya izin ver
        setTimeout(() => sonKoduSifirla(), 2000);
      } else {
        // Kamera donanımını anında kapat ve başarı ekranına geç
        kamerayiDurdur();
        setBasariliMi(true);
      }
    } catch {
      setHataMesaji('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
      setTimeout(() => sonKoduSifirla(), 2000);
    } finally {
      setIslemde(false);
    }
  }, [siparisKodu, islemde, basariliMi, onTeslimatTamamlandi, kamerayiDurdur, sonKoduSifirla]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#18071C] border border-[#521E5C] w-full max-w-sm rounded-3xl p-5 shadow-2xl text-white space-y-4">
        {/* Üst Başlık */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Canlı QR Teslimat Onayı</h3>
              <p className="text-[11px] text-amber-300 font-mono">Sipariş #{siparisKodu}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-[#2A0E33] hover:bg-[#3D144A] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Başarı Durumunda Otomatik Kapanan Ekran */}
        {basariliMi ? (
          <TeslimatBasariEkrani siparisKodu={siparisKodu} onKapat={onKapat} primTutari={45} />
        ) : (
          <>
            {/* Canlı Kamera Vizörü */}
            <KameraTaramaCercesi
              videoRef={videoRef}
              kameraDurumu={kameraDurumu}
              hataMesaji={kameraHatasi}
              fenerDestegi={fenerDestegi}
              fenerAcik={fenerAcik}
              onFeneriDegistir={feneriDegistir}
              onYenidenDene={kamerayiBaslat}
            />

            {/* Hata Bildirimi */}
            {hataMesaji && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-300 bg-rose-950/80 p-2.5 rounded-xl border border-rose-800/60 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{hataMesaji}</span>
              </div>
            )}

            {/* Manuel 4 Haneli PIN Giriş Alanı */}
            <ManuelPinGirisKutusu
              girilenPin={girilenPin}
              onPinDegisti={(p) => {
                setGirilenPin(p);
                setHataMesaji(null);
              }}
              onPinOnayla={() => koduDogrulaVeTeslimEt(girilenPin)}
              yukleniyor={islemde}
            />
          </>
        )}
      </div>
    </div>
  );
};
