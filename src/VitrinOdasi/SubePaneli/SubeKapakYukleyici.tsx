import React, { useState, useRef } from 'react';
import { Camera, Loader2, Check } from 'lucide-react';
import { sunucuyaGorselYukle } from '@/src/MalzemeCekmeceleri/sunucuGorselYukleyici';

interface SubeKapakYukleyiciProps {
  mevcutGorsel?: string;
  onGorselYuklendi: (yeniUrl: string) => Promise<void> | void;
}

export const SubeKapakYukleyici: React.FC<SubeKapakYukleyiciProps> = ({
  mevcutGorsel,
  onGorselYuklendi,
}) => {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [basarili, setBasarili] = useState(false);
  const dosyaGirdisiRef = useRef<HTMLInputElement>(null);

  const dosyaSecildi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;

    setYukleniyor(true);
    setBasarili(false);
    try {
      const sonuc = await sunucuyaGorselYukle(dosya, 'mutfaklar');
      if (sonuc.basarili && sonuc.url) {
        await onGorselYuklendi(sonuc.url);
        setBasarili(true);
        setTimeout(() => setBasarili(false), 2500);
      }
    } finally {
      setYukleniyor(false);
      if (dosyaGirdisiRef.current) dosyaGirdisiRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={dosyaGirdisiRef}
        onChange={dosyaSecildi}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        disabled={yukleniyor}
        onClick={() => dosyaGirdisiRef.current?.click()}
        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-[#35133E] hover:bg-[#4D1B59] text-amber-300 border border-amber-500/30 disabled:opacity-50"
        title="Sunucuya yeni kapak fotoğrafı yükle (yedek.pazarafyon.com.tr)"
      >
        {yukleniyor ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        ) : basarili ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Camera className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{yukleniyor ? 'Yükleniyor...' : basarili ? 'Güncellendi' : 'Kapak Değiştir'}</span>
      </button>
    </div>
  );
};
