import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeKaydet, koleksiyonGetir, koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

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
    return await belgeKaydet('sube_siparisleri', siparisId, { durum: yeniDurum });
  }
  return true;
}
