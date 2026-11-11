/**
 * 🦁 AFYON EV LEZZETLERİ - MÜŞTERİ TESLİMAT QR KODU MODALI
 * Müşterinin kapıda kuryeye göstereceği güvenli kod
 * Sipariş kurye tarafından teslim edildiğinde otomatik algılar ve kapanır
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

import React, { useMemo, useState, useEffect } from 'react';
import { X, QrCode, ShieldCheck, KeyRound } from 'lucide-react';
import { GuvenliQrCizici } from '@/src/VitrinOdasi/Bilesenler/QrTeslimat/GuvenliQrCizici';
import { MusteriTeslimatBasariKarti } from '@/src/VitrinOdasi/Bilesenler/QrTeslimat/MusteriTeslimatBasariKarti';
import { useQrTeslimat } from '@/src/MalzemeCekmeceleri/useQrTeslimat';
import { koleksiyonGetir, koleksiyonuCanliDinle, canliFirebaseAktifMi } from '@/src/veritabani/FirebaseKoleksiyonServisi';

interface MusteriQrKoduModaliProps {
  siparisKodu: string;
  pinKodu?: string;
  onKapat: () => void;
}

export const MusteriQrKoduModali: React.FC<MusteriQrKoduModaliProps> = ({
  siparisKodu,
  pinKodu: gelenPinKodu,
  onKapat
}) => {
  const [canliPin, setCanliPin] = useState<string>(gelenPinKodu || '');
  const [teslimEdildiMi, setTeslimEdildiMi] = useState<boolean>(false);

  useEffect(() => {
    // 1. İlk açılışta verilen PIN varsa kullan
    if (gelenPinKodu) {
      setCanliPin(gelenPinKodu);
    }

    // 2. Canlı Firestore sipariş dinleyicisi
    let abonelikDurdur: (() => void) | null = null;

    const siparisleriIncele = (siparisler: any[]) => {
      const hedefSiparis = siparisler.find(
        (s) => s.siparisKodu === siparisKodu || s.siparis_kodu === siparisKodu || s.id === siparisKodu
      );

      if (hedefSiparis) {
        // PIN güncelleme
        const pin = hedefSiparis.pinKodu || hedefSiparis.pin_kodu || hedefSiparis.teslimat_kodu;
        if (pin) setCanliPin(String(pin));

        // Kurye teslim etti mi?
        const tamamlandi =
          hedefSiparis.asama === 'teslim_edildi' ||
          hedefSiparis.durum === 'teslim_edildi' ||
          Boolean(hedefSiparis.teslimTarihi);

        if (tamamlandi) {
          setTeslimEdildiMi(true);
        }
      }
    };

    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', siparisleriIncele);
    } else {
      koleksiyonGetir<any>('siparisler').then(siparisleriIncele);
    }

    return () => {
      if (abonelikDurdur) abonelikDurdur();
    };
  }, [siparisKodu, gelenPinKodu]);

  const { teslimatQrVerisiUret } = useQrTeslimat(siparisKodu, canliPin);
  const qrVerisi = useMemo(
    () => teslimatQrVerisiUret(siparisKodu, 'Müşteri', canliPin),
    [siparisKodu, canliPin, teslimatQrVerisiUret]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#18071C] border border-[#521E5C] w-full max-w-sm rounded-3xl p-5 shadow-2xl text-white space-y-4">
        
        {/* Üst Kısım */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#F5D28A]">Teslimat Doğrulama</h3>
              <p className="text-[11px] text-gray-400 font-mono">#{siparisKodu}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-[#2A0E33] hover:bg-[#3D144A] flex items-center justify-center text-gray-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sipariş Kurye Tarafından Teslim Edildiğinde Otomatik Kapanan Başarı Görünümü */}
        {teslimEdildiMi ? (
          <MusteriTeslimatBasariKarti siparisKodu={siparisKodu} onKapat={onKapat} />
        ) : (
          <>
            {/* QR Kod Alanı */}
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <GuvenliQrCizici veri={qrVerisi.guvenlik_imzasi} boyut={190} />
              </div>

              <p className="text-[11px] text-purple-200/90 text-center px-2">
                Kuryeniz kapıya geldiğinde bu kodu okutunuz veya aşağıdaki 4 haneli PIN kodunu iletiniz.
              </p>
            </div>

            {/* 4 Haneli Yedek PIN Kodu */}
            <div className="bg-[#120414] border border-purple-900/60 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-300 text-xs">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Yedek PIN:</span>
              </div>
              <div className="font-mono text-xl font-black tracking-widest text-[#F5D28A] bg-[#240A2B] px-3 py-1 rounded-xl border border-amber-500/30">
                {qrVerisi.teslimat_kodu}
              </div>
            </div>

            {/* Güvenlik Bilgisi */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Siparişiniz ancak siz QR veya PIN onayını verdikten sonra tamamlanır.</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

