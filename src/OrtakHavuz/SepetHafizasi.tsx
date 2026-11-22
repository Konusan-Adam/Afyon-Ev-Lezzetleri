import React, { createContext, useContext, useState, useEffect } from 'react';
import { SepetElemani, YemekTipi, MutfakTipi, GelAlSubesi } from '@/src/veritabani/VeriTipleri';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { veritabaninaSepeteEkle, type SepetEkBilgileri } from '@/src/MalzemeCekmeceleri/Sepet/sepeteEkle';
import {
  veritabanindaSepetAdetiGuncelle,
  veritabanindanSepetElemaniniSil,
  veritabanindanMutfakSepetiniTemizle,
} from '@/src/MalzemeCekmeceleri/Sepet/sepetElemaniGuncelle';
import { sepetiMutfaklaraGöreGrupla, MutfakSepetGrubu } from '@/src/MalzemeCekmeceleri/Sepet/sepetGruplayici';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { sepetElemanlariniZenginlestir } from '@/src/MalzemeCekmeceleri/Sepet/sepetUrunEslestirici';
import { SubeUrunu } from '@/src/veritabani/SubeTipleri';
import { mutfakMolaDurumuGetir, yemekStokDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/yemekStokDurumu';
import { calismaSaatiDurumuHesapla } from '@/src/MalzemeCekmeceleri/OnSiparisVePorsiyon/calismaSaatiKontrolu';

interface SepetHafizasiTip {
  sepetPaneliAcik: boolean;
  sepetPaneliAc: () => void;
  sepetPaneliKapat: () => void;
  sepetElemanlari: SepetElemani[];
  mutfakGruplari: MutfakSepetGrubu[];
  mutfaklarListesi: MutfakTipi[];
  yemeklerListesi: YemekTipi[];
  sepetUyarisi: string | null;
  sepetUyarisiTemizle: () => void;
  toplamUrunSayisi: number;
  toplamSepetTutari: number;
  toplamTeslimatUcreti: number;
  genelToplamTutar: number;
  yukleniyor: boolean;
  sepeteEkle: (mutfakId: string, yemekId: string, adet: number, birimFiyat: number, ekBilgiler?: SepetEkBilgileri) => Promise<void>;
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
  mutfaklarListesi: [],
  yemeklerListesi: [],
  sepetUyarisi: null,
  sepetUyarisiTemizle: () => {},
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
  const [mutfaklarState, setMutfaklarState] = useState<MutfakTipi[]>([]);
  const [subelerState, setSubelerState] = useState<GelAlSubesi[]>([]);
  const [yemeklerState, setYemeklerState] = useState<YemekTipi[]>([]);
  const [sepetUyarisi, setSepetUyarisi] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState<boolean>(true);

  const uyariGoster = (mesaj: string) => {
    setSepetUyarisi(mesaj);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('afyon_vitrin_uyari', { detail: { mesaj } }));
    }
  };

  useEffect(() => {
    if (!sepetUyarisi) return;
    const zamanlayici = setTimeout(() => setSepetUyarisi(null), 4000);
    return () => clearTimeout(zamanlayici);
  }, [sepetUyarisi]);

  const musteriId = aktifKullanici?.kimlik || 'misafir_yerel_sepet';

  useEffect(() => {
    setYukleniyor(true);
    let abonelikCikarSepet = () => {};
    let abonelikCikarYemek = () => {};
    let abonelikCikarMutfak = () => {};
    let abonelikCikarSubeUrun = () => {};
    let abonelikCikarSube = () => {};

    let mevcutSepet: SepetElemani[] = [];
    let mevcutYemekler: YemekTipi[] = [];
    let mevcutMutfaklar: MutfakTipi[] = [];
    let mevcutSubeUrunleri: SubeUrunu[] = [];
    let mevcutSubeler: GelAlSubesi[] = [];

    const sepetiHaritalaVeGuncelle = () => {
      const haritalanmis = sepetElemanlariniZenginlestir(
        mevcutSepet,
        mevcutYemekler,
        mevcutMutfaklar,
        mevcutSubeUrunleri,
        mevcutSubeler
      );

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
      setYemeklerState(mevcutYemekler);
      sepetiHaritalaVeGuncelle();
    });

    abonelikCikarMutfak = koleksiyonuCanliDinle<MutfakTipi>('mutfaklar', (mListesi) => {
      mevcutMutfaklar = mListesi || [];
      setMutfaklarState(mevcutMutfaklar);
      sepetiHaritalaVeGuncelle();
    });

    abonelikCikarSubeUrun = koleksiyonuCanliDinle<SubeUrunu>('sube_stoklari', (uListesi) => {
      mevcutSubeUrunleri = uListesi || [];
      sepetiHaritalaVeGuncelle();
    });

    abonelikCikarSube = koleksiyonuCanliDinle<GelAlSubesi>('gel_al_subeleri', (sListesi) => {
      mevcutSubeler = sListesi || [];
      setSubelerState(mevcutSubeler);
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
      abonelikCikarSubeUrun();
      abonelikCikarSube();
    };
  }, [musteriId]);

  const sepeteEkle = async (
    mutfakId: string,
    yemekId: string,
    adet: number,
    birimFiyat: number,
    ekBilgiler?: SepetEkBilgileri
  ) => {
    const bagliMutfak = mutfaklarState.find((m) => m.id === mutfakId || m.kimlik === mutfakId);
    const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak);
    if (molaBilgisi.siparisEngelliMi) {
      uyariGoster(molaBilgisi.uyariMetni);
      return;
    }

    const bagliSube = subelerState.find((s) => s.id === mutfakId || s.kimlik === mutfakId);
    if (bagliSube) {
      const subeDurumu = calismaSaatiDurumuHesapla(bagliSube);
      if (!subeDurumu.acikMi) {
        uyariGoster(subeDurumu.uyariMetni || `${bagliSube.ad} şu an kapalıdır.`);
        return;
      }
    }

    let eklenecekAdet = Math.max(1, Number(adet) || 1);

    if (!ekBilgiler?.coklu_menu_mu) {
      const canliYemek = yemeklerState.find((y) => y.id === yemekId);
      if (canliYemek) {
        const stokBilgisi = yemekStokDurumuHesapla(canliYemek, bagliMutfak);
        if (stokBilgisi.tukendiMi) {
          uyariGoster(`${canliYemek.baslik} şu an tükendi.`);
          return;
        }
        if (stokBilgisi.stokTakibiVarMi && stokBilgisi.kalanStok !== undefined) {
          const sepettekiToplam = sepetElemanlari
            .filter((e) => e.yemek_id === yemekId)
            .reduce((t, e) => t + e.adet, 0);
          const kalanHak = Math.max(0, stokBilgisi.kalanStok - sepettekiToplam);
          if (kalanHak <= 0) {
            uyariGoster(`Stok sınırı: Bu üründen en fazla ${stokBilgisi.kalanStok} ${stokBilgisi.birim} ekleyebilirsiniz.`);
            return;
          }
          if (eklenecekAdet > kalanHak) {
            eklenecekAdet = kalanHak;
            uyariGoster(`Stok sınırı nedeniyle sepetteki toplam adet ${stokBilgisi.kalanStok} ${stokBilgisi.birim} ile sınırlandı.`);
          }
        }
      }
    }

    await veritabaninaSepeteEkle(musteriId, mutfakId, yemekId, eklenecekAdet, birimFiyat, ekBilgiler);
  };

  const adetGuncelle = async (sepetId: string, yeniAdet: number) => {
    if (yeniAdet <= 0) {
      await sepettenSil(sepetId);
      return;
    }

    const mevcutEleman = sepetElemanlari.find((e) => e.id === sepetId);
    if (mevcutEleman) {
      const hedefMutfakId = mevcutEleman.mutfak_id || mevcutEleman.yemek?.mutfak_id;
      const bagliMutfak = mutfaklarState.find((m) => m.id === hedefMutfakId || m.kimlik === hedefMutfakId) || mevcutEleman.mutfak;
      const molaBilgisi = mutfakMolaDurumuGetir(bagliMutfak);

      if (molaBilgisi.siparisEngelliMi && yeniAdet > mevcutEleman.adet) {
        uyariGoster(molaBilgisi.uyariMetni);
        return;
      }

      const bagliSube = subelerState.find((s) => s.id === hedefMutfakId || s.kimlik === hedefMutfakId);
      if (bagliSube && yeniAdet > mevcutEleman.adet) {
        const subeDurumu = calismaSaatiDurumuHesapla(bagliSube);
        if (!subeDurumu.acikMi) {
          uyariGoster(subeDurumu.uyariMetni || `${bagliSube.ad} şu an kapalıdır.`);
          return;
        }
      }

      if (!mevcutEleman.coklu_menu_mu && mevcutEleman.yemek_id) {
        const canliYemek = yemeklerState.find((y) => y.id === mevcutEleman.yemek_id) || mevcutEleman.yemek;
        if (canliYemek) {
          const stokBilgisi = yemekStokDurumuHesapla(canliYemek, bagliMutfak);
          if (stokBilgisi.stokTakibiVarMi && stokBilgisi.kalanStok !== undefined) {
            const digerSatirlarToplami = sepetElemanlari
              .filter((e) => e.yemek_id === mevcutEleman.yemek_id && e.id !== sepetId)
              .reduce((t, e) => t + e.adet, 0);
            const buSatirMaks = Math.max(0, stokBilgisi.kalanStok - digerSatirlarToplami);
            if (yeniAdet > buSatirMaks) {
              uyariGoster(`Stok sınırı: Bu üründen en fazla ${stokBilgisi.kalanStok} ${stokBilgisi.birim} ekleyebilirsiniz.`);
              if (mevcutEleman.adet !== buSatirMaks && buSatirMaks > 0) {
                await veritabanindaSepetAdetiGuncelle(sepetId, buSatirMaks);
              }
              return;
            }
          }
        }
      }
    }

    await veritabanindaSepetAdetiGuncelle(sepetId, yeniAdet);
  };

  const sepettenSil = async (sepetId: string) => {
    setSepetElemanlari((oncekiler) => oncekiler.filter((e) => e.id !== sepetId));
    await veritabanindanSepetElemaniniSil(sepetId);
  };

  const mutfakSepetiniTemizle = async (mutfakId: string) => {
    setSepetElemanlari((oncekiler) =>
      oncekiler.filter((e) => (e.mutfak_id || e.yemek?.mutfak_id) !== mutfakId)
    );
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
        mutfaklarListesi: mutfaklarState,
        yemeklerListesi: yemeklerState,
        sepetUyarisi,
        sepetUyarisiTemizle: () => setSepetUyarisi(null),
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
