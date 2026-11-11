import React from 'react';
import { Tag, Bike } from 'lucide-react';
import { Mutfak } from '@/src/veritabani/VeriTipleri';
import { useAdminKuponu } from '@/src/MalzemeCekmeceleri/useAdminKuponu';
import { useMutfakTeslimatAyari } from '@/src/MalzemeCekmeceleri/useMutfakTeslimatAyari';
import { useKuryeAyarlari } from '@/src/MalzemeCekmeceleri/useKuryeAyarlari';

export const MasaustuKampanyaSeridi: React.FC<{ mutfak: Mutfak }> = ({ mutfak }) => {
  const { kupon } = useAdminKuponu();
  const { ayar: mutfakTeslimat } = useMutfakTeslimatAyari(mutfak.id);
  const { ayarlar: kuryeAyarlari } = useKuryeAyarlari();
  const [kopyalandi, setKopyalandi] = React.useState(false);

  const kuponKopyala = async () => {
    try {
      await navigator.clipboard.writeText(kupon.kod);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {}
  };

  // Dinamik Kurye Limiti: Yönetim Paneli sistem ayarlarından çekilir
  const kuryeKampanyasiAktif = kuryeAyarlari.ucretsiz_teslimat_aktif !== false;
  const kuryeLimiti =
    Number(kuryeAyarlari.ucretsiz_teslimat_esigi) > 0
      ? Number(kuryeAyarlari.ucretsiz_teslimat_esigi)
      : Number(mutfakTeslimat.ucretsizTeslimatLimiti) || 2000;

  if (!kupon.aktif && !kuryeKampanyasiAktif) {
    return null;
  }

  return (
    <div className={`grid ${kupon.aktif && kuryeKampanyasiAktif ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-5 select-none`}>
      {kupon.aktif && (
        <div
          onClick={kuponKopyala}
          className="flex items-center gap-3 bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 rounded-xl p-3 cursor-pointer hover:border-amber-400 transition-colors"
          title="Kupon kodunu kopyalamak için tıklayın"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div className="text-xs min-w-0">
            <p className="font-bold text-amber-300 truncate">{kupon.baslik}</p>
            <p className="text-purple-300/80 text-[11px] truncate">
              Kupon Kodu: <strong className="text-white font-mono">{kupon.kod}</strong>
              <span className="text-amber-400 font-semibold ml-1.5">
                {kopyalandi ? '✓ Kopyalandı' : '• Kopyala'}
              </span>
            </p>
          </div>
        </div>
      )}

      {kuryeKampanyasiAktif && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/30 rounded-xl p-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Bike className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-emerald-300">
              {kuryeLimiti} ₺ Üzeri Ücretsiz Kurye
            </p>
            <p className="text-purple-300/80 text-[11px]">Sıcak ve taze termal çantalı teslimat</p>
          </div>
        </div>
      )}
    </div>
  );
};

