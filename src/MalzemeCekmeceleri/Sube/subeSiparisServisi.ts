import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeGetir, belgeKaydet, koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { subeDurumunuGenelSipariseEsle } from './subeSiparisSenkronYardimcisi';
import { kritikOlayDamgala } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/hukukiDelilServisi';

export async function subeSiparisiOlustur(siparis: SubeSiparisi): Promise<boolean> {
  if (canliFirebaseAktifMi()) {
    return await belgeKaydet('sube_siparisleri', siparis.id, siparis);
  }
  return true;
}

export async function subeSiparisleriGetir(subeId?: string): Promise<SubeSiparisi[]> {
  if (!canliFirebaseAktifMi()) return [];
  const tum = await koleksiyonGetir<SubeSiparisi>('sube_siparisleri');
  if (!tum) return [];
  return subeId ? tum.filter((s) => s.sube_id === subeId) : tum;
}

export function subeSiparisleriniCanliDinle(
  subeId: string,
  onGuncelle: (siparisler: SubeSiparisi[]) => void
): () => void {
  if (!canliFirebaseAktifMi()) return () => {};
  return koleksiyonuCanliDinle<SubeSiparisi>('sube_siparisleri', (liste) => {
    const filtrelenmis = (liste || []).filter((s) => s.sube_id === subeId);
    onGuncelle(filtrelenmis);
  });
}

export async function subeSiparisiDurumGuncelle(
  siparisId: string,
  yeniDurum: SubeSiparisi['durum']
): Promise<boolean> {
  if (canliFirebaseAktifMi()) {
    const subeKayit = await belgeGetir<SubeSiparisi>('sube_siparisleri', siparisId);
    const basarili = await belgeKaydet('sube_siparisleri', siparisId, { durum: yeniDurum });
    if (basarili) {
      const genelSiparis = await belgeGetir<any>('siparisler', siparisId);
      const teslimatTipi = subeKayit?.teslimat_tipi || genelSiparis?.teslimat_tipi || 'gel_al';
      const eslenen = subeDurumunuGenelSipariseEsle(yeniDurum, teslimatTipi);
      if (genelSiparis) {
        await belgeKaydet('siparisler', siparisId, {
          durum: eslenen.durum,
          asama: eslenen.asama,
          durum_aciklamasi: eslenen.durumAciklamasi,
          durumAciklamasi: eslenen.durumAciklamasi,
        });
      }
      if (yeniDurum === 'teslim_edildi' || yeniDurum === 'iptal') {
        void kritikOlayDamgala({
          islemTuru: yeniDurum === 'teslim_edildi' ? 'teslimat' : 'iptal',
          sozlesmeTuru: yeniDurum === 'teslim_edildi' ? 'sube_teslimat_onayi' : 'iptal_iade_kosullari',
          ilgiliKayitId: subeKayit?.siparis_kodu || siparisId,
          kullaniciKimlik: subeKayit?.musteri_id,
          kullaniciTelefon: subeKayit?.musteri_telefon,
          kullaniciAdSoyad: subeKayit?.musteri_adi,
          ekDetay: {
            subeId: subeKayit?.sube_id || '',
            teslimatTipi,
            yeniDurum,
          },
        });
      }
    }
    return basarili;
  }
  return true;
}
