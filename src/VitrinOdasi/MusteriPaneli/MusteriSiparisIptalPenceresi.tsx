import React, { useState } from 'react';
import { X, AlertTriangle, Ban, CheckCircle2, FileText } from 'lucide-react';
import { siparisIptalEt } from '@/src/MalzemeCekmeceleri/MutfakYonetimi/siparisIptalIslemleri';
import { SozlesmePenceresi } from '@/src/VitrinOdasi/Bilesenler/HukukVeSozlesmeler/SozlesmePenceresi';

interface MusteriSiparisIptalPenceresiProps {
  siparisId: string;
  siparisKodu: string;
  odemeYontemi?: string;
  odemeDurumu?: string;
  toplamTutar?: number;
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
  odemeDurumu,
  toplamTutar,
  onKapat,
  onIptalEdildi,
}) => {
  const [secilenSebep, setSecilenSebep] = useState(IPTAL_SEBEPLERI[0]);
  const [aciklama, setAciklama] = useState('');
  const [kosulOnayi, setKosulOnayi] = useState(true);
  const [sozlesmeAcik, setSozlesmeAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState('');
  const [tamamMesaji, setTamamMesaji] = useState('');

  const onlineOdemeMi = odemeDurumu === 'odendi';

  const iptaliOnayla = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kosulOnayi) {
      setHataMesaji('Lütfen İptal ve İade Koşullarını onaylayınız.');
      return;
    }
    setHataMesaji('');
    setYukleniyor(true);

    try {
      const sonuc = await siparisIptalEt(siparisId, secilenSebep, aciklama, 'musteri', siparisKodu);
      if (!sonuc.basarili) {
        setHataMesaji(sonuc.hataMesaji || 'Sipariş iptali kaydedilemedi. Lütfen tekrar deneyiniz.');
        setYukleniyor(false);
        return;
      }
      setYukleniyor(false);
      setTamamMesaji(
        sonuc.iadeMesaji ||
          (onlineOdemeMi
            ? 'PayTR iade talebiniz başlatıldı; tutar bankanıza bağlı olarak 1–7 iş günü içinde kartınıza yansır.'
            : 'Siparişiniz iptal edildi. Kapıda ödeme seçildiği için ücret tahsil edilmemiştir.')
      );
      onIptalEdildi();
    } catch {
      setHataMesaji('Sipariş iptal edilirken beklenmeyen bir hata oluştu.');
      setYukleniyor(false);
    }
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
              <p className="text-[10px] text-gray-400">
                Sipariş No: #{siparisKodu}
                {toplamTutar ? ` • ${toplamTutar} ₺` : ''}
              </p>
            </div>
          </div>
          <button onClick={onKapat} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {tamamMesaji ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>İptal Talebiniz Onaylandı ve Mühürlendi</span>
              </div>
              <p className="leading-relaxed text-[11px]">{tamamMesaji}</p>
            </div>
            <button
              type="button"
              onClick={onKapat}
              className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold cursor-pointer"
            >
              Kapat
            </button>
          </div>
        ) : (
          <form onSubmit={iptaliOnayla} className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 text-[11px] leading-relaxed">
              {onlineOdemeMi
                ? 'Mutfak henüz yemeğinizi hazırlamaya başlamadan siparişinizi iptal edebilirsiniz. PayTR online ödemeniz için otomatik iade talimatı başlatılır; tutar bankanıza göre 1–7 iş günü içinde kartınıza yansır.'
                : 'Mutfak henüz yemeğinizi hazırlamaya başlamadan önce siparişinizi iptal edebilirsiniz. Kapıda ödeme seçildiği için tarafınızdan ücret tahsil edilmemiştir.'}
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
                placeholder="Mutfak veya şubeye iletmek istediğiniz not..."
                className="w-full bg-[#120614] border border-purple-900 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 resize-none placeholder-gray-600"
              />
            </div>

            <label className="flex items-start gap-2 text-[11px] text-purple-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={kosulOnayi}
                onChange={(e) => setKosulOnayi(e.target.checked)}
                className="mt-0.5 accent-amber-400"
              />
              <span>
                <button
                  type="button"
                  onClick={() => setSozlesmeAcik(true)}
                  className="text-amber-300 underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>İptal ve İade Koşulları</span>
                </button>
                &apos;nı okudum ve iptal talebimin zaman damgasıyla kayıt altına alınmasını onaylıyorum.
              </span>
            </label>

            {hataMesaji && (
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-[11px] font-medium">
                {hataMesaji}
              </div>
            )}

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
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-60"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{yukleniyor ? 'İşleniyor...' : 'Siparişi Kesin İptal Et'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {sozlesmeAcik && (
        <SozlesmePenceresi
          tur="iptal_iade_kosullari"
          acikMi={sozlesmeAcik}
          onKapat={() => setSozlesmeAcik(false)}
        />
      )}
    </div>
  );
};
