import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { belgeGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { patronBildirimiEkle } from '@/src/MalzemeCekmeceleri/PatronBildirimServisi';

export interface SiparisBildirimVerisi {
  siparisId: string;
  siparisKodu: string;
  toplamTutar: number;
  musteriAdi: string;
  mutfakId: string;
  subeSiparisiMi: boolean;
  subeAdi?: string;
  teslimatTipi?: 'gel_al' | 'teslimat';
}

interface MutfakOzetBelgesi {
  isletme_adi?: string;
  ad?: string;
}

async function mutfakAdiniCoz(mutfakId: string): Promise<string> {
  if (!canliFirebaseAktifMi() || !mutfakId) return 'Ev Mutfağı';
  try {
    const mutfak = await belgeGetir<MutfakOzetBelgesi>('mutfaklar', mutfakId);
    return mutfak?.isletme_adi || mutfak?.ad || 'Ev Mutfağı';
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

  const mutfakAdi = await mutfakAdiniCoz(veri.mutfakId);
  patronBildirimiEkle(
    'yeni_siparis',
    'Yeni Mutfak Siparişi! 🍲',
    `#${veri.siparisKodu} nolu ${veri.toplamTutar} ₺ tutarındaki sipariş ${mutfakAdi} mutfağına iletildi. Müşteri: ${veri.musteriAdi}`,
    veri.siparisId,
    { sessizMi: true, hedefSekme: 'siparisler' }
  );
}
