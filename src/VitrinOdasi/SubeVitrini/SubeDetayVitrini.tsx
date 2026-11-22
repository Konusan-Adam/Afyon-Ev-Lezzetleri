import React, { useState } from 'react';
import { GelAlSubesi, SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { useSubeUrunleri } from '@/src/MalzemeCekmeceleri/Sube/useSubeUrunleri';
import { SubeMobilKapak } from './SubeMobilKapak';
import { SubeYolHaritasi } from './SubeYolHaritasi';
import { SubeUrunKarti } from './SubeUrunKarti';
import { SubeSabitSepet } from './SubeSabitSepet';
import { SubeUrunDetayModali } from './SubeUrunDetayModali';
import { SubeAramaVeFiltre } from './SubeAramaVeFiltre';
import { SubeHakkindaVeYorumlar } from './SubeHakkindaVeYorumlar';
import { SubeCanliYayinModali } from './SubeCanliYayinModali';
import { MobilAltMenu } from '../MobilAnasayfa/MobilAltMenu';
import { CokluSepetVitrini } from '../Bilesenler/Sepet/CokluSepetVitrini';
import { YuzenSepetBari } from '../Bilesenler/Sepet/YuzenSepetBari';
import { KullaniciGirisPenceresi } from '../KullaniciGiris/KullaniciGirisPenceresi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';
import { useCanliDakika } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/useCanliDakika';
import { Ban } from 'lucide-react';

interface SubeDetayVitriniProps {
  sube: GelAlSubesi;
  tumSubeler: GelAlSubesi[];
  geriDonTiklandi: () => void;
  onSubeDegistir: (yeniSube: GelAlSubesi) => void;
  seciliMahalle?: string;
  mutfaklarTiklandi?: () => void;
  subelerTiklandi?: () => void;
}

export const SubeDetayVitrini: React.FC<SubeDetayVitriniProps> = ({
  sube,
  geriDonTiklandi,
  mutfaklarTiklandi,
  subelerTiklandi,
}) => {
  const subeId = sube.id || sube.kimlik || 'sube-1';
  const { urunler, yukleniyor } = useSubeUrunleri(subeId);
  const [seciliKategori, setSeciliKategori] = useState<string>('hepsi');
  const [aramaMetni, setAramaMetni] = useState<string>('');
  const [seciliDetayUrun, setSeciliDetayUrun] = useState<SubeUrunu | null>(null);
  const [canliYayinAcik, setCanliYayinAcik] = useState<boolean>(false);

  const { sepetPaneliAc } = sepetHafizasiKullan();
  const anlikDakika = useCanliDakika();
  const subeDurumu = calismaSaatiDurumuHesapla(sube, anlikDakika);

  const kategoriler = ['hepsi', ...Array.from(new Set(urunler.map((u) => u.kategori)))];
  
  // Canlı arama ve kategoriye göre süzülmüş ürünler
  const filtrelenmisUrunler = urunler.filter((u) => {
    const katUygun = seciliKategori === 'hepsi' || u.kategori === seciliKategori;
    const aramaUygun = !aramaMetni.trim() || 
      u.ad.toLocaleLowerCase('tr').includes(aramaMetni.toLocaleLowerCase('tr')) ||
      (u.aciklama && u.aciklama.toLocaleLowerCase('tr').includes(aramaMetni.toLocaleLowerCase('tr')));
    return katUygun && aramaUygun;
  });

  return (
    <div className="w-full min-h-screen bg-[#14061A] text-white pb-28">
      {/* 1. Masaüstü Yol Haritası (Mutfak Vitrini ile Birebir Aynı Tasarım Dili) */}
      <div className="hidden lg:block">
        <SubeYolHaritasi sube={sube} geriDonTiklandi={geriDonTiklandi} />
      </div>

      {/* Şube Kapak Alanı */}
      <SubeMobilKapak
        sube={sube}
        urunSayisi={urunler.length}
        geriDonTiklandi={geriDonTiklandi}
        onCanliYayinAc={() => setCanliYayinAcik(true)}
      />

      {/* Şube Detay İçerik Alanı: Sol Kolon Ürünler (%70) + Sağ Kolon Kayan Sabit Sepet (%30) */}
      <div className="anasayfa-genislik px-4 pb-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Sol Kolon: Canlı Arama + Kategoriler & Ürünler + En Altta Yorumlar */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* 1. Şube İçi Canlı Arama ve Kategori Filtreleri */}
            <SubeAramaVeFiltre
              aramaMetni={aramaMetni}
              onAramaDegisti={setAramaMetni}
              kategoriler={kategoriler}
              seciliKategori={seciliKategori}
              onKategoriSecildi={setSeciliKategori}
            />

            {!subeDurumu.acikMi && (
              <div className="bg-rose-950/70 border border-rose-500/60 p-3.5 rounded-2xl flex items-center gap-2.5 text-rose-200 text-xs font-semibold">
                <Ban className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{subeDurumu.uyariMetni || 'Bu şube şu an çalışma saatleri dışındadır.'}</span>
              </div>
            )}

            {/* 2. Şube Tezgah Ürün Listesi */}
            {yukleniyor ? (
              <div className="py-24 text-center text-amber-300 text-sm">Şube canlı stokları yükleniyor...</div>
            ) : filtrelenmisUrunler.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm bg-[#1E0926]/60 rounded-2xl border border-purple-900/40 p-6">
                Aradığınız kriterde hazır ürün bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtrelenmisUrunler.map((urun) => (
                  <SubeUrunKarti
                    key={urun.id}
                    urun={urun}
                    sube={sube}
                    onGelAlSecildi={sepetPaneliAc}
                    detayAc={(u) => setSeciliDetayUrun(u)}
                  />
                ))}
              </div>
            )}

            {/* 3. Şube Hakkında Hijyen ve Müşteri Yorum Değerlendirme Alanı (En Altta) */}
            <SubeHakkindaVeYorumlar sube={sube} />
          </div>

          {/* Sağ Kolon: Masaüstünde Sayfayla Birlikte Kayan Sabit Sepet (%30) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-4">
            <SubeSabitSepet sube={sube} />
          </aside>

        </div>
      </div>

      {/* Mobil Alt Menü */}
      <div className="lg:hidden">
        <MobilAltMenu 
          anasayfayaDon={geriDonTiklandi}
          subelerTiklandi={subelerTiklandi || (() => {})}
          mutfaklarTiklandi={mutfaklarTiklandi}
          aktifSekme="subeler"
        />
      </div>

      {/* Yüzen Sepet Çubuğu */}
      <YuzenSepetBari />

      {/* Çoklu Sepet Çekmecesi & Ödeme Akışı */}
      <CokluSepetVitrini />

      {/* Ürün Detay ve Fotoğraf Modalı */}
      {seciliDetayUrun && (
        <SubeUrunDetayModali
          urun={seciliDetayUrun}
          onKapat={() => setSeciliDetayUrun(null)}
          onGelAlSecildi={sepetPaneliAc}
        />
      )}

      {/* 🔴 Şubeyi Canlı İzle Modalı */}
      {canliYayinAcik && (
        <SubeCanliYayinModali
          sube={sube}
          onKapat={() => setCanliYayinAcik(false)}
        />
      )}

      {/* Kullanıcı Giriş Penceresi */}
      <KullaniciGirisPenceresi />
    </div>
  );
};

