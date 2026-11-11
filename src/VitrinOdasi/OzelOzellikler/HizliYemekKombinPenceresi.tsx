import React, { useState } from 'react';
import { X, Zap, Sparkles, PlusCircle } from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz';

export const HizliYemekKombinPenceresi: React.FC = () => {
  const { aktifPencere, pencereKapat } = ozelOzelliklerHafizasiKullan();
  const { sepeteEkle, sepetPaneliAc } = sepetHafizasiKullan();

  const [seciliKombin, setSeciliKombin] = useState<number>(0);

  if (aktifPencere !== 'hizli_kombin') return null;

  const kombinler = [
    {
      baslik: 'Geleneksel Afyon Kahvaltı & Bükme Kombini',
      aciklama: 'Haşhaşlı Mercimekli Bükme + Köy Mermer Peyniri + Vişne Hoşafı',
      kisi: '1-2 Kişilik',
      fiyat: 220,
      yemek: {
        id: 'kombin_1',
        baslik: 'Haşhaşlı Bükme & Hoşaf Menüsü',
        aciklama: 'Geleneksel Afyon Usulü Bükme ve Ev Yapımı Vişne Hoşafı',
        fiyat: 220,
        kategori: 'Hızlı Kombin',
        gorsel_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=400',
        populer: true,
        puan: 4.9,
      },
    },
    {
      baslik: 'Ağır Abi Ziyafet Kombini',
      aciklama: 'Tandır Çorbası + Afyon Sukuklu Pide + Kaymaklı Ekmek Kadayıfı',
      kisi: '2-3 Kişilik',
      fiyat: 450,
      yemek: {
        id: 'kombin_2',
        baslik: 'Tandır & Sucuklu Pide Ziyafeti',
        aciklama: 'Afyon Kasap Sucuklu Pide, Çorba ve Kaymaklı Kadayıf',
        fiyat: 450,
        kategori: 'Hızlı Kombin',
        gorsel_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
        populer: true,
        puan: 5.0,
      },
    },
  ];

  const sepeteEkleVeKapat = (kombinIndex: number) => {
    const k = kombinler[kombinIndex];
    sepeteEkle('m1', k.yemek.id, 1, k.fiyat);
    pencereKapat();
    sepetPaneliAc();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Üst Bar */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#FFB703]" />
            <h3 className="font-bold text-base text-white">Hızlı Yemek — AI Akıllı Kombin</h3>
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
          <p className="text-gray-300">
            Yapay zeka asistanımız Afyon mutfağının en çok uyum sağlayan lezzetlerini sizin için tek paket haline getirdi:
          </p>

          <div className="space-y-3">
            {kombinler.map((k, idx) => (
              <div
                key={k.baslik}
                onClick={() => setSeciliKombin(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  seciliKombin === idx
                    ? 'bg-[#3D1843] border-[#FFB703] shadow-lg'
                    : 'bg-[#2A102E]/60 border-[#521E5C]'
                }`}
              >
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>{k.baslik}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
                  </div>
                  <div className="text-[10px] text-[#A872B5] mt-0.5">{k.aciklama}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{k.kisi}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-[#FFB703] text-sm">{k.fiyat} ₺</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sepeteEkleVeKapat(idx);
                    }}
                    className="mt-1 bg-[#6D237A] hover:bg-[#852C94] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-[#9633A7] cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3 text-[#FFB703]" />
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
