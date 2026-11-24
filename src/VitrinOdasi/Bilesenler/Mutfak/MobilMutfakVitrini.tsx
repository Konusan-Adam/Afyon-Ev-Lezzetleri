import React, { useState, useMemo } from 'react';
import { Mutfak, Yemek } from '@/src/veritabani/VeriTipleri';
import { MobilMutfakKapak } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Mobil/MobilMutfakKapak';
import { MobilTeslimatKarti } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Mobil/MobilTeslimatKarti';
import { MobilKuponKarti } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Mobil/MobilKuponKarti';
import { MobilMenuAramaVeKategori } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Mobil/MobilMenuAramaVeKategori';
import { MutfakYemekIzgarasi } from '@/src/VitrinOdasi/Bilesenler/Mutfak/MutfakYemekIzgarasi';
import { MobilMutfakBilgiPenceresi } from '@/src/VitrinOdasi/Bilesenler/Mutfak/Mobil/MobilMutfakBilgiPenceresi';
import { MutfakHakkindaVeYorumlar } from '@/src/VitrinOdasi/Bilesenler/Mutfak/MutfakHakkindaVeYorumlar';
import { CokluMenulerVitrini } from '@/src/VitrinOdasi/Bilesenler/CokluMenu/CokluMenulerVitrini';

interface MobilMutfakVitriniOzellikleri {
  mutfak: Mutfak;
  yemekler: Yemek[];
  yukleniyor: boolean;
  kategoriler: string[];
  geriDonTiklandi: () => void;
}

export const MobilMutfakVitrini: React.FC<MobilMutfakVitriniOzellikleri> = ({
  mutfak,
  yemekler,
  yukleniyor,
  kategoriler,
  geriDonTiklandi,
}) => {
  const [seciliKategori, setSeciliKategori] = useState<string>('Tümü');
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [bilgiPenceresiAcik, setBilgiPenceresiAcik] = useState<boolean>(false);

  const filtrelenmisYemekler = useMemo(() => {
    return yemekler.filter((y) => {
      const kategoriUygun =
        seciliKategori === 'Tümü'
          ? true
          : seciliKategori === 'Popüler'
          ? y.populer
          : y.kategori === seciliKategori;

      const aramaUygun = aramaMetni.trim() === ''
        ? true
        : y.baslik.toLocaleLowerCase('tr').includes(aramaMetni.toLocaleLowerCase('tr')) ||
          y.aciklama.toLocaleLowerCase('tr').includes(aramaMetni.toLocaleLowerCase('tr'));

      return kategoriUygun && aramaUygun;
    });
  }, [yemekler, seciliKategori, aramaMetni]);

  return (
    <div className="w-full bg-[#481D52] min-h-screen pb-32 text-white select-none">
      {mutfak.mola_durumu === true ? (
        <div className="bg-amber-500 text-stone-950 px-4 py-3 text-center text-xs font-black border-b border-amber-600 flex items-center justify-center gap-2">
          <span>
            ☕ Mutfak Dinlenmede / Molada
            {(mutfak.mola_bitis_zamani || mutfak.mola_bitis_saati)
              ? ` • Tahmini Açılış: ${mutfak.mola_bitis_zamani || mutfak.mola_bitis_saati}`
              : ' • Sipariş alımı geçici olarak durduruldu'}
          </span>
        </div>
      ) : mutfak.acik_mi === false ? (
        <div className="bg-rose-900/90 text-white px-4 py-3 text-center text-xs font-bold border-b border-rose-700/50 flex items-center justify-center gap-2">
          <span>🚫 Bu mutfak şu an kapalıdır. Menüyü inceleyebilir ancak sipariş veremezsiniz.</span>
        </div>
      ) : null}
      <MobilMutfakKapak
        mutfak={mutfak}
        geriDonTiklandi={geriDonTiklandi}
        bilgiTiklandi={() => setBilgiPenceresiAcik(true)}
      />

      <MobilTeslimatKarti mutfak={mutfak} />

      <MobilKuponKarti />

      <MobilMenuAramaVeKategori
        aramaMetni={aramaMetni}
        onAramaDegisti={setAramaMetni}
        kategoriler={kategoriler}
        seciliKategori={seciliKategori}
        onKategoriSecildi={setSeciliKategori}
      />

      <div className="px-4 pt-3">
        <CokluMenulerVitrini
          mutfakId={mutfak.id}
          baslik="Çoklu Menü Paketleri"
          kompaktMi
        />
      </div>

      <MutfakYemekIzgarasi yemekler={filtrelenmisYemekler} yukleniyor={yukleniyor} />

      <div className="mt-6 pt-4 border-t border-purple-900/40">
        <MutfakHakkindaVeYorumlar mutfak={mutfak} />
      </div>

      {bilgiPenceresiAcik && (
        <MobilMutfakBilgiPenceresi
          mutfak={mutfak}
          onKapat={() => setBilgiPenceresiAcik(false)}
        />
      )}
    </div>
  );
};
