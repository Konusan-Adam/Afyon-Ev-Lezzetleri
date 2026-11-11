import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export async function veritabanindanSepetiGetir(musteriId: string): Promise<SepetElemani[]> {
  const tumSepetElemanlari = await koleksiyonGetir<SepetElemani>('sepet_elemanlari');
  return tumSepetElemanlari.filter(e => e.musteri_id === musteriId);
}
