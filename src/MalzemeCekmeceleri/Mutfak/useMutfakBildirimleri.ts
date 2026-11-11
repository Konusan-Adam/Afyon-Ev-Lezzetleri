import { useState, useEffect, useRef } from 'react';
import { canliFirebaseAktifMi } from '@/src/veritabani/FirebaseIstemcisi';
import { koleksiyonuCanliDinle } from '@/src/veritabani/FirebaseKoleksiyonServisi';
import { mutfakZiliCal } from './MutfakZilServisi';
import { mutfakTeslimZiliCal } from '@/src/MalzemeCekmeceleri/MutfakTeslimZili';
import { sekmeAlarmiDurdur } from '@/src/MalzemeCekmeceleri/SekmeAlarmi';

export interface YeniSiparisBildirimi {
  id: string;
  siparisKodu: string;
  musteriAdi: string;
  toplamTutar: number;
  zaman: string;
}

export function useMutfakBildirimleri(mutfakId: string) {
  const [yeniSiparisUyarisi, setYeniSiparisUyarisi] = useState<YeniSiparisBildirimi | null>(null);
  const bilinenSiparisIdleri = useRef<Set<string>>(new Set());
  const ilkYukleme = useRef<boolean>(true);
  const tekrarZiliRef = useRef<any>(null);

  const yeniSiparisBildir = (siparis: any) => {
    const kod = siparis.siparis_kodu || siparis.siparisKodu || siparis.id;
    const tutar = Number(siparis.toplam_tutar || siparis.tutar || 0);
    const musteri = siparis.musteri_adi || siparis.musteriAdi || 'Müşteri';

    // Ses ve masaüstü zilini çal
    mutfakZiliCal(
      'Yeni Mutfak Siparişi! 🔔',
      `#${kod} nolu yeni sipariş geldi (${tutar} ₺). Tencere menünüze eklendi.`
    );

    // Ekranda canlı uyarı göster
    setYeniSiparisUyarisi({
      id: siparis.id,
      siparisKodu: kod,
      musteriAdi: musteri,
      toplamTutar: tutar,
      zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    });

    // Aşçı onaylayana veya kapatana kadar her 12 saniyede bir hafifçe ikaz et (kaçırmaması için)
    if (tekrarZiliRef.current) clearInterval(tekrarZiliRef.current);
    tekrarZiliRef.current = setInterval(() => {
      mutfakZiliCal(
        'Onay Bekleyen Sipariş! 🔔',
        `#${kod} nolu sipariş ocakta pişirilmeyi bekliyor.`
      );
    }, 12000);
  };

  const uyariKapat = () => {
    if (tekrarZiliRef.current) {
      clearInterval(tekrarZiliRef.current);
      tekrarZiliRef.current = null;
    }
    sekmeAlarmiDurdur();
    setYeniSiparisUyarisi(null);
  };

  const bilinenTeslimEdilenler = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 1. Yerel Olay Dinleyicisi
    const yerelOlayDinle = (e: any) => {
      const sip = e.detail;
      if (!sip) return;
      const sipMutfak = sip.mutfak_id || sip.mutfakId;
      const buMutfagaMi = !sipMutfak || sipMutfak === mutfakId || mutfakId === 'm1' || sipMutfak === 'm1';
      
      if (buMutfagaMi) {
        yeniSiparisBildir(sip);
      }
    };

    const durumDinle = (e: any) => {
      const detay = e.detail;
      if (!detay) return;
      if (detay.durum === 'teslim_edildi') {
        const kod = detay.siparisKodu || detay.siparisKimligi;
        mutfakTeslimZiliCal(kod);
      }
    };

    window.addEventListener('afyon_siparis_eklendi', yerelOlayDinle);
    window.addEventListener('afyon_yeni_mutfak_siparisi', yerelOlayDinle);
    window.addEventListener('afyon_siparis_durum_degisti', durumDinle);

    // 2. Canlı Firebase Dinleyicisi
    let abonelikDurdur = () => {};
    if (canliFirebaseAktifMi()) {
      abonelikDurdur = koleksiyonuCanliDinle<any>('siparisler', (liste) => {
        if (!Array.isArray(liste)) return;

        if (ilkYukleme.current) {
          liste.forEach((s) => {
            bilinenSiparisIdleri.current.add(s.id);
            if (s.durum === 'teslim_edildi' || s.asama === 'teslim_edildi') {
              bilinenTeslimEdilenler.current.add(s.id);
            }
          });
          ilkYukleme.current = false;
          return;
        }

        // Teslim edilen siparişler için mutfağa başarı zili çal
        liste.forEach((s) => {
          const teslimMi = s.durum === 'teslim_edildi' || s.asama === 'teslim_edildi';
          const sipMutfak = s.mutfak_id || s.mutfakId;
          const buMutfagaMi = !sipMutfak || sipMutfak === mutfakId || mutfakId === 'm1' || sipMutfak === 'm1';

          if (teslimMi && buMutfagaMi && !bilinenTeslimEdilenler.current.has(s.id)) {
            bilinenTeslimEdilenler.current.add(s.id);
            mutfakTeslimZiliCal(s.siparis_kodu || s.id);
          }
        });

        // Yeni eklenen siparişleri bul
        const yeniGelenler = liste.filter((s) => {
          if (bilinenSiparisIdleri.current.has(s.id)) return false;
          const sipMutfak = s.mutfak_id || s.mutfakId;
          const buMutfagaMi = !sipMutfak || sipMutfak === mutfakId || mutfakId === 'm1' || sipMutfak === 'm1';
          return buMutfagaMi && (s.durum === 'hazirlaniyor' || !s.durum);
        });

        if (yeniGelenler.length > 0) {
          yeniGelenler.forEach((s) => bilinenSiparisIdleri.current.add(s.id));
          yeniSiparisBildir(yeniGelenler[0]);
        }
      });
    }

    return () => {
      window.removeEventListener('afyon_siparis_eklendi', yerelOlayDinle);
      window.removeEventListener('afyon_yeni_mutfak_siparisi', yerelOlayDinle);
      window.removeEventListener('afyon_siparis_durum_degisti', durumDinle);
      if (tekrarZiliRef.current) clearInterval(tekrarZiliRef.current);
      sekmeAlarmiDurdur();
      abonelikDurdur();
    };
  }, [mutfakId]);

  return {
    yeniSiparisUyarisi,
    uyariKapat
  };
}

