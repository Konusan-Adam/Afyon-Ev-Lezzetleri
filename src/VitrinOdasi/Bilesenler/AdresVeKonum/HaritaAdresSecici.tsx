import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Check, Compass, AlertTriangle, RotateCcw } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { koordinattanAdresBul } from '@/src/MalzemeCekmeceleri/AdresVeKonum/koordinattanAdresBul';

export const HaritaAdresSecici: React.FC = () => {
  const { haritaPenceresiAcik, haritaPenceresiKapat, yeniAdresEkle } = teslimatHafizasiKullan();

  const haritaKutusuRef = useRef<HTMLDivElement>(null);
  const haritaRef = useRef<L.Map | null>(null);
  const isaretciRef = useRef<L.Marker | null>(null);

  // Form durumları (Afyonkarahisar Varsayılan Koordinatları: 38.7569, 30.5387)
  const [enlem, setEnlem] = useState<number>(38.7569);
  const [boylam, setBoylam] = useState<number>(30.5387);
  const [adresBasligi, setAdresBasligi] = useState<string>('Evim');
  const [il, setIl] = useState<string>('Afyonkarahisar');
  const [ilce, setIlce] = useState<string>('Merkez');
  const [mahalle, setMahalle] = useState<string>('');
  const [caddeSokak, setCaddeSokak] = useState<string>('');
  const [binaNo, setBinaNo] = useState<string>('');
  const [daireNo, setDaireNo] = useState<string>('');
  const [acikAdresTarifi, setAcikAdresTarifi] = useState<string>('');
  const [kaydediliyor, setKaydediliyor] = useState<boolean>(false);
  const [hizmetBolgesiIciMi, setHizmetBolgesiIciMi] = useState<boolean>(true);

  const afyonMerkezeDon = () => {
    if (haritaRef.current && isaretciRef.current) {
      const merkez = L.latLng(38.7569, 30.5387);
      haritaRef.current.setView(merkez, 14);
      isaretciRef.current.setLatLng(merkez);
      setEnlem(38.7569);
      setBoylam(30.5387);
      setIl('Afyonkarahisar');
      setIlce('Merkez');
      setMahalle('Dumlupınar Mah.');
      setCaddeSokak('Yeşilyol Caddesi');
      setHizmetBolgesiIciMi(true);
    }
  };

  useEffect(() => {
    if (!haritaPenceresiAcik || !haritaKutusuRef.current) return;

    if (!haritaRef.current) {
      // Afyonkarahisar merkezli Leaflet haritası oluştur
      const harita = L.map(haritaKutusuRef.current).setView([38.7569, 30.5387], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap katmanları',
      }).addTo(harita);

      // Özel Kırmızı Konum İğnesi
      const ozelOge = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #6D237A; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #DDAF53; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const isaretci = L.marker([38.7569, 30.5387], {
        draggable: true,
        icon: ozelOge,
      }).addTo(harita);

      const konumuGuncelle = async (lat: number, lng: number) => {
        setEnlem(lat);
        setBoylam(lng);
        try {
          const sonuc = await koordinattanAdresBul(lat, lng);
          setIl(sonuc.il);
          setIlce(sonuc.ilce);
          setHizmetBolgesiIciMi(sonuc.hizmetBolgesindeMi);
          if (sonuc.mahalle) setMahalle(sonuc.mahalle);
          if (sonuc.caddeSokak) setCaddeSokak(sonuc.caddeSokak);
          if (sonuc.binaNo) setBinaNo(sonuc.binaNo);
        } catch {}
      };

      // İlk açılışta harita merkezinin adresini otomatik doldur
      konumuGuncelle(38.7569, 30.5387);

      isaretci.on('dragend', () => {
        const konum = isaretci.getLatLng();
        konumuGuncelle(konum.lat, konum.lng);
      });

      harita.on('click', (e) => {
        isaretci.setLatLng(e.latlng);
        konumuGuncelle(e.latlng.lat, e.latlng.lng);
      });

      haritaRef.current = harita;
      isaretciRef.current = isaretci;
    }

    return () => {
      if (haritaRef.current) {
        haritaRef.current.remove();
        haritaRef.current = null;
      }
    };
  }, [haritaPenceresiAcik]);

  if (!haritaPenceresiAcik) return null;

  const adresiKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hizmetBolgesiIciMi) {
      alert('Sadece Afyonkarahisar Merkez bölgesine teslimat hizmeti verilmektedir.');
      return;
    }
    const kayitliMahalle = mahalle.trim() || 'Dumlupınar Mah.';
    const kayitliSokak = caddeSokak.trim() || 'Yeşilyol Caddesi';

    setKaydediliyor(true);
    const basarili = await yeniAdresEkle({
      adres_basligi: adresBasligi || 'Evim',
      il: il || 'Afyonkarahisar',
      ilce: ilce || 'Merkez',
      mahalle: kayitliMahalle,
      cadde_sokak: kayitliSokak,
      bina_no: binaNo || '1',
      daire_no: daireNo || '1',
      acik_adres_tarifi: acikAdresTarifi,
      adres_tarifi: acikAdresTarifi,
      enlem,
      boylam,
      varsayilan_mi: true,
    });

    setKaydediliyor(false);
    if (basarili) {
      haritaPenceresiKapat();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Sol Taraf: İnteraktif Harita */}
        <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px] relative bg-[#130713]">
          <div ref={haritaKutusuRef} className="w-full h-full z-0" />
          <div className="absolute top-3 left-3 z-10 bg-[#1A0A1D]/90 border border-[#521E5C] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#DDAF53] flex items-center gap-1.5 shadow-md">
            <Compass className="w-4 h-4 text-[#DDAF53]" />
            <span>Pini Afyon Üzerinde Sürükleyin</span>
          </div>
        </div>

        {/* Sağ Taraf: Türkçe Adres Formu */}
        <div className="w-full md:w-1/2 p-5 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[#3E1646] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#DDAF53]" />
              <h3 className="font-bold text-base text-white">Haritadan Yeni Adres Ekle</h3>
            </div>
            <button
              type="button"
              onClick={haritaPenceresiKapat}
              className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={adresiKaydet} className="space-y-3 text-xs">
            {/* Adres Başlığı */}
            <div>
              <label className="block text-[#CFA353] font-semibold mb-1">Adres Başlığı</label>
              <div className="grid grid-cols-3 gap-2">
                {['Evim', 'İş Yerim', 'Diğer'].map((baslik) => (
                  <button
                    key={baslik}
                    type="button"
                    onClick={() => setAdresBasligi(baslik)}
                    className={`py-1.5 rounded-lg font-medium border text-center cursor-pointer transition-all ${
                      adresBasligi === baslik
                        ? 'bg-[#6D237A] text-white border-[#DDAF53]'
                        : 'bg-[#2A102E] text-[#A872B5] border-[#521E5C] hover:bg-[#3D1843]'
                    }`}
                  >
                    {baslik}
                  </button>
                ))}
              </div>
            </div>

            {/* İl ve İlçe */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 font-medium mb-1">İl</label>
                <input
                  type="text"
                  value={il}
                  onChange={(e) => setIl(e.target.value)}
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#DDAF53]"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">İlçe</label>
                <input
                  type="text"
                  value={ilce}
                  onChange={(e) => setIlce(e.target.value)}
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#DDAF53]"
                  required
                />
              </div>
            </div>

            {/* Mahalle ve Cadde/Sokak */}
            <div>
              <label className="block text-gray-300 font-medium mb-1">Mahalle</label>
              <input
                type="text"
                value={mahalle}
                onChange={(e) => setMahalle(e.target.value)}
                placeholder="Örn: Dumlupınar Mah."
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">Cadde / Sokak</label>
              <input
                type="text"
                value={caddeSokak}
                onChange={(e) => setCaddeSokak(e.target.value)}
                placeholder="Örn: Kocatepe Cad. No: 12"
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                required
              />
            </div>

            {/* Bina No ve Daire No */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Bina No</label>
                <input
                  type="text"
                  value={binaNo}
                  onChange={(e) => setBinaNo(e.target.value)}
                  placeholder="Bina No"
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-1">Daire No</label>
                <input
                  type="text"
                  value={daireNo}
                  onChange={(e) => setDaireNo(e.target.value)}
                  placeholder="Daire No"
                  className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                />
              </div>
            </div>

            {/* Açık Adres Tarifi */}
            <div>
              <label className="block text-gray-300 font-medium mb-1">Adres Tarifi (Opsiyonel)</label>
              <textarea
                value={acikAdresTarifi}
                onChange={(e) => setAcikAdresTarifi(e.target.value)}
                rows={2}
                placeholder="Kurye için kapı zili veya adres tarifi..."
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53] resize-none"
              />
            </div>

            {/* Hizmet Bölgesi Dışı Uyarısı */}
            {!hizmetBolgesiIciMi && (
              <div className="bg-rose-950/90 border border-rose-500/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-200 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-rose-300">
                    Seçilen Bölge ({il && ilce ? `${il} / ${ilce}` : il || ilce || 'Bölge Dışı'}): Hizmet Alanımız Dışında!
                  </p>
                  <p className="text-[11px] text-rose-200/80 leading-relaxed">
                    Sıcak ev lezzetlerimiz şu an sadece <strong>Afyonkarahisar Merkez</strong> bölgesine teslim edilmektedir.
                  </p>
                  <button
                    type="button"
                    onClick={afyonMerkezeDon}
                    className="mt-1.5 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Beni Afyon Merkez'e Götür</span>
                  </button>
                </div>
              </div>
            )}

            {/* Kaydet Butonu */}
            <button
              type="submit"
              disabled={kaydediliyor || !hizmetBolgesiIciMi}
              className={`w-full mt-2 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 border shadow-lg transition-all ${
                !hizmetBolgesiIciMi
                  ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed opacity-60'
                  : 'bg-[#6D237A] hover:bg-[#852C94] text-white border-[#9633A7] cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4 text-[#DDAF53]" />
              <span>
                {kaydediliyor
                  ? 'Veritabanına Kaydediliyor...'
                  : !hizmetBolgesiIciMi
                  ? 'Sadece Afyon Merkez Seçilebilir'
                  : 'Adresi Kaydet ve Seç'}
              </span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
