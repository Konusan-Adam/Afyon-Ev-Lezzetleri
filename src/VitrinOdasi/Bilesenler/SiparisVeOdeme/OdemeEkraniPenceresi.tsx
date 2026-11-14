import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, AlertCircle } from 'lucide-react';
import { sepetHafizasiKullan, teslimatHafizasiKullan, useOnSiparis, type MutfakSepetGrubu } from '@/src/OrtakHavuz';
import { veritabaninaSiparisOlustur } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/siparisIslemleri';
import { TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { AdresSecimKarti } from './AdresSecimKarti';
import { ZamanSecimKarti } from './ZamanSecimKarti';
import { OdemeYontemiKarti, OdemeTipi } from './OdemeYontemiKarti';
import { SiparisOzetKarti } from './SiparisOzetKarti';
import { SiparisBasariliKutusu } from './SiparisBasariliKutusu';
import { MisafirIletisimKarti } from './MisafirIletisimKarti';
import { telefonGecerliMi, telefonuStandartlastir } from '@/src/MalzemeCekmeceleri/Dogrulama/telefonDogrulayici';
import { hukukiLogKaydet } from '@/src/MalzemeCekmeceleri';
import { misafirProfiliniGetir, misafirProfiliniKaydetVeGuncelle, type MisafirProfili } from '@/src/MalzemeCekmeceleri/misafirIslemleri';
import { useKuponHesaplayici } from '@/src/MalzemeCekmeceleri/useKuponHesaplayici';
import { useOdemeSecenekleri } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/useOdemeSecenekleri';
import { PaytrOdemePenceresi } from './PaytrOdemePenceresi';

interface OdemeEkraniPenceresiOzellikleri {
  grup?: MutfakSepetGrubu;
  gruplar?: MutfakSepetGrubu[];
  onKapat: () => void;
}

export const OdemeEkraniPenceresi: React.FC<OdemeEkraniPenceresiOzellikleri> = ({
  grup,
  gruplar = [],
  onKapat,
}) => {
  const { aktifKullanici } = kullaniciHafizasiKullan();
  const { mutfakSepetiniTemizle, sepetiTamamenTemizle, sepetPaneliKapat } = sepetHafizasiKullan();
  const {
    teslimatTipi,
    seciliAdres,
    seciliGelAlSubesi,
    adresSecimPenceresiAc,
    gelAlPenceresiAc,
  } = teslimatHafizasiKullan();
  const { tercih, tercihGuncelle } = useOnSiparis();

  const containerRef = useRef<HTMLDivElement>(null);

  // İşlenecek mutfak grupları
  const aktifGruplar: MutfakSepetGrubu[] =
    gruplar.length > 0 ? gruplar : grup ? [grup] : [];

  const gelAlMi = teslimatTipi === 'gel_al';

  // İsim & Telefon
  const [adSoyad, setAdSoyad] = useState(aktifKullanici?.ad_soyad || '');
  const [telefon, setTelefon] = useState(aktifKullanici?.telefon || '');
  const [hataMesaji, setHataMesaji] = useState('');
  const [sozlesmeOnaylandi, setSozlesmeOnaylandi] = useState(false);

  // Misafir Teslimat Adresi Form Değerleri
  const [seciliMahalle, setSeciliMahalle] = useState(() => seciliAdres?.mahalle || 'Selçuklu Mahallesi');
  const [acikAdres, setAcikAdres] = useState(() => {
    if (seciliAdres) {
      return [seciliAdres.cadde_sokak, seciliAdres.acik_adres_tarifi].filter(Boolean).join(' ').trim();
    }
    return '';
  });
  const [binaDaireNo, setBinaDaireNo] = useState(() => {
    if (seciliAdres) {
      const b = seciliAdres.bina_no ? `No: ${seciliAdres.bina_no}` : '';
      const d = seciliAdres.daire_no ? `D: ${seciliAdres.daire_no}` : '';
      return `${b} ${d}`.trim();
    }
    return '';
  });

  // TeslimatHafizasi'nde seçili adres varsa misafir formuna anında otomatik yansıt
  useEffect(() => {
    if (seciliAdres) {
      if (seciliAdres.mahalle) {
        setSeciliMahalle(seciliAdres.mahalle);
      }
      const caddeMetni = [seciliAdres.cadde_sokak, seciliAdres.acik_adres_tarifi].filter(Boolean).join(' ').trim();
      if (caddeMetni) {
        setAcikAdres(caddeMetni);
      }
      const binaDaire = [
        seciliAdres.bina_no ? `No: ${seciliAdres.bina_no}` : '',
        seciliAdres.daire_no ? `D: ${seciliAdres.daire_no}` : ''
      ].filter(Boolean).join(' ').trim();
      if (binaDaire) {
        setBinaDaireNo(binaDaire);
      }
    }
  }, [seciliAdres]);

  const { gecerliVarsayilanYontem, secenekAktifMi } = useOdemeSecenekleri();
  const kullaniciElleSectiRef = useRef(false);
  const [adresNotu, setAdresNotu] = useState('');
  const [odemeYontemi, setOdemeYontemi] = useState<OdemeTipi>(() => gecerliVarsayilanYontem || 'kapida_nakit');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [olusanSiparisler, setOlusanSiparisler] = useState<TestSiparis[]>([]);
  const [taninanMisafir, setTaninanMisafir] = useState<MisafirProfili | null>(null);
  const [paytrPenceresiAcik, setPaytrPenceresiAcik] = useState(false);
  const [hazirAdresMetni, setHazirAdresMetni] = useState('');

  useEffect(() => {
    if (!gecerliVarsayilanYontem) return;
    if (!kullaniciElleSectiRef.current || !secenekAktifMi(odemeYontemi)) {
      setOdemeYontemi(gecerliVarsayilanYontem);
    }
  }, [gecerliVarsayilanYontem, odemeYontemi, secenekAktifMi]);

  // 🎫 Akıllı Kupon Hesaplayıcı ve İndirim Denetçisi
  const toplamSepetTutari = aktifGruplar.reduce((acc, g) => acc + g.araToplam, 0);
  const {
    girilenKod,
    setGirilenKod,
    kuponBilgisi,
    hataMesaji: kuponHata,
    kuponUygula,
    kuponKaldir,
  } = useKuponHesaplayici(toplamSepetTutari, aktifKullanici?.telefon || telefon);

  // Telefon değiştiğinde misafir profilini sorgula ve otomatik doldur
  useEffect(() => {
    if (aktifKullanici) return;

    const temizTel = telefon.replace(/\D/g, '').slice(-10);
    if (temizTel.length === 10) {
      misafirProfiliniGetir(temizTel).then((profil) => {
        if (profil) {
          setTaninanMisafir(profil);
          if (!adSoyad.trim() && profil.ad_soyad) {
            setAdSoyad(profil.ad_soyad);
          }
          if (!acikAdres.trim() && profil.son_acik_adres) {
            setAcikAdres(profil.son_acik_adres);
          }
          if (profil.son_mahalle) {
            setSeciliMahalle(profil.son_mahalle);
          }
          if (!binaDaireNo.trim() && profil.son_bina_daire) {
            setBinaDaireNo(profil.son_bina_daire);
          }
        }
      });
    }
  }, [telefon, aktifKullanici]);

  // Açılışta varsa önceki misafir telefon ve ismini getir
  useEffect(() => {
    if (!aktifKullanici && !telefon) {
      const kayitliSonTel = localStorage.getItem('afyon_son_misafir_telefon') || '';
      const kayitliSonAd = localStorage.getItem('afyon_son_misafir_ad') || '';
      if (kayitliSonTel) {
        setTelefon(kayitliSonTel);
      }
      if (kayitliSonAd && !adSoyad) {
        setAdSoyad(kayitliSonAd);
      }
    }
  }, [aktifKullanici]);

  useEffect(() => {
    if (olusanSiparisler.length > 0 && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [olusanSiparisler]);

  const pencereyiKapat = async () => {
    if (olusanSiparisler.length > 0) {
      if (gruplar.length > 0) {
        await sepetiTamamenTemizle();
      } else if (grup) {
        await mutfakSepetiniTemizle(grup.mutfakId);
      }
      sepetPaneliKapat();
    }
    onKapat();
  };

  const misafirTelGecerli = telefonGecerliMi(telefon).gecerli;

  const formGecerli = aktifKullanici
    ? true
    : gelAlMi
    ? Boolean(adSoyad.trim().length > 0 && misafirTelGecerli)
    : Boolean(
        adSoyad.trim().length > 0 &&
        misafirTelGecerli &&
        acikAdres.trim().length > 0
      );

  const siparisiTamamla = async () => {
    setHataMesaji('');

    if (aktifGruplar.length === 0) {
      setHataMesaji('Sepetinizde sipariş verilecek ürün bulunmuyor.');
      return;
    }

    const musteriIsmi = aktifKullanici ? aktifKullanici.ad_soyad : adSoyad.trim();
    const musteriTel = aktifKullanici ? (aktifKullanici.telefon || '0542 333 44 55') : telefon.trim();

    if (!musteriIsmi) {
      setHataMesaji('Lütfen Ad ve Soyadınızı giriniz.');
      return;
    }

    if (aktifKullanici) {
      if (!gelAlMi && !seciliAdres) {
        setHataMesaji('Lütfen teslimat için kayıtlı adresinizi seçiniz.');
        return;
      }
    } else {
      const telSonuc = telefonGecerliMi(musteriTel);
      if (!telSonuc.gecerli) {
        setHataMesaji(telSonuc.hata || 'Lütfen geçerli bir telefon numarası giriniz.');
        return;
      }

      if (!gelAlMi && !acikAdres.trim()) {
        setHataMesaji('Lütfen teslimat yapılacak açık adresi yazınız.');
        return;
      }
    }

    if (!sozlesmeOnaylandi) {
      setHataMesaji('Lütfen Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Koşullarını onaylayınız.');
      return;
    }

    if (!gecerliVarsayilanYontem || !secenekAktifMi(odemeYontemi)) {
      setHataMesaji('Şu anda seçtiğiniz ödeme yöntemi aktif değildir. Lütfen aktif bir ödeme yöntemi seçiniz.');
      return;
    }

    let adresMetni = '';
    if (gelAlMi) {
      adresMetni = `[GEL AL ŞUBESİ: ${seciliGelAlSubesi?.ad || 'Merkez Şube'}]`;
    } else if (aktifKullanici) {
      if (!seciliAdres) {
        setHataMesaji('Lütfen teslimat için adres seçiniz.');
        return;
      }
      adresMetni = `${seciliAdres.mahalle} Mah. ${seciliAdres.cadde_sokak} No:${seciliAdres.bina_no} ${seciliAdres.ilce}/${seciliAdres.il}`;
    } else {
      adresMetni = `${seciliMahalle}, ${acikAdres.trim()} ${binaDaireNo.trim() ? `(${binaDaireNo.trim()})` : ''} - Afyonkarahisar`;
    }

    if (odemeYontemi === 'online_cuzdan') {
      setHazirAdresMetni(adresMetni);
      setPaytrPenceresiAcik(true);
      return;
    }

    await siparisleriVeritabaninaKaydet(adresMetni, 'kapida');
  };

  const siparisleriVeritabaninaKaydet = async (
    adresMetni: string,
    odemeDurumu: 'odendi' | 'bekliyor' | 'kapida',
    paytrOid?: string
  ) => {
    const musteriIsmi = aktifKullanici ? aktifKullanici.ad_soyad : adSoyad.trim();
    const musteriTel = aktifKullanici ? (aktifKullanici.telefon || '0542 333 44 55') : telefon.trim();
    setYukleniyor(true);

    await new Promise((resolve) => setTimeout(resolve, 250));

    const yeniOlusanlar: TestSiparis[] = [];
    const toplamKuponIndirimi = kuponBilgisi?.gecerli ? kuponBilgisi.indirimTutari : 0;
    let kalanIndirim = toplamKuponIndirimi;

    for (const tekGrup of aktifGruplar) {
      const siparisElemanlari = tekGrup.elemanlar.map((e: any) => ({
        id: e.id || e.yemek_id || 'el-' + Math.random(),
        yemek_id: e.yemek_id || e.yemek?.id || e.id || 'yemek',
        baslik: e.yemek?.baslik || e.baslik || 'Ev Yemeği',
        yemek_baslik: e.yemek?.baslik || 'Ev Yemeği',
        fiyat: e.birim_fiyat || e.fiyat || 0,
        birim_fiyat: e.birim_fiyat,
        adet: e.adet,
      }));

      const teslimatUcreti = gelAlMi ? 0 : tekGrup.teslimatUcreti;
      const tabanTutar = tekGrup.araToplam + teslimatUcreti;
      const buGrupIndirimi = Math.min(kalanIndirim, tabanTutar);
      kalanIndirim -= buGrupIndirimi;
      const gercekToplamTutar = Math.round((tabanTutar - buGrupIndirimi) * 100) / 100;

      const sonuc = await veritabaninaSiparisOlustur({
        musteriId: aktifKullanici?.kimlik || `misafir-${Date.now()}`,
        musteriAdi: musteriIsmi,
        musteriTelefon: telefonuStandartlastir(musteriTel),
        misafirMi: !aktifKullanici,
        teslimatAdresiMetni: adresMetni,
        mutfakId: tekGrup.mutfakId,
        elemanlar: siparisElemanlari,
        toplamTutar: gercekToplamTutar,
        teslimatUcreti,
        kuponKodu: buGrupIndirimi > 0 ? (kuponBilgisi?.kod || '') : undefined,
        kuponIndirimTutari: buGrupIndirimi,
        odemeYontemi,
        odemeDurumu,
        paytrOid,
        tahminiTeslimat:
          tercih.tip === 'hemen'
            ? gelAlMi
              ? seciliGelAlSubesi?.hazirlanma_suresi || '15-20 dk'
              : '35-45 dk'
            : `${tercih.tarihEtiketi} ${tercih.saatAraligi}`,
        adresNotu: gelAlMi ? `[GEL AL: ${seciliGelAlSubesi?.ad}] ${adresNotu}` : adresNotu,
      });

      if (sonuc) {
        yeniOlusanlar.push(sonuc);
        // Misafir kullanıcı ise hem misafir_kullanicilar hem de musteri_adresleri tablosuna mühürle
        if (!aktifKullanici) {
          try {
            await misafirProfiliniKaydetVeGuncelle({
              telefon: musteriTel,
              adSoyad: musteriIsmi,
              mahalle: seciliMahalle,
              acikAdres: acikAdres.trim(),
              binaDaire: binaDaireNo.trim(),
              siparisKodu: sonuc.siparis_kodu
            });
            localStorage.setItem('afyon_son_misafir_telefon', telefonuStandartlastir(musteriTel));
            localStorage.setItem('afyon_son_misafir_ad', musteriIsmi);
          } catch {}
        }
        // Hukuki Mesafeli Satış ve Ön Bilgilendirme Onay Logu Kaydet
        hukukiLogKaydet({
          sozlesmeTuru: 'mesafeli_satis',
          sozlesmeVersiyonu: '1.0.0',
          kullaniciKimlik: aktifKullanici?.kimlik,
          kullaniciAdSoyad: musteriIsmi,
          kullaniciTelefon: musteriTel,
          islemTuru: 'siparis',
          onaylandiMi: true,
        });
      }
    }

    setYukleniyor(false);

    if (yeniOlusanlar.length > 0) {
      setOlusanSiparisler(yeniOlusanlar);
      // Sepeti temizle
      if (gruplar.length > 0) {
        await sepetiTamamenTemizle();
      } else if (grup) {
        await mutfakSepetiniTemizle(grup.mutfakId);
      }
    } else {
      setHataMesaji('Siparişiniz kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div
        ref={containerRef}
        className="w-full max-w-lg bg-[#180A1F] border border-[#521E5C] rounded-3xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Başlık Barı */}
        <div className="p-4 border-b border-[#3E1646] bg-[#220B2B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pencereyiKapat}
              className="p-1.5 rounded-xl bg-[#2D1233] hover:bg-[#4D1857] text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-black text-base text-[#F5D28A]">
              {olusanSiparisler.length > 0
                ? 'Sipariş Tamamlandı'
                : aktifGruplar.length > 1
                ? `Tüm Sepeti Satın Al (${aktifGruplar.length} Mutfak)`
                : 'Sipariş ve Ödeme Adımı'}
            </h2>
          </div>
          <button
            type="button"
            onClick={pencereyiKapat}
            className="w-8 h-8 rounded-full bg-[#2D1233] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gövde */}
        <div className="p-4 overflow-y-auto space-y-4">
          {olusanSiparisler.length > 0 ? (
            <SiparisBasariliKutusu
              siparisler={olusanSiparisler}
              onKapat={pencereyiKapat}
            />
          ) : (
            <>
              {/* Hata Uyarısı */}
              {hataMesaji && (
                <div className="p-3 bg-red-950/80 border border-red-700/80 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{hataMesaji}</span>
                </div>
              )}

              {/* Misafir Kullanıcı İletişim Bilgileri */}
              {!aktifKullanici ? (
                <MisafirIletisimKarti
                  aktifKullanici={aktifKullanici}
                  adSoyad={adSoyad}
                  onAdSoyadDegis={setAdSoyad}
                  telefon={telefon}
                  onTelefonDegis={setTelefon}
                  seciliMahalle={seciliMahalle}
                  onMahalleDegis={setSeciliMahalle}
                  acikAdres={acikAdres}
                  onAcikAdresDegis={setAcikAdres}
                  binaDaireNo={binaDaireNo}
                  onBinaDaireNoDegis={setBinaDaireNo}
                  gelAlMi={gelAlMi}
                  seciliGelAlSubesi={seciliGelAlSubesi}
                  onGelAlSubesiDegistir={gelAlPenceresiAc}
                  taninanMisafir={taninanMisafir}
                  seciliAdres={seciliAdres}
                  onHaritaAdresSecimAc={adresSecimPenceresiAc}
                />
              ) : (
                <AdresSecimKarti
                  seciliAdres={seciliAdres}
                  gelAlMi={gelAlMi}
                  seciliGelAlSubesi={seciliGelAlSubesi}
                  onAdresDegistir={gelAlMi ? gelAlPenceresiAc : adresSecimPenceresiAc}
                />
              )}

              {/* Teslimat Zamanı Seçimi */}
              <ZamanSecimKarti
                seciliZamanTipi={tercih.tip === 'hemen' ? 'hemen' : 'ileri_saat'}
                onZamanTipiSec={(tip) => {
                  if (tip === 'hemen') {
                    tercihGuncelle({
                      tip: 'hemen',
                      tarihEtiketi: 'Hemen Şimdi',
                      saatAraligi: '25-35 dk Sıcak Teslimat',
                    });
                  } else {
                    tercihGuncelle({
                      tip: 'ileri_tarih',
                      tarihEtiketi: 'Bugün',
                      saatAraligi: '18:30 - 19:30',
                    });
                  }
                }}
                seciliSaat={`${tercih.tarihEtiketi} ${tercih.saatAraligi}`}
                onSaatSec={(tamMetin) => {
                  // "Bugün 18:30 - 19:30" -> ["Bugün", "18:30", "-", "19:30"]
                  const parcalar = tamMetin.split(' ');
                  const etiket = parcalar[0]; // Bugün / Yarın
                  const aralik = parcalar.slice(1).join(' '); // "18:30 - 19:30"
                  tercihGuncelle({
                    tip: 'ileri_tarih',
                    tarihEtiketi: etiket,
                    saatAraligi: aralik,
                  });
                }}
              />

              {/* Ödeme Yöntemi Seçimi */}
              <OdemeYontemiKarti
                seciliYontem={odemeYontemi}
                onYontemSec={(yontem) => {
                  kullaniciElleSectiRef.current = true;
                  setOdemeYontemi(yontem);
                }}
              />

              {/* Sipariş Özeti ve Onay Kilidi */}
              <SiparisOzetKarti
                gruplar={aktifGruplar}
                yukleniyor={yukleniyor}
                gelAlMi={gelAlMi}
                formGecerli={formGecerli}
                sozlesmeOnaylandi={sozlesmeOnaylandi}
                onSozlesmeOnayDegis={setSozlesmeOnaylandi}
                onSiparisiTamamla={siparisiTamamla}
                kuponBilgisi={kuponBilgisi}
                girilenKod={girilenKod}
                onKodDegis={setGirilenKod}
                onKuponUygula={() => kuponUygula(girilenKod)}
                onKuponKaldir={kuponKaldir}
                kuponHataMesaji={kuponHata}
              />
            </>
          )}
        </div>
      </div>

      {paytrPenceresiAcik && (
        <PaytrOdemePenceresi
          tutar={Math.max(
            1,
            Math.round(
              (aktifGruplar.reduce(
                (t, g) => t + g.araToplam + (gelAlMi ? 0 : g.teslimatUcreti),
                0
              ) -
                (kuponBilgisi?.gecerli ? kuponBilgisi.indirimTutari : 0)) *
                100
            ) / 100
          )}
          sepet={aktifGruplar.flatMap((g) =>
            g.elemanlar.map((e: any) => ({
              ad: e.yemek?.baslik || e.baslik || 'Ev Yemeği',
              fiyat: Number(e.birim_fiyat || e.fiyat || 0),
              adet: Number(e.adet || 1),
            }))
          )}
          musteri={{
            adSoyad: aktifKullanici ? aktifKullanici.ad_soyad : adSoyad.trim(),
            telefon: aktifKullanici ? aktifKullanici.telefon || '05000000000' : telefon.trim(),
            adres: hazirAdresMetni || 'Afyonkarahisar',
          }}
          onOdemeBasarili={async (paytrOid) => {
            setPaytrPenceresiAcik(false);
            await siparisleriVeritabaninaKaydet(hazirAdresMetni, 'odendi', paytrOid);
          }}
          onKapat={() => setPaytrPenceresiAcik(false)}
        />
      )}
    </div>
  );
};
