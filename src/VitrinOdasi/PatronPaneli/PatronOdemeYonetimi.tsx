import React from 'react';
import { Sliders } from 'lucide-react';
import { useOdemeSecenekleri } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/useOdemeSecenekleri';
import { OdemeTipi } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/odemeSecenekTipleri';
import {
  odemeSecenekleriniKaydet,
  paytrAyarlariniKaydet,
} from '@/src/MalzemeCekmeceleri/Paytr/paytrYonetimServisi';
import { PatronPaytrDurumKarti } from './PatronPaytrDurumKarti';

export const PatronOdemeYonetimi: React.FC = () => {
  const { secenekler, paytrAyarlari } = useOdemeSecenekleri();

  const secenekDegistir = (alan: 'kapidaNakitAktif' | 'kapidaKartAktif', deger: boolean) =>
    odemeSecenekleriniKaydet({ ...secenekler, [alan]: deger });

  const varsayilanDegistir = (varsayilanYontem: OdemeTipi) =>
    odemeSecenekleriniKaydet({ ...secenekler, varsayilanYontem });

  const paytrDegistir = (yeni: Partial<typeof paytrAyarlari>) =>
    paytrAyarlariniKaydet({ ...paytrAyarlari, ...yeni });

  const anahtarButon = (aktif: boolean, etiket: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
        aktif
          ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
          : 'bg-[#180A1F] border-[#3E1646] text-gray-400'
      }`}
    >
      <span>{etiket}</span>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30">
        {aktif ? 'Açık' : 'Kapalı'}
      </span>
    </button>
  );

  return (
    <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#DDAF53]" />
          <span>Ödeme Seçenekleri ve PayTR Sanal POS Yönetimi</span>
        </h3>
        <select
          value={secenekler.varsayilanYontem}
          onChange={(e) => varsayilanDegistir(e.target.value as OdemeTipi)}
          className="bg-[#180A1F] border border-[#521E5C] rounded-xl px-3 py-1.5 text-xs text-white outline-none"
        >
          <option value="kapida_nakit">Varsayılan: Kapıda Nakit</option>
          <option value="kapida_kart">Varsayılan: Kapıda Kart</option>
          <option value="online_cuzdan">Varsayılan: Online Kart (PayTR)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {anahtarButon(secenekler.kapidaNakitAktif !== false, 'Kapıda Nakit', () =>
          secenekDegistir('kapidaNakitAktif', secenekler.kapidaNakitAktif === false)
        )}
        {anahtarButon(secenekler.kapidaKartAktif !== false, 'Kapıda Kredi Kartı', () =>
          secenekDegistir('kapidaKartAktif', secenekler.kapidaKartAktif === false)
        )}
        {anahtarButon(paytrAyarlari.onlineOdemeAktif, 'Online Kart (PayTR)', () =>
          paytrDegistir({ onlineOdemeAktif: !paytrAyarlari.onlineOdemeAktif })
        )}
        {anahtarButon(paytrAyarlari.testModu, 'PayTR Test Modu', () =>
          paytrDegistir({ testModu: !paytrAyarlari.testModu })
        )}
        {anahtarButon(paytrAyarlari.demoSimulasyonAktif, 'Demo 3D Simülasyon', () =>
          paytrDegistir({ demoSimulasyonAktif: !paytrAyarlari.demoSimulasyonAktif })
        )}
        {anahtarButon(paytrAyarlari.taksitAktif, `Taksit (Maks ${paytrAyarlari.maksimumTaksit})`, () =>
          paytrDegistir({ taksitAktif: !paytrAyarlari.taksitAktif })
        )}
      </div>

      <PatronPaytrDurumKarti />
    </div>
  );
};
