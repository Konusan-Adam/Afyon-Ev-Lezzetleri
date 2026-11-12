import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FavoriVerisi, FavoriHafizaTipi } from './FavoriTipleri';
import { kullaniciHafizasiKullan } from './KullaniciHafizasi';
import { belgeGetir, belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';

const YEREL_DEPO_ANAHTARI = 'afyon_musteri_favorileri';

const varsayilanVeri: FavoriVerisi = {
  mutfakIdleri: [],
  subeIdleri: [],
};

const FavoriContext = createContext<FavoriHafizaTipi | undefined>(undefined);

export const FavoriSaglayici: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { aktifKullanici } = kullaniciHafizasiKullan();

  const [favoriler, setFavoriler] = useState<FavoriVerisi>(() => {
    if (typeof window === 'undefined') return varsayilanVeri;
    try {
      const kayitli = localStorage.getItem(YEREL_DEPO_ANAHTARI);
      return kayitli ? JSON.parse(kayitli) : varsayilanVeri;
    } catch {
      return varsayilanVeri;
    }
  });

  // Kullanıcı oturum açtığında Firestore'dan favorileri çekip birleştir
  useEffect(() => {
    if (!aktifKullanici?.kimlik && !aktifKullanici?.telefon) return;
    const kullaniciKimligi = aktifKullanici.kimlik || aktifKullanici.telefon;

    let aktifMi = true;
    belgeGetir<FavoriVerisi>('musteri_favorileri', kullaniciKimligi).then((bulunan) => {
      if (!aktifMi || !bulunan) return;

      setFavoriler((onceki) => {
        const yeniMutfaklar = Array.from(new Set([...onceki.mutfakIdleri, ...(bulunan.mutfakIdleri || [])]));
        const yeniSubeler = Array.from(new Set([...onceki.subeIdleri, ...(bulunan.subeIdleri || [])]));
        const guncel: FavoriVerisi = { mutfakIdleri: yeniMutfaklar, subeIdleri: yeniSubeler };
        try {
          localStorage.setItem(YEREL_DEPO_ANAHTARI, JSON.stringify(guncel));
        } catch {}
        return guncel;
      });
    });

    return () => {
      aktifMi = false;
    };
  }, [aktifKullanici]);

  // Favoriler değiştikçe hem localStorage'a hem de varsa kullanıcı için Firestore'a yaz
  const favorileriKaydet = useCallback(
    (yeniFavoriler: FavoriVerisi) => {
      setFavoriler(yeniFavoriler);
      try {
        localStorage.setItem(YEREL_DEPO_ANAHTARI, JSON.stringify(yeniFavoriler));
        window.dispatchEvent(new CustomEvent('afyon_favoriler_degisti', { detail: yeniFavoriler }));
      } catch {}

      const kullaniciKimligi = aktifKullanici?.kimlik || aktifKullanici?.telefon;
      if (kullaniciKimligi) {
        belgeKaydet('musteri_favorileri', kullaniciKimligi, {
          ...yeniFavoriler,
          kullanici_kimlik: kullaniciKimligi,
          guncellenme_zamani: new Date().toISOString(),
        }).catch((err) => console.warn('Firestore favori güncelleme hatası:', err));
      }
    },
    [aktifKullanici]
  );

  const mutfakFavoriMi = useCallback(
    (mutfakId: string) => favoriler.mutfakIdleri.includes(mutfakId),
    [favoriler.mutfakIdleri]
  );

  const subeFavoriMi = useCallback(
    (subeId: string) => favoriler.subeIdleri.includes(subeId),
    [favoriler.subeIdleri]
  );

  const mutfakFavoriDegistir = useCallback(
    (mutfakId: string) => {
      const varMi = favoriler.mutfakIdleri.includes(mutfakId);
      const yeniMutfakIdleri = varMi
        ? favoriler.mutfakIdleri.filter((id) => id !== mutfakId)
        : [...favoriler.mutfakIdleri, mutfakId];

      favorileriKaydet({
        ...favoriler,
        mutfakIdleri: yeniMutfakIdleri,
      });
    },
    [favoriler, favorileriKaydet]
  );

  const subeFavoriDegistir = useCallback(
    (subeId: string) => {
      const varMi = favoriler.subeIdleri.includes(subeId);
      const yeniSubeIdleri = varMi
        ? favoriler.subeIdleri.filter((id) => id !== subeId)
        : [...favoriler.subeIdleri, subeId];

      favorileriKaydet({
        ...favoriler,
        subeIdleri: yeniSubeIdleri,
      });
    },
    [favoriler, favorileriKaydet]
  );

  const toplamFavoriSayisi = favoriler.mutfakIdleri.length + favoriler.subeIdleri.length;

  return (
    <FavoriContext.Provider
      value={{
        favoriMutfakIdleri: favoriler.mutfakIdleri,
        favoriSubeIdleri: favoriler.subeIdleri,
        mutfakFavoriMi,
        subeFavoriMi,
        mutfakFavoriDegistir,
        subeFavoriDegistir,
        toplamFavoriSayisi,
      }}
    >
      {children}
    </FavoriContext.Provider>
  );
};

export const favoriHafizasiKullan = (): FavoriHafizaTipi => {
  const context = useContext(FavoriContext);
  if (!context) {
    throw new Error('favoriHafizasiKullan, FavoriSaglayici içinde kullanılmalıdır.');
  }
  return context;
};
