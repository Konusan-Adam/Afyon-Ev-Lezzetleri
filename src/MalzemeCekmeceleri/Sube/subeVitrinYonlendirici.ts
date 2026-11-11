export function subeVitriniAc(subeId?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('afyon_sube_vitrini_ac', {
      detail: { subeId: subeId || 'sube-1' },
    })
  );
}
