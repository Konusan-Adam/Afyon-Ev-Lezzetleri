import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, Heart, Clock, CheckCircle } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';
import { useMutfaklar } from '@/src/MalzemeCekmeceleri/MutfakCekmecesi';
import { useMusteriSiparisleri } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { siparisAktifMi, siparisIptalMi } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/siparisDurumYardimcisi';
import { veritabanindanAdresleriGetir } from '@/src/MalzemeCekmeceleri/AdresVeKonum/adresIslemleri';
import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';
import { DegerlendirmePenceresi } from '../Bilesenler/Degerlendirme/DegerlendirmePenceresi';
import { CanliSiparisTakipModali } from '../Bilesenler/CanliTakip/CanliSiparisTakipModali';
import { MusteriQrKoduModali } from '../Bilesenler/QrTeslimat/MusteriQrKoduModali';
import { MusteriSiparisIptalPenceresi } from './MusteriSiparisIptalPenceresi';
import { MusteriPanelUstBaslik } from './MusteriPanelUstBaslik';
import { MusteriSiparisKarti, type IptalTetiklemeBilgisi } from './MusteriSiparisKarti';
import { AdreslerimSekmesi } from './AdreslerimSekmesi';
import { FavorilerimSekmesi } from './FavorilerimSekmesi';
import { MutfakIptalBildirimModal } from './MutfakIptalBildirimModal';

