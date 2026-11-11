export interface CozulenAdresTipi {
  mahalle: string;
  caddeSokak: string;
  binaNo: string;
  tamMetin: string;
  il: string;
  ilce: string;
  hizmetBolgesindeMi: boolean;
}

// Afyonkarahisar MERKEZ İlçe Koordinat Sınırları (Sıcak Teslimat Alanı)
const MERKEZ_MIN_ENLEM = 38.68;
const MERKEZ_MAX_ENLEM = 38.83;
const MERKEZ_MIN_BOYLAM = 30.46;
const MERKEZ_MAX_BOYLAM = 30.64;

const AFYON_DIS_ILCELER = [
  'sandıklı', 'sandikli', 'bolvadin', 'dinar', 'emirdağ', 'emirdag',
  'çay', 'cay', 'şuhut', 'suhut', 'iscehisar', 'işcehisar',
  'sinanpaşa', 'sinanpasa', 'dazkırı', 'dazkiri', 'başmakçı', 'basmakci',
  'bayat', 'hocalar', 'kızılören', 'kiziloren', 'ihsaniye', 'çobanlar',
  'cobanlar', 'sultandağı', 'sultandagi', 'evciler'
];

export const koordinattanAdresBul = async (
  enlem: number,
  boylam: number
): Promise<CozulenAdresTipi> => {
  const koordinatMerkezdeMi =
    enlem >= MERKEZ_MIN_ENLEM &&
    enlem <= MERKEZ_MAX_ENLEM &&
    boylam >= MERKEZ_MIN_BOYLAM &&
    boylam <= MERKEZ_MAX_BOYLAM;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${enlem}&lon=${boylam}&addressdetails=1`;
    const yanit = await fetch(url, { headers: { 'Accept-Language': 'tr-TR,tr;q=0.9' } });

    if (yanit.ok) {
      const veri = await yanit.json();
      const adres = veri.address || {};

      const il = adres.province || adres.city || adres.state || '';
      const ilce = adres.town || adres.district || adres.county || adres.city_district || 'Merkez';
      const mahalle = adres.suburb || adres.neighbourhood || adres.quarter || adres.village || 'Mahalle';
      const caddeSokak = adres.road || adres.pedestrian || adres.street || 'Cadde/Sokak';
      const binaNo = adres.house_number || '';

      const ilAfyonMu = il.toLowerCase().includes('afyon');
      const ilceKucuk = ilce.toLowerCase();
      const disIlceMi = AFYON_DIS_ILCELER.some((d) => ilceKucuk.includes(d));

      const hizmetBolgesindeMi = ilAfyonMu && !disIlceMi && koordinatMerkezdeMi;

      return {
        mahalle: mahalle.includes('Mah') ? mahalle : `${mahalle} Mah.`,
        caddeSokak,
        binaNo,
        il: il || (hizmetBolgesindeMi ? 'Afyonkarahisar' : 'Şehir Dışı'),
        ilce: ilce || 'Merkez',
        hizmetBolgesindeMi,
        tamMetin: `${mahalle}, ${caddeSokak} ${binaNo ? 'No:' + binaNo : ''}`
      };
    }
  } catch (hata) {
    console.warn('Ters jeokodlama hatası:', hata);
  }

  return {
    mahalle: 'Dumlupınar Mah.',
    caddeSokak: 'Yeşilyol Caddesi',
    binaNo: '',
    il: 'Afyonkarahisar',
    ilce: 'Merkez',
    hizmetBolgesindeMi: koordinatMerkezdeMi,
    tamMetin: 'Dumlupınar Mah. Yeşilyol Cad., Merkez / Afyon'
  };
};
