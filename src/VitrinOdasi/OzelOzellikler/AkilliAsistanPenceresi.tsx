import React, { useState } from 'react';
import { X, Sparkles, Mic, Send, Bot } from 'lucide-react';
import { ozelOzelliklerHafizasiKullan } from '@/src/OrtakHavuz/OzelOzelliklerHafizasi';

export const AkilliAsistanPenceresi: React.FC = () => {
  const { aktifPencere, pencereKapat } = ozelOzelliklerHafizasiKullan();

  const [mesajlar, setMesajlar] = useState<Array<{ gonderen: 'bot' | 'kullanici'; metin: string }>>([
    {
      gonderen: 'bot',
      metin: 'Selamlar Hemşerim! Ben Afyon Ev Lezzetleri Rehber Asistanıyım. Bugün ne yemek istersin? Bükme, Keşkek, Sucuklu Pide veya Kadayıf hakkında bana sorabilirsin!',
    },
  ]);
  const [girdimetni, setGirdimetni] = useState<string>('');

  if (aktifPencere !== 'asistan') return null;

  const mesajGonder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!girdimetni.trim()) return;

    const yeniKullaniciMesaji = girdimetni.trim();
    setMesajlar((prev) => [...prev, { gonderen: 'kullanici', metin: yeniKullaniciMesaji }]);
    setGirdimetni('');

    setTimeout(() => {
      let yanit = 'Afyon mutfağında haşhaşlı bükme ile vişne hoşafı mükemmel uyum sağlar! Şerife Abla Mutfaklarında taze yapılıyor.';
      if (yeniKullaniciMesaji.toLowerCase().includes('kalori')) {
        yanit = '1 adet mercimekli haşhaşlı Afyon bükmesi ortalama 380 kaloridir. Yanında şekersiz hoşaf önerilir!';
      } else if (yeniKullaniciMesaji.toLowerCase().includes('tatlı')) {
        yanit = 'Afyon’da tatlı denince Kaymaklı Ekmek Kadayıfı tek geçer! Şerife Hanım Ev Mutfağını denemelisin.';
      }

      setMesajlar((prev) => [...prev, { gonderen: 'bot', metin: yanit }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        
        {/* Üst Bar */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C138D6]" />
            <h3 className="font-bold text-base text-white">Akıllı Asistan — Sesli & Yazılı Rehber</h3>
          </div>
          <button
            type="button"
            onClick={pencereKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] flex items-center justify-center cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mesaj Akışı */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {mesajlar.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                m.gonderen === 'kullanici' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.gonderen === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-[#8C1D9C] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[80%] ${
                  m.gonderen === 'kullanici'
                    ? 'bg-[#6D237A] text-white rounded-tr-none'
                    : 'bg-[#2A102E] border border-[#521E5C] text-gray-200 rounded-tl-none'
                }`}
              >
                {m.metin}
              </div>
            </div>
          ))}
        </div>

        {/* Mesaj Yazma Barı */}
        <form onSubmit={mesajGonder} className="p-3 border-t border-[#3E1646] bg-[#1A0A1D] flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Sesli arama dinleniyor...')}
            className="p-2.5 rounded-xl bg-[#2A102E] hover:bg-[#3D1843] border border-[#521E5C] text-[#C138D6] cursor-pointer"
            title="Sesle Konuş"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={girdimetni}
            onChange={(e) => setGirdimetni(e.target.value)}
            placeholder="Asistana soru sorun..."
            className="flex-1 bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C138D6]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#8C1D9C] hover:bg-[#A323B5] text-white font-bold cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
