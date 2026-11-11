import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSepet } from '@/src/OrtakHavuz/SepetHavuzu';
import { useSiparisTakipKancasi } from '@/src/MalzemeCekmeceleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { SepetElemanSatiri } from './SepetElemanSatiri';
import { SepetAltAlani } from './SepetAltAlani';
import { SiparisBasariModali } from './SiparisBasariModali';

import { useOnSiparis } from '@/src/OrtakHavuz/OnSiparisHafizasi';

export const SepetCekmecesi: React.FC = () => {
  const { sepetAcikMi, sepetiAcKapat, sepetElemanlari, adetGuncelle, toplamTutar, sepetiTemizle } = useSepet();
  const { siparisKaydet } = useSiparisTakipKancasi();
  const { tercih } = useOnSiparis();
  const [onayAcik, setOnayAcik] = useState(false);
  const [sonSiparis, setSonSiparis] = useState({ kod: '', pin: '', tutar: 0 });

  if (!sepetAcikMi) {
    return <SiparisBasariModali acikMi={onayAcik} kapat={() => setOnayAcik(false)} siparisKodu={sonSiparis.kod} pinKodu={sonSiparis.pin} tutar={sonSiparis.tutar} />;
  }

  const siparisTamamla = () => {
    const kod = 'AFY-' + Math.floor(1000 + Math.random() * 9000);
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const teslimatMetni = tercih.tip === 'hemen' ? 'Hemen (En Kısa Sürede)' : `${tercih.tarihEtiketi} • ${tercih.saatAraligi}`;
    
    setSonSiparis({ kod, pin, tutar: toplamTutar });
    siparisKaydet({
      siparisKodu: kod,
      pinKodu: pin,
      asama: 'ocakta',
      tahminiDakika: tercih.tip === 'hemen' ? 30 : 0,
      sonGuncelleme: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      teslimatZamani: teslimatMetni
    });

    if (canliFirebaseAktifMi()) {
      belgeKaydet('siparisler', kod, {
        id: kod,
        siparisKodu: kod,
        siparis_kodu: kod,
        pinKodu: pin,
        pin_kodu: pin,
        teslimat_kodu: pin,
        asama: 'ocakta',
        durum: 'hazirlaniyor',
        toplam_tutar: toplamTutar,
        tutar: toplamTutar,
        elemanlar: sepetElemanlari,
        teslimat_zamani: teslimatMetni,
        olusturmaTarihi: new Date().toISOString()
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_siparis_eklendi', { detail: { id: kod, siparisKodu: kod, tutar: toplamTutar } }));
      window.dispatchEvent(new CustomEvent('afyon_yeni_mutfak_siparisi', { detail: { id: kod, siparisKodu: kod, tutar: toplamTutar } }));
    }
    sepetiTemizle();
    sepetiAcKapat(false);
    setOnayAcik(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Sipariş Sepeti</h3>
            <button onClick={() => sepetiAcKapat(false)} className="p-2 rounded-lg text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 overflow-y-auto flex-1 my-3 pr-1">
            {sepetElemanlari.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-sm">Sepetiniz henüz boş.</div>
            ) : (
              sepetElemanlari.map((e) => (
                <SepetElemanSatiri key={e.id} eleman={e} onAdetGuncelle={adetGuncelle} />
              ))
            )}
          </div>
        </div>

        {sepetElemanlari.length > 0 && (
          <SepetAltAlani toplamTutar={toplamTutar} onSiparisTamamla={siparisTamamla} />
        )}
      </div>
    </div>
  );
};
