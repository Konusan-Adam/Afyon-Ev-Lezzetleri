import { YemekTipi } from '@/src/veritabani/VeriTipleri';

export interface OneriSecenek {
  id: string;
  etiket: string;
  secimMetni: string;
  yemek?: YemekTipi;
  aksiyonTipi?: 'sepete_ekle' | 'soru_sor';
}

export interface DanismanMesaji {
  id: string;
  rol: 'kullanici' | 'asistan';
  icerik: string;
  zaman: string;
  onerilenYemekler?: YemekTipi[];
  hizliSecenekler?: OneriSecenek[];
}

export interface LezzetDanismaniAyarlari {
  aktifMi: boolean;
  karsilamaMesaji: string;
  baloncukMetni: string;
}

export const VARSAYILAN_DANISMAN_AYARLARI: LezzetDanismaniAyarlari = {
  aktifMi: true,
  karsilamaMesaji: 'Afyon Ev Lezzetleri’ne hoş geldiniz! Taş fırınımızdan çıkan taze yöresel lezzetlerimiz hakkında sizlere yardımcı olmaktan memnuniyet duyarım.',
  baloncukMetni: 'Lezzet Danışmanımıza Danışın ✨',
};
