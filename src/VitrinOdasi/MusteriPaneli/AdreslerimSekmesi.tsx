import React from 'react';
import { MapPin } from 'lucide-react';
import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';

interface AdreslerimSekmesiOzellikleri {
  kayitliAdresler: MusteriAdresi[];
}

export const AdreslerimSekmesi: React.FC<AdreslerimSekmesiOzellikleri> = ({ kayitliAdresler }) => {
  if (kayitliAdresler.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-xs bg-[#180A1F] rounded-2xl border border-purple-900/40">
        <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-50" />
        <p>Henüz kayıtlı bir adresiniz bulunmuyor.</p>
        <p className="text-[11px] text-purple-300 mt-1">
          Sipariş verirken girdiğiniz teslimat adresleri burada otomatik saklanır.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {kayitliAdresler.map((adr) => (
        <div
          key={adr.kimlik}
          className="p-4 rounded-2xl bg-[#180A1F] border border-[#3E1646] flex justify-between items-start"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{adr.adres_basligi || 'Adres'}</span>
              {adr.varsayilan_mi && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Varsayılan
                </span>
              )}
            </div>
            <p className="text-xs text-purple-200/80 mt-1">
              {adr.mahalle} {adr.cadde_sokak ? `${adr.cadde_sokak} ` : ''}
              {adr.bina_no ? `No:${adr.bina_no} ` : ''}
              {adr.daire_no && adr.daire_no !== adr.bina_no ? `D:${adr.daire_no} ` : ''}
              {adr.ilce} / {adr.il}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
