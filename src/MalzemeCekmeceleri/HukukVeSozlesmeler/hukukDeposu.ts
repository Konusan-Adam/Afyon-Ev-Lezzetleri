import { HukukiSozlesme, HukukiOnayLogu, CerezTercihleri, SozlesmeTuru } from './tipler';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, belgeKaydet, belgeSil } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const YEREL_SOZLESMELER_ANAHTARI = 'afyon_hukuki_sozlesmeler_v3';
const YEREL_LOGLAR_ANAHTARI = 'afyon_hukuki_onay_loglari_v2';
const YEREL_CEREZ_ANAHTARI = 'afyon_cerez_tercihleri_v1';
const SILINEN_SOZLESMELER_ANAHTARI = 'afyon_silinen_sozlesmeler_v1';

export const VARSAYILAN_SOZLESMELER: Record<string, HukukiSozlesme> = {
  mutfak_kayit_sozlesmesi: {
    tur: 'mutfak_kayit_sozlesmesi',
    baslik: 'Ev Mutfağı & Aşçı İş Ortaklığı ve Hijyen Taahhüt Sözleşmesi',
    kisaBaslik: 'Mutfak Kayıt Sözleşmesi',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: true,
    konum: 'asci_basvuru',
    silinebilirMi: false,
    icerik: `MADDE 1 - TARAFLAR VE AMAÇ
İşbu Sözleşme, Afyon Ev Lezzetleri Platformu ile platforma mutfak/aşçı olarak kayıt yaptıran ve ev yapımı yöresel lezzetlerini sunan "Ev Aşçısı / Butik Mutfak" arasında akdedilmiştir.

MADDE 2 - HİJYEN VE GIDA GÜVENLİĞİ STANDARTLARI
2.1. Aşçı, pişirdiği tüm yemeklerde hijyen kurallarına, taze ve kaliteli yerel malzemelerin kullanımına tam riayet edeceğini kabul ve taahhüt eder.
2.2. Yemeklerin paketlenmesinde gıdaya uygun, sızdırmaz ve mühürlü ambalajlar kullanılacak; yemekler hijyen standartlarına uygun olarak kuryeye teslim edilecektir.
2.3. Aşçı, ilgili yasal hijyen belgesi veya esnaf muafiyet belgesine sahip olduğunu, talep halinde platforma sunacağını beyan eder.

MADDE 3 - SİPARİŞ KABULÜ VE HAZIRLANMA SÜRELERİ
3.1. Aşçı, panel üzerinden gelen siparişleri çalışma saatleri dahilinde belirtilen sürede taze olarak hazırlamakla yükümlüdür.
3.2. Zamanında hazırlanmayan veya kalitesiz ürün tesliminden doğacak müşteri şikayetleri ve iadelerinden ilgili mutfak sorumludur.

MADDE 4 - KOMİSYON, HAKEDİŞ VE ÖDEMELER
4.1. Platform hizmet bedeli ve komisyon oranları mutfak paneli üzerinden şeffaf olarak gösterilir.
4.2. Başarıyla tamamlanan siparişlerin hakedişleri, mutfağın talep ettiği IBAN numarasına mutabakat takvimine göre eksiksiz aktarılır.

MADDE 5 - FESİH VE YETKİLİ MAHKEME
Gıda güvenliğini tehlikeye atan, platform itibarını zedeleyen veya taahhütlerini yerine getirmeyen mutfakların üyeliği derhal askıya alınabilir. İhtilaflarda Afyonkarahisar Mahkemeleri ve İcra Daireleri yetkilidir.`
  },
  kurye_kayit_sozlesmesi: {
    tur: 'kurye_kayit_sozlesmesi',
    baslik: 'Kurye Taşıma ve Bağımsız Hizmet Sözleşmesi',
    kisaBaslik: 'Kurye Taşıma Sözleşmesi',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: true,
    konum: 'kurye_basvuru',
    silinebilirMi: false,
    icerik: `MADDE 1 - TARAFLAR
İşbu Sözleşme, Afyon Ev Lezzetleri Platformu ile platform üzerinden paket sipariş dağıtım hizmeti sunan "Kurye" arasında akdedilmiştir.

MADDE 2 - HİZMETİN KAPSAMI VE KURALLARI
2.1. Kurye, mutfaktan teslim aldığı sıcak/taze ev yemeklerini termal çantada, dökülmeden ve belirlenen tahmini sürede müşteriye teslim etmekle yükümlüdür.
2.2. Kurye, teslimat esnasında trafik kurallarına ve nezaket standartlarına eksiksiz riayet edecektir.
2.3. Teslimat sırasında müşteriden PIN kodu veya onay alınarak sipariş başarıyla tamamlanır.

MADDE 3 - SEFER BAŞINA HAKEDİŞ VE ÖDEMELER
3.1. Kurye, tamamlanan her başarılı teslimat için km ve paket başı belirlenen hak edişi kazanır.
3.2. Biriken bakiye, Kurye Paneli üzerinden talep edildiğinde kayıtlı banka hesabına aktarılır.

MADDE 4 - GÜVENLİK VE SORUMLULUK
Kuryenin kendi aracının muayene, sigorta ve ehliyet geçerliliğinden bizzat kendisi sorumludur.`
  },
  kullanici_sozlesmesi: {
    tur: 'kullanici_sozlesmesi',
    baslik: 'Kullanıcı ve Üyelik Sözleşmesi',
    kisaBaslik: 'Kullanıcı Sözleşmesi',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: true,
    konum: 'kayit',
    silinebilirMi: false,
    icerik: `1. GENEL ŞARTLAR
Afyon Ev Lezzetleri platformuna üye olan veya sipariş veren her kullanıcı bu sözleşmeyi kabul etmiş sayılır.

2. HESAP GÜVENLİĞİ
Kullanıcı, hesabına ait telefon numarası ve şifrenin güvenliğinden kendisi sorumludur. Gerçek dışı veya başkasına ait telefon numarasıyla işlem yapılması hukuki ve cezai sorumluluk doğurur.

3. KULLANIM KURALLARI
Platform üzerinde asılsız sipariş vermek, kuryeyi kasıtlı olarak bekletmek veya teslimatı keyfi reddetmek kullanıcının hesabının kalıcı olarak engellenmesine ve yasal işlem başlatılmasına yol açar.`
  },
  kvkk_aydinlatma: {
    tur: 'kvkk_aydinlatma',
    baslik: 'KVKK Aydınlatma ve Açık Rıza Metni',
    kisaBaslik: 'KVKK Aydınlatma Metni',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: true,
    konum: 'genel',
    silinebilirMi: false,
    icerik: `6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca:
Veri Sorumlusu sıfatıyla Afyon Ev Lezzetleri olarak;
1. İŞLENEN KİŞİSEL VERİLER: Ad, Soyad, Cep Telefon Numarası, Teslimat Adresi, Sipariş Geçmişi, Cihaz IP ve Tarayıcı Bilgileri.
2. VERİ İŞLEME AMAÇLARI: Siparişlerin doğru adrese ulaştırılması, kurye koordinasyonu, yasal faturalandırma ve müşteri memnuniyeti analizi.
3. VERİ AKTARIMI: Verileriniz yalnızca siparişi hazırlayan Mutfak ile siparişi getiren Kurye'ye teslimatın ifası amacıyla sınırlı olarak aktarılır. Üçüncü şahıslara ticari amaçla satılamaz.
4. HAKLARINIZ: KVKK Madde 11 uyarınca dilediğiniz zaman verilerinizin silinmesini veya düzeltilmesini talep edebilirsiniz.`
  },
  mesafeli_satis: {
    tur: 'mesafeli_satis',
    baslik: 'Mesafeli Satış Sözleşmesi',
    kisaBaslik: 'Mesafeli Satış Sözleşmesi',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: true,
    konum: 'siparis',
    silinebilirMi: false,
    icerik: `MADDE 1 - TARAFLAR
1.1. SATICI: Afyon Ev Lezzetleri Aracılık Platformu.
1.2. ALICI: Siparişi veren ve ödeme yükümlülüğü altına giren müşteri.

MADDE 2 - SÖZLEŞMENİN KONUSU
ALICI'nın platform üzerinden siparişini verdiği ev yemeklerinin satışı ve teslimi ile ilgili hak ve yükümlülüklerin saptanmasıdır.

MADDE 3 - CAYMA HAKKI İSTİSNASI
6502 sayılı Kanun uyarınca; çabuk bozulabilen taze sıcak yemeklerde cayma hakkı bulunmamaktadır.`
  },
  cerez_politikasi: {
    tur: 'cerez_politikasi',
    baslik: 'Çerez (Cookie) Politikası',
    kisaBaslik: 'Çerez Politikası',
    versiyon: '1.0.0',
    guncellenmeTarihi: '2026-10-19',
    zorunluMu: false,
    konum: 'genel',
    silinebilirMi: false,
    icerik: `Afyon Ev Lezzetleri olarak sitemizde güvenli bir alışveriş deneyimi sunmak amacıyla zorunlu ve analitik çerezler kullanmaktayız.`
  }
};

