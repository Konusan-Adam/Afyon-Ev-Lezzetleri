import { useState, useEffect, useRef } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { kuryeZiliCal } from './KuryeZilServisi';
import { kuryeTeslimZiliCal } from '@/src/MalzemeCekmeceleri/KuryeTeslimZili';
import { sekmeAlarmiDurdur } from '@/src/MalzemeCekmeceleri/SekmeAlarmi';

export interface YeniPaketBildirimi {
  id: string;
  siparisKodu: string;
  adres: string;
  tutar: number;
  zaman: string;
}

export function useKuryeBildirimleri(kuryeId: string) {
  const [yeniPaketUyarisi, setYeniPaketUyarisi] = useState<YeniPaketBildirimi | null>(null);
  const bilinenPaketIdleri = useRef<Set<string>>(new Set());
  const ilkYukleme = useRef<boolean>(true);
  const tekrarZiliRef = useRef<any>(null);

  const yeniPaketBildir = (paket: any) => {
    const kod = paket.siparis_kodu || paket.siparisKodu || paket.id;
    const tutar = Number(paket.toplam_tutar || paket.tutar || 0);
    const adres = paket.teslimat_adresi_metni || paket.teslimatAdresiMetni || 'Afyonkarahisar İçi';

    // Ses ve korna çal
    kuryeZiliCal(
      'Yeni Paket Dağıtıma Hazır! 🛵',
      `#${kod} nolu paket mutfaktan çıktı. ${adres} teslimatı için kurye bekleniyor!`
    );

    // Ekranda canlı flaş uyarı göster
    setYeniPaketUyarisi({
      id: paket.id || kod,
      siparisKodu: kod,
      adres,
      tutar,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });

    // Kurye teslim alana kadar her 15 saniyede bir hafifçe ikaz et
    if (tekrarZiliRef.current) clearInterval(tekrarZiliRef.current);
    tekrarZiliRef.current = setInterval(() => {
      kuryeZiliCal(
        'Bekleyen Paket Var! 🛵',
        `#${kod} nolu paket mutfakta hazır, teslim alınmayı bekliyor.`
      );
    }, 15000);
  };

  const uyariKapat = () => {
    if (tekrarZiliRef.current) {
      clearInterval(tekrarZiliRef.current);
      tekrarZiliRef.current = null;
    }
    sekmeAlarmiDurdur();
    setYeniPaketUyarisi(null);
  };

  useEffect(() => {
    const bilinenTeslimler = new Set<string>();

    // 1. Yerel Olay Dinleyicisi
    const durumDinle = (e: any) => {
      const detay = e.detail;
      if (!detay) return;
      if (detay.durum === 'paketlendi') {
        yeniPaketBildir(detay);
      } else if (detay.durum === 'teslim_edildi') {
        const kod = detay.siparisKodu || detay.siparisKimligi;
        kuryeTeslimZiliCal(kod);
      }
    };

    window.addEventListener('afyon_siparis_durum_degisti', durumDinle);

    // 2. Canlı Firebase Dinleyicisi
    let abonelikDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', (liste) => {
        if (!Array.isArray(liste)) return;

        if (ilkYukleme.current) {
          liste.forEach((s) => {
            if (s.durum === 'paketlendi') {
              bilinenPaketIdleri.current.add(s.id);
            }
            if (s.durum === 'teslim_edildi' || s.asama === 'teslim_edildi') {
              bilinenTeslimler.add(s.id);
            }
          });
          ilkYukleme.current = false;
          return;
        }

        // Teslim edilen paketler için kuryeye prim ve bildirim zili çal
        liste.forEach((s) => {
          const teslimMi = s.durum === 'teslim_edildi' || s.asama === 'teslim_edildi';
          const benimMi = !s.kurye_id || s.kurye_id === kuryeId;
          if (teslimMi && benimMi && !bilinenTeslimler.has(s.id)) {
            bilinenTeslimler.add(s.id);
            kuryeTeslimZiliCal(s.siparis_kodu || s.id);
          }
        });

        // Yeni paketlenen ve henüz sahipsiz olan siparişleri tespit et
        const yeniHazirlar = liste.filter((s) => {
          const hazirMi = s.durum === 'paketlendi' || s.asama === 'paketlendi';
          const sahipsizMi = !s.kurye_id || s.kurye_id === '';
          const dahaOnceBiliniyorMu = bilinenPaketIdleri.current.has(s.id);

          return hazirMi && sahipsizMi && !dahaOnceBiliniyorMu;
        });

        if (yeniHazirlar.length > 0) {
          yeniHazirlar.forEach((s) => bilinenPaketIdleri.current.add(s.id));
          yeniPaketBildir(yeniHazirlar[0]);
        }
      });
    }

    return () => {
      window.removeEventListener('afyon_siparis_durum_degisti', durumDinle);
      if (tekrarZiliRef.current) clearInterval(tekrarZiliRef.current);
      sekmeAlarmiDurdur();
      abonelikDurdur();
    };
  }, [kuryeId]);

  return {
    yeniPaketUyarisi,
    uyariKapat
  };
}

