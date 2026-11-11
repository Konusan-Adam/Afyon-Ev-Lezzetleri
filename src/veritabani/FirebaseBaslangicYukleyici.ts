import { koleksiyonGetir } from '@/src/veritabani/FirebaseKoleksiyonServisi';

export async function firebaseBaslangicVerileriniYukle() {
  try {
    const mevcutKategoriler = await koleksiyonGetir('kategoriler');
    const mevcutMutfaklar = await koleksiyonGetir('mutfaklar');
    const mevcutYemekler = await koleksiyonGetir('yemekler');

    if (mevcutMutfaklar.length === 0) {
      // Başlangıç verisi boş
    }
  } catch (hata) {
    console.warn('Firebase tohumlama sessiz atlandı:', hata);
  }
}
