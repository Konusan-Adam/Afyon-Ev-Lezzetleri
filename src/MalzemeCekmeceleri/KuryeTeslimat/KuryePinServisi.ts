import { belgeKaydet, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';
import { yerelSiparisDurumGuncelle, yerelSiparisleriGetir } from '@/src/MalzemeCekmeceleri/useMusteriSiparisleri';
import { kuryeTeslimZiliCal } from '@/src/MalzemeCekmeceleri/KuryeTeslimZili';

export async function kuryePaketiUzerineAl(
  siparisId: string,
  kuryeId: string,
  kuryeAdi: string
): Promise<{ basarili: boolean; mesaj: string }> {
  try {
    // 🛡️ Güvenlik Zırhı: Onaylanmamış kurye paket alamaz
    const kullanicilar = await koleksiyonGetir<any>('kullanicilar');
    const kuryeKayiT = kullanicilar.find((k: any) => k.id === kuryeId || k.kimlik === kuryeId);
    if (kuryeKayiT && (kuryeKayiT.onayli_mi === false || kuryeKayiT.askida_mi === true || kuryeKayiT.onay_durumu === 'beklemede' || kuryeKayiT.onay_durumu === 'askida')) {
      return { basarili: false, mesaj: 'Hesabınız henüz patron tarafından onaylanmadı. Onaysız kuryeler paket teslim alamaz!' };
    }

    const tum = await koleksiyonGetir<any>('siparisler');
    const siparis = tum.find((s) => s.id === siparisId || s.siparisKodu === siparisId || s.siparis_kodu === siparisId);
    if (!siparis) return { basarili: false, mesaj: 'Sipariş bulunamadı.' };

    const durum = (siparis.durum || '').toLowerCase();
    const asama = (siparis.asama || '').toLowerCase();
    const mutfakPaketlediMi = 
      durum === 'paketlendi' || 
      durum === 'yolda' || 
      asama === 'paketlendi' || 
      asama === 'kurye_geliyor' || 
      asama === 'kuryede';

    if (!mutfakPaketlediMi) {
      return { basarili: false, mesaj: 'HATA: Mutfak henüz "Kurye Gelsin (Paketle)" butonuna basmadı! Mutfak onaylamadan kurye bu paketi alamaz.' };
    }

    if (siparis.kurye_id && siparis.kurye_id !== kuryeId) {
      return { basarili: false, mesaj: 'Bu paket az önce başka bir kurye tarafından alındı!' };
    }

    const aciklamaMetni = `Kurye (${kuryeAdi}) paketi almak için yola çıktı. 5 dakika içinde teslim alması gerekmektedir!`;

    // 1. Yerel hafızayı güncelle
    yerelSiparisDurumGuncelle(siparis.id || siparisId, 'paketlendi', aciklamaMetni);
    if (siparis.siparis_kodu) {
      yerelSiparisDurumGuncelle(siparis.siparis_kodu, 'paketlendi', aciklamaMetni);
    }

    // 2. Canlı sinyal fırlat
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('afyon_siparis_durum_degisti', {
          detail: { siparisKimligi: siparis.id || siparisId, durum: 'paketlendi', kurye_id: kuryeId, kurye_adi: kuryeAdi, asama: 'kurye_geliyor' }
        })
      );
    }

    const kayit = await belgeKaydet('siparisler', siparis.id || siparisId, {
      ...siparis,
      kurye_id: kuryeId,
      kurye_adi: kuryeAdi,
      asama: 'kurye_geliyor',
      durum: 'paketlendi',
      kurye_alis_zamani: Date.now(),
      kurye_teslim_aldi_mi: false,
      durumAciklamasi: aciklamaMetni
    });

    // 🔔 Mutfağa Bildirim Gönder: Kurye yola çıktı
    patronBildirimiEkle(
      'siparis_durumu',
      'Kurye Yola Çıktı! 🛵',
      `Kurye ${kuryeAdi}, #${siparis.siparis_kodu || siparis.id} nolu paketi almak için mutfağa doğru yola çıktı. (5 dk süre başladı)`,
      siparis.id
    );

    return kayit
      ? { basarili: true, mesaj: 'Paket üzerinize kilitlendi! 5 dakika içinde mutfaktan teslim almanız gerekmektedir.' }
      : { basarili: false, mesaj: 'Kayıt sırasında hata oluştu.' };
  } catch (hata) {
    return { basarili: false, mesaj: 'Bağlantı hatası oluştu.' };
  }
}

