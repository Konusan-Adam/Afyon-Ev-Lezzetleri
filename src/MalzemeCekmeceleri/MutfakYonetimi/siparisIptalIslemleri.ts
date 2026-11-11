import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { yerelSiparisDurumGuncelle } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';

export async function siparisIptalEt(siparisKimligi: string, gerekceBaslik: string, detayNot?: string): Promise<boolean> {
  const aciklamaMetni = detayNot && detayNot.trim()
    ? `Sipariş İptal Edildi: ${gerekceBaslik} (${detayNot.trim()})`
    : `Sipariş İptal Edildi: ${gerekceBaslik}`;

  // 1. Yerel depolama ve localStorage güncellemesi
  yerelSiparisDurumGuncelle(siparisKimligi, 'iptal', aciklamaMetni);

  // 2. Canlı Firebase güncellemesi
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('siparisler', siparisKimligi, {
        durum: 'iptal',
        asama: 'iptal',
        durumAciklamasi: aciklamaMetni,
        sonGuncelleme: new Date().toLocaleTimeString('tr-TR')
      });
    } catch (hata) {
      console.warn('Firebase sipariş iptal güncelleme hatası:', hata);
    }
  }

  // 3. Patron Bildirimi Ekle & Ses Çal
  patronBildirimiEkle('iade_talebi', 'Sipariş İptal Edildi ⚠️', `#${siparisKimligi.substring(0, 8)} nolu sipariş iptal edildi. Gerekçe: ${gerekceBaslik}`);

  // 4. Global olay tetikle
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('afyon_siparis_durum_degisti', { detail: { siparisKimligi, durum: 'iptal' } }));
  }

  return true;
}

