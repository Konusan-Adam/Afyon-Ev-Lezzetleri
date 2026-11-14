import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Store,
  Star,
  MessageCircle,
  Ban,
  Bike,
  QrCode,
  RefreshCw,
  Heart
} from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { favoriHafizasiKullan } from '@/src/OrtakHavuz/FavoriHafizasi';
import { mutfaklariGetir } from '@/src/MalzemeCekmeceleri/Mutfak/mutfaklariGetir';
import { useMusteriSiparisleri } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { DegerlendirmePenceresi } from '../Bilesenler/Degerlendirme/DegerlendirmePenceresi';
import { siparisDegerlendirildiMi } from '@/src/MalzemeCekmeceleri/Degerlendirme/degerlendirmeDeposu';
import { MusteriSiparisIptalPenceresi } from './MusteriSiparisIptalPenceresi';
import { TekrarSiparisButonu } from './TekrarSiparisButonu';
import { CanliSiparisTakipModali } from '../Bilesenler/CanliTakip/CanliSiparisTakipModali';
import { MusteriQrKoduModali } from '../Bilesenler/QrTeslimat/MusteriQrKoduModali';
import { veritabanindanAdresleriGetir } from '@/src/MalzemeCekmeceleri/AdresVeKonum/adresIslemleri';
import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';
import { FavorilerimSekmesi } from './FavorilerimSekmesi';

