import { SepetElemani, Mutfak } from '@/src/veritabani/VeriTipleri';
import { mahalleyeGoreMesafeVeUcretBul } from '@/src/MalzemeCekmeceleri/AkilliKurye/mesafeHesaplayici';
import { akilliKuryeUcretiHesapla } from '@/src/MalzemeCekmeceleri/AkilliKurye/rotaKonsolidasyon';

export interface MutfakSepetGrubu {
  mutfakId: string;
  mutfak: Mutfak;
  elemanlar: SepetElemani[];
  araToplam: number;
  kalanMinTutar: number;
  minTutarUlasildi: boolean;
  teslimatUcreti: number;
  genelToplam: number;
}

export function sepetiMutfaklaraGöreGrupla(
  elemanlar: SepetElemani[],
  teslimatMahallesi?: string
): MutfakSepetGrubu[] {
  const gruplar: { [mutfakId: string]: MutfakSepetGrubu } = {};
  const { bazUcret } = mahalleyeGoreMesafeVeUcretBul(teslimatMahallesi);

  elemanlar.forEach((item) => {
    const mutfakId = item.mutfak_id || 'varsayilan_mutfak';
    
    // Mutfak veya Şube bilgisi
    const subeMi = mutfakId.startsWith('sube');
    const mutfakBilgisi: Mutfak = item.mutfak || {
      id: mutfakId,
      ad: subeMi ? 'Afyon Ev Lezzetleri (Şube Tezgahı)' : 'Afyon Yöresel Ev Mutfakları',
      min_siparis_tutari: subeMi ? 0 : 100,
      teslimat_ucreti: bazUcret,
      puan: 5.0,
    };

    if (!gruplar[mutfakId]) {
      gruplar[mutfakId] = {
        mutfakId,
        mutfak: mutfakBilgisi,
        elemanlar: [],
        araToplam: 0,
        kalanMinTutar: 0,
        minTutarUlasildi: subeMi ? true : false,
        teslimatUcreti: bazUcret,
        genelToplam: 0,
      };
    }

    gruplar[mutfakId].elemanlar.push(item);
    gruplar[mutfakId].araToplam += item.birim_fiyat * item.adet;
  });

  const grupListesi = Object.values(gruplar);
  const mutfakSayisi = grupListesi.length;
  const toplamSepetTutari = grupListesi.reduce((toplam, g) => toplam + g.araToplam, 0);

  // Akıllı Kurye Rota Motoru ile nihai toplam teslimat ücretini hesapla:
  const kuryeSonuc = akilliKuryeUcretiHesapla(mutfakSayisi, bazUcret, toplamSepetTutari);

  // Mutfak sayısına göre teslimat ücretini mutfaklara adil paylaştır
  const tabanPay = mutfakSayisi > 0 ? Math.floor(kuryeSonuc.nihaiTeslimatUcreti / mutfakSayisi) : 0;
  const kalanArtik = mutfakSayisi > 0 ? kuryeSonuc.nihaiTeslimatUcreti % mutfakSayisi : 0;

  return grupListesi.map((g, index) => {
    const subeGrup = g.mutfakId.startsWith('sube');
    const minTutar = subeGrup ? 0 : (g.mutfak.min_siparis_tutari || 100);
    const kalan = Math.max(0, minTutar - g.araToplam);
    const kuryePayi = g.araToplam > 0 ? (tabanPay + (index < kalanArtik ? 1 : 0)) : 0;

    return {
      ...g,
      kalanMinTutar: kalan,
      minTutarUlasildi: subeGrup ? true : (g.araToplam >= minTutar),
      teslimatUcreti: kuryePayi,
      genelToplam: g.araToplam + (g.araToplam > 0 ? kuryePayi : 0),
    };
  });
}

