import React from 'react';
import { suAnkiZamanDilimi } from '@/src/MalzemeCekmeceleri';

interface HizliOneriDugmeleriProps {
  oneriSecildi: (oneri: string) => void;
  devreDisi: boolean;
}

export const HizliOneriDugmeleri: React.FC<HizliOneriDugmeleriProps> = ({
  oneriSecildi,
  devreDisi,
}) => {
  const zaman = suAnkiZamanDilimi();

  // Saate ve esnaf akışına göre dinamik hazır sorular
  const oneriler = React.useMemo(() => {
    if (zaman.dilim === 'sabah') {
      return [
        '🥐 Sıcak Kahvaltılık ve Fırın Lezzetleri',
        '🥣 Sabah Çorbası Var mı?',
        '☕ Çay & Atıştırmalık Menüsü',
        '👨‍👩‍👧‍👦 Aile Boyu Kahvaltı Sofrası',
      ];
    }
    if (zaman.dilim === 'ogle') {
      return [
        '🍲 Bugünün Sulu Tencere Yemekleri',
        '🍚 Yanına Eşlikçi ve İçecek Ne Var?',
        '🥣 Sıcak Başlangıç Çorbaları',
        '🍮 Kalan Porsiyon Tatlılar',
      ];
    }
    if (zaman.dilim === 'ikindi') {
      return [
        '☕ İkindi Çayı ve Fırın Lezzetleri',
        '🍮 Mutfaktaki Günlük Tatlılar',
        '🥐 Hafif Atıştırmalık Ne Önerirsin?',
      ];
    }
    return [
      '🍲 Akşam İçin Doyurucu Ana Yemekler',
      '🍚 Tam Bir Akşam Menüsü Oluştur',
      '🥣 Sıcak Çorbalar',
      '🍮 Akşam Tatlısı Ne Var?',
    ];
  }, [zaman.dilim]);

  return (
    <div className="flex gap-2 overflow-x-auto py-2.5 px-1 scrollbar-none no-scrollbar">
      {oneriler.map((oneri, indeks) => (
        <button
          key={indeks}
          disabled={devreDisi}
          onClick={() => oneriSecildi(oneri)}
          className="whitespace-nowrap bg-stone-100 hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-amber-300/60 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50 shrink-0 shadow-2xs"
        >
          {oneri}
        </button>
      ))}
    </div>
  );
};
