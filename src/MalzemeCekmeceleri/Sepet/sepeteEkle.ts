import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { belgeEkle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export interface SepetEkBilgileri {
  coklu_menu_mu?: boolean;
  coklu_menu_baslik?: string;
  coklu_menu_gorsel?: string;
  secilen_ogeler?: Array<{
    id: string;
    baslik: string;
    not?: string;
  }>;
  varyasyon?: string;
}

export async function veritabaninaSepeteEkle(
  musteriId: string,
  mutfakId: string,
  yemekId: string,
  adet: number,
  birimFiyat: number,
  ekBilgiler?: SepetEkBilgileri
): Promise<SepetElemani | null> {
  const yeniSepetElemani: Omit<SepetElemani, 'id'> = {
    musteri_id: musteriId,
    mutfak_id: mutfakId,
    yemek_id: yemekId,
    adet: adet,
    birim_fiyat: birimFiyat,
    eklenme_tarihi: new Date().toISOString(),
    ...(ekBilgiler || {}),
  };

  const id = await belgeEkle('sepet_elemanlari', yeniSepetElemani);
  return id ? { id, ...yeniSepetElemani } : null;
}
