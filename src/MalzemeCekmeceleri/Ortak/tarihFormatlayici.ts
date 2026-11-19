export function tarihSaatFormatla(tarihDegeri?: string): string {
  if (!tarihDegeri || !tarihDegeri.trim()) return 'Bugün';
  const temiz = tarihDegeri.trim();

  // ISO veya ayrıştırılabilir tarih formatı ise Türkçe tarih/saat göster
  const isoBenzeriMi = /^\d{4}-\d{2}-\d{2}/.test(temiz);
  if (isoBenzeriMi) {
    const tarih = new Date(temiz);
    if (!Number.isNaN(tarih.getTime())) {
      return tarih.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ' ' + tarih.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  return temiz;
}
