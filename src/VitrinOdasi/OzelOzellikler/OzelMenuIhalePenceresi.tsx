import React, { useState } from 'react';
import { X, FileText, Send, CheckCircle2 } from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';

export const OzelMenuIhalePenceresi: React.FC = () => {
  const { aktifPencere, pencereKapat } = ozelOzelliklerHafizasiKullan();
  const [gonderildi, setGonderildi] = useState<boolean>(false);
  const [kisiSayisi, setKisiSayisi] = useState<number>(20);
  const [etkinlikTipi, setEtkinlikTipi] = useState<string>('Düğün / Nişan');
  const [butce, setButce] = useState<string>('');
  const [notlar, setNotlar] = useState<string>('');

  if (aktifPencere !== 'ihale') return null;

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    setGonderildi(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Üst Bar */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FFB703]" />
            <h3 className="font-bold text-base text-white">Özel Menü — Kapalı Teklif İhalesi</h3>
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
          {gonderildi ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
              <h4 className="font-bold text-lg text-white">İhale Talebiniz Başarıyla Yayınlandı!</h4>
              <p className="text-gray-300">
                Afyon ev mutfakları talebinizi inceleyip size özel kapalı tekliflerini iletecektir.
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
            <form onSubmit={gonder} className="space-y-3">
              <div>
                <label className="block text-[#FFB703] font-semibold mb-1">Etkinlik Tipi</label>
                <select
                  value={etkinlikTipi}
                  onChange={(e) => setEtkinlikTipi(e.target.value)}
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white"
                >
                  <option value="Düğün / Nişan">Düğün / Nişan / Sünnet</option>
                  <option value="Toplantı / Şirket">Şirket / Toplantı Yemeği</option>
                  <option value="Mevlit / Anma">Mevlit / Anma Yemeği</option>
                  <option value="Özel Davet">Özel Aile Daveti</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Kişi Sayısı</label>
                  <input
                    type="number"
                    value={kisiSayisi}
                    onChange={(e) => setKisiSayisi(Number(e.target.value))}
                    min={5}
                    className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Kişi Başı Bütçe (₺)</label>
                  <input
                    type="text"
                    value={butce}
                    onChange={(e) => setButce(e.target.value)}
                    placeholder="Örn: 250 ₺"
                    className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Menü İsteğiniz & Notlar</label>
                <textarea
                  value={notlar}
                  onChange={(e) => setNotlar(e.target.value)}
                  placeholder="Örn: Haşhaşlı bükme, keşkek, patlıcan musakka ve kaymaklı kadayıf menüsü..."
                  rows={3}
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl p-3 text-white placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#FFB703]" />
                <span>İhaleyi Mutfaklara Gönder</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
