import L from 'leaflet';

export function haritaIkonlariOlustur() {
  const mutfakIkonu = L.divIcon({
    className: 'harita-mutfak-ikonu',
    html: `
      <div style="background:#521E5C; width:34px; height:34px; border-radius:50%; border:2px solid #CFA353; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.6);">
        <span style="font-size:16px;">👩‍🍳</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  const kuryeIkonu = L.divIcon({
    className: 'harita-kurye-ikonu',
    html: `
      <div style="background:#DDAF53; width:40px; height:40px; border-radius:50%; border:3px solid #1C0821; display:flex; align-items:center; justify-content:center; box-shadow:0 0 16px rgba(221,175,83,0.8); animation: bounce 1.5s infinite;">
        <span style="font-size:20px;">🛵</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const musteriIkonu = L.divIcon({
    className: 'harita-musteri-ikonu',
    html: `
      <div style="background:#166534; width:34px; height:34px; border-radius:50%; border:2px solid #86EFAC; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.6);">
        <span style="font-size:16px;">🏠</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });

  return { mutfakIkonu, kuryeIkonu, musteriIkonu };
}
