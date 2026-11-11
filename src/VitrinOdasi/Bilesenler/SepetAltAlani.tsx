import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { TamAdresFormu } from './TamAdresFormu';
import { useKullanici } from '@/src/OrtakHavuz/KullaniciHavuzu';

import { useOnSiparis } from '@/src/OrtakHavuz/OnSiparisHafizasi';
import { Clock } from 'lucide-react';

interface Props {
  toplamTutar: number;
  onSiparisTamamla: (tamAdres: string) => void;
}

export const SepetAltAlani: React.FC<Props> = ({ toplamTutar, onSiparisTamamla }) => {
  const { kullanici } = useKullanici();
  const { tercih } = useOnSiparis();
  const [adres, setAdres] = useState({ caddeSokak: '', binaNo: '', daireNo: '' });
  const [uyari, setUyari] = useState('');

  const hemenMi = tercih.tip === 'hemen';

  const alanGuncelle = (alan: string, deger: string) => {
    setAdres((onceki) => ({ ...onceki, [alan]: deger }));
    setUyari('');
  };

  const deneVeOnayla = () => {
    if (!adres.caddeSokak.trim() || !adres.binaNo.trim()) {
      setUyari('Lütfen cadde, sokak ve bina numarasını eksiksiz giriniz.');
      return;
    }
    const tamMetin = `${kullanici?.seciliAdres || 'Afyonkarahisar'}, ${adres.caddeSokak} No:${adres.binaNo} D:${adres.daireNo || '-'}`;
    onSiparisTamamla(tamMetin);
  };

  return (
    <div className="pt-3 border-t border-stone-200 space-y-3">
      {/* Teslimat Zamanı Bilgisi */}
      <div className={`p-3 rounded-xl flex items-center justify-between border ${
        hemenMi ? 'bg-amber-50 border-amber-100' : 'bg-purple-50 border-purple-100'
      }`}>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${hemenMi ? 'text-amber-600' : 'text-purple-600'}`} />
          <span className="text-xs font-bold text-stone-700">Teslimat:</span>
        </div>
        <span className={`text-xs font-extrabold ${hemenMi ? 'text-amber-700' : 'text-purple-700'}`}>
          {hemenMi ? 'Hemen (25-35 dk)' : `${tercih.tarihEtiketi} • ${tercih.saatAraligi}`}
        </span>
      </div>

      <TamAdresFormu
        mahalle={kullanici?.seciliAdres || ''}
        caddeSokak={adres.caddeSokak}
        binaNo={adres.binaNo}
        daireNo={adres.daireNo}
        onChange={alanGuncelle}
      />

      {uyari && (
        <div className="flex items-center gap-1.5 text-rose-600 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uyari}</span>
        </div>
      )}

      <div className="flex justify-between text-base font-bold text-stone-900">
        <span>Toplam:</span>
        <span className="text-amber-800">{toplamTutar} ₺</span>
      </div>

      <button
        onClick={deneVeOnayla}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
      >
        <span>Siparişi Onayla & PIN Al</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
