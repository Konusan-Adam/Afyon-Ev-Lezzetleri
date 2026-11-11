import React from 'react';
import { X, KeyRound, Clock } from 'lucide-react';
import { TakipVerisiTipi } from '@/src/MalzemeCekmeceleri';
import { SiparisDurumCubugu } from './SiparisDurumCubugu';

interface Props {
  acikMi: boolean;
  siparis: TakipVerisiTipi | null;
  onKapat: () => void;
}

export const SiparisTakipPenceresi: React.FC<Props> = ({ acikMi, siparis, onKapat }) => {
  if (!acikMi || !siparis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Canlı Sipariş Takibi</span>
            <h3 className="font-bold text-stone-900 text-sm">#{siparis.siparisKodu}</h3>
          </div>
          <button onClick={onKapat} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <SiparisDurumCubugu asama={siparis.asama} />

        {siparis.asama === 'teslim_edildi' ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
            <div className="text-2xl">🎉</div>
            <div className="text-sm font-bold text-emerald-900">Siparişiniz Teslim Edildi!</div>
            <p className="text-[11px] text-emerald-700">Afiyet olsun! Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-800 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Kurye Teslimat PIN Kodunuz</span>
            </div>
            <div className="text-3xl font-black tracking-widest text-amber-900">{siparis.pinKodu}</div>
            <p className="text-[10px] text-amber-700/80">Kurye kapınıza ulaştığında bu kodu iletiniz.</p>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          {siparis.teslimatZamani && (
            <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-3 py-2 rounded-xl border border-purple-100">
              <Clock className="w-4 h-4" />
              <span className="font-bold">Teslimat Vakti: {siparis.teslimatZamani}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Tahmini Varış: <strong>{siparis.tahminiDakika} dk</strong></span>
            </div>
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">Canlı Takip Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};
