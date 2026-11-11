import React from 'react';
import { Lock, Unlock, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useKorlemeKancasi } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/KorlemeKancasi';
import { KorlemeSiparisTipi } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/ZirhTipleri';
import { telefonMaskele, isimMaskele } from '@/src/MalzemeCekmeceleri/GuvenlikZirhi/MetinMaskeleyici';

export const KuryeKademeliEkran: React.FC<{ siparis: KorlemeSiparisTipi }> = ({ siparis }) => {
  const { asama, girilenPin, setGirilenPin, hata, paketiTeslimAl, teslimatiTamamla } = useKorlemeKancasi(siparis);

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-5 max-w-md space-y-4 border border-stone-800 text-xs">
      <div className="flex justify-between items-center border-b border-stone-800 pb-2">
        <span className="font-bold text-amber-400">Kurye Kademeli Görev</span>
        <span className="font-mono text-stone-400">#{siparis.siparisKodu}</span>
      </div>

      {asama === 'mutfaga_gidiliyor' && (
        <div className="space-y-3">
          <div className="bg-amber-950/50 border border-amber-800/40 p-3 rounded-xl text-amber-200">
            <p className="font-bold">1. Aşama: Mutfağa Git & Paketi Al</p>
            <p className="text-[11px] text-amber-300/70 mt-1">Mutfak Kodu: {siparis.mutfakKodu}</p>
          </div>
          <div className="bg-stone-800/60 p-3 rounded-xl flex items-center gap-2 text-stone-400">
            <Lock className="w-4 h-4 text-stone-500" />
            <span>Müşteri açık adresi güvenlik sebebiyle kilitlidir.</span>
          </div>
          <button onClick={paketiTeslimAl} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl">
            Paketi Mutfaktan Teslim Aldım
          </button>
        </div>
      )}

      {asama === 'paket_alindi' && (
        <div className="space-y-3">
          <div className="bg-emerald-950/50 border border-emerald-800/40 p-3 rounded-xl text-emerald-200">
            <p className="font-bold flex items-center gap-1.5"><Unlock className="w-3.5 h-3.5" /> 2. Aşama: Müşteriye Teslim Et</p>
            <p className="mt-1 font-semibold text-white">{siparis.acikAdres}</p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Alıcı: {isimMaskele(siparis.musteriAdi)} • {telefonMaskele(siparis.musteriTelefon)}</p>
          </div>
          <input
            type="text"
            maxLength={4}
            placeholder="Müşteriden 4 haneli PIN kodunu alıp giriniz"
            value={girilenPin}
            onChange={(e) => setGirilenPin(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-white text-center font-mono tracking-widest text-base"
          />
          {hata && <p className="text-rose-400 text-[11px] text-center">{hata}</p>}
          <button onClick={teslimatiTamamla} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl">
            PIN Kodunu Doğrula ve Bitir
          </button>
        </div>
      )}

      {asama === 'teslim_edildi' && (
        <div className="bg-emerald-900/40 border border-emerald-700/50 p-4 rounded-xl text-center space-y-1 text-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <p className="font-bold">Teslimat Başarıyla Tamamlandı!</p>
          <p className="text-[10px] text-emerald-400/70">Müşteri adres bilgileri ekrandan silindi.</p>
        </div>
      )}
    </div>
  );
};