export const MusteriPaneli: React.FC = () => {
  const { aktifKullanici, panelDegistir, cikisYap } = kullaniciHafizasiKullan();
  const { mutfaklar } = useMutfaklar();
  const { sepeteEkle, sepetPaneliAc, subelerListesi } = sepetHafizasiKullan();
  const { toplamFavoriSayisi } = favoriHafizasiKullan();

  const [aktifSekme, setAktifSekme] = useState<'aktif_siparisler' | 'gecmis_siparisler' | 'adresler' | 'favoriler'>(() => {
    if (typeof window !== 'undefined') {
      const kayitli = localStorage.getItem('afyon_musteri_paneli_sekme');
      if (kayitli === 'favoriler' || kayitli === 'adresler' || kayitli === 'gecmis_siparisler') {
        localStorage.removeItem('afyon_musteri_paneli_sekme');
        return kayitli;
      }
    }
    return 'aktif_siparisler';
  });

  const [iptalEdilecekSiparis, setIptalEdilecekSiparis] = useState<IptalTetiklemeBilgisi | null>(null);
  const [takipEdilecekSiparisKodu, setTakipEdilecekSiparisKodu] = useState<string | null>(null);
  const [qrGosterilecekSiparisKodu, setQrGosterilecekSiparisKodu] = useState<string | null>(null);
  const [degerlendirilecekSiparis, setDegerlendirilecekSiparis] = useState<{
    siparisKimligi: string;
    siparisKodu: string;
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

  const [mutfakIptalBildirimi, setMutfakIptalBildirimi] = useState<{ siparisKodu: string; aciklama?: string } | null>(null);

  useEffect(() => {
    const mutfaktanIptalEdilen = siparisler.find(
      (s) => siparisIptalMi(s.durum) && s.iptal_kaynagi === 'mutfak'
    );
    if (mutfaktanIptalEdilen) {
      const gorulduKey = `afyon_mutfak_iptal_goruldu_${mutfaktanIptalEdilen.id || mutfaktanIptalEdilen.siparis_kodu}`;
      if (typeof window !== 'undefined' && !localStorage.getItem(gorulduKey)) {
        localStorage.setItem(gorulduKey, '1');
        setMutfakIptalBildirimi({
          siparisKodu: mutfaktanIptalEdilen.siparis_kodu || mutfaktanIptalEdilen.id,
          aciklama: mutfaktanIptalEdilen.durum_aciklamasi,
        });
      }
    }
  }, [siparisler]);

  const aktifSiparisler = siparisler.filter((s) => siparisAktifMi(s.durum));
  const gecmisSiparisler = siparisler.filter((s) => !siparisAktifMi(s.durum));
  const gosterilenSiparisler = aktifSekme === 'gecmis_siparisler' ? gecmisSiparisler : aktifSiparisler;

  const qrSeciliSiparis = qrGosterilecekSiparisKodu
    ? siparisler.find((s) => (s.siparis_kodu || s.id || s.siparisKodu) === qrGosterilecekSiparisKodu)
    : undefined;

  const sekmeButonSinifi = (aktif: boolean) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 transition-all ${
      aktif
        ? 'bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-md border border-purple-500/60'
        : 'bg-[#180A1F] text-purple-300/70 hover:text-white border border-purple-900/40 hover:border-purple-800'
    }`;

  return (
    <div className="w-full min-h-screen bg-[#130713] text-gray-200 select-none pb-16">
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
        {/* 🚀 Masaüstünde Tek Sıra, Mobil ve Tablette Sola Kayar Tek Sıra Menü */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-purple-950/60 scroll-smooth flex-nowrap">
          {/* 1. Aktif Siparişlerim */}
          <button
            type="button"
            onClick={() => setAktifSekme('aktif_siparisler')}
            className={sekmeButonSinifi(aktifSekme === 'aktif_siparisler')}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Aktif Siparişlerim</span>
            {aktifSiparisler.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-950 font-black animate-pulse">
                {aktifSiparisler.length}
              </span>
            )}
          </button>

          {/* 2. Geçmiş Siparişlerim */}
          <button
            type="button"
            onClick={() => setAktifSekme('gecmis_siparisler')}
            className={sekmeButonSinifi(aktifSekme === 'gecmis_siparisler')}
          >
            <CheckCircle className="w-4 h-4 text-purple-300" />
            <span>Geçmiş Siparişlerim</span>
            {gecmisSiparisler.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-900/80 text-purple-200 font-bold">
                {gecmisSiparisler.length}
              </span>
            )}
          </button>

          {/* 3. Kayıtlı Adreslerim */}
          <button
            type="button"
            onClick={() => setAktifSekme('adresler')}
            className={sekmeButonSinifi(aktifSekme === 'adresler')}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Kayıtlı Adreslerim</span>
          </button>

          {/* 4. Favorilerim */}
          <button
            type="button"
            onClick={() => setAktifSekme('favoriler')}
            className={sekmeButonSinifi(aktifSekme === 'favoriler')}
          >
            <Heart className={`w-4 h-4 ${toplamFavoriSayisi > 0 ? 'text-rose-400 fill-rose-500' : 'text-amber-400'}`} />
            <span>Favorilerim</span>
            {toplamFavoriSayisi > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                {toplamFavoriSayisi}
              </span>
            )}
          </button>
        </div>

        {/* Sipariş Listesi (Aktif veya Geçmiş) */}
        {(aktifSekme === 'aktif_siparisler' || aktifSekme === 'gecmis_siparisler') && (
          <div className="space-y-4">
            {gosterilenSiparisler.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs bg-[#180A1F] rounded-2xl border border-purple-900/40">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-50" />
                <p>
                  {aktifSekme === 'aktif_siparisler'
                    ? 'Şu an devam eden aktif siparişiniz bulunmuyor.'
                    : 'Geçmişte tamamlanmış veya iptal edilmiş siparişiniz bulunmuyor.'}
                </p>
              </div>
            ) : (
              gosterilenSiparisler.map((sip) => {
                const eslesenMutfak = mutfaklar.find((m) => m.id === sip.mutfak_id || m.kimlik === sip.mutfak_id);
                const eslesenSube = !eslesenMutfak
                  ? subelerListesi.find((s) => (s.id || s.kimlik) === (sip.sube_id || sip.mutfak_id))
                  : undefined;
                const birimMutfak =
                  eslesenMutfak ||
                  (eslesenSube
                    ? {
                        id: eslesenSube.id || eslesenSube.kimlik || '',
                        ad: eslesenSube.ad,
                        min_siparis_tutari: 0,
                        teslimat_ucreti: 0,
                        puan: eslesenSube.puan || 5,
                        tip: 'sube' as const,
                      }
                    : undefined);

                return (
                  <MusteriSiparisKarti
                    key={sip.id}
                    siparis={sip}
                    mutfak={birimMutfak}
                    sepeteEkle={sepeteEkle}
                    sepetPaneliAc={sepetPaneliAc}
                    onTakipEt={setTakipEdilecekSiparisKodu}
                    onQrAc={setQrGosterilecekSiparisKodu}
                    onIptalEt={setIptalEdilecekSiparis}
                    onDegerlendir={setDegerlendirilecekSiparis}
                  />
                );
              })
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
          odemeYontemi={iptalEdilecekSiparis.odemeYontemi}
          odemeDurumu={iptalEdilecekSiparis.odemeDurumu}
          toplamTutar={iptalEdilecekSiparis.toplamTutar}
          onKapat={() => setIptalEdilecekSiparis(null)}
          onIptalEdildi={yenile}
        />
      )}
      {degerlendirilecekSiparis && (
        <DegerlendirmePenceresi
          siparisKimligi={degerlendirilecekSiparis.siparisKimligi}
          siparisKodu={degerlendirilecekSiparis.siparisKodu}
          mutfakId={degerlendirilecekSiparis.mutfakId}
          mutfakAdi={degerlendirilecekSiparis.mutfakAdi}
          musteriAdi={aktifKullanici?.ad_soyad || sonMisafirAd || 'Misafir Müşteri'}
          yemekler={degerlendirilecekSiparis.yemekler}
          onKapat={() => setDegerlendirilecekSiparis(null)}
          onBasarili={yenile}
        />
      )}
      {mutfakIptalBildirimi && (
        <MutfakIptalBildirimModal
          siparisKodu={mutfakIptalBildirimi.siparisKodu}
          durumAciklamasi={mutfakIptalBildirimi.aciklama}
          onKapat={() => setMutfakIptalBildirimi(null)}
        />
      )}
    </div>
  );
};
