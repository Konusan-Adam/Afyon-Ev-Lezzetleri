import { MutfakTipi } from '@/src/veritabani/VeriTipleri';

export function onayliMutfakMi(m: unknown): boolean {
  if (!m || typeof m !== 'object') return false;
  const kayit = m as Record<string, unknown>;
  if (kayit.askida_mi === true) return false;
  if (kayit.onay_durumu === 'reddedildi') return false;
  if (kayit.onayli_mi === false) return false;
  return true;
}

export function onayliMutfaklariSirala(liste: MutfakTipi[]): MutfakTipi[] {
  return (liste || [])
    .filter(onayliMutfakMi)
    .sort((a, b) => {
      const aAcik = a.acik_mi !== false ? 1 : 0;
      const bAcik = b.acik_mi !== false ? 1 : 0;
      return bAcik - aAcik;
    });
}
