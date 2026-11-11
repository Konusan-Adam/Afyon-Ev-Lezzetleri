import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, Phone, User, QrCode, ArrowRight } from 'lucide-react';
import { SubeSiparisi } from '@/src/veritabani/SubeTipleri';
import { subeSiparisleriniCanliDinle, subeSiparisiDurumGuncelle } from '@/src/MalzemeCekmeceleri/Sube/subeSiparisServisi';

interface Props {
  subeId: string;
}

export const SubeSiparisYonetimi: React.FC<Props> = ({ subeId }) => {
  const [siparisler, setSiparisler] = useState<SubeSiparisi[]>([]);
  const [seciliDurum, setSeciliDurum] = useState<string>('tumu');

  useEffect(() => {
    const durdur = subeSiparisleriniCanliDinle(subeId, (liste) => {
      setSiparisler(liste);
    });
    return () => durdur();
  }, [subeId]);

  const durumGuncelle = async (siparisId: string, yeniDurum: SubeSiparisi['durum']) => {
    await subeSiparisiDurumGuncelle(siparisId, yeniDurum);
  };

  const filtrelenmisSiparisler = siparisler.filter((s) => {
    if (seciliDurum === 'tumu') return true;
    return s.durum === seciliDurum;
  });

  const bekleyenSayisi = siparisler.filter((s) => s.durum === 'hazirlaniyor').length;

  return (
    <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-3.5 sm:p-5 text-white shadow-xl space-y-4">
      {bekleyenSayisi > 0 && (
        <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center justify-between text-amber-200 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-bold">Dikkat: {bekleyenSayisi} Gel-Al siparişi paketlenmeyi bekliyor!</span>
          </div>
          <span className="text-[10px] text-amber-300 font-semibold hidden sm:inline">Tezgahı Kontrol Edin</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3E1646] pb-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#DDAF53]" />
          <h3 className="font-bold text-sm sm:text-base text-white">Şube Gel-Al Canlı Sipariş Havuzu</h3>
        </div>

        <div className="flex items-center gap-1 bg-[#180A1F] p-1 rounded-xl border border-[#3E1646] text-xs overflow-x-auto max-w-full">
          {[
            { id: 'tumu', etiket: 'Tümü' },
            { id: 'hazirlaniyor', etiket: 'Hazırlanıyor' },
            { id: 'teslime_hazir', etiket: 'Teslime Hazır' },
            { id: 'teslim_edildi', etiket: 'Teslim Edildi' },
          ].map((sekme) => (
            <button
              key={sekme.id}
              onClick={() => setSeciliDurum(sekme.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-xs ${
                seciliDurum === sekme.id ? 'bg-[#6D237A] text-white font-bold' : 'text-[#A872B5] hover:text-white'
              }`}
            >
              {sekme.etiket}
            </button>
          ))}
        </div>
      </div>

      {filtrelenmisSiparisler.length === 0 ? (
        <div className="py-10 text-center text-stone-400 bg-[#180A1F] rounded-xl border border-[#3E1646]">
          <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[#521E5C] mb-2" />
          <p className="text-xs sm:text-sm font-medium">Bu şubeye ait aktif Gel-Al siparişi bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrelenmisSiparisler.map((siparis) => (
            <div
              key={siparis.id}
              className="bg-[#180A1F] border border-[#3E1646] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#3E1646] text-[#DDAF53] font-bold text-xs px-2.5 py-0.5 rounded-md border border-[#521E5C]">
                    #{siparis.siparis_kodu}
                  </span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                    siparis.durum === 'hazirlaniyor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    siparis.durum === 'teslime_hazir' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {siparis.durum === 'hazirlaniyor' ? '🔥 Hazırlanıyor' :
                     siparis.durum === 'teslime_hazir' ? '📦 Teslime Hazır' : '✅ Teslim Edildi'}
                  </span>
                  <span className="text-xs text-stone-400">PIN: <strong className="text-white">{siparis.pin_kodu}</strong></span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-300 pt-1">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#DDAF53]" /> {siparis.musteri_adi}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {siparis.musteri_telefon}</span>
                </div>

                {siparis.urunler && siparis.urunler.length > 0 && (
                  <div className="text-xs text-stone-300 pt-1 flex flex-wrap gap-1">
                    {siparis.urunler.map((u, i) => (
                      <span key={i} className="bg-[#2A102E] px-2 py-0.5 rounded border border-[#521E5C]">
                        {u.adet}x {u.ad}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#3E1646] pt-3 md:pt-0">
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <span className="text-xs text-stone-400 sm:hidden">Toplam:</span>
                  <div className="text-base font-bold text-[#DDAF53]">{siparis.toplam_tutar} ₺</div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {siparis.durum === 'hazirlaniyor' && (
                    <button
                      type="button"
                      onClick={() => durumGuncelle(siparis.id, 'teslime_hazir')}
                      className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Paketlendi (Teslime Al)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {siparis.durum === 'teslime_hazir' && (
                    <button
                      type="button"
                      onClick={() => durumGuncelle(siparis.id, 'teslim_edildi')}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Müşteriye Teslim Et</span>
                    </button>
                  )}
                  {siparis.durum === 'teslim_edildi' && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 py-1">
                      <CheckCircle2 className="w-4 h-4" /> Teslim Edildi
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