export const hukukiSozlesmeleriGetir = (): Record<string, HukukiSozlesme> => {
  try {
    const silinenler: string[] = JSON.parse(localStorage.getItem(SILINEN_SOZLESMELER_ANAHTARI) || '[]');
    const kayitli = localStorage.getItem(YEREL_SOZLESMELER_ANAHTARI);
    let sonuc: Record<string, HukukiSozlesme> = { ...VARSAYILAN_SOZLESMELER };
    if (kayitli) {
      sonuc = { ...sonuc, ...JSON.parse(kayitli) };
    }
    // Silinmiş sözleşmeleri listeden temizle
    silinenler.forEach((tur) => {
      delete sonuc[tur];
    });
    return sonuc;
  } catch (e) {
    console.warn('Sözleşmeler yüklenemedi, varsayılanlar devrede:', e);
  }
  return VARSAYILAN_SOZLESMELER;
};

// Canlı Firestore'dan sözleşmeleri arka planda çekip senkronize et
export const hukukiSozlesmeleriCanliSenkronizeEt = async (): Promise<Record<string, HukukiSozlesme>> => {
  if (canliFirebaseAktifMi()) {
    try {
      const fbSozlesmeler = await koleksiyonGetir<HukukiSozlesme>('sozlesmeler');
      const silinenler: string[] = JSON.parse(localStorage.getItem(SILINEN_SOZLESMELER_ANAHTARI) || '[]');
      if (fbSozlesmeler && fbSozlesmeler.length > 0) {
        const sozlesmeHaritasi: Record<string, HukukiSozlesme> = { ...VARSAYILAN_SOZLESMELER };
        fbSozlesmeler.forEach(s => {
          if (s.tur && !silinenler.includes(s.tur)) {
            sozlesmeHaritasi[s.tur] = s;
          }
        });
        silinenler.forEach((tur) => {
          delete sozlesmeHaritasi[tur];
        });
        localStorage.setItem(YEREL_SOZLESMELER_ANAHTARI, JSON.stringify(sozlesmeHaritasi));
        return sozlesmeHaritasi;
      } else {
        // İlk tohumlama
        for (const anahtar of Object.keys(VARSAYILAN_SOZLESMELER)) {
          await belgeKaydet('sozlesmeler', anahtar, VARSAYILAN_SOZLESMELER[anahtar]);
        }
      }
    } catch (hata) {
      console.warn('Firebase sözleşme senkronizasyon hatası:', hata);
    }
  }
  return hukukiSozlesmeleriGetir();
};

