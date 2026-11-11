import { useKampanyalar } from '@/src/MalzemeCekmeceleri/KampanyaCekmecesi';
import { AnaAfisOgesi } from '@/src/veritabani/GercekVeriYardimcisi';

export type Kampanya = AnaAfisOgesi;

export const kampanyalariGetir = () => {
  return useKampanyalar();
};
