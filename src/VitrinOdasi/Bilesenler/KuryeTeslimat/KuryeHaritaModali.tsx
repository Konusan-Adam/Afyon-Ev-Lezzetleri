import React, { useEffect, useRef } from 'react';
import { X, Navigation, MapPin, Phone, User, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { haritaIkonlariOlustur } from '@/src/MalzemeCekmeceleri/CanliTakip/HaritaIkonlari';

interface KuryeHaritaModaliProps {
  paket: any;
  kuryeKonum?: { enlem: number; boylam: number } | null;
  onKapat: () => void;
}

export const KuryeHaritaModali: React.FC<KuryeHaritaModaliProps> = ({
  paket,
  kuryeKonum,
  onKapat,
}) => {
  const haritaKutusuRef = useRef<HTMLDivElement>(null);
  const haritaRef = useRef<L.Map | null>(null);

  const paketKodu = paket.siparis_kodu || paket.siparisKodu || paket.id;
  const musteriAdi = paket.musteri_adi || paket.musteriAdi || 'Müşteri';
  const musteriTelefon = paket.musteri_telefon || paket.musteriTelefon || '';
  const teslimatAdresi = paket.teslimat_adresi_metni || paket.teslimatAdresiMetni || paket.adres || 'Afyonkarahisar Merkez';

  // Kurye ve müşteri koordinatları (Afyon merkez odaklı)
  const kuryeEnlem = kuryeKonum?.enlem || 38.7569;
  const kuryeBoylam = kuryeKonum?.boylam || 30.5387;
  const musteriEnlem = paket.enlem || 38.7585;
  const musteriBoylam = paket.boylam || 30.5445;

  useEffect(() => {
    if (!haritaKutusuRef.current) return;

    if (!haritaRef.current) {
      const kuryeNoktasi: [number, number] = [kuryeEnlem, kuryeBoylam];
      const musteriNoktasi: [number, number] = [musteriEnlem, musteriBoylam];

      const harita = L.map(haritaKutusuRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(kuryeNoktasi, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(harita);

      L.control.zoom({ position: 'bottomright' }).addTo(harita);

      const { kuryeIkonu, musteriIkonu } = haritaIkonlariOlustur();

      // Kurye İşaretçisi
      L.marker(kuryeNoktasi, { icon: kuryeIkonu })
        .addTo(harita)
        .bindPopup('<div class="text-xs font-bold">Bulunduğunuz Konum (Siz)</div>');

      // Müşteri Teslimat İşaretçisi
      L.marker(musteriNoktasi, { icon: musteriIkonu })
        .addTo(harita)
        .bindPopup(`<div class="text-xs font-bold">Teslimat: ${musteriAdi}</div><div class="text-[10px] text-gray-600">${teslimatAdresi}</div>`);

      // İki noktayı ekrana sığdır
      const sinir = L.latLngBounds([kuryeNoktasi, musteriNoktasi]);
      harita.fitBounds(sinir, { padding: [40, 40] });

      haritaRef.current = harita;

      // Modal açılış animasyonundan sonra harita boyutunu tam oturt
      setTimeout(() => {
        harita.invalidateSize();
      }, 250);
    }

    return () => {
      if (haritaRef.current) {
        haritaRef.current.remove();
        haritaRef.current = null;
      }
    };
  }, [kuryeEnlem, kuryeBoylam, musteriEnlem, musteriBoylam, musteriAdi, teslimatAdresi]);

  const hedefMetin = encodeURIComponent(`${teslimatAdresi}, Afyonkarahisar`);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hedefMetin}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1C0922] border border-[#521E5C] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[90vh]">
        {/* Üst Başlık */}
        <div className="p-4 border-b border-purple-900/40 flex items-center justify-between bg-[#240C28]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#F5D28A]">Canlı Teslimat Rotası</h3>
              <p className="text-[11px] text-purple-300">Sipariş #{paketKodu}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Harita Alanı */}
        <div className="relative w-full h-72 sm:h-80 bg-[#120516]">
          <div ref={haritaKutusuRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 z-[400] bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-900/60 text-[10px] text-emerald-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Canlı GPS Haritası</span>
          </div>
        </div>

        {/* Alt Teslimat Detayları & Navigasyon Butonu */}
        <div className="p-4 space-y-3 bg-[#1C0922]">
          <div className="p-3 rounded-2xl bg-[#240E2A] border border-purple-800/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {musteriAdi}
              </span>
              {musteriTelefon && (
                <a
                  href={`tel:${musteriTelefon}`}
                  className="text-amber-400 font-bold flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" /> {musteriTelefon}
                </a>
              )}
            </div>
            <p className="text-gray-300 text-[11px] flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>{teslimatAdresi}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Haritalar ile Navigasyon Aç</span>
            </a>
            <button
              type="button"
              onClick={onKapat}
              className="py-2.5 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-gray-300 text-xs font-bold cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
