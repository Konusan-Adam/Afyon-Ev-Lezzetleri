import React from 'react';
import { useOturumHareketsizlik } from '@/src/MalzemeCekmeceleri/useOturumHareketsizlik';
import { OturumZamanlayiciUyarisi } from '@/src/OrtakHavuz/OturumZamanlayiciUyarisi';

/**
 * 🦁 Afyon Ev Lezzetleri — Akıllı Oturum Zamanlayıcısı Servisi
 * Müşteri, mutfak ve kurye oturumlarını 1 saatlik hareketsizlikte sonlandırır.
 * Patron / Yönetici bu sınırlamadan muaftır.
 */
export const OturumZamanlayicisiServisi: React.FC = () => {
  const { uyariGoster, kalanSaniye, oturumDiriTut } = useOturumHareketsizlik();

  if (!uyariGoster) return null;

  return (
    <OturumZamanlayiciUyarisi
      kalanSaniye={kalanSaniye}
      onDevamEt={oturumDiriTut}
    />
  );
};