// 📦 Kurye Mutfaktan Paketi Teslim Aldı (Adres Açılır)
export async function kuryePaketiTeslimAldi(
  siparisId: string,
  kuryeId: string
): Promise<{ basarili: boolean; mesaj: string }> {
  try {
    const tum = await koleksiyonGetir<any>('siparisler');
    const siparis = tum.find((s) => s.id === siparisId || s.siparisKodu === siparisId || s.siparis_kodu === siparisId);
    if (!siparis) return { basarili: false, mesaj: 'Sipariş bulunamadı.' };

    const mutfakTeslimEttiMi = 
      siparis.durum === 'yolda' || 
      siparis.durum === 'teslim_edildi' || 
      siparis.asama === 'kuryede' || 
      siparis.asama === 'teslim_edildi';

    if (!mutfakTeslimEttiMi) {
      return { basarili: false, mesaj: 'HATA: Mutfak henüz "Kuryeye Teslim Edildi" onayını vermedi! Mutfak onaylamadan paketi teslim alamazsınız.' };
    }

    const aciklamaMetni = 'Kurye paketi mutfaktan teslim aldı, adrese doğru yola çıktı!';

    yerelSiparisDurumGuncelle(siparis.id || siparisId, 'yolda', aciklamaMetni);
    if (siparis.siparis_kodu) {
      yerelSiparisDurumGuncelle(siparis.siparis_kodu, 'yolda', aciklamaMetni);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('afyon_siparis_durum_degisti', {
          detail: { siparisKimligi: siparis.id || siparisId, durum: 'yolda', asama: 'kuryede' }
        })
      );
    }

    const kayit = await belgeKaydet('siparisler', siparis.id || siparisId, {
      ...siparis,
      asama: 'kuryede',
      durum: 'yolda',
      kurye_teslim_aldi_mi: true,
      teslim_aldi_zamani: Date.now(),
      durumAciklamasi: aciklamaMetni
    });

    patronBildirimiEkle(
      'siparis_durumu',
      'Paket Kurye Tarafından Teslim Alındı! 🛵',
      `Kurye, #${siparis.siparis_kodu || siparis.id} nolu paketi mutfaktan teslim aldı ve yola çıktı.`,
      siparis.id
    );

    return kayit
      ? { basarili: true, mesaj: 'Paket teslim alındı! Müşteri açık adresi ve canlı takip aktif edildi.' }
      : { basarili: false, mesaj: 'Kayıt sırasında hata oluştu.' };
  } catch (hata) {
    return { basarili: false, mesaj: 'Bağlantı hatası oluştu.' };
  }
}

// ⏱️ 5 Dakika Kuralı Zaman Aşımı Kontrolü
export async function kuryeZamanAsimiKontrolEt() {
  try {
    const tum = await koleksiyonGetir<any>('siparisler');
    const simdi = Date.now();
    const BEKLEME_SURESI_MS = 5 * 60 * 1000; // 5 Dakika

    for (const sip of tum) {
      if (
        sip.kurye_id && 
        sip.asama === 'kurye_geliyor' && 
        !sip.kurye_teslim_aldi_mi && 
        sip.kurye_alis_zamani && 
        simdi - sip.kurye_alis_zamani > BEKLEME_SURESI_MS
      ) {
        const guncelVeri = {
          kurye_id: null,
          kurye_adi: null,
          asama: 'paketlendi',
          durum: 'paketlendi',
          kurye_alis_zamani: null,
          kurye_teslim_aldi_mi: false,
          durumAciklamasi: 'Kurye 5 dakika içinde teslim almadığı için sistem tarafından havuza geri düşürüldü.'
        };

        await belgeKaydet('siparisler', sip.id, { ...sip, ...guncelVeri });
        yerelSiparisDurumGuncelle(sip.id, 'paketlendi', guncelVeri.durumAciklamasi);

        patronBildirimiEkle(
          'siparis_durumu',
          '⏱️ 5 Dakika Kuralı İhlali! Kurye Değiştirildi',
          `#${sip.siparis_kodu || sip.id} nolu paketi 5 dakika içinde teslim almayan kurye cezalandırılarak paket havuza geri düşürüldü.`,
          sip.id
        );
      }
    }
  } catch (err) {
    console.warn('Kurye zaman aşımı kontrol hatası:', err);
  }
}

