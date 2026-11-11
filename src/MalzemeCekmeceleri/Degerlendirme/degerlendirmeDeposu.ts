import { SiparisDegerlendirmesi } from './DegerlendirmeTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonGetir, belgeKaydet, belgeSil } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const DEPOLAMA_ANAHTARI = 'afyon_ev_lezzetleri_degerlendirmeler_v1';
const SILINENLER_ANAHTARI = 'afyon_ev_lezzetleri_silinen_degerlendirmeler_v1';

// Hafızada tutulan değerlendirmeler (Önbellek)
let yerelDegerlendirmeler: SiparisDegerlendirmesi[] = [];

function silinenleriGetir(): string[] {
  try {
    const k = localStorage.getItem(SILINENLER_ANAHTARI);
    if (k) {
      const parsed = JSON.parse(k);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function silinenlereEkle(kimlik: string) {
  try {
    const liste = silinenleriGetir();
    if (!liste.includes(kimlik)) {
      liste.push(kimlik);
      localStorage.setItem(SILINENLER_ANAHTARI, JSON.stringify(liste));
    }
  } catch {}
}

// Başlangıçta yerel hafızadan yükle
function yerelHafizadanYukle(): SiparisDegerlendirmesi[] {
  try {
    const kayit = localStorage.getItem(DEPOLAMA_ANAHTARI);
    if (kayit) {
      const parsed = JSON.parse(kayit);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const silinenler = silinenleriGetir();
        return parsed.filter((d: any) => !silinenler.includes(d.kimlik));
      }
    }
  } catch {
    // Hata toleransı
  }
  return [];
}

yerelDegerlendirmeler = yerelHafizadanYukle();

// Canlı Firebase'den değerlendirmeleri arka planda çek ve senkronize et
export async function canliDegerlendirmeleriCek(): Promise<SiparisDegerlendirmesi[]> {
  const silinenler = silinenleriGetir();

  if (!canliFirebaseAktifMi()) {
    return yerelDegerlendirmeler.filter(d => !silinenler.includes(d.kimlik));
  }

  try {
    const fbDegerlendirmeler = await koleksiyonGetir<any>('degerlendirmeler');
    if (fbDegerlendirmeler && Array.isArray(fbDegerlendirmeler) && fbDegerlendirmeler.length > 0) {
      const donusturulen: SiparisDegerlendirmesi[] = fbDegerlendirmeler
        .filter((d: any) => !silinenler.includes(d.id || d.kimlik))
        .map((d: any) => ({
          kimlik: d.id || d.kimlik || `deg-${Math.random()}`,
          siparis_kimligi: d.siparis_id || d.siparis_kimligi || '',
          mutfak_id: d.mutfak_id || '',
          musteri_adi: d.musteri_adi || 'Afyonlu Misafir',
          lezzet_puani: Number(d.lezzet_puani) || 5,
          kurye_puani: Number(d.kurye_puani) || 5,
          yorum_metni: d.yorum_metni || '',
          tarih: d.olusturma_tarihi ? (typeof d.olusturma_tarihi === 'string' ? d.olusturma_tarihi : new Date(d.olusturma_tarihi).toLocaleDateString('tr-TR')) : 'Bugün',
          onayli_mi: Boolean(d.onayli_mi)
        }));

      // Birleştir (Tekilleştirilmiş)
      const harita = new Map<string, SiparisDegerlendirmesi>();
      donusturulen.forEach(item => {
        if (!silinenler.includes(item.kimlik)) {
          harita.set(item.siparis_kimligi || item.kimlik, item);
        }
      });
      yerelDegerlendirmeler.forEach(item => {
        const anahtar = item.siparis_kimligi || item.kimlik;
        if (!harita.has(anahtar) && !silinenler.includes(item.kimlik)) {
          harita.set(anahtar, item);
        }
      });

      const birlesik = Array.from(harita.values()).filter(item => !silinenler.includes(item.kimlik));
      yerelDegerlendirmeler = birlesik;
      try {
        localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(birlesik));
      } catch {
        // Hata toleransı
      }
      return birlesik;
    }
  } catch (err) {
    console.warn('Canlı değerlendirme senkronizasyon hatası:', err);
  }

  return yerelDegerlendirmeler.filter(d => !silinenler.includes(d.kimlik));
}

// Uygulama açılışında canlı veriyi arka planda sorgula
if (typeof window !== 'undefined') {
  setTimeout(() => {
    canliDegerlendirmeleriCek();
  }, 1000);
}

export function degerlendirmeleriGetir(): SiparisDegerlendirmesi[] {
  if (yerelDegerlendirmeler.length === 0) {
    yerelDegerlendirmeler = yerelHafizadanYukle();
  }
  const silinenler = silinenleriGetir();
  return yerelDegerlendirmeler.filter(d => !silinenler.includes(d.kimlik));
}

export function mutfakDegerlendirmeleriniGetir(mutfakId: string): SiparisDegerlendirmesi[] {
  const tumu = degerlendirmeleriGetir();
  return tumu.filter((d) => !d.mutfak_id || d.mutfak_id === mutfakId || mutfakId === 'tumu');
}

export function siparisDegerlendirildiMi(siparisKimligi: string): boolean {
  const tumu = degerlendirmeleriGetir();
  return tumu.some((d) => d.siparis_kimligi === siparisKimligi);
}

export function degerlendirmeKaydet(
  yeniDegerlendirme: Omit<SiparisDegerlendirmesi, 'kimlik' | 'tarih'>
): SiparisDegerlendirmesi {
  const tumu = degerlendirmeleriGetir();
  const olusturulan: SiparisDegerlendirmesi = {
    ...yeniDegerlendirme,
    kimlik: `deg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tarih: 'Az önce'
  };

  const guncel = [olusturulan, ...tumu];
  yerelDegerlendirmeler = guncel;
  try {
    localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(guncel));
  } catch {
    // Depolama hatası toleransı
  }

  // Canlı Firebase varsa veritabanına yaz
  if (canliFirebaseAktifMi()) {
    belgeKaydet('degerlendirmeler', olusturulan.kimlik, {
      ...olusturulan,
      olusturma_tarihi: new Date().toISOString()
    }).catch(err => console.warn('Firebase değerlendirme kaydetme hatası:', err));
  }

  return olusturulan;
}

export async function degerlendirmeOnayGuncelle(kimlik: string, onayliMi: boolean): Promise<boolean> {
  yerelDegerlendirmeler = yerelDegerlendirmeler.map(d => d.kimlik === kimlik ? { ...d, onayli_mi: onayliMi } : d);
  try {
    localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(yerelDegerlendirmeler));
  } catch {}
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('degerlendirmeler', kimlik, { onayli_mi: onayliMi });
    } catch (err) {
      console.warn('Firebase onay güncelleme hatası:', err);
    }
  }
  return true;
}

export async function degerlendirmeDuzenle(kimlik: string, yeniMetin: string): Promise<boolean> {
  yerelDegerlendirmeler = yerelDegerlendirmeler.map(d => d.kimlik === kimlik ? { ...d, yorum_metni: yeniMetin } : d);
  try {
    localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(yerelDegerlendirmeler));
  } catch {}
  if (canliFirebaseAktifMi()) {
    try {
      await belgeKaydet('degerlendirmeler', kimlik, { yorum_metni: yeniMetin });
    } catch (err) {
      console.warn('Firebase düzenleme hatası:', err);
    }
  }
  return true;
}

export async function degerlendirmeSil(kimlik: string): Promise<boolean> {
  silinenlereEkle(kimlik);
  yerelDegerlendirmeler = yerelDegerlendirmeler.filter(d => d.kimlik !== kimlik);
  try {
    localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(yerelDegerlendirmeler));
  } catch {}
  if (canliFirebaseAktifMi()) {
    try {
      await belgeSil('degerlendirmeler', kimlik);
    } catch (err) {
      console.warn('Firebase silme hatası:', err);
    }
  }
  return true;
}
