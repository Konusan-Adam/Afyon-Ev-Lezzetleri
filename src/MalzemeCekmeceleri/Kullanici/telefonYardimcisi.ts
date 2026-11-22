export function telefonStandartCekirdek(tel: string): string {
  const rakamlar = tel.replace(/\D/g, '');
  if (rakamlar.startsWith('90') && rakamlar.length === 12) {
    return rakamlar.substring(2);
  }
  if (rakamlar.startsWith('0') && rakamlar.length === 11) {
    return rakamlar.substring(1);
  }
  return rakamlar;
}

export function telefonOnluFormat(tel: string): string {
  const cekirdek = telefonStandartCekirdek(tel);
  if (!cekirdek) return '';
  return cekirdek.startsWith('0') ? cekirdek : `0${cekirdek}`;
}

/**
 * Firestore 'kullanicilar' koleksiyonu için standart doküman kimliği:
 * telefon_numarasi + "_" + rol (örn: 05551234567_musteri)
 */
export function kullaniciBelgeIdOlustur(tel: string, rol: string = 'musteri'): string {
  const formatliTelefon = telefonOnluFormat(tel);
  const temizRol = String(rol || 'musteri').trim();
  return formatliTelefon ? `${formatliTelefon}_${temizRol}` : `usr_${Date.now()}_${temizRol}`;
}
