import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { belgeEkle } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export async function veritabaninaSepeteEkle(
  musteriId: string,
  mutfakId: string,
  yemekId: string,
  adet: number,
  birimFiyat: number
): Promise<SepetElemani | null> {
  const yeniSepetElemani: Omit<SepetElemani, 'id'> = {
    musteri_id: musteriId,
    mutfak_id: mutfakId,
    yemek_id: yemekId,
    adet: adet,
    birim_fiyat: birimFiyat,
    eklenme_tarihi: new Date().toISOString()
  };

  const id = await belgeEkle('sepet_elemanlari', yeniSepetElemani);
  return id ? { id, ...yeniSepetElemani } : null;
}
