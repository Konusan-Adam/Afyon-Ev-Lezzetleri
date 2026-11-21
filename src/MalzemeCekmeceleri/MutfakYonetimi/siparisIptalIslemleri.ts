import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { yerelSiparisDurumGuncelle } from '@/src/MalzemeCekmeceleri/SiparisVeOdeme/yerelSiparisDeposu';

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

  const guncellenecekAlanlar = {
    durum: 'iptal',
    asama: 'iptal',
    durum_aciklamasi: aciklamaMetni,
    durumAciklamasi: aciklamaMetni,
    iptal_kaynagi: iptalKaynagi,
    iptal_tarihi: new Date().toISOString(),
    sonGuncelleme: new Date().toLocaleTimeString('tr-TR'),
  };

  if (canliFirebaseAktifMi()) {
    try {
      const tumSiparisler = await koleksiyonGetir<any>('siparisler');
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