export async function kuryePinDogrulaVeTeslimEt(
  siparisKodu: string,
  girilenPin: string
): Promise<{ basarili: boolean; mesaj: string }> {
  try {
    const girilenTemiz = String(girilenPin || '').trim();
    if (!girilenTemiz) {
      return { basarili: false, mesaj: 'Lütfen müşterinin 4 haneli teslimat PIN kodunu giriniz.' };
    }

    const tumSiparisler = await koleksiyonGetir<any>('siparisler');
    const eslesenler = tumSiparisler.filter(
      (s: any) => (s.siparisKodu === siparisKodu || s.id === siparisKodu || s.siparis_kodu === siparisKodu)
    );

    const yerelListe = yerelSiparisleriGetir();
    const yerelSiparis = yerelListe.find(
      (s: any) => (s.siparisKodu === siparisKodu || s.id === siparisKodu || s.siparis_kodu === siparisKodu)
    );

    let siparis = eslesenler.find(s => s.pinKodu || s.pin_kodu || s.teslimat_kodu || s.pin) || eslesenler[0] || yerelSiparis;

    if (!siparis) {
      return { basarili: false, mesaj: 'Sipariş kaydı bulunamadı.' };
    }

    const gercekPin = String(
      siparis.pinKodu || 
      siparis.pin_kodu || 
      siparis.teslimat_kodu || 
      siparis.pin || 
      (yerelSiparis && (yerelSiparis.pinKodu || (yerelSiparis as any).pin_kodu || (yerelSiparis as any).teslimat_kodu)) ||
      ''
    ).trim();

    const hedefSiparisKodu = String(siparis.siparisKodu || siparis.siparis_kodu || siparis.id || siparisKodu).trim().toUpperCase();
    
    const pinGecerli = gercekPin !== '' && gercekPin === girilenTemiz;
    const qrGecerli = gercekPin !== '' && 
      girilenTemiz.length >= 4 && 
      (girilenTemiz.toUpperCase().includes(hedefSiparisKodu) || girilenTemiz.toUpperCase().startsWith('AFYON-TESLIMAT-')) && 
      girilenTemiz.includes(gercekPin);

    if (!pinGecerli && !qrGecerli) {
      if (girilenTemiz.length > 4) {
        return { basarili: false, mesaj: 'Geçersiz QR kodu! Bu QR bu siparişe ait değil. Lütfen müşterinin ekranındaki doğru teslimat QR kodunu okutunuz.' };
      }
      return { basarili: false, mesaj: 'Hatalı PIN kodu! Lütfen müşterinin ekranındaki 4 haneli PIN kodunu kontrol ediniz.' };
    }

    const guncelVeri = {
      asama: 'teslim_edildi',
      durum: 'teslim_edildi',
      durum_aciklamasi: 'Sipariş başarıyla teslim edildi. Afiyet olsun!',
      durumAciklamasi: 'Sipariş başarıyla teslim edildi. Afiyet olsun!',
      teslimTarihi: new Date().toISOString(),
      sonGuncelleme: new Date().toLocaleTimeString('tr-TR')
    };

    if (eslesenler.length > 0) {
      for (const eslesme of eslesenler) {
        await belgeKaydet('siparisler', eslesme.id, {
          ...eslesme,
          ...guncelVeri
        });
      }
    } else {
      await belgeKaydet('siparisler', siparisKodu, guncelVeri);
    }

    yerelSiparisDurumGuncelle(siparis.id || siparisKodu, 'teslim_edildi', guncelVeri.durum_aciklamasi);
    if (siparis.siparis_kodu) {
      yerelSiparisDurumGuncelle(siparis.siparis_kodu, 'teslim_edildi', guncelVeri.durum_aciklamasi);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('afyon_siparis_durum_degisti', {
          detail: { 
            siparisKimligi: siparis.id || siparisKodu, 
            siparisKodu: siparis.siparis_kodu || siparisKodu, 
            durum: 'teslim_edildi', 
            asama: 'teslim_edildi' 
          }
        })
      );
    }

    patronBildirimiEkle(
      'siparis_durumu',
      'Sipariş Teslim Edildi! 🎉',
      `#${siparis.siparis_kodu || siparisKodu} nolu sipariş kurye ${siparis.kurye_adi || ''} tarafından teslim edildi.`,
      siparis.id || siparisKodu
    );

    kuryeTeslimZiliCal(siparis.siparis_kodu || siparisKodu);

    if (siparis.kurye_id) {
      const tumKullanicilar = await koleksiyonGetir<any>('kullanicilar');
      const kurye = tumKullanicilar.find((k: any) => k.id === siparis.kurye_id || k.kimlik === siparis.kurye_id);
      if (kurye) {
        await belgeKaydet('kullanicilar', kurye.id || kurye.kimlik, {
          ...kurye,
          bakiye: (kurye.bakiye || 0) + 35,
          toplam_teslimat: (kurye.toplam_teslimat || 0) + 1
        });
      }
    }

    return { basarili: true, mesaj: 'Teslimat başarıyla tamamlandı! Priminiz hesabınıza eklendi.' };
  } catch (hata: any) {
    return { basarili: false, mesaj: hata?.message || 'Teslimat onaylanırken hata oluştu.' };
  }
}
