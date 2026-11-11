import React, { useState } from 'react';
import { Plus, Trash2, Layers, Check, AlertCircle } from 'lucide-react';
import { SecenekGrubu, SecenekOgesi } from '@/src/MalzemeCekmeceleri/UrunSecenekleri/UrunSecenekleriTipleri';

interface YemekSecenekDuzenleyiciProps {
  kategori: string;
  secenekGruplari: SecenekGrubu[];
  onChange: (yeniGruplar: SecenekGrubu[]) => void;
}

export const YemekSecenekDuzenleyici: React.FC<YemekSecenekDuzenleyiciProps> = ({
  kategori,
  secenekGruplari,
  onChange,
}) => {
  const [yeniGrupAdi, setYeniGrupAdi] = useState('');
  const [zorunlu, setZorunlu] = useState(false);
  const [coklu, setCoklu] = useState(false);

  // Mutfak için hızlı hazır öneriler
  const hizliOneriler: { [anaKat: string]: { baslik: string; zorunlu: boolean; coklu: boolean; ogeler: { baslik: string; ek_ucret: number }[] }[] } = {
    'Hamur İşleri & Bükme': [
      {
        baslik: 'İç Harç Tercihi',
        zorunlu: true,
        coklu: false,
        ogeler: [
          { baslik: 'Mercimekli', ek_ucret: 0 },
          { baslik: 'Patatesli', ek_ucret: 0 },
          { baslik: 'Kıymalı', ek_ucret: 25 }
        ]
      },
      {
        baslik: 'Pişirme Tercihi',
        zorunlu: false,
        coklu: false,
        ogeler: [
          { baslik: 'Ekstra Çıtır / İyice Kızarmış', ek_ucret: 0 },
          { baslik: 'Yumuşak Kıvamlı', ek_ucret: 0 }
        ]
      }
    ],
    'Geleneksel Tatlılar': [
      {
        baslik: 'Kaymak Tercihi',
        zorunlu: true,
        coklu: false,
        ogeler: [
          { baslik: 'Hakiki Afyon Manda Kaymağı İle', ek_ucret: 45 },
          { baslik: 'Sade (Kaymaksız)', ek_ucret: 0 }
        ]
      },
      {
        baslik: 'Şerbet Tercihi',
        zorunlu: false,
        coklu: false,
        ogeler: [
          { baslik: 'Tam Kıvamında Şerbetli', ek_ucret: 0 },
          { baslik: 'Az Şerbetli / Hafif', ek_ucret: 0 }
        ]
      }
    ]
  };

  const onerilenler = hizliOneriler[kategori] || [];

  const oneriEkle = (oneri: any) => {
    const yeniGrup: SecenekGrubu = {
      kimlik: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      baslik: oneri.baslik,
      zorunlu_mu: oneri.zorunlu,
      coklu_secim_mi: oneri.coklu,
      ogeler: oneri.ogeler.map((o: any, idx: number) => ({
        kimlik: `oge_${Date.now()}_${idx}`,
        baslik: o.baslik,
        ek_ucret: o.ek_ucret
      }))
    };
    onChange([...secenekGruplari, yeniGrup]);
  };

  const grupEkle = () => {
    if (!yeniGrupAdi.trim()) return;
    const yeni: SecenekGrubu = {
      kimlik: `grp_${Date.now()}`,
      baslik: yeniGrupAdi.trim(),
      zorunlu_mu: zorunlu,
      coklu_secim_mi: coklu,
      ogeler: [
        { kimlik: `oge_${Date.now()}_1`, baslik: 'Standart / Sade', ek_ucret: 0 }
      ]
    };
    onChange([...secenekGruplari, yeni]);
    setYeniGrupAdi('');
  };

  const grupSil = (grupId: string) => {
    onChange(secenekGruplari.filter((g) => g.kimlik !== grupId));
  };

  const ogeEkle = (grupId: string) => {
    const guncel = secenekGruplari.map((g) => {
      if (g.kimlik === grupId) {
        const yeniOge: SecenekOgesi = {
          kimlik: `oge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          baslik: 'Yeni Çeşit / Tercih',
          ek_ucret: 0
        };
        return { ...g, ogeler: [...g.ogeler, yeniOge] };
      }
      return g;
    });
    onChange(guncel);
  };

  const ogeGuncelle = (grupId: string, ogeId: string, baslik: string, ekUcret: number) => {
    const guncel = secenekGruplari.map((g) => {
      if (g.kimlik === grupId) {
        return {
          ...g,
          ogeler: g.ogeler.map((o) => (o.kimlik === ogeId ? { ...o, baslik, ek_ucret: ekUcret } : o))
        };
      }
      return g;
    });
    onChange(guncel);
  };

  const ogeSil = (grupId: string, ogeId: string) => {
    const guncel = secenekGruplari.map((g) => {
      if (g.kimlik === grupId) {
        return {
          ...g,
          ogeler: g.ogeler.filter((o) => o.kimlik !== ogeId)
        };
      }
      return g;
    });
    onChange(guncel);
  };

  return (
    <div className="bg-[#17051a] border border-[#44174c] rounded-2xl p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold text-white text-xs">
            Özel Seçenek, Porsiyon & İkram Yönetimi
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-400">
          {secenekGruplari.length === 0 ? 'Özel Seçenek Yok' : `${secenekGruplari.length} Grup`}
        </span>
      </div>

      {secenekGruplari.length > 0 && (
        <div className="space-y-2.5 pt-1">
          {secenekGruplari.map((grup) => (
            <div key={grup.kimlik} className="bg-[#120414] border border-purple-900/60 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 text-xs">{grup.baslik}</span>
                </div>
                <button onClick={() => grupSil(grup.kimlik)} className="text-gray-400 hover:text-rose-400 p-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 pl-2 border-l-2 border-amber-400/30">
                {grup.ogeler.map((oge) => (
                  <div key={oge.kimlik} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={oge.baslik}
                      onChange={(e) => ogeGuncelle(grup.kimlik, oge.kimlik, e.target.value, oge.ek_ucret)}
                      className="flex-1 bg-[#1d0a20] border border-purple-900/50 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                    />
                    <input
                      type="number"
                      value={oge.ek_ucret}
                      onChange={(e) => ogeGuncelle(grup.kimlik, oge.kimlik, oge.baslik, Number(e.target.value))}
                      className="w-20 bg-[#1d0a20] border border-purple-900/50 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold text-right outline-none"
                    />
                    <button onClick={() => ogeSil(grup.kimlik, oge.kimlik)} className="text-gray-500 hover:text-rose-400 p-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <button onClick={() => ogeEkle(grup.kimlik)} className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3 h-3" /> Yeni Madde
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-purple-900/40 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={yeniGrupAdi}
            onChange={(e) => setYeniGrupAdi(e.target.value)}
            placeholder="Grup Başlığı"
            className="flex-1 bg-[#120414] border border-purple-900/60 rounded-xl px-3 py-1.5 text-white text-xs outline-none"
          />
          <button onClick={grupEkle} className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Grup Aç
          </button>
        </div>
      </div>
    </div>
  );
};
