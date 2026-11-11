import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { haritaIkonlariOlustur } from '@/src/MalzemeCekmeceleri/CanliTakip/HaritaIkonlari';
import { KuryeCanliKonumBilgisi } from '@/src/MalzemeCekmeceleri/CanliTakip/CanliTakipTipleri';

interface CanliKuryeHaritasiProps {
  bilgi: KuryeCanliKonumBilgisi;
}

export const CanliKuryeHaritasi: React.FC<CanliKuryeHaritasiProps> = ({ bilgi }) => {
  const haritaKutusuRef = useRef<HTMLDivElement>(null);
  const haritaRef = useRef<L.Map | null>(null);
  const kuryeIsaretciRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!haritaKutusuRef.current) return;

    if (!haritaRef.current) {
      const kuryeKonum: [number, number] = [bilgi.anlik_konum.enlem, bilgi.anlik_konum.boylam];
      const musteriKonum: [number, number] = [
        bilgi.musteri_konum?.enlem || 38.7585,
        bilgi.musteri_konum?.boylam || 30.5445
      ];

      const harita = L.map(haritaKutusuRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(kuryeKonum, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(harita);

      L.control.zoom({ position: 'bottomright' }).addTo(harita);

      const { kuryeIkonu, musteriIkonu } = haritaIkonlariOlustur();

      // Müşteri Teslimat İşaretçisi
      L.marker(musteriKonum, { icon: musteriIkonu })
        .addTo(harita)
        .bindPopup('<div class="text-xs font-bold">Teslimat Adresiniz</div>');

      // Hareketli Kurye İşaretçisi
      const kuryeIsaretci = L.marker(kuryeKonum, { icon: kuryeIkonu }).addTo(harita);
      kuryeIsaretciRef.current = kuryeIsaretci;
      haritaRef.current = harita;

      // Kurye ve Müşteri arasındaki alanı ekrana sığdır
      const sinir = L.latLngBounds([kuryeKonum, musteriKonum]);
      harita.fitBounds(sinir, { padding: [50, 50] });
    }

    return () => {
      if (haritaRef.current) {
        haritaRef.current.remove();
        haritaRef.current = null;
      }
    };
  }, []);

  // Kuryenin gerçek GPS konumu Firebase'den güncellendikçe haritada akıcı hareket ettir
  useEffect(() => {
    if (kuryeIsaretciRef.current && haritaRef.current) {
      const yeniLatLng = L.latLng(bilgi.anlik_konum.enlem, bilgi.anlik_konum.boylam);
      kuryeIsaretciRef.current.setLatLng(yeniLatLng);
      haritaRef.current.panTo(yeniLatLng, { animate: true, duration: 1.2 });
    }
  }, [bilgi.anlik_konum.enlem, bilgi.anlik_konum.boylam]);

  return (
    <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#521E5C] shadow-inner">
      <div ref={haritaKutusuRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 z-[400] bg-[#140616]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
        <span className={`w-2 h-2 rounded-full ${bilgi.gps_aktif_mi ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
        <span>{bilgi.gps_aktif_mi ? 'Canlı GPS Yayını Aktif' : 'GPS Sinyali Aranıyor...'}</span>
      </div>
    </div>
  );
};
