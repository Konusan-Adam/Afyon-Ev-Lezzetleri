import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Heart } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';
import { useMutfaklar } from '@/src/MalzemeCekmeceleri/MutfakCekmecesi';
import { useMusteriSiparisleri } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { veritabanindanAdresleriGetir } from '@/src/MalzemeCekmeceleri/AdresVeKonum/adresIslemleri';
import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';
import { DegerlendirmePenceresi } from '../Bilesenler/Degerlendirme/DegerlendirmePenceresi';
import { CanliSiparisTakipModali } from '../Bilesenler/CanliTakip/CanliSiparisTakipModali';
import { MusteriQrKoduModali } from '../Bilesenler/QrTeslimat/MusteriQrKoduModali';
import { MusteriSiparisIptalPenceresi } from './MusteriSiparisIptalPenceresi';
import { MusteriPanelUstBaslik } from './MusteriPanelUstBaslik';
import { MusteriSiparisKarti } from './MusteriSiparisKarti';
import { AdreslerimSekmesi } from './AdreslerimSekmesi';
import { FavorilerimSekmesi } from './FavorilerimSekmesi';

export const MusteriPaneli: React.FC = () => {
  const { aktifKullanici, panelDegistir, cikisYap } = kullaniciHafizasiKullan();
  const { mutfaklar } = useMutfaklar();
  const { sepeteEkle, sepetPaneliAc } = sepetHafizasiKullan();
  const { toplamFavoriSayisi } = favoriHafizasiKullan();

  const [aktifSekme, setAktifSekme] = useState<'siparisler' | 'adresler' | 'favoriler'>(() => {
    if (typeof window !== 'undefined') {
      const kayitli = localStorage.getItem('afyon_musteri_paneli_sekme');
      if (kayitli === 'favoriler' || kayitli === 'adresler') {
        localStorage.removeItem('afyon_musteri_paneli_sekme');
        return kayitli;
      }
    }
    return 'siparisler';
  });

  const [iptalEdilecekSiparis, setIptalEdilecekSiparis] = useState<{ id: string; kodu: string } | null>(null);
  const [takipEdilecekSiparisKodu, setTakipEdilecekSiparisKodu] = useState<string | null>(null);
  const [qrGosterilecekSiparisKodu, setQrGosterilecekSiparisKodu] = useState<string | null>(null);
  const [degerlendirilecekSiparis, setDegerlendirilecekSiparis] = useState<{
    siparisKimligi: string;
    mutfakId: string;
    mutfakAdi: string;
    yemekler: string[];
  } | null>(null);

  const sonMisafirTelefon = typeof window !== 'undefined' ? localStorage.getItem('afyon_son_misafir_telefon') || '' : '';
  const sonMisafirAd = typeof window !== 'undefined' ? localStorage.getItem('afyon_son_misafir_ad') || '' : '';
  const [kayitliAdresler, setKayitliAdresler] = useState<MusteriAdresi[]>([]);

  useEffect(() => {
    const kimlik = aktifKullanici?.kimlik || (sonMisafirTelefon ? `misafir_${sonMisafirTelefon}` : 'misafir');
    veritabanindanAdresleriGetir(kimlik).then((adr) => setKayitliAdresler(adr));
  }, [aktifKullanici, sonMisafirTelefon]);

  const { siparisler, yukleniyor, yenile } = useMusteriSiparisleri(
    aktifKullanici?.kimlik,
    aktifKullanici?.telefon || sonMisafirTelefon
  );

  const qrSeciliSiparis = qrGosterilecekSiparisKodu
    ? siparisler.find((s) => (s.siparis_kodu || s.id || s.siparisKodu) === qrGosterilecekSiparisKodu)
    : undefined;

  const sekmeButonSinifi = (aktif: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
      aktif ? 'bg-[#6D237A] text-white shadow-md' : 'bg-[#180A1F] text-gray-400 hover:text-white border border-[#3E1646]'
    }`;

  return (
    <div className="w-full min-h-screen bg-[#0C020E] text-gray-200 select-none pb-16">
      <MusteriPanelUstBaslik
        aktifKullanici={aktifKullanici}
        sonMisafirAd={sonMisafirAd}
        sonMisafirTelefon={sonMisafirTelefon}
        yukleniyor={yukleniyor}
        onVitrineDon={() => panelDegistir('vitrin')}
        onYenile={yenile}
        onCikisYap={() => { cikisYap(); panelDegistir('vitrin'); }}
      />

      <main className="anasayfa-genislik px-4 pt-6 space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-purple-950">
          <button type="button" onClick={() => setAktifSekme('siparisler')} className={sekmeButonSinifi(aktifSekme === 'siparisler')}>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Siparişlerim ({siparisler.filter((s) => s.durum !== 'iptal').length})</span>
          </button>
          <button type="button" onClick={() => setAktifSekme('adresler')} className={sekmeButonSinifi(aktifSekme === 'adresler')}>
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Kayıtlı Adreslerim</span>
          </button>
          <button type="button" onClick={() => setAktifSekme('favoriler')} className={sekmeButonSinifi(aktifSekme === 'favoriler')}>
            <Heart className={`w-4 h-4 ${toplamFavoriSayisi > 0 ? 'text-rose-400 fill-rose-500' : 'text-amber-400'}`} />
            <span>Favorilerim ({toplamFavoriSayisi})</span>
          </button>
        </div>

        {aktifSekme === 'siparisler' && (
          <div className="space-y-4">
            {siparisler.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs bg-[#180A1F] rounded-2xl border border-purple-900/40">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-50" />
                <p>Henüz verilmiş bir siparişiniz bulunmuyor.</p>
              </div>
            ) : (
              siparisler.map((sip) => (
                <MusteriSiparisKarti
                  key={sip.id}
                  siparis={sip}
                  mutfak={mutfaklar.find((m) => m.id === sip.mutfak_id)}
                  sepeteEkle={sepeteEkle}
                  sepetPaneliAc={sepetPaneliAc}
                  onTakipEt={setTakipEdilecekSiparisKodu}
                  onQrAc={setQrGosterilecekSiparisKodu}
                  onIptalEt={setIptalEdilecekSiparis}
                  onDegerlendir={setDegerlendirilecekSiparis}
                />
              ))
            )}
          </div>
        )}

        {aktifSekme === 'adresler' && <AdreslerimSekmesi kayitliAdresler={kayitliAdresler} />}
        {aktifSekme === 'favoriler' && <FavorilerimSekmesi />}
      </main>

      {takipEdilecekSiparisKodu && (
        <CanliSiparisTakipModali siparisKodu={takipEdilecekSiparisKodu} onKapat={() => setTakipEdilecekSiparisKodu(null)} />
      )}
      {qrGosterilecekSiparisKodu && (
        <MusteriQrKoduModali
          siparisKodu={qrGosterilecekSiparisKodu}
          pinKodu={qrSeciliSiparis?.pinKodu || qrSeciliSiparis?.pin_kodu || qrSeciliSiparis?.teslimat_kodu}
          onKapat={() => setQrGosterilecekSiparisKodu(null)}
        />
      )}
      {iptalEdilecekSiparis && (
        <MusteriSiparisIptalPenceresi
          siparisId={iptalEdilecekSiparis.id}
          siparisKodu={iptalEdilecekSiparis.kodu}
          onKapat={() => setIptalEdilecekSiparis(null)}
          onIptalEdildi={yenile}
        />
      )}
      {degerlendirilecekSiparis && (
        <DegerlendirmePenceresi
          siparisKimligi={degerlendirilecekSiparis.siparisKimligi}
          mutfakId={degerlendirilecekSiparis.mutfakId}
          mutfakAdi={degerlendirilecekSiparis.mutfakAdi}
          musteriAdi={aktifKullanici?.ad_soyad || sonMisafirAd || 'Misafir Müşteri'}
          yemekler={degerlendirilecekSiparis.yemekler}
          onKapat={() => setDegerlendirilecekSiparis(null)}
          onBasarili={yenile}
        />
      )}
    </div>
  );
};
