import React, { useEffect, useRef, useState } from 'react';
import { X, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { usePaytrAyarlari } from '@/src/MalzemeCekmeceleri/Paytr/usePaytrAyarlari';
import {
  paytrOturumBaslat,
  paytrDurumSorgula,
} from '@/src/MalzemeCekmeceleri/Paytr/paytrApiIstemcisi';
import { PaytrDemoOdemeEkrani } from './PaytrDemoOdemeEkrani';

interface PaytrOdemePenceresiOzellikleri {
  tutar: number;
  sepet: Array<{ ad: string; fiyat: number; adet: number }>;
  musteri: { adSoyad: string; telefon: string; adres: string };
  onOdemeBasarili: (paytrOid: string) => void;
  onKapat: () => void;
}

export const PaytrOdemePenceresi: React.FC<PaytrOdemePenceresiOzellikleri> = ({
  tutar,
  sepet,
  musteri,
  onOdemeBasarili,
  onKapat,
}) => {
  const { ayarlar } = usePaytrAyarlari();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hataMesaji, setHataMesaji] = useState('');
  const [merchantOid, setMerchantOid] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [demoMod, setDemoMod] = useState(false);
  const onayTetiklendiRef = useRef(false);

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);
    setHataMesaji('');

    paytrOturumBaslat({ tutar, sepet, musteri, ayarlar })
      .then((yanit) => {
        if (iptal) return;
        if (!yanit.basarili || !yanit.merchantOid) {
          setHataMesaji(yanit.hata || 'PayTR ödeme oturumu başlatılamadı.');
          setYukleniyor(false);
          return;
        }
        setMerchantOid(yanit.merchantOid);
        setDemoMod(Boolean(yanit.demoMod));
        setIframeUrl(yanit.iframeUrl || '');
        setYukleniyor(false);
      })
      .catch(() => {
        if (!iptal) {
          setHataMesaji('PayTR sunucusuna bağlanılamadı.');
          setYukleniyor(false);
        }
      });

    return () => {
      iptal = true;
    };
    // Modal açılışında tek oturum başlatılır
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!merchantOid) return;
    const zamanlayici = setInterval(async () => {
      try {
        const sonuc = await paytrDurumSorgula(merchantOid);
        if (sonuc.durum === 'odendi' && !onayTetiklendiRef.current) {
          onayTetiklendiRef.current = true;
          clearInterval(zamanlayici);
          onOdemeBasarili(merchantOid);
        } else if (sonuc.durum === 'hata') {
          clearInterval(zamanlayici);
          setHataMesaji(sonuc.hataMesaji || 'Ödeme işlemi başarısız oldu.');
        }
      } catch {}
    }, 1500);

    return () => clearInterval(zamanlayici);
  }, [merchantOid, onOdemeBasarili]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-xl bg-[#180A1F] border border-[#521E5C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 bg-[#220B2B] border-b border-[#3E1646] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#F5D28A] font-black text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>PayTR Güvenli Ödeme ({tutar.toFixed(2)} ₺)</span>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="w-8 h-8 rounded-full bg-[#2D1233] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {yukleniyor && (
            <div className="py-12 flex flex-col items-center gap-3 text-purple-200 text-xs">
              <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
              <span>PayTR güvenli ödeme oturumu hazırlanıyor...</span>
            </div>
          )}

          {!yukleniyor && hataMesaji && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-700/70 text-rose-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{hataMesaji}</span>
              </div>
              <button
                type="button"
                onClick={onKapat}
                className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Ödeme Ekranına Dön
              </button>
            </div>
          )}

          {!yukleniyor && !hataMesaji && demoMod && merchantOid && (
            <PaytrDemoOdemeEkrani
              merchantOid={merchantOid}
              tutar={tutar}
              taksitBilgisi={
                ayarlar.taksitAktif
                  ? `Taksit Seçeneği Aktif (Maks. ${ayarlar.maksimumTaksit} Taksit)`
                  : undefined
              }
            />
          )}

          {!yukleniyor && !hataMesaji && !demoMod && iframeUrl && (
            <iframe
              src={iframeUrl}
              title="PayTR 3D Güvenli Ödeme"
              className="w-full h-[520px] rounded-2xl border border-purple-900/60 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};
