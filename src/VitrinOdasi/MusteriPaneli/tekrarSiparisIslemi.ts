import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { TestSiparisElemani } from '@/src/veritabani/CanliVeriYardimcisi';

export interface TekrarSiparisParametreleri {
  mutfakId: string;
  elemanlar: TestSiparisElemani[];
  sepeteEkleFonksiyonu: (
    mutfakId: string,
    yemekId: string,
    adet: number,
    birimFiyat: number
  ) => Promise<void>;
  sepetPaneliAc: () => void;
}

export async function siparisiTekrarSepeteEkle({
  mutfakId,
  elemanlar,
  sepeteEkleFonksiyonu,
  sepetPaneliAc
}: TekrarSiparisParametreleri): Promise<boolean> {
  try {
    for (const eleman of elemanlar) {
      await sepeteEkleFonksiyonu(
        mutfakId,
        eleman.yemek_id,
        eleman.adet || 1,
        eleman.birim_fiyat || eleman.fiyat || 0
      );
    }
    sepetPaneliAc();
    return true;
  } catch (hata) {
    console.error('Tekrar sipariş sepete eklenirken hata oluştu:', hata);
    return false;
  }
}