export const sozlesmeGuncelle = (sozlesme: HukukiSozlesme): boolean => {
  try {
    const mevcut = hukukiSozlesmeleriGetir();
    const guncelSozlesme = {
      ...sozlesme,
      guncellenmeTarihi: new Date().toISOString().split('T')[0]
    };
    mevcut[sozlesme.tur] = guncelSozlesme;
    localStorage.setItem(YEREL_SOZLESMELER_ANAHTARI, JSON.stringify(mevcut));

    if (canliFirebaseAktifMi()) {
      belgeKaydet('sozlesmeler', sozlesme.tur, guncelSozlesme).catch(() => {});
    }
    return true;
  } catch (e) {
    console.error('Sözleşme güncellenemedi:', e);
    return false;
  }
};

export const yeniSozlesmeEkle = (sozlesme: Omit<HukukiSozlesme, 'guncellenmeTarihi' | 'silinebilirMi'>): boolean => {
  try {
    const mevcut = hukukiSozlesmeleriGetir();
    const kod = sozlesme.tur.trim().toLowerCase().replace(/\s+/g, '_');
    const yeni: HukukiSozlesme = {
      ...sozlesme,
      tur: kod,
      guncellenmeTarihi: new Date().toISOString().split('T')[0],
      silinebilirMi: true
    };
    mevcut[kod] = yeni;
    localStorage.setItem(YEREL_SOZLESMELER_ANAHTARI, JSON.stringify(mevcut));

    // Silinenler listesinde varsa çıkar
    try {
      const silinenler: string[] = JSON.parse(localStorage.getItem(SILINEN_SOZLESMELER_ANAHTARI) || '[]');
      const guncelSilinenler = silinenler.filter(s => s !== kod);
      localStorage.setItem(SILINEN_SOZLESMELER_ANAHTARI, JSON.stringify(guncelSilinenler));
    } catch {}

    if (canliFirebaseAktifMi()) {
      belgeKaydet('sozlesmeler', kod, yeni).catch(() => {});
    }
    return true;
  } catch (e) {
    console.error('Yeni sözleşme eklenemedi:', e);
    return false;
  }
};

