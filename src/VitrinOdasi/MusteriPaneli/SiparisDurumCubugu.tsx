import React from 'react';
import { Clock } from 'lucide-react';
import { siparisIptalMi, siparisTamamlandiMi } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/siparisDurumYardimcisi';

interface SiparisDurumCubuguOzellikleri {
  durum: string;
  durumAciklamasi?: string;
  tahminiTeslimat?: string;
}

export const SiparisDurumCubugu: React.FC<SiparisDurumCubuguOzellikleri> = ({
  durum,
  durumAciklamasi,
  tahminiTeslimat,
}) => {
  const iptal = siparisIptalMi(durum);
  const tamamlandi = siparisTamamlandiMi(durum);
  const yolda = durum === 'yolda' || durum === 'kapida';
  const hazirVeyaPaketlendi =
    durum === 'hazir' ||
    durum === 'teslime_hazir' ||
    durum === 'paketlendi';
  const hazirlaniyor =
    durum === 'beklemede' ||
    durum === 'onaylandi' ||
    durum === 'hazirlaniyor';

  return (
    <div className="pt-2 border-t border-purple-900/40">
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-purple-300">
          Durum:{' '}
          <strong className={iptal ? 'text-red-400' : 'text-white'}>
            {durumAciklamasi || 'İşleniyor'}
          </strong>
        </span>
        {!iptal && (
          <span className="text-amber-300 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Tahmini: {tahminiTeslimat || '40-50 dk'}</span>
          </span>
        )}
      </div>

      {!iptal ? (
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div className={`h-1.5 rounded-full ${hazirlaniyor || hazirVeyaPaketlendi || yolda || tamamlandi ? 'bg-amber-400' : 'bg-purple-950'}`} />
          <div className={`h-1.5 rounded-full ${hazirVeyaPaketlendi || yolda || tamamlandi ? 'bg-blue-400' : 'bg-purple-950'}`} />
          <div className={`h-1.5 rounded-full ${tamamlandi ? 'bg-emerald-400' : 'bg-purple-950'}`} />
        </div>
      ) : (
        <div className="h-1.5 rounded-full bg-red-800 w-full" />
      )}
    </div>
  );
};
