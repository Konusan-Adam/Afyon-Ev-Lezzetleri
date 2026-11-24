import React from 'react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { AnaSayfaVitrini } from '@/src/VitrinOdasi/AnaSayfaVitrini';
import { MusteriPaneli } from '@/src/VitrinOdasi/MusteriPaneli/MusteriPaneli';

/**
 * 🚪 Ana Giriş Kapısı (Müşteri Vitrini & Sipariş Ekosistemi)
 */
export const AnaKapi: React.FC = () => {
  const { goruntulenenPanel } = kullaniciHafizasiKullan();

  if (goruntulenenPanel === 'musteri') {
    return <MusteriPaneli />;
  }

  return (
    <div className="w-full min-h-screen bg-stone-50/50">
      <AnaSayfaVitrini />
    </div>
  );
};

