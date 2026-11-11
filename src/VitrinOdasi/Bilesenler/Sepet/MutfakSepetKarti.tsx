import React, { useState } from 'react';
import { Store, AlertCircle, CheckCircle, ArrowRight, Trash2, Bike } from 'lucide-react';
import { MutfakSepetGrubu } from '@/src/MalzemeCekmeceleri/Sepet/sepetGruplayici';
import { SepetUrunSatiri } from '@/src/VitrinOdasi/Bilesenler';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { OdemeEkraniPenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';

interface MutfakSepetKartiOzellikleri {
  grup: MutfakSepetGrubu;
}

export const MutfakSepetKarti: React.FC<MutfakSepetKartiOzellikleri> = ({ grup }) => {
  const { mutfakSepetiniTemizle, mutfakGruplari } = sepetHafizasiKullan();
  const {
    teslimatTipi,
    teslimatTipiDegistir,
    seciliGelAlSubesi,
    gelAlPenceresiAc,
  } = teslimatHafizasiKullan();
  const [odemeAcik, setOdemeAcik] = useState(false);

  const gelAlMi = teslimatTipi === 'gel_al';
  const teslimatUcreti = gelAlMi ? 0 : grup.teslimatUcreti;
  const nihaiToplam = grup.araToplam + teslimatUcreti;

  return (
    <div className="bg-[#1D0A20] border border-[#521E5C] rounded-2xl p-4 text-xs text-white space-y-3 shadow-lg select-none">
      {/* Mutfak Başlığı */}
      <div className="flex items-center justify-between border-b border-[#3E1646] pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#321138] border border-[#CFA353] flex items-center justify-center shrink-0">
            <Store className="w-4 h-4 text-[#DDAF53]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-[#F5D28A] truncate">{grup.mutfak.ad}</h3>
            <span className="text-[10px] text-[#A872B5]">
              {gelAlMi
                ? 'Teslimat: Şubeden Gel Al (0 ₺)'
                : `Min. Sipariş: ${grup.mutfak.min_siparis_tutari || 100} ₺ | Kurye: ${grup.teslimatUcreti} ₺`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => mutfakSepetiniTemizle(grup.mutfakId)}
          className="text-red-400 hover:text-red-200 cursor-pointer p-1 shrink-0"
          title="Bu Mutfağın Sepetini Temizle"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Teslimat Tercihi Hızlı Seçimi */}
      <div className="bg-[#140616] p-2 rounded-xl border border-[#3E1646] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {gelAlMi ? (
            <Store className="w-4 h-4 text-[#DDAF53] shrink-0" />
          ) : (
            <Bike className="w-4 h-4 text-purple-300 shrink-0" />
          )}
          <div className="min-w-0">
            <span className="font-bold text-white text-[11px] block truncate">
              {gelAlMi ? (seciliGelAlSubesi?.ad || 'Gel Al Şubesi') : 'Kurye ile Adrese Teslimat'}
            </span>
            {gelAlMi && (
              <button
                type="button"
                onClick={gelAlPenceresiAc}
                className="text-[10px] text-[#DDAF53] underline cursor-pointer"
              >
                Şube Değiştir
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => teslimatTipiDegistir(gelAlMi ? 'teslimat' : 'gel_al')}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-[#2A102E] hover:bg-[#3D1447] text-[#DDAF53] border border-[#521E5C] font-semibold cursor-pointer shrink-0 transition-colors"
        >
          {gelAlMi ? '🛵 Kuryeye Geç' : '🏬 Gel-Al Yap'}
        </button>
      </div>

      {/* Ürün Listesi */}
      <div className="space-y-2">
        {grup.elemanlar.map((item: SepetElemani) => (
          <SepetUrunSatiri key={item.id} eleman={item} />
        ))}
      </div>

      {/* Minimum Tutar Uyarı / Bilgi Çubuğu */}
      {!grup.minTutarUlasildi ? (
        <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-700/60 text-amber-200 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Siparişi tamamlamak için <strong>{grup.kalanMinTutar} ₺</strong> daha eklemelisiniz.
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 px-3 py-2 rounded-xl">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Minimum sipariş tutarına ulaşıldı!</span>
        </div>
      )}

      {/* Tutar Özeti & Yalnızca Bu Mutfağı Satın Alma Seçeneği */}
      <div className="pt-2 border-t border-[#3E1646] flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-400">
            Ara Toplam: {grup.araToplam} ₺ + {gelAlMi ? 'Gel Al: 0 ₺' : `Kurye: ${teslimatUcreti} ₺`}
          </div>
          <div className="font-bold text-sm text-white">
            Mutfak Toplamı: <span className="text-[#F5D28A]">{nihaiToplam} ₺</span>
          </div>
        </div>

        {mutfakGruplari.length > 1 && (
          <button
            type="button"
            disabled={!grup.minTutarUlasildi}
            onClick={() => setOdemeAcik(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              grup.minTutarUlasildi
                ? 'bg-[#321138] hover:bg-[#4D1857] text-[#F5D28A] border border-amber-500/40 shadow-sm'
                : 'bg-[#3E1646] text-gray-500 border border-[#521E5C] cursor-not-allowed opacity-60'
            }`}
            title="Yalnızca bu mutfağa ait ürünleri ayrı satın al"
          >
            <span>Tek Al ({nihaiToplam} ₺)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {odemeAcik && (
        <OdemeEkraniPenceresi
          grup={grup}
          onKapat={() => setOdemeAcik(false)}
        />
      )}
    </div>
  );
};
