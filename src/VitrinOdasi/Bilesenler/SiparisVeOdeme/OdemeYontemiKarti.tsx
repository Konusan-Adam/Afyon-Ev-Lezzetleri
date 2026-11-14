import React, { useEffect } from 'react';
import { CreditCard, Banknote, ShieldCheck, AlertCircle } from 'lucide-react';
import { OdemeTipi } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/odemeSecenekTipleri';
import { useOdemeSecenekleri } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/useOdemeSecenekleri';
import { OdemeSecenekSatiri } from './OdemeSecenekSatiri';

export type { OdemeTipi };

interface OdemeYontemiKartiOzellikleri {
  seciliYontem: OdemeTipi;
  onYontemSec: (yontem: OdemeTipi) => void;
}

export const OdemeYontemiKarti: React.FC<OdemeYontemiKartiOzellikleri> = ({
  seciliYontem,
  onYontemSec,
}) => {
  const {
    secenekler,
    paytrAyarlari,
    gecerliVarsayilanYontem,
    secenekAktifMi,
  } = useOdemeSecenekleri();

  useEffect(() => {
    if (!secenekAktifMi(seciliYontem) && gecerliVarsayilanYontem) {
      onYontemSec(gecerliVarsayilanYontem);
    }
  }, [seciliYontem, gecerliVarsayilanYontem, secenekler, paytrAyarlari.onlineOdemeAktif, onYontemSec, secenekAktifMi]);

  const hicAktifYok =
    secenekler.kapidaNakitAktif === false &&
    secenekler.kapidaKartAktif === false &&
    paytrAyarlari.onlineOdemeAktif === false;

  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-[#F5D28A] font-bold text-sm border-b border-[#3E1646] pb-2">
        <CreditCard className="w-4 h-4 text-[#CFA353]" />
        <span>Ödeme Yöntemi</span>
      </div>

      {hicAktifYok ? (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Şu anda aktif bir ödeme yöntemi bulunmuyor. Lütfen daha sonra tekrar deneyin.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {secenekler.kapidaNakitAktif !== false && (
            <OdemeSecenekSatiri
              baslik="Kapıda Nakit Ödeme"
              aciklama="Sipariş tesliminde kapıda nakit ödeyin"
              seciliMi={seciliYontem === 'kapida_nakit'}
              ikon={<Banknote className="w-4 h-4 text-emerald-400" />}
              onSec={() => onYontemSec('kapida_nakit')}
            />
          )}

          {secenekler.kapidaKartAktif !== false && (
            <OdemeSecenekSatiri
              baslik="Kapıda Kredi / Banka Kartı"
              aciklama="Kuryemizin getireceği POS cihazıyla ödeyin"
              seciliMi={seciliYontem === 'kapida_kart'}
              ikon={<CreditCard className="w-4 h-4 text-blue-400" />}
              onSec={() => onYontemSec('kapida_kart')}
            />
          )}

          {paytrAyarlari.onlineOdemeAktif !== false && (
            <OdemeSecenekSatiri
              baslik="Online Kredi Kartı (PayTR 3D Güvenli)"
              aciklama={
                paytrAyarlari.taksitAktif
                  ? `Visa / Mastercard / Troy • ${paytrAyarlari.maksimumTaksit} Taksite Kadar`
                  : 'PayTR güvencesiyle 256-Bit SSL anında ödeme'
              }
              seciliMi={seciliYontem === 'online_cuzdan'}
              ikon={<ShieldCheck className="w-4 h-4 text-amber-400" />}
              onSec={() => onYontemSec('online_cuzdan')}
            />
          )}
        </div>
      )}
    </div>
  );
};
