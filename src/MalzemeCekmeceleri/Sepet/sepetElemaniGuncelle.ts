import {
  belgeSil,
  belgeKaydet,
  koleksiyonGetir,
} from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';

export async function veritabanindaSepetAdetiGuncelle(
  sepetId: string,
  yeniAdet: number
): Promise<boolean> {
  await belgeKaydet('sepet_elemanlari', sepetId, { adet: yeniAdet });
  return true;
}

export async function veritabanindanSepetElemaniniSil(sepetId: string): Promise<boolean> {
  await belgeSil('sepet_elemanlari', sepetId);
  return true;
}

export async function veritabanindanMutfakSepetiniTemizle(
  musteriId: string,
  mutfakId: string
): Promise<boolean> {
  const tumElemanlar = await koleksiyonGetir<SepetElemani & { id: string }>('sepet_elemanlari');
  const silinecekler = tumElemanlar.filter(
    (e) => e.musteri_id === musteriId && e.mutfak_id === mutfakId
  );

  for (const eleman of silinecekler) {
    if (eleman.id) {
      await belgeSil('sepet_elemanlari', eleman.id);
    }
  }

  return true;
}
