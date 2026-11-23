import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { yerelSiparisDurumGuncelle } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/yerelSiparisDeposu';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { subeStoklariniGeriYukle } from '@/src/MalzemeCekmeceleri/Sube/subeSiparisKayitServisi';
import { kritikOlayDamgala } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/hukukiDelilServisi';

export async function siparisIptalEt(
  siparisKimligi: string,
  gerekceBaslik: string,
  detayNot?: string,
  iptalKaynagi: 'musteri' | 'mutfak' = 'musteri',
  siparisKodu?: string
): Promise<boolean> {
  const aciklamaMetni =
    detayNot && detayNot.trim()
      ? `Sipariş İptal Edildi: ${gerekceBaslik} (${detayNot.trim()})`
      : `Sipariş İptal Edildi: ${gerekceBaslik}`;

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
    sonGuncelleme: new Date().toLocaleTimeString('tr-TR'),
  };

  if (canliFirebaseAktifMi()) {
    try {
      const [tumSiparisler, tumSubeSiparisleri] = await Promise.all([
        koleksiyonGetir<any>('siparisler'),
        koleksiyonGetir<SubeSiparisi>('sube_siparisleri'),
      ]);

      const eslesenBelgeler = (tumSiparisler || []).filter((fbDoc) => {
        const kod = fbDoc.siparis_kodu || fbDoc.siparisKodu;
        return (
          fbDoc.id === siparisKimligi ||
          kod === siparisKimligi ||
          (siparisKodu && (fbDoc.id === siparisKodu || kod === siparisKodu))
        );
      });

      if (eslesenBelgeler.length > 0) {
        for (const belge of eslesenBelgeler) {
          const basarili = await belgeKaydet('siparisler', belge.id, guncellenecekAlanlar);
          if (!basarili) return false;
        }
      } else {
        const basarili = await belgeKaydet('siparisler', siparisKimligi, guncellenecekAlanlar);
        if (!basarili) return false;
      }

      const eslesenSubeSiparisleri = (tumSubeSiparisleri || []).filter((sDoc) => {
        return (
          sDoc.id === siparisKimligi ||
          sDoc.siparis_kodu === siparisKimligi ||
          (siparisKodu && (sDoc.id === siparisKodu || sDoc.siparis_kodu === siparisKodu))
        );
      });

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
      return false;
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
    } tarafından iptal edildi. Gerekçe: ${gerekceBaslik}`
  );

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('afyon_siparis_durum_degisti', {
        detail: { siparisKimligi, siparisKodu, durum: 'iptal' },
      })
    );
  }

  return true;
}
