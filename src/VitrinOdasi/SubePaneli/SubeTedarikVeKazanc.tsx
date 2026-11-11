import React, { useState, useEffect } from 'react';
import { Users, Plus, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { SubeUrunu, TedarikciHakedis, SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import {
  tedarikciHakedisleriniCanliDinle,
  subeGunlukRaporHesapla,
} from '@/src/MalzemeCekmeceleri/Sube/subeTedarikServisi';
import { SubeKazancOzeti } from './SubeKazancOzeti';
import { SubeTedarikGirisModali } from './SubeTedarikGirisModali';

interface Props {
  subeId: string;
  subeAdi: string;
  urunler: SubeUrunu[];
  siparisler: SubeSiparisi[];
  onYenile: () => void;
}

export const SubeTedarikVeKazanc: React.FC<Props> = ({
  subeId,
  subeAdi,
  urunler,
  siparisler,
  onYenile,
}) => {
  const [hakedisler, setHakedisler] = useState<TedarikciHakedis[]>([]);
  const [modalAcik, setModalAcik] = useState<boolean>(false);

  useEffect(() => {
    const durdur = tedarikciHakedisleriniCanliDinle(subeId, (liste) => {
      setHakedisler(liste);
    });
    return () => durdur();
  }, [subeId]);

  const rapor = subeGunlukRaporHesapla(urunler, hakedisler, siparisler);

  return (
    <div className="space-y-4">
      {/* 1. Kazanç ve Ciro Özet Kartları */}
      <SubeKazancOzeti
        toplamCiro={rapor.toplamCiro}
        tedarikciMaliyeti={rapor.toplamTedarikciMaliyeti}
        netKar={rapor.netSubeKari}
        teslimatSayisi={rapor.toplamTeslimat}
      />

      {/* 2. Tedarikçi Teslimat ve Hak Ediş Listesi */}
      <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-3.5 sm:p-5 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3E1646] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#DDAF53]" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Tedarikçi & Ev Mutfağı Hak Edişleri</h3>
              <p className="text-[10px] sm:text-[11px] text-[#A872B5]">Süper Admin (Patron) onay havuzuyla senkronize çalışır</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalAcik(true)}
            className="w-full sm:w-auto px-3.5 py-2 bg-[#6D237A] hover:bg-[#852C94] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md border border-[#9633A7]"
          >
            <Plus className="w-4 h-4" /> Yeni Teslimat Girişi
          </button>
        </div>

        {hakedisler.length === 0 ? (
          <div className="py-10 text-center text-stone-400 bg-[#180A1F] rounded-xl border border-[#3E1646] space-y-2">
            <Users className="w-8 h-8 mx-auto text-[#521E5C]" />
            <p className="text-xs">Henüz tedarikçi teslimatı kaydedilmemiş.</p>
            <p className="text-[10px] text-stone-500">"Yeni Teslimat Girişi" butonuyla ev hanımlarından gelen taze ürünleri ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {hakedisler.map((h) => (
              <div
                key={h.id}
                className="bg-[#180A1F] border border-[#3E1646] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{h.tedarikci_adi}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        h.durum === 'odendi'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : h.durum === 'onaylandi'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {h.durum === 'odendi' ? '✅ Ödendi' : h.durum === 'onaylandi' ? '👍 Patron Onayladı' : '⏳ Patron Onayı Bekliyor'}
                    </span>
                  </div>
                  <p className="text-stone-300">
                    Ürün: <strong className="text-[#DDAF53]">{h.urun_adi}</strong> • Teslim: {h.teslim_adedi} Adet (Birim Alış: {h.birim_alis_fiyati} ₺)
                  </p>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-[#2A102E] pt-2 sm:pt-0">
                  <div className="text-[10px] text-stone-400">Tedarikçi Alacağı</div>
                  <div className="text-base font-bold text-purple-300">{h.toplam_hakedis} ₺</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SubeTedarikGirisModali
        subeId={subeId}
        subeAdi={subeAdi}
        urunler={urunler}
        acikMi={modalAcik}
        onKapat={() => setModalAcik(false)}
        onBasarili={onYenile}
      />
    </div>
  );
};
