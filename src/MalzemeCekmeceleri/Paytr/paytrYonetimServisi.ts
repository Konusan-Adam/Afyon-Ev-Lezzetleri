import { belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { PaytrCanliAyarlari } from './paytrAyarTipleri';
import { OdemeSecenekleriAyari } from '../SiparisVeOdeme/odemeSecenekTipleri';

export interface PaytrHazirlikYaniti {
  basarili: boolean;
  hazirMi: boolean;
  eksikler: string[];
}

export interface PaytrTestYaniti {
  basarili: boolean;
  mesaj?: string;
  hata?: string;
}

export async function paytrSunucuHazirlikGetir(): Promise<PaytrHazirlikYaniti> {
  const yanit = await fetch('/api/paytr/hazirlik');
  return (await yanit.json()) as PaytrHazirlikYaniti;
}

export async function paytrTestBaglantisiYap(): Promise<PaytrTestYaniti> {
  const yanit = await fetch('/api/paytr/test', { method: 'POST' });
  return (await yanit.json()) as PaytrTestYaniti;
}

export async function paytrAyarlariniKaydet(ayar: PaytrCanliAyarlari): Promise<boolean> {
  return belgeKaydet('genel_ayarlar', 'paytr_ayarlari', ayar);
}

export async function odemeSecenekleriniKaydet(secenek: OdemeSecenekleriAyari): Promise<boolean> {
  return belgeKaydet('genel_ayarlar', 'odeme_secenekleri', secenek);
}
