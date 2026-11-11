import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { yerelSiparisDurumGuncelle } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';

export async function mutfakSiparisDurumuGuncelle(
  siparisId: string,
  yeniDurum: 'beklemede' | 'hazirlaniyor' | 'paketlendi' | 'yolda' | 'teslim_edildi',
  dakika: number,
  ozelAciklama?: string,
  siparisKodu?: string
) {
  const varsayilanAciklama =
    yeniDurum === 'beklemede'
      ? 'Sipariş alındı, mutfağın onaylaması bekleniyor.'
      : yeniDurum === 'paketlendi'
      ? `Sipariş paketlendi, kurye çağrıldı. Tahmini ${dakika} dk içinde teslim edilecek.`
      : yeniDurum === 'yolda'
      ? 'Sipariş kuryeye teslim edildi, sıcak şekilde yola çıktı!'
      : yeniDurum === 'teslim_edildi'
      ? 'Sipariş başarıyla teslim edildi. Afiyet olsun!'
      : `Sipariş mutfakta özenle pişiriliyor. Tahmini pişme: ${dakika} dakika.`;

  const aciklama = (ozelAciklama && ozelAciklama.trim()) ? ozelAciklama.trim() : varsayilanAciklama;
  const yeniAsama = 
    yeniDurum === 'beklemede'
      ? 'beklemede'
      : yeniDurum === 'hazirlaniyor' 
      ? 'ocakta' 
      : yeniDurum === 'paketlendi' 
      ? 'paketlendi' 
      : yeniDurum === 'yolda' 
      ? 'kuryede' 
      : 'teslim_edildi';

  // 1. Yerel depoyu güncelle
  yerelSiparisDurumGuncelle(siparisId, yeniDurum, aciklama);
  if (siparisKodu && siparisKodu !== siparisId) {
    yerelSiparisDurumGuncelle(siparisKodu, yeniDurum, aciklama);
  }

  // 2. Canlı event fırlat
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('afyon_siparis_durum_degisti', {
        detail: { siparisKimligi: siparisId, siparisKodu, durum: yeniDurum, aciklama, asama: yeniAsama }
      })
    );
  }

  // 3. Canlı Firebase Firestore
  if (canliFirebaseAktifMi()) {
    try {
      const guncellenecekVeri = {
        durum: yeniDurum,
        asama: yeniAsama,
        hazirlanmaSuresiDakika: dakika,
        durum_aciklamasi: aciklama,
        durumAciklamasi: aciklama,
        sonGuncelleme: new Date().toLocaleTimeString('tr-TR'),
        guncellenme_zamani: new Date().toISOString()
      };

      const tumFbSiparisler = await koleksiyonGetir<any>('siparisler');
      let guncellenenVarMi = false;

      if (tumFbSiparisler && Array.isArray(tumFbSiparisler)) {
        for (const fbDoc of tumFbSiparisler) {
          const docId = fbDoc.id;
          const koddur = fbDoc.siparis_kodu || fbDoc.siparisKodu;
          const eslesiyorMu = 
            docId === siparisId || 
            (siparisKodu && docId === siparisKodu) || 
            koddur === siparisId || 
            (siparisKodu && koddur === siparisKodu);

          if (eslesiyorMu && docId) {
            await belgeKaydet('siparisler', docId, guncellenecekVeri);
            guncellenenVarMi = true;
          }
        }
      }

      if (!guncellenenVarMi && siparisId) {
        await belgeKaydet('siparisler', siparisId, guncellenecekVeri);
      }

      // 🔔 Bildirim tetikleyici
      if (yeniDurum === 'paketlendi') {
        patronBildirimiEkle(
          'siparis_durumu',
          'Kurye Çağrıldı! 🚴‍♂️',
          `#${siparisKodu || siparisId} nolu sipariş paketlendi, kurye bekleniyor.`,
          siparisId
        );
      } else if (yeniDurum === 'yolda') {
        patronBildirimiEkle(
          'siparis_durumu',
          'Paket Kuryeye Teslim Edildi! 🛵',
          `#${siparisKodu || siparisId} nolu sipariş kuryeye teslim edildi ve yola çıktı.`,
          siparisId
        );
      }
    } catch (hata) {
      console.warn('Firebase mutfak durum güncelleme hatası:', hata);
    }
  }
}