export const MusteriPaneli: React.FC = () => {
  const { aktifKullanici, panelDegistir, cikisYap } = kullaniciHafizasiKullan();
  const { mutfaklar } = mutfaklariGetir();
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

  // Misafir kullanıcı ise localStorage'dan telefon ve adı al
  const sonMisafirTelefon = typeof window !== 'undefined' ? (localStorage.getItem('afyon_son_misafir_telefon') || '') : '';
  const sonMisafirAd = typeof window !== 'undefined' ? (localStorage.getItem('afyon_son_misafir_ad') || '') : '';

  const [kayitliAdresler, setKayitliAdresler] = useState<MusteriAdresi[]>([]);

  useEffect(() => {
    const kimlik = aktifKullanici?.kimlik || (sonMisafirTelefon ? `misafir_${sonMisafirTelefon}` : 'misafir');
    veritabanindanAdresleriGetir(kimlik).then((adr) => setKayitliAdresler(adr));
  }, [aktifKullanici, sonMisafirTelefon]);

  // Canlı & Senkron Müşteri Siparişleri (Firebase + Yerel Depo)
  const { siparisler, yukleniyor, yenile } = useMusteriSiparisleri(
    aktifKullanici?.kimlik,
    aktifKullanici?.telefon || sonMisafirTelefon
  );

  return (
    <div className="w-full min-h-screen bg-[#0C020E] text-gray-200 select-none pb-16">
      

      {/* Üst Başlık Barı */}
      <header className="bg-[#180A1F] border-b border-[#3E1646] px-4 py-4">
        <div className="anasayfa-genislik flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => panelDegistir('vitrin')}
              className="p-2 rounded-xl bg-[#2D1233] text-purple-300 hover:text-white border border-purple-800/40 cursor-pointer"
              title="Vitrini Aç"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-white font-black text-sm sm:text-base">
                {aktifKullanici ? 'Müşteri Hesabım & Siparişlerim' : 'Misafir Sipariş Takibi'}
              </h1>
              <p className="text-xs text-purple-300">
                {aktifKullanici 
                  ? `${aktifKullanici.ad_soyad} • ${aktifKullanici.telefon}`
                  : (sonMisafirAd 
                      ? `${sonMisafirAd} • ${sonMisafirTelefon || 'Bu Cihazdaki Siparişler'}`
                      : 'Bu Cihazdan Verilen Siparişler')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => yenile()}
              className="p-2 rounded-xl bg-[#2D1233] text-amber-400 hover:text-amber-300 border border-purple-800/40 cursor-pointer transition-transform active:scale-95"
              title="Siparişleri Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${yukleniyor ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => panelDegistir('vitrin')}
              className="px-3.5 py-1.5 rounded-xl bg-[#6D237A] text-white text-xs font-bold hover:bg-[#852C94] cursor-pointer shadow-md"
            >
              Lezzet Keşfet
            </button>
            {aktifKullanici ? (
              <button
                type="button"
                onClick={() => {
                  cikisYap();
                  panelDegistir('vitrin');
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Çıkış Yap
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Gövde ve Sekmeler */}
      <main className="anasayfa-genislik px-4 pt-6 space-y-6">
        
        {/* Sekmeler (Siparişlerim ve Kayıtlı Adreslerim) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-purple-950">
          <button
            type="button"
            onClick={() => setAktifSekme('siparisler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
              aktifSekme === 'siparisler'
                ? 'bg-[#6D237A] text-white shadow-md'
                : 'bg-[#180A1F] text-gray-400 hover:text-white border border-[#3E1646]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Siparişlerim ({siparisler.filter(s => s.durum !== 'iptal').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifSekme('adresler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
              aktifSekme === 'adresler'
                ? 'bg-[#6D237A] text-white shadow-md'
                : 'bg-[#180A1F] text-gray-400 hover:text-white border border-[#3E1646]'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Kayıtlı Adreslerim</span>
          </button>

          <button
            type="button"
            onClick={() => setAktifSekme('favoriler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap ${
              aktifSekme === 'favoriler'
                ? 'bg-[#6D237A] text-white shadow-md'
                : 'bg-[#180A1F] text-gray-400 hover:text-white border border-[#3E1646]'
            }`}
          >
            <Heart className={`w-4 h-4 ${toplamFavoriSayisi > 0 ? 'text-rose-400 fill-rose-500' : 'text-amber-400'}`} />
            <span>Favorilerim ({toplamFavoriSayisi})</span>
          </button>
        </div>

        {/* Sekme 1: Siparişler */}
        {aktifSekme === 'siparisler' && (
          <div className="space-y-4">
            {siparisler.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs bg-[#180A1F] rounded-2xl border border-purple-900/40">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-50" />
                <p>Henüz verilmiş bir siparişiniz bulunmuyor.</p>
              </div>
            ) : (
              siparisler.map((sip) => {
                const mutfak = mutfaklar.find((m) => m.id === sip.mutfak_id);
                const hazirlaniyor = sip.durum === 'hazirlaniyor';
                const yolda = sip.durum === 'yolda';
                const tamamlandi = sip.durum === 'teslim_edildi';
                const iptal = sip.durum === 'iptal';
                const aktifSiparisMi = hazirlaniyor || yolda;
                const puanlandi = siparisDegerlendirildiMi(sip.id);

                const whatsappLink = `https://wa.me/905423334455?text=${encodeURIComponent(
                  `Merhaba, #${sip.siparis_kodu} kodlu siparişim ile ilgili bilgi ve destek almak istiyorum.`
                )}`;

                return (
                  <div key={sip.id} className="p-4 rounded-2xl bg-[#1C0922] border border-amber-500/40 shadow-lg space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${hazirlaniyor ? 'bg-amber-400 animate-ping' : yolda ? 'bg-blue-400 animate-pulse' : iptal ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        <span className="font-bold text-white text-xs">#{sip.siparis_kodu}</span>
                        <span className="text-[10px] text-purple-300">({sip.olusturma_tarihi})</span>
                      </div>
                      <span className="text-xs font-extrabold text-amber-400">{sip.toplam_tutar} ₺</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-amber-400" />
                          <span>{mutfak?.ad || 'Afyon Ev Mutfağı'}</span>
                        </div>

                        {/* WhatsApp Destek Yalnızca Aktif Siparişte Görünür */}
                        {aktifSiparisMi && (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900 px-3 py-1 rounded-xl border border-emerald-700/60 shadow-sm cursor-pointer transition-all"
                            title="Sipariş için WhatsApp Destek Hattı"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-950" />
                            <span>WhatsApp Destek</span>
                          </a>
                        )}
                      </div>
                      
                      <div className="text-gray-300 pl-5">
                        {sip.elemanlar && sip.elemanlar.length > 0 ? (
                          sip.elemanlar.map((e: any, i: number) => (
                            <span key={i} className="inline-block mr-2">
                              {e.adet}x {e.yemek_baslik}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">Sipariş detayları hazırlanıyor</span>
                        )}
                      </div>
                    </div>

                    {/* Sipariş Durum İlerleme Çubuğu */}
                    <div className="pt-2 border-t border-purple-900/40">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-purple-300">Durum: <strong className={iptal ? 'text-red-400' : 'text-white'}>{sip.durum_aciklamasi}</strong></span>
                        {!iptal && (
                          <span className="text-amber-300 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Tahmini: {sip.tahmini_teslimat}</span>
                          </span>
                        )}
                      </div>

                      {!iptal ? (
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          <div className={`h-1.5 rounded-full ${hazirlaniyor || yolda || tamamlandi ? 'bg-amber-400' : 'bg-purple-950'}`} />
                          <div className={`h-1.5 rounded-full ${yolda || tamamlandi ? 'bg-blue-400' : 'bg-purple-950'}`} />
                          <div className={`h-1.5 rounded-full ${tamamlandi ? 'bg-emerald-400' : 'bg-purple-950'}`} />
                        </div>
                      ) : (
                        <div className="h-1.5 rounded-full bg-red-800 w-full" />
                      )}
                    </div>

                    {/* Alt İşlem Butonları */}
                    <div className="pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {yolda && (
                          <button
                            type="button"
                            onClick={() => setTakipEdilecekSiparisKodu(sip.siparis_kodu || sip.id || null)}
                            className="text-xs font-black text-[#130713] bg-gradient-to-r from-amber-400 to-[#F5D28A] hover:brightness-110 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                          >
                            <Bike className="w-4 h-4 stroke-[2.5]" />
                            <span>Kuryeyi Canlı Takip Et 🛵</span>
                          </button>
                        )}

                        {aktifSiparisMi && (
                          <button
                            type="button"
                            onClick={() => setQrGosterilecekSiparisKodu(sip.siparis_kodu || sip.id || null)}
                            className="text-xs font-bold text-white bg-[#2A102E] hover:bg-[#3E1646] border border-purple-700/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                            title="Kapıda Kuryeye Gösterilecek QR ve PIN"
                          >
                            <QrCode className="w-4 h-4 text-amber-400" />
                            <span>Teslimat QR Kodum 📱</span>
                          </button>
                        )}
                      </div>

                      {hazirlaniyor && (
                        <button
                          type="button"
                          onClick={() => setIptalEdilecekSiparis({ id: sip.id, kodu: sip.siparis_kodu || sip.id })}
                          className="text-[11px] text-rose-300 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Ban className="w-3 h-3 text-rose-400" />
                          <span>Siparişi İptal Et</span>
                        </button>
                      )}

                      {/* 🔁 Tekrar Sipariş Ver */}
                      {(tamamlandi || iptal) && (
                        <TekrarSiparisButonu
                          mutfakId={sip.mutfak_id || 'm1'}
                          elemanlar={sip.elemanlar}
                          sepeteEkleFonksiyonu={sepeteEkle}
                          sepetPaneliAc={sepetPaneliAc}
                        />
                      )}

                      {!hazirlaniyor && !tamamlandi && !iptal && <div />}

                      {tamamlandi && (
                        <div>
                          {puanlandi ? (
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-1 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Değerlendirildi</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDegerlendirilecekSiparis({
                                siparisKimligi: sip.id,
                                mutfakId: sip.mutfak_id || 'mutfak-fatma-teyze',
                                mutfakAdi: mutfak?.ad || 'Afyon Ev Mutfağı',
                                yemekler: (sip.elemanlar || []).map((e: any) => e.yemek_baslik)
                              })}
                              className="bg-amber-500 hover:bg-amber-400 text-[#130713] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                            >
                              <Star className="w-3.5 h-3.5 fill-[#130713]" />
                              <span>Lezzeti & Kuryeyi Puanla</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Sekme 2: Adresler */}
        {aktifSekme === 'adresler' && (
          <div className="space-y-4">
            {kayitliAdresler.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs bg-[#180A1F] rounded-2xl border border-purple-900/40">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-400 opacity-50" />
                <p>Henüz kayıtlı bir adresiniz bulunmuyor.</p>
                <p className="text-[11px] text-purple-300 mt-1">Sipariş verirken girdiğiniz teslimat adresleri burada otomatik saklanır.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kayitliAdresler.map((adr) => (
                  <div key={adr.kimlik} className="p-4 rounded-2xl bg-[#180A1F] border border-[#3E1646] flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{adr.adres_basligi || 'Adres'}</span>
                        {adr.varsayilan_mi && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Varsayılan</span>
                        )}
                      </div>
                      <p className="text-xs text-purple-200/80 mt-1">
                        {adr.mahalle} {adr.cadde_sokak ? `${adr.cadde_sokak} ` : ''}
                        {adr.bina_no ? `No:${adr.bina_no} ` : ''}
                        {adr.daire_no && adr.daire_no !== adr.bina_no ? `D:${adr.daire_no} ` : ''}
                        {adr.ilce} / {adr.il}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sekme 3: Favorilerim */}
        {aktifSekme === 'favoriler' && <FavorilerimSekmesi />}

      </main>

      {/* Canlı Kurye & Sipariş Takip Modalı */}
      {takipEdilecekSiparisKodu && (
        <CanliSiparisTakipModali
          siparisKodu={takipEdilecekSiparisKodu}
          onKapat={() => setTakipEdilecekSiparisKodu(null)}
        />
      )}

      {/* Müşteri Teslimat QR Kodu Modalı */}
      {qrGosterilecekSiparisKodu && (
        <MusteriQrKoduModali
          siparisKodu={qrGosterilecekSiparisKodu}
          pinKodu={
            siparisler.find(
              (s) => (s.siparis_kodu || s.id || s.siparisKodu) === qrGosterilecekSiparisKodu
            )?.pinKodu ||
            siparisler.find(
              (s) => (s.siparis_kodu || s.id || s.siparisKodu) === qrGosterilecekSiparisKodu
            )?.pin_kodu ||
            siparisler.find(
              (s) => (s.siparis_kodu || s.id || s.siparisKodu) === qrGosterilecekSiparisKodu
            )?.teslimat_kodu
          }
          onKapat={() => setQrGosterilecekSiparisKodu(null)}
        />
      )}

      {/* Sipariş İptal Penceresi Modalı */}
      {iptalEdilecekSiparis && (
        <MusteriSiparisIptalPenceresi
          siparisId={iptalEdilecekSiparis.id}
          siparisKodu={iptalEdilecekSiparis.kodu}
          onKapat={() => setIptalEdilecekSiparis(null)}
          onIptalEdildi={() => yenile()}
        />
      )}

      {/* Değerlendirme Penceresi Modalı */}
      {degerlendirilecekSiparis && (
        <DegerlendirmePenceresi
          siparisKimligi={degerlendirilecekSiparis.siparisKimligi}
          mutfakId={degerlendirilecekSiparis.mutfakId}
          mutfakAdi={degerlendirilecekSiparis.mutfakAdi}
          musteriAdi={aktifKullanici?.ad_soyad || sonMisafirAd || 'Misafir Müşteri'}
          yemekler={degerlendirilecekSiparis.yemekler}
          onKapat={() => setDegerlendirilecekSiparis(null)}
          onBasarili={() => {
            yenile();
          }}
        />
      )}

    </div>
  );
};
