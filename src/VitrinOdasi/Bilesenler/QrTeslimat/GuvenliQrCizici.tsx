/**
 * 🦁 AFYON EV LEZZETLERİ - GÜVENLİ VE GERÇEK QR ÇİZİCİ
 * Standart ISO/IEC 18004 Gerçek QR Matrisi - SVG Tabanlı Vektörel Çizim
 * Tek Dosya - Tek İş Prensibi (AGENTS.md Kural 4)
 */

import React, { useMemo } from 'react';
import QRCode from 'qrcode';

interface GuvenliQrCiziciProps {
  veri: string;
  boyut?: number;
  anaRenk?: string;
  arkaPlanRenk?: string;
}

export const GuvenliQrCizici: React.FC<GuvenliQrCiziciProps> = ({
  veri,
  boyut = 200,
  anaRenk = '#1C0821',
  arkaPlanRenk = '#FFFFFF'
}) => {
  // Gerçek standart QR matrisi oluşturma
  const { hucreler, toplamBoyut, gecerliMi } = useMemo(() => {
    try {
      const guvenliVeri = veri && veri.trim().length > 0 ? veri : 'AFYON-BOS';
      const qrNesnesi = QRCode.create(guvenliVeri, { errorCorrectionLevel: 'M' });
      const modulSayisi = qrNesnesi.modules.size;
      const kenarBoslugu = 2; // Okuyucu kameraların rahat görmesi için sessiz alan (Quiet Zone)
      const tamGenislik = modulSayisi + kenarBoslugu * 2;

      const matris: { x: number; y: number }[] = [];
      for (let satir = 0; satir < modulSayisi; satir++) {
        for (let sutun = 0; sutun < modulSayisi; sutun++) {
          if (qrNesnesi.modules.get(satir, sutun)) {
            matris.push({
              x: sutun + kenarBoslugu,
              y: satir + kenarBoslugu
            });
          }
        }
      }

      return {
        hucreler: matris,
        toplamBoyut: tamGenislik,
        gecerliMi: true
      };
    } catch {
      return {
        hucreler: [],
        toplamBoyut: 25,
        gecerliMi: false
      };
    }
  }, [veri]);

  if (!gecerliMi) {
    return (
      <div
        style={{ width: boyut, height: boyut }}
        className="flex items-center justify-center bg-gray-100 rounded-xl text-xs text-gray-500 text-center p-2"
      >
        QR Kodu Hazırlanamadı
      </div>
    );
  }

  return (
    <svg
      width={boyut}
      height={boyut}
      viewBox={`0 0 ${toplamBoyut} ${toplamBoyut}`}
      className="rounded-2xl shadow-xl border-4 border-white bg-white select-none transition-transform duration-300"
      shapeRendering="crispEdges"
    >
      {/* Sessiz alan ve arka plan tabanı */}
      <rect width={toplamBoyut} height={toplamBoyut} fill={arkaPlanRenk} />
      
      {/* Gerçek QR Kod Hücreleri */}
      {hucreler.map((hucre, sira) => (
        <rect
          key={sira}
          x={hucre.x}
          y={hucre.y}
          width={1}
          height={1}
          fill={anaRenk}
        />
      ))}
    </svg>
  );
};

