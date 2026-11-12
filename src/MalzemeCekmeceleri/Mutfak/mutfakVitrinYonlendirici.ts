export function mutfakVitriniAc(mutfakId?: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('afyon_mutfak_vitrini_ac', {
      detail: { mutfakId: mutfakId || 'm1' },
    })
  );
}
