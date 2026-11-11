import React from 'react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { AnaSayfaVitrini } from '@/src/VitrinOdasi/AnaSayfaVitrini';
import { MusteriPaneli } from '@/src/VitrinOdasi/MusteriPaneli/MusteriPaneli';
import { SubeYoneticisiPaneli } from '@/src/VitrinOdasi/SubePaneli/SubeYoneticisiPaneli';
import { PatronYoneticisiPaneli } from '@/src/VitrinOdasi/PatronPaneli/PatronYoneticisiPaneli';

/**
 * 🚪 Ana Giriş Kapısı (Müşteri Vitrini & Sipariş Ekosistemi)
 */
export const AnaKapi: React.FC = () => {
  const { goruntulenenPanel } = kullaniciHafizasiKullan();

  if (goruntulenenPanel === 'musteri') {
    return <MusteriPaneli />;
  }

  if (goruntulenenPanel === 'sube') {
    return <SubeYoneticisiPaneli />;
  }

  if (goruntulenenPanel === 'patron') {
    return <PatronYoneticisiPaneli />;
  }

  return (
    <div className="w-full min-h-screen bg-stone-50/50">
      <AnaSayfaVitrini />
    </div>
  );
};

