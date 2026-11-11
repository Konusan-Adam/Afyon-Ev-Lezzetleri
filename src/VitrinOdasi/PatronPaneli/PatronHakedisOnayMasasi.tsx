import React, { useState } from 'react';
import { CheckCircle2, Clock, ThumbsUp, DollarSign, Building2 } from 'lucide-react';
import { TedarikciHakedis } from '@/src/veritabani/SubeTipleri';
import { tedarikciHakedisDurumuGuncelle } from '@/src/MalzemeCekmeceleri/Sube/subeTedarikServisi';

interface Props {
  hakedisler: TedarikciHakedis[];
}

export const PatronHakedisOnayMasasi: React.FC<Props> = ({ hakedisler }) => {
  const [filtre, setFiltre] = useState<'tumu' | 'beklemede' | 'onaylandi' | 'odendi'>('tumu');

  const onayVer = async (id: string, durum: 'onaylandi' | 'odendi') => {
    await tedarikciHakedisDurumuGuncelle(id, durum);
  };

  const filtrelenmis = hakedisler.filter((h) => {
    if (filtre === 'tumu') return true;
    return h.durum === filtre;
  });

  const bekleyenToplam = hakedisler
    .filter((h) => h.durum === 'beklemede')
    .reduce((t, h) => t + (h.toplam_hakedis || 0), 0);

  return (
    <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-5 text-white shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3E1646] pb-3">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#DDAF53]" />
            Şube Tedarikçi Hak Ediş Onay Masası
          </h3>
          <p className="text-xs text-[#A872B5]">
            Tüm şubelerden giren ev lezzetleri ve tedarikçi hak edişleri Patron onayına tabidir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-xl font-bold">
            Onay Bekleyen: {bekleyenToplam} ₺
          </span>
        </div>
      </div>

      {/* Filtre Butonları */}
      <div className="flex items-center gap-1.5 text-xs">
        {[
          { id: 'tumu', etiket: 'Tümü' },
          { id: 'beklemede', etiket: '⏳ Onay Bekleyenler' },
          { id: 'onaylandi', etiket: '👍 Onaylananlar' },
          { id: 'odendi', etiket: '✅ Ödenenler' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltre(f.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filtre === f.id ? 'bg-[#6D237A] text-white font-bold' : 'text-[#A872B5] hover:text-white bg-[#180A1F]'
            }`}
          >
            {f.etiket}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtrelenmis.length === 0 ? (
        <div className="py-10 text-center text-stone-400 bg-[#180A1F] rounded-xl border border-[#3E1646] text-xs">
          Bu filtreye uygun tedarikçi hak ediş kaydı bulunmamaktadır.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3E1646] text-[#CFA353] bg-[#180A1F]">
                <th className="p-3">Şube</th>
                <th className="p-3">Tedarikçi</th>
                <th className="p-3">Ürün & Adet</th>
                <th className="p-3">Birim Alış</th>
                <th className="p-3">Toplam Hak Ediş</th>
                <th className="p-3">Durum</th>
                <th className="p-3 text-right">Patron Aksiyonu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1233]">
              {filtrelenmis.map((h) => (
                <tr key={h.id} className="hover:bg-[#250D2D] transition-colors">
                  <td className="p-3 font-semibold text-stone-200 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{h.sube_adi}</span>
                  </td>
                  <td className="p-3 font-bold text-white">{h.tedarikci_adi}</td>
                  <td className="p-3 text-stone-300">
                    {h.urun_adi} ({h.teslim_adedi} adet)
                  </td>
                  <td className="p-3 text-stone-400">{h.birim_alis_fiyati} ₺</td>
                  <td className="p-3 font-bold text-[#DDAF53]">{h.toplam_hakedis} ₺</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        h.durum === 'odendi'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : h.durum === 'onaylandi'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {h.durum === 'odendi' ? '✅ Ödendi' : h.durum === 'onaylandi' ? '👍 Onaylandı' : '⏳ Onay Bekliyor'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {h.durum === 'beklemede' && (
                        <button
                          type="button"
                          onClick={() => onayVer(h.id, 'onaylandi')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Onayla</span>
                        </button>
                      )}
                      {h.durum !== 'odendi' && (
                        <button
                          type="button"
                          onClick={() => onayVer(h.id, 'odendi')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Ödendi Yap</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
