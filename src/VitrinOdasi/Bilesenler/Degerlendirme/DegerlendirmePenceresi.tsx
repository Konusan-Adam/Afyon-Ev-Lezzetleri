import React, { useState } from 'react';
import { X, Star, Heart, Bike, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { degerlendirmeKaydet } from '@/src/MalzemeCekmeceleri/Degerlendirme/degerlendirmeDeposu';
import { SiparisDegerlendirmesi } from '@/src/MalzemeCekmeceleri/Degerlendirme/DegerlendirmeTipleri';

interface DegerlendirmePenceresiOzellikleri {
  siparisKimligi: string;
  mutfakId: string;
  mutfakAdi: string;
  musteriAdi: string;
  yemekler?: string[];
  onKapat: () => void;
  onBasarili?: (kayit: SiparisDegerlendirmesi) => void;
}

export const DegerlendirmePenceresi: React.FC<DegerlendirmePenceresiOzellikleri> = ({
  siparisKimligi,
  mutfakId,
  mutfakAdi,
  musteriAdi,
  yemekler = [],
  onKapat,
  onBasarili,
}) => {
  const [lezzetPuani, setLezzetPuani] = useState(5);
  const [kuryePuani, setKuryePuani] = useState(5);
  const [yorum, setYorum] = useState('');
  const [tamamlandi, setTamamlandi] = useState(false);

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    const kayit = degerlendirmeKaydet({
      siparis_kimligi: siparisKimligi,
      mutfak_id: mutfakId,
      musteri_adi: musteriAdi || 'Afyonlu Misafir',
      lezzet_puani: lezzetPuani,
      kurye_puani: kuryePuani,
      yorum_metni: yorum.trim() || 'Ellerinize sağlık, çok lezzetliydi!',
      yemek_basliklari: yemekler
    });

    setTamamlandi(true);
    if (onBasarili) {
      onBasarili(kayit);
    }
    setTimeout(() => {
      onKapat();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1C0821] border border-[#521E5C] w-full max-w-md rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden">
        
        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onKapat}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {tamamlandi ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#F5D28A]">Değerlendirmeniz Alındı!</h3>
            <p className="text-xs text-purple-200/80">
              Samimi yorumunuz için teşekkür ederiz. Aşçımıza ve kuryemize iletildi.
            </p>
          </div>
        ) : (
          <form onSubmit={gonder} className="space-y-4">
            
            {/* Başlık */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[#321138] border border-[#CFA353] flex items-center justify-center mx-auto text-[#DDAF53]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#F5D28A]">Siparişi Değerlendir</h2>
              <p className="text-xs text-purple-300/80">{mutfakAdi}</p>
            </div>

            {/* Lezzet Puanı */}
            <div className="bg-[#240C2A] border border-[#3E1646] p-3.5 rounded-2xl space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <span>Lezzet & Anne Eli Puanı</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((yildiz) => (
                  <button
                    key={yildiz}
                    type="button"
                    onClick={() => setLezzetPuani(yildiz)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        yildiz <= lezzetPuani
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-amber-200/90 font-semibold block">
                {lezzetPuani === 5 ? '🏆 Parmak Isırtan Lezzet (5/5)' : `${lezzetPuani} / 5 Yıldız`}
              </span>
            </div>

            {/* Kurye ve Hız Puanı */}
            <div className="bg-[#240C2A] border border-[#3E1646] p-3.5 rounded-2xl space-y-2 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-300">
                <Bike className="w-4 h-4 text-purple-400" />
                <span>Teslimat Hızı & Kurye Nezaketi</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((yildiz) => (
                  <button
                    key={yildiz}
                    type="button"
                    onClick={() => setKuryePuani(yildiz)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        yildiz <= kuryePuani
                          ? 'text-[#DDAF53] fill-[#DDAF53]'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Samimi Yorum Alanı */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F5D28A] block">
                Samimi Yorumunuz (Aşçıya & Esnafa Not)
              </label>
              <textarea
                value={yorum}
                onChange={(e) => setYorum(e.target.value)}
                placeholder="Örn: Bükmesi çıtır çıtırdı, sıcacık geldi. Ellerinize sağlık..."
                rows={3}
                className="w-full bg-[#140616] border border-[#3E1646] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#CFA353]"
              />
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              className="w-full bg-[#CFA353] hover:bg-[#E0B25B] text-[#130713] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span className="text-xs">Değerlendirmeyi Yayınla</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
