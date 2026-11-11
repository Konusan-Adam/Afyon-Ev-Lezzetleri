export const isimMaskele = (adSoyad: string): string => {
  if (!adSoyad) return 'Müşteri';
  const parcalar = adSoyad.trim().split(' ');
  return parcalar
    .map((p) => (p.length > 1 ? `${p[0]}***` : p))
    .join(' ');
};

export const telefonMaskele = (telefon: string): string => {
  if (!telefon) return '***';
  const temiz = telefon.replace(/\s+/g, '');
  if (temiz.length < 7) return '***';
  return `${temiz.substring(0, 4)} *** ** ${temiz.substring(temiz.length - 2)}`;
};

export const adresGizle = (acikAdres: string): string => {
  if (!acikAdres) return 'Afyonkarahisar / Merkez';
  const parcalar = acikAdres.split(',');
  return parcalar[0]?.trim() || 'Afyonkarahisar / Merkez';
};
