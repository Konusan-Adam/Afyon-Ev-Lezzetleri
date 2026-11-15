import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeGetir, koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';

export interface SiparisBildirimVerisi {
  siparisId: string;
  siparisKodu: string;
  toplamTutar: number;
  musteriAdi: string;
  mutfakId: string;
  subeSiparisiMi: boolean;
  subeAdi?: string;
  mutfakAdi?: string;
  teslimatTipi?: 'gel_al' | 'teslimat';
}

interface MutfakOzetBelgesi {
  id?: string;
  kimlik?: string;
  isletme_adi?: string;
  ad?: string;
}

export async function mutfakAdiniCoz(mutfakId: string): Promise<string> {
  if (!canliFirebaseAktifMi() || !mutfakId) return 'Ev Mutfağı';
  try {
    const mutfak = await belgeGetir<MutfakOzetBelgesi>('mutfaklar', mutfakId);
    if (mutfak) {
      return mutfak.isletme_adi || mutfak.ad || 'Ev Mutfağı';
    }
    const tumMutfaklar = await koleksiyonGetir<MutfakOzetBelgesi>('mutfaklar');
    const eslesen = (tumMutfaklar || []).find((m) => m.id === mutfakId || m.kimlik === mutfakId);
    return eslesen?.isletme_adi || eslesen?.ad || 'Ev Mutfağı';
  } catch {
    return 'Ev Mutfağı';
  }
}

export async function siparisPatronBildirimiGonder(
  veri: SiparisBildirimVerisi
): Promise<void> {
  if (veri.subeSiparisiMi || veri.mutfakId.startsWith('sube-')) {
    const birimAdi = veri.subeAdi || 'Afyon Ev Lezzetleri Şubesi';
    patronBildirimiEkle(
      'yeni_siparis',
      '🛍️ Yeni Şube Siparişi: #' + veri.siparisKodu,
      `${birimAdi} için #${veri.siparisKodu} nolu ${veri.toplamTutar} ₺ şube siparişi alındı. Müşteri: ${veri.musteriAdi}`,
      veri.siparisId,
      { sessizMi: true, hedefSekme: 'sube_siparisleri', subeId: veri.mutfakId }
    );
    return;
  }

  const mutfakAdi = veri.mutfakAdi || (await mutfakAdiniCoz(veri.mutfakId));
  patronBildirimiEkle(
    'yeni_siparis',
    'Yeni Mutfak Siparişi! 🍲',
    `#${veri.siparisKodu} nolu ${veri.toplamTutar} ₺ tutarındaki sipariş ${mutfakAdi} mutfağına iletildi. Müşteri: ${veri.musteriAdi}`,
    veri.siparisId,
    { sessizMi: true, hedefSekme: 'siparisler' }
  );
}