export const sozlesmeSil = (tur: string): boolean => {
  try {
    const mevcut = hukukiSozlesmeleriGetir();
    if (mevcut[tur] && mevcut[tur].silinebilirMi !== false) {
      delete mevcut[tur];
      localStorage.setItem(YEREL_SOZLESMELER_ANAHTARI, JSON.stringify(mevcut));

      // Silinenler defterine kaydet ki geri yüklenmesin
      try {
        const silinenler: string[] = JSON.parse(localStorage.getItem(SILINEN_SOZLESMELER_ANAHTARI) || '[]');
        if (!silinenler.includes(tur)) {
          silinenler.push(tur);
          localStorage.setItem(SILINEN_SOZLESMELER_ANAHTARI, JSON.stringify(silinenler));
        }
      } catch {}

      // Firestore koleksiyonundan da kalıcı olarak sil
      if (canliFirebaseAktifMi()) {
        belgeSil('sozlesmeler', tur).catch((err) => {
          console.warn('Firebase sözleşme silme uyarısı:', err);
        });
      }
      return true;
    }
    return false;
  } catch (e) {
    console.error('Sözleşme silinemedi:', e);
    return false;
  }
};

export const hukukiLoglariGetir = (): HukukiOnayLogu[] => {
  try {
    const kayitli = localStorage.getItem(YEREL_LOGLAR_ANAHTARI);
    if (kayitli) {
      return JSON.parse(kayitli);
    }
  } catch (e) {
    console.warn('Loglar yüklenemedi:', e);
  }
  return [];
};

export const hukukiLoglariCanliGetir = async (): Promise<HukukiOnayLogu[]> => {
  if (canliFirebaseAktifMi()) {
    try {
      const fbLoglar = await koleksiyonGetir<HukukiOnayLogu>('hukuki_onay_loglari');
      if (fbLoglar && fbLoglar.length > 0) {
        // En yeni tarih en üstte
        fbLoglar.sort((a, b) => (b.kimlik > a.kimlik ? 1 : -1));
        localStorage.setItem(YEREL_LOGLAR_ANAHTARI, JSON.stringify(fbLoglar));
        return fbLoglar;
      }
    } catch {}
  }
  return hukukiLoglariGetir();
};

export const hukukiLogKaydet = (logVerisi: Omit<HukukiOnayLogu, 'kimlik' | 'tarihSaat' | 'ipAdresi' | 'cihazBilgisi'>): HukukiOnayLogu => {
  const yeniLog: HukukiOnayLogu = {
    kimlik: 'log_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
    tarihSaat: new Date().toLocaleString('tr-TR'),
    ipAdresi: '195.175.' + Math.floor(Math.random() * 200 + 10) + '.' + Math.floor(Math.random() * 200 + 10) + ' (Afyon/Merkez)',
    cihazBilgisi: navigator.userAgent.substring(0, 70),
    ...logVerisi
  };

  try {
    const mevcut = hukukiLoglariGetir();
    mevcut.unshift(yeniLog); // En yeni log en başta
    if (mevcut.length > 500) mevcut.pop();
    localStorage.setItem(YEREL_LOGLAR_ANAHTARI, JSON.stringify(mevcut));

    if (canliFirebaseAktifMi()) {
      belgeKaydet('hukuki_onay_loglari', yeniLog.kimlik, yeniLog).catch(() => {});
    }
  } catch (e) {
    console.error('Hukuki log yazılamadı:', e);
  }

  return yeniLog;
};

export const cerezTercihleriniGetir = (): CerezTercihleri | null => {
  try {
    const kayitli = localStorage.getItem(YEREL_CEREZ_ANAHTARI);
    if (kayitli) {
      return JSON.parse(kayitli);
    }
  } catch (e) {
    console.warn('Çerez tercihleri okunamadı:', e);
  }
  return null;
};

export const cerezTercihleriniKaydet = (tercihler: CerezTercihleri): void => {
  try {
    localStorage.setItem(YEREL_CEREZ_ANAHTARI, JSON.stringify(tercihler));
    hukukiLogKaydet({
      sozlesmeTuru: 'cerez_politikasi',
      sozlesmeVersiyonu: '1.0.0',
      islemTuru: 'cerez_onayi',
      onaylandiMi: tercihler.onaylandi
    });
  } catch (e) {
    console.error('Çerez tercihleri kaydedilemedi:', e);
  }
};
