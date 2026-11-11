import { useState, useCallback, useMemo } from 'react';
import { useAdminKuponu } from './useAdminKuponu';

export interface KuponHesaplamaSonucu {
  gecerli: boolean;
  kod: string;
  baslik: string;
  indirimTutari: number;
  hataMesaji?: string;
}

const KULLANILAN_KUPONLAR_ANAHTARI = 'afyon_kullanilmis_kuponlar_v1';

export function kuponDahaOnceKullanildiMi(kod: string, telefon?: string): boolean {
  if (!kod) return false;
  try {
    const kayitli = localStorage.getItem(KULLANILAN_KUPONLAR_ANAHTARI);
    if (!kayitli) return false;
    const liste: Array<{ kod: string; telefon?: string }> = JSON.parse(kayitli);
    const temizKod = kod.trim().toUpperCase();
    const temizTel = telefon ? telefon.replace(/\D/g, '').slice(-10) : '';

    return liste.some((k) => {
      const kodEslesiyor = k.kod.toUpperCase() === temizKod;
      if (!kodEslesiyor) return false;
      if (temizTel && k.telefon) {
        return k.telefon.slice(-10) === temizTel;
      }
      return true;
    });
  } catch {
    return false;
  }
}

export function kuponuKullanildiOlarakIsaretle(kod: string, telefon?: string) {
  try {
    const kayitli = localStorage.getItem(KULLANILAN_KUPONLAR_ANAHTARI);
    const liste: Array<{ kod: string; telefon?: string; tarih: string }> = kayitli ? JSON.parse(kayitli) : [];
    const temizTel = telefon ? telefon.replace(/\D/g, '').slice(-10) : '';
    liste.push({
      kod: kod.trim().toUpperCase(),
      telefon: temizTel,
      tarih: new Date().toISOString()
    });
    localStorage.setItem(KULLANILAN_KUPONLAR_ANAHTARI, JSON.stringify(liste));
  } catch {}
}

export function useKuponHesaplayici(sepetTutari: number, telefon?: string) {
  const { kupon: adminKupon } = useAdminKuponu();
  const [girilenKod, setGirilenKod] = useState('');
  const [uygulananKod, setUygulananKod] = useState<string | null>(null);
  const [hataMesaji, setHataMesaji] = useState<string | null>(null);

  const kuponBilgisi: KuponHesaplamaSonucu | null = useMemo(() => {
    if (!uygulananKod) return null;
    const temizKod = uygulananKod.trim().toUpperCase();

    if (!adminKupon.aktif) {
      return { gecerli: false, kod: temizKod, baslik: '', indirimTutari: 0, hataMesaji: 'Kupon kampanyası şu anda aktif değildir.' };
    }

    if (adminKupon.kod.toUpperCase() !== temizKod) {
      return { gecerli: false, kod: temizKod, baslik: '', indirimTutari: 0, hataMesaji: 'Geçersiz kupon kodu.' };
    }

    if (adminKupon.tekKullanimlikMi && kuponDahaOnceKullanildiMi(temizKod, telefon)) {
      return { gecerli: false, kod: temizKod, baslik: adminKupon.baslik, indirimTutari: 0, hataMesaji: 'Bu kupon kodu daha önce kullanılmıştır.' };
    }

    if (sepetTutari < adminKupon.minSepetTutari) {
      return {
        gecerli: false,
        kod: temizKod,
        baslik: adminKupon.baslik,
        indirimTutari: 0,
        hataMesaji: `Bu kupon en az ${adminKupon.minSepetTutari} ₺ sepet tutarında geçerlidir.`
      };
    }

    let hesaplanan = 0;
    if (adminKupon.indirimTipi === 'yuzde') {
      hesaplanan = (sepetTutari * adminKupon.indirimOrani) / 100;
      if (adminKupon.maksimumIndirim > 0) {
        hesaplanan = Math.min(hesaplanan, adminKupon.maksimumIndirim);
      }
    } else {
      hesaplanan = Math.min(adminKupon.indirimOrani, sepetTutari);
    }

    return {
      gecerli: true,
      kod: temizKod,
      baslik: adminKupon.baslik,
      indirimTutari: Math.round(hesaplanan * 100) / 100
    };
  }, [uygulananKod, adminKupon, sepetTutari, telefon]);

  const kuponUygula = useCallback((kod: string) => {
    setHataMesaji(null);
    const temiz = kod.trim().toUpperCase();
    if (!temiz) {
      setHataMesaji('Lütfen kupon kodunu giriniz.');
      return;
    }

    if (!adminKupon.aktif || adminKupon.kod.toUpperCase() !== temiz) {
      setHataMesaji('Geçersiz veya süresi dolmuş kupon kodu.');
      return;
    }

    if (adminKupon.tekKullanimlikMi && kuponDahaOnceKullanildiMi(temiz, telefon)) {
      setHataMesaji('Bu kupon kodu daha önce kullanılmıştır.');
      return;
    }

    if (sepetTutari < adminKupon.minSepetTutari) {
      setHataMesaji(`Bu kupon en az ${adminKupon.minSepetTutari} ₺ sepet için geçerlidir.`);
      return;
    }

    setUygulananKod(temiz);
  }, [adminKupon, sepetTutari, telefon]);

  const kuponKaldir = useCallback(() => {
    setUygulananKod(null);
    setGirilenKod('');
    setHataMesaji(null);
  }, []);

  return {
    girilenKod,
    setGirilenKod,
    uygulananKod,
    kuponBilgisi,
    hataMesaji,
    kuponUygula,
    kuponKaldir
  };
}
