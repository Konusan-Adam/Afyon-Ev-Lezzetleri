import { TestIptalGerekcesi } from '@/src/veritabani/GercekVeriYardimcisi';

export type IptalGerekcesi = TestIptalGerekcesi;

export const HAZIR_IPTAL_GEREKCELERI: IptalGerekcesi[] = [
  { kimlik: 'g1', baslik: 'Stokta kalmadı' },
  { kimlik: 'g2', baslik: 'Yoğunluk nedeniyle iptal' },
  { kimlik: 'g3', baslik: 'Müşteri talebiyle iptal' },
  { kimlik: 'g4', baslik: 'Adres teslimat bölgesi dışında' }
];
