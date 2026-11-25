import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { yerelSiparisDurumGuncelle } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/yerelSiparisDeposu';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { subeStoklariniGeriYukle } from '@/src/MalzemeCekmeceleri/Sube/subeSiparisKayitServisi';
import { kritikOlayDamgala } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/hukukiDelilServisi';
import { siparisMusteriTarafindanIptalEdilebilirMi } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/siparisDurumYardimcisi';
import { paytrIadesiBaslat } from '@/src/MalzemeCekmeceleri/Paytr/paytrIadeIstemcisi';

export interface SiparisIptalSonucu {
  basarili: boolean;
  hataMesaji?: string;
  iadeDurumu?: 'tamamlandi' | 'demo_iade' | 'hata' | 'gerekli_degil';
  iadeReferans?: string;
  iadeMesaji?: string;
}

export async function siparisIptalEt(
  siparisKimligi: string,
  gerekceBaslik: string,
  detayNot?: string,
  iptalKaynagi: 'musteri' | 'mutfak' = 'musteri',
  siparisKodu?: string
): Promise<SiparisIptalSonucu> {
  const aciklamaMetni =
    detayNot && detayNot.trim()
      ? `Sipariş İptal Edildi: ${gerekceBaslik} (${detayNot.trim()})`
      : `Sipariş İptal Edildi: ${gerekceBaslik}`;

  let paytrOid = '';
  let onlineOdendiMi = false;
  let iadeTutari = 0;
  let eslesenBelgeler: any[] = [];
  let eslesenSubeSiparisleri: SubeSiparisi[] = [];

  if (canliFirebaseAktifMi()) {
    try {
      const [tumSiparisler, tumSubeSiparisleri] = await Promise.all([
        koleksiyonGetir<any>('siparisler'),
        koleksiyonGetir<SubeSiparisi>('sube_siparisleri'),
      ]);

      eslesenBelgeler = (tumSiparisler || []).filter((fbDoc) => {
        const kod = fbDoc.siparis_kodu || fbDoc.siparisKodu;
        return (
          fbDoc.id === siparisKimligi ||
          kod === siparisKimligi ||
          (siparisKodu && (fbDoc.id === siparisKodu || kod === siparisKodu))
        );
      });

      eslesenSubeSiparisleri = (tumSubeSiparisleri || []).filter((sDoc) => {
        return (
          sDoc.id === siparisKimligi ||
          sDoc.siparis_kodu === siparisKimligi ||
          (siparisKodu && (sDoc.id === siparisKodu || sDoc.siparis_kodu === siparisKodu))
        );
      });

      if (iptalKaynagi === 'musteri') {
        const engelliSiparis = eslesenBelgeler.find((b) => !siparisMusteriTarafindanIptalEdilebilirMi(b));
        const engelliSube = eslesenSubeSiparisleri.find(
          (s) => !siparisMusteriTarafindanIptalEdilebilirMi({ durum: s.durum, siparis_kaynagi: 'sube', sube_id: s.sube_id })
        );
        if (engelliSiparis || engelliSube) {
          return {
            basarili: false,
            hataMesaji:
              'Mutfak siparişi hazırlamaya başladığı veya yola çıkardığı için artık tek taraflı iptal edilemez. Sorun yaşıyorsanız WhatsApp Destek hattından ulaşabilirsiniz.',
          };
        }
      }

      const anaSiparis = eslesenBelgeler[0];
      if (anaSiparis) {
        paytrOid = anaSiparis.paytrOid || '';
        onlineOdendiMi = anaSiparis.odemeDurumu === 'odendi' && Boolean(paytrOid);
        iadeTutari = Number(anaSiparis.toplam_tutar || anaSiparis.toplamTutar || anaSiparis.tutar || 0);
      }
    } catch (hata) {
      console.warn('Sipariş durum kontrol hatası:', hata);
      return {
        basarili: false,
        hataMesaji: 'Sipariş durumu doğrulanamadı. Lütfen bağlantınızı kontrol edip tekrar deneyiniz.',
      };
    }
  }

  let iadeDurumu: SiparisIptalSonucu['iadeDurumu'] = 'gerekli_degil';
  let iadeReferans = '';
  let iadeMesaji = 'Kapıda ödeme seçildiği için tahsilat yapılmamıştır.';

  if (onlineOdendiMi && paytrOid && iadeTutari > 0) {
    const paytrYanit = await paytrIadesiBaslat(paytrOid, iadeTutari, siparisKodu || siparisKimligi);
    iadeDurumu = paytrYanit.iadeDurumu;
    iadeReferans = paytrYanit.referansNo || '';
    iadeMesaji = paytrYanit.mesaj;
  }

  const iptalDamgasi = await kritikOlayDamgala({
    islemTuru: 'iptal',
    sozlesmeTuru: 'iptal_iade_kosullari',
    ilgiliKayitId: siparisKodu || siparisKimligi,
    ekDetay: {
      siparisKimligi,
      siparisKodu: siparisKodu || '',
      iptalKaynagi,
      gerekceBaslik,
      detayNot: detayNot?.trim() || '',
      onlineOdendiMi,
      paytrOid,
      iadeDurumu,
      iadeReferans,
      iadeTutari,
    },
  });

  const guncellenecekAlanlar = {
    durum: 'iptal',
    asama: 'iptal',
    durum_aciklamasi: aciklamaMetni,
    durumAciklamasi: aciklamaMetni,
    iptal_kaynagi: iptalKaynagi,
    iptal_tarihi: iptalDamgasi.sunucuUtc,
    iptal_zaman_damgasi: iptalDamgasi,
    iade_durumu: iadeDurumu,
    iade_referans: iadeReferans,
    iade_mesaji: iadeMesaji,
    iade_tarihi: onlineOdendiMi ? iptalDamgasi.sunucuUtc : '',
    sonGuncelleme: new Date().toLocaleTimeString('tr-TR'),
  };

  if (canliFirebaseAktifMi()) {
    try {
      if (eslesenBelgeler.length > 0) {
        for (const belge of eslesenBelgeler) {
          const basarili = await belgeKaydet('siparisler', belge.id, guncellenecekAlanlar);
          if (!basarili) {
            return { basarili: false, hataMesaji: 'Sipariş iptali veritabanına kaydedilemedi.' };
          }
        }
      } else {
        const basarili = await belgeKaydet('siparisler', siparisKimligi, guncellenecekAlanlar);
        if (!basarili) {
          return { basarili: false, hataMesaji: 'Sipariş iptali veritabanına kaydedilemedi.' };
        }
      }

      for (const subeSip of eslesenSubeSiparisleri) {
        const oncekiDurum = (subeSip.durum || '').toLowerCase();
        await belgeKaydet('sube_siparisleri', subeSip.id, { durum: 'iptal' });
        if (oncekiDurum !== 'iptal' && oncekiDurum !== 'teslim_edildi' && Array.isArray(subeSip.urunler)) {
          await subeStoklariniGeriYukle(
            subeSip.urunler.map((u) => ({
              id: u.urun_id,
              yemek_id: u.urun_id,
              baslik: u.ad,
              fiyat: u.fiyat,
              adet: u.adet,
            }))
          );
        }
      }
    } catch (hata) {
      console.warn('Firebase sipariş iptal güncelleme hatası:', hata);
      return { basarili: false, hataMesaji: 'İptal kaydı sırasında bağlantı hatası oluştu.' };
    }
  }

  yerelSiparisDurumGuncelle(siparisKimligi, 'iptal', aciklamaMetni, iptalKaynagi);
  if (siparisKodu && siparisKodu !== siparisKimligi) {
    yerelSiparisDurumGuncelle(siparisKodu, 'iptal', aciklamaMetni, iptalKaynagi);
  }

  const baslikMesaji =
    iptalKaynagi === 'mutfak'
      ? 'Sipariş Mutfak Tarafından İptal Edildi ⚠️'
      : 'Müşteri Siparişi İptal Etti ⚠️';
  patronBildirimiEkle(
    'iade_talebi',
    baslikMesaji,
    `#${(siparisKodu || siparisKimligi).substring(0, 12)} nolu sipariş ${
      iptalKaynagi === 'mutfak' ? 'mutfak' : 'müşteri'
    } tarafından iptal edildi. Gerekçe: ${gerekceBaslik}${onlineOdendiMi ? ` | PayTR İade: ${iadeDurumu}` : ''}`
  );

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('afyon_siparis_durum_degisti', {
        detail: { siparisKimligi, siparisKodu, durum: 'iptal' },
      })
    );
  }

  return {
    basarili: true,
    iadeDurumu,
    iadeReferans,
    iadeMesaji,
  };
}
