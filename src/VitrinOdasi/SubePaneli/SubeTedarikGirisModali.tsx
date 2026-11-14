import React, { useState } from 'react';
import { X, Plus, PackageCheck, AlertCircle } from 'lucide-react';
import { SubeUrunu, TedarikciHakedis } from '@/src/veritabani/SubeTipleri';
import { tedarikciHakedisKaydet } from '@/src/MalzemeCekmeceleri/Sube/subeTedarikServisi';
import { belgeKaydet } from '@/src/veritabani/FirebaseKoleksiyonServisi';

interface Props {
  subeId: string;
  subeAdi: string;
  urunler: SubeUrunu[];
  acikMi: boolean;
  onKapat: () => void;
  onBasarili: () => void;
}

export const SubeTedarikGirisModali: React.FC<Props> = ({
  subeId,
  subeAdi,
  urunler,
  acikMi,
  onKapat,
  onBasarili,
}) => {
  const [seciliUrunId, setSeciliUrunId] = useState<string>(urunler[0]?.id || '');
  const [tedarikciAdi, setTedarikciAdi] = useState<string>('');
  const [teslimAdedi, setTeslimAdedi] = useState<number>(20);
  const [birimAlisFiyati, setBirimAlisFiyati] = useState<number>(30);
  const [yukleniyor, setYukleniyor] = useState<boolean>(false);
  const [hata, setHata] = useState<string>('');

  if (!acikMi) return null;

  const subeUrunleri = urunler.filter((u) => !subeId || u.sube_id === subeId);
  const seciliUrun = subeUrunleri.find((u) => u.id === seciliUrunId) || subeUrunleri[0] || urunler[0];

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tedarikciAdi.trim()) {
      setHata('Lütfen tedarikçi / ev mutfağı adını yazınız.');
      return;
    }
    setYukleniyor(true);
    setHata('');

    const toplamHakedis = teslimAdedi * birimAlisFiyati;
    const hakedisKaydi: TedarikciHakedis = {
      id: `tedarik-${Date.now()}`,
      sube_id: subeId,
      sube_adi: subeAdi,
      tedarikci_id: `ted_${tedarikciAdi.toLowerCase().replace(/\s+/g, '_')}`,
      tedarikci_adi: tedarikciAdi.trim(),
      urun_id: seciliUrun.id,
      urun_adi: seciliUrun.ad,
      teslim_adedi: teslimAdedi,
      satilan_adet: 0,
      birim_alis_fiyati: birimAlisFiyati,
      toplam_hakedis: toplamHakedis,
      durum: 'beklemede',
      tarih: new Date().toISOString(),
    };

    // 1. Tedarikçi Hakedişini Firestore'a yaz ve Patron'a zil gönder
    await tedarikciHakedisKaydet(hakedisKaydi);

    // 2. Ürünün stok adedini ve tedarikçi alanlarını güncelle
    const yeniStok = (seciliUrun.stok_adedi || 0) + teslimAdedi;
    await belgeKaydet('sube_stoklari', seciliUrun.id, {
      stok_adedi: yeniStok,
      tedarikci_adi: tedarikciAdi.trim(),
      alis_fiyati: birimAlisFiyati,
      gunluk_gelen_adet: (seciliUrun.gunluk_gelen_adet || 0) + teslimAdedi,
    });

    setYukleniyor(false);
    onBasarili();
    onKapat();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-md rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#3E1646] pb-3">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-sm">Tedarikçi Teslimatı Girişi</h3>
          </div>
          <button onClick={onKapat} className="p-1 rounded-lg hover:bg-[#2A102E] text-stone-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {hata && (
          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={kaydet} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#CFA353] font-semibold mb-1">Tedarikçi / Ev Hanımı Adı</label>
            <input
              type="text"
              value={tedarikciAdi}
              onChange={(e) => setTedarikciAdi(e.target.value)}
              placeholder="Örn: Fatma Teyze Ev Mutfağı"
              className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#DDAF53]"
              required
            />
          </div>

          <div>
            <label className="block text-[#CFA353] font-semibold mb-1">Teslim Alınan Ürün</label>
            <select
              value={seciliUrunId}
              onChange={(e) => setSeciliUrunId(e.target.value)}
              className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#DDAF53]"
            >
              {urunler.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.ad} (Satış: {u.fiyat} ₺)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#CFA353] font-semibold mb-1">Teslim Adedi</label>
              <input
                type="number"
                min={1}
                value={teslimAdedi}
                onChange={(e) => setTeslimAdedi(Number(e.target.value))}
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[#CFA353] font-semibold mb-1">Birim Alış (Maliyet ₺)</label>
              <input
                type="number"
                min={0}
                value={birimAlisFiyati}
                onChange={(e) => setBirimAlisFiyati(Number(e.target.value))}
                className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2 text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#2A102E] border border-[#521E5C] text-stone-300 space-y-1">
            <div className="flex justify-between">
              <span>Toplam Tedarikçi Hak Edişi:</span>
              <strong className="text-purple-300 font-bold">{teslimAdedi * birimAlisFiyati} ₺</strong>
            </div>
            <div className="text-[10px] text-stone-400">
              * Bu tutar otomatik olarak Süper Admin (Patron) hak ediş onay havuzuna gönderilecektir.
            </div>
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full py-2.5 bg-[#6D237A] hover:bg-[#852C94] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{yukleniyor ? 'Kaydediliyor...' : 'Teslimatı Onayla & Stoka Ekle'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
