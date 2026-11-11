import React, { createContext, useContext, useState, useEffect } from 'react';
import { SepetElemani, YemekTipi, MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { veritabaninaSepeteEkle } from '@/src/MalzemeCekmeceleri/Sepet/sepeteEkle';
import {
  veritabanindaSepetAdetiGuncelle,
  veritabanindanSepetElemaniniSil,
  veritabanindanMutfakSepetiniTemizle,
} from '@/src/MalzemeCekmeceleri/Sepet/sepetElemaniGuncelle';
import { sepetiMutfaklaraGöreGrupla, MutfakSepetGrubu } from '@/src/MalzemeCekmeceleri/Sepet/sepetGruplayici';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';

interface SepetHafizasiTip {
  sepetPaneliAcik: boolean;
  sepetPaneliAc: () => void;
  sepetPaneliKapat: () => void;
  sepetElemanlari: SepetElemani[];
  mutfakGruplari: MutfakSepetGrubu[];
  toplamUrunSayisi: number;
  toplamSepetTutari: number;
  toplamTeslimatUcreti: number;
  genelToplamTutar: number;
  yukleniyor: boolean;
  sepeteEkle: (mutfakId: string, yemekId: string, adet: number, birimFiyat: number) => Promise<void>;
  adetGuncelle: (sepetId: string, yeniAdet: number) => Promise<void>;
  sepettenSil: (sepetId: string) => Promise<void>;
  mutfakSepetiniTemizle: (mutfakId: string) => Promise<void>;
  sepetiTamamenTemizle: () => Promise<void>;
}

const SepetContext = createContext<SepetHafizasiTip>({
  sepetPaneliAcik: false,
  sepetPaneliAc: () => {},
  sepetPaneliKapat: () => {},
  sepetElemanlari: [],
  mutfakGruplari: [],
  toplamUrunSayisi: 0,
  toplamSepetTutari: 0,
  toplamTeslimatUcreti: 0,
  genelToplamTutar: 0,
  yukleniyor: false,
  sepeteEkle: async () => {},
  adetGuncelle: async () => {},
  sepettenSil: async () => {},
  mutfakSepetiniTemizle: async () => {},
  sepetiTamamenTemizle: async () => {},
});

export const SepetSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { aktifKullanici } = kullaniciHafizasiKullan();
  const [sepetPaneliAcik, setSepetPaneliAcik] = useState<boolean>(false);
  const [sepetElemanlari, setSepetElemanlari] = useState<SepetElemani[]>([]);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  // Dinamik Müşteri ID: Aktif kullanıcı varsa onun kimliği, yoksa misafir ID
  const musteriId = aktifKullanici?.kimlik || 'misafir_yerel_sepet';

  // 🔥 Firebase Firestore Canlı Dinleyici ile Sepet Verilerini, Yemek ve Mutfak Detaylarıyla Senkronize Etme
  useEffect(() => {
    setYukleniyor(true);
    let abonelikCikarSepet = () => {};
    let abonelikCikarYemek = () => {};
    let abonelikCikarMutfak = () => {};

    let mevcutSepet: SepetElemani[] = [];
    let mevcutYemekler: YemekTipi[] = [];
    let mevcutMutfaklar: MutfakTipi[] = [];

    const sepetiHaritalaVeGuncelle = () => {
      const haritalanmis = mevcutSepet.map((item) => {
        const bulunanYemek = mevcutYemekler.find((y) => y.id === item.yemek_id);
        const bulunanMutfak = mevcutMutfaklar.find((m) => m.id === (item.mutfak_id || bulunanYemek?.mutfak_id));

        const birimFiyat = item.birim_fiyat || bulunanYemek?.fiyat || 0;

        return {
          ...item,
          birim_fiyat: birimFiyat,
          yemek: item.yemek || bulunanYemek,
          mutfak: item.mutfak || bulunanMutfak,
        };
      });

      setSepetElemanlari(haritalanmis);
      setYukleniyor(false);
      try {
        if (haritalanmis.length > 0) {
          localStorage.setItem('afyon_yerel_sepet_v1', JSON.stringify(haritalanmis));
        } else {
          localStorage.removeItem('afyon_yerel_sepet_v1');
        }
      } catch {}
    };

    abonelikCikarYemek = koleksiyonuCanliDinle<YemekTipi>('yemekler', (yListesi) => {
      mevcutYemekler = yListesi || [];
      sepetiHaritalaVeGuncelle();
    });

    abonelikCikarMutfak = koleksiyonuCanliDinle<MutfakTipi>('mutfaklar', (mListesi) => {
      mevcutMutfaklar = mListesi || [];
      sepetiHaritalaVeGuncelle();
    });

    abonelikCikarSepet = koleksiyonuCanliDinle<SepetElemani>('sepet_elemanlari', (tumElemanlar) => {
      mevcutSepet = (tumElemanlar || []).filter((e) => e.musteri_id === musteriId);
      sepetiHaritalaVeGuncelle();
    });

    return () => {
      abonelikCikarSepet();
      abonelikCikarYemek();
      abonelikCikarMutfak();
    };
  }, [musteriId]);

  const sepeteEkle = async (
    mutfakId: string,
    yemekId: string,
    adet: number,
    birimFiyat: number
  ) => {
    await veritabaninaSepeteEkle(musteriId, mutfakId, yemekId, adet, birimFiyat);
  };

  const adetGuncelle = async (sepetId: string, yeniAdet: number) => {
    await veritabanindaSepetAdetiGuncelle(sepetId, yeniAdet);
  };

  const sepettenSil = async (sepetId: string) => {
    // 🚀 Anında arayüzden (optimistic) kaldır
    setSepetElemanlari((oncekiler) => oncekiler.filter((e) => e.id !== sepetId));
    await veritabanindanSepetElemaniniSil(sepetId);
  };

  const mutfakSepetiniTemizle = async (mutfakId: string) => {
    setSepetElemanlari((oncekiler) => oncekiler.filter((e) => e.yemek && e.yemek.mutfak_id !== mutfakId));
    await veritabanindanMutfakSepetiniTemizle(musteriId, mutfakId);
  };

  const sepetiTamamenTemizle = async () => {
    for (const g of mutfakGruplari) {
      await veritabanindanMutfakSepetiniTemizle(musteriId, g.mutfakId);
    }
    setSepetElemanlari([]);
    try {
      localStorage.removeItem('afyon_yerel_sepet_v1');
    } catch {}
  };

  const mutfakGruplari = sepetiMutfaklaraGöreGrupla(sepetElemanlari);
  const toplamUrunSayisi = sepetElemanlari.reduce((toplam, item) => toplam + item.adet, 0);
  const toplamSepetTutari = mutfakGruplari.reduce((toplam, g) => toplam + g.araToplam, 0);
  const toplamTeslimatUcreti = mutfakGruplari.reduce((toplam, g) => toplam + g.teslimatUcreti, 0);
  const genelToplamTutar = toplamSepetTutari + toplamTeslimatUcreti;

  return (
    <SepetContext.Provider
      value={{
        sepetPaneliAcik,
        sepetPaneliAc: () => setSepetPaneliAcik(true),
        sepetPaneliKapat: () => setSepetPaneliAcik(false),
        sepetElemanlari,
        mutfakGruplari,
        toplamUrunSayisi,
        toplamSepetTutari,
        toplamTeslimatUcreti,
        genelToplamTutar,
        yukleniyor,
        sepeteEkle,
        adetGuncelle,
        sepettenSil,
        mutfakSepetiniTemizle,
        sepetiTamamenTemizle,
      }}
    >
      {children}
    </SepetContext.Provider>
  );
};

export const sepetHafizasiKullan = () => useContext(SepetContext);
