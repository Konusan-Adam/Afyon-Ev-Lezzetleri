import React, { useState, useMemo } from 'react';
import { Mutfak, Yemek } from '@/src/veritabani/VeriTipleri';
import { MasaustuYolHaritasi } from './MasaustuYolHaritasi';
import { MasaustuMutfakBasligi } from './MasaustuMutfakBasligi';
import { MasaustuKampanyaSeridi } from './MasaustuKampanyaSeridi';
import { MasaustuMenuFiltresi } from './MasaustuMenuFiltresi';
import { MasaustuYemekIzgarasi } from './MasaustuYemekIzgarasi';
import { MasaustuSabitSepet } from './MasaustuSabitSepet';
import { MutfakHakkindaVeYorumlar } from '../MutfakHakkindaVeYorumlar';

interface MasaustuMutfakVitriniOzellikleri {
  mutfak: Mutfak;
  yemekler: Yemek[];
  yukleniyor: boolean;
  kategoriler: string[];
  geriDonTiklandi: () => void;
}

export const MasaustuMutfakVitrini: React.FC<MasaustuMutfakVitriniOzellikleri> = ({
  mutfak,
  yemekler,
  yukleniyor,
  kategoriler,
  geriDonTiklandi
}) => {
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('Tümü');

  const filtrelenmisYemekler = useMemo(() => {
    return yemekler.filter((y) => {
      const kategoriUygun = seciliKategori === 'Tümü' || y.kategori === seciliKategori;
      const aramaUygun =
        !aramaMetni.trim() ||
        y.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        (y.aciklama && y.aciklama.toLowerCase().includes(aramaMetni.toLowerCase()));
      return kategoriUygun && aramaUygun;
    });
  }, [yemekler, seciliKategori, aramaMetni]);

  return (
    <div className="w-full min-h-screen bg-[#1A0A1D] text-white">
      {mutfak.acik_mi === false && (
        <div className="bg-rose-900/90 text-white px-4 py-2.5 text-center text-sm font-black border-b border-rose-700/50 flex items-center justify-center gap-2">
          <span>🚫 BU MUTFAK ŞU AN KAPALIDIR — Menüyü İnceleyebilirsiniz</span>
        </div>
      )}
      {/* 1. Ekmek Kırıntısı / Yol Haritası */}
      <MasaustuYolHaritasi mutfak={mutfak} geriDonTiklandi={geriDonTiklandi} />

      {/* 2. Ana Taşıyıcı Konteyner (Üst barlarla birebir 1300px ve px-4 hizalı) */}
      <main className="anasayfa-genislik px-4 py-6">
        <MasaustuMutfakBasligi mutfak={mutfak} />
        <MasaustuKampanyaSeridi mutfak={mutfak} />

        {/* 3. İki Sütunlu İskelet: Sol Menü (%70), Sağ Yüzen Sepet (%30) */}
        <div className="grid grid-cols-12 gap-6 relative">
          <section className="col-span-8 space-y-4">
            <MasaustuMenuFiltresi
              aramaMetni={aramaMetni}
              aramaDegisti={setAramaMetni}
              kategoriler={kategoriler}
              seciliKategori={seciliKategori}
              kategoriSecildi={setSeciliKategori}
            />
            <MasaustuYemekIzgarasi yemekler={filtrelenmisYemekler} yukleniyor={yukleniyor} />
            <div className="mt-8 pt-6 border-t border-purple-900/40">
              <MutfakHakkindaVeYorumlar mutfak={mutfak} />
            </div>
          </section>

          <aside className="col-span-4 h-full relative">
            <div className="sticky top-6">
              <MasaustuSabitSepet mutfak={mutfak} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
