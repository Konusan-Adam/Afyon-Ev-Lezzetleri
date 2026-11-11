import { Yemek } from '@/src/veritabani/VeriTipleri';
import { SecenekGrubu } from './UrunSecenekleriTipleri';

/**
 * 🦁 AFYON EV LEZZETLERİ - ÜRÜN VARYASYON KURALI
 * 
 * USTA EMRİ (Patron Mutfaktır Kuralı):
 * 1. Eğer mutfak aşçısı bu yemeğe özel seçenek (porsiyon, sos, boyut vb.) tanımlamışsa SADECE o gösterilir.
 * 2. Eğer mutfak herhangi bir seçenek tanımlamamışsa (boş liste veya tanımsız ise),
 *    sistem KESİNLİKLE kafasına göre "1.5 porsiyon", "köy ekmeği", "turşu" gibi saçma varsayılanlar UYDURAMAZ!
 *    Boş dizi döner, modal doğrudan sade adet seçimiyle sepete eklenir veya seçenek modali açılmadan eklenir.
 */
export function yemekVaryasyonlariniGetir(yemek: Yemek): SecenekGrubu[] {
  // Mutfak aşçısı tarafından tanımlanmış seçenek grupları varsa onları getir
  if (yemek.secenek_gruplari && Array.isArray(yemek.secenek_gruplari) && yemek.secenek_gruplari.length > 0) {
    return yemek.secenek_gruplari;
  }

  // Mutfak herhangi bir seçenek tanımlamamışsa BOŞ dön (Asla otomatik saçma seçenek uydurma!)
  return [];
}
