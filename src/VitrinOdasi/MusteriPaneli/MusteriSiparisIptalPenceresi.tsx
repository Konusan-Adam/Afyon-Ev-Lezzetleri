import React, { useState } from 'react';
import { X, AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { siparisIptalEt } from '@/src/MalzemeCekmeceleri/MutfakYonetimi/siparisIptalIslemleri';

interface MusteriSiparisIptalPenceresiProps {
  siparisId: string;
  siparisKodu: string;
  onKapat: () => void;
  onIptalEdildi: () => void;
}

const IPTAL_SEBEPLERI = [
  'Yanlış yemek / porsiyon seçtim',
  'Teslimat süresi uzun geldi',
  'Teslimat adresini yanlış seçtim',
  'Fikrimi değiştirdim / Vazgeçtim',
  'Diğer bir sebepten dolayı',
];

export const MusteriSiparisIptalPenceresi: React.FC<MusteriSiparisIptalPenceresiProps> = ({
  siparisId,
  siparisKodu,
  onKapat,
  onIptalEdildi,
}) => {
  const [secilenSebep, setSecilenSebep] = useState(IPTAL_SEBEPLERI[0]);
  const [aciklama, setAciklama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const iptaliOnayla = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    try {
      await siparisIptalEt(siparisId, secilenSebep, aciklama);
    } catch {}

    setYukleniyor(false);
    onIptalEdildi();
    onKapat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1D0A20] border border-rose-900/60 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Siparişi İptal Et</h3>
              <p className="text-[10px] text-gray-400">Sipariş No: #{siparisKodu}</p>
            </div>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={iptaliOnayla} className="space-y-3.5 text-xs">
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 text-[11px] leading-relaxed">
            Mutfak henüz yemeğinizi hazırlamaya başlamadan önce siparişinizi iptal edebilirsiniz. Ödemeniz anında iade edilecektir.
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1.5">İptal Sebebiniz</label>
            <div className="space-y-1.5">
              {IPTAL_SEBEPLERI.map((sebep, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    secilenSebep === sebep
                      ? 'bg-purple-950/80 border-amber-400 text-white'
                      : 'bg-[#140616] border-purple-900/50 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="iptal_sebebi"
                    checked={secilenSebep === sebep}
                    onChange={() => setSecilenSebep(sebep)}
                    className="accent-amber-400"
                  />
                  <span className="text-xs font-medium">{sebep}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Ek Not (İsteğe Bağlı)</label>
            <textarea
              rows={2}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Aşçı teyzeye veya sisteme iletmek istediğiniz not..."
              className="w-full bg-[#120614] border border-purple-900 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 resize-none placeholder-gray-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
            <button
              type="button"
              onClick={onKapat}
              className="px-4 py-2 rounded-xl bg-purple-950 text-gray-300 hover:text-white cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={yukleniyor}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>{yukleniyor ? 'İptal Ediliyor...' : 'Siparişi Kesin İptal Et'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
