import React, { useState } from 'react';
import { X, Calendar, Check, ShieldCheck } from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';

export const YemekAboneligiPenceresi: React.FC = () => {
  const { aktifPencere, pencereKapat } = ozelOzelliklerHafizasiKullan();
  const [seciliPaket, setSeciliPaket] = useState<'haftalik' | 'aylik'>('aylik');
  const [basarili, setBasarili] = useState<boolean>(false);

  if (aktifPencere !== 'abonelik') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Üst Bar */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFB703]" />
            <h3 className="font-bold text-base text-white">Yemek Aboneliği — %25 İndirimli Paketler</h3>
          </div>
          <button
            type="button"
            onClick={pencereKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] flex items-center justify-center cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs space-y-4">
          {basarili ? (
            <div className="py-8 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-green-400 mx-auto" />
              <h4 className="font-bold text-lg text-white">Abonelik İsteğiniz Alındı!</h4>
              <p className="text-gray-300">
                Mutfak ekibimiz haftalık yemek takviminizi onaylamak için sizinle iletişime geçecektir.
              </p>
              <button
                type="button"
                onClick={pencereKapat}
                className="mt-4 bg-[#6D237A] hover:bg-[#852C94] text-white px-6 py-2.5 rounded-xl font-bold border border-[#9633A7] cursor-pointer"
              >
                Tamam
              </button>
            </div>
          ) : (
            <>
              {/* Paket Seçenekleri */}
              <div className="grid grid-cols-2 gap-3">
                {/* Paket 1: Haftalık */}
                <div
                  onClick={() => setSeciliPaket('haftalik')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    seciliPaket === 'haftalik'
                      ? 'bg-[#3D1843] border-[#FFB703] shadow-md'
                      : 'bg-[#2A102E]/60 border-[#521E5C]'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Haftalık Ev Yemeği</div>
                  <div className="text-[10px] text-[#A872B5] mt-0.5">5 Gün Sıcak Menü</div>
                  <div className="text-lg font-extrabold text-[#FFB703] mt-2">650 ₺ <span className="text-[10px] text-gray-400 font-normal">/ hafta</span></div>
                </div>

                {/* Paket 2: Aylık */}
                <div
                  onClick={() => setSeciliPaket('aylik')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    seciliPaket === 'aylik'
                      ? 'bg-[#3D1843] border-[#FFB703] shadow-md'
                      : 'bg-[#2A102E]/60 border-[#521E5C]'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 bg-[#FFB703] text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded-md uppercase">
                    %25 İNDİRİM
                  </span>
                  <div className="font-bold text-white text-xs">Aylık VIP Abonelik</div>
                  <div className="text-[10px] text-[#A872B5] mt-0.5">22 Gün Sıcak Ev Yemeği</div>
                  <div className="text-lg font-extrabold text-[#FFB703] mt-2">2.200 ₺ <span className="text-[10px] text-gray-400 font-normal">/ ay</span></div>
                </div>
              </div>

              {/* Avantajlar */}
              <div className="bg-[#2A102E] border border-[#521E5C] rounded-xl p-3 space-y-1.5">
                <div className="font-bold text-white text-[11px] mb-1">Abonelik Avantajları:</div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Her gün saat 12:00 veya 18:00'de sıcak teslimat</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>İstediğiniz gün menüyü ücretsiz değiştirme hakkı</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Teslimat ücreti tamamen ücretsiz</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBasarili(true)}
                className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] cursor-pointer"
              >
                <span>Aboneliği Başlat (%25 İndirimli)</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
