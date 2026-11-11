import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Store } from 'lucide-react';
import { type MutfakSepetGrubu } from '@/src/OrtakHavuz';
import { KuponUygulamaAlani, SozlesmePenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { type SozlesmeTuru } from '@/src/MalzemeCekmeceleri';
import { SepetElemani } from '@/src/veritabani/VeriTipleri';
import { type KuponHesaplamaSonucu } from '@/src/MalzemeCekmeceleri/useKuponHesaplayici';

interface SiparisOzetKartiOzellikleri {
  gruplar: MutfakSepetGrubu[];
  yukleniyor: boolean;
  gelAlMi?: boolean;
  formGecerli?: boolean;
  sozlesmeOnaylandi: boolean;
  onSozlesmeOnayDegis: (onay: boolean) => void;
  onSiparisiTamamla: () => void;
  kuponBilgisi?: KuponHesaplamaSonucu | null;
  girilenKod?: string;
  onKodDegis?: (kod: string) => void;
  onKuponUygula?: () => void;
  onKuponKaldir?: () => void;
  kuponHataMesaji?: string | null;
}

export const SiparisOzetKarti: React.FC<SiparisOzetKartiOzellikleri> = ({
  gruplar,
  yukleniyor,
  gelAlMi = false,
  formGecerli = true,
  sozlesmeOnaylandi,
  onSozlesmeOnayDegis,
  onSiparisiTamamla,
  kuponBilgisi,
  girilenKod,
  onKodDegis,
  onKuponUygula,
  onKuponKaldir,
  kuponHataMesaji,
}) => {
  const [aktifSozlesmeTuru, setAktifSozlesmeTuru] = useState<SozlesmeTuru | null>(null);

  const toplamUrunTutari = gruplar.reduce((acc, g) => acc + g.araToplam, 0);
  const toplamTeslimatUcreti = gelAlMi ? 0 : gruplar.reduce((acc, g) => acc + g.teslimatUcreti, 0);
  const kuponIndirimi = kuponBilgisi?.gecerli ? kuponBilgisi.indirimTutari : 0;
  const odenecekTutar = Math.max(0, Math.round((toplamUrunTutari + toplamTeslimatUcreti - kuponIndirimi) * 100) / 100);

  const butonDevreDisi = yukleniyor || !formGecerli || !sozlesmeOnaylandi;

  return (
    <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between text-[#F5D28A] font-bold text-sm border-b border-[#3E1646] pb-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#CFA353]" />
          <span>Sipariş Özeti ({gruplar.length} Mutfak)</span>
        </div>
        <span className="text-xs text-purple-300 font-normal">
          {gruplar.reduce((acc, g) => acc + g.elemanlar.reduce((eAcc, e) => eAcc + e.adet, 0), 0)} Adet Ürün
        </span>
      </div>

      {/* Mutfak Grupları ve Ürünler Listesi */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {gruplar.map((grup) => (
          <div key={grup.mutfakId} className="bg-[#1A081D] p-2.5 rounded-xl border border-purple-900/40 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#F5D28A]">
              <span className="flex items-center gap-1 truncate">
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{grup.mutfak.ad}</span>
              </span>
              <span className="shrink-0 text-[11px] text-purple-300">
                {grup.araToplam} ₺ {gelAlMi ? '' : `(+${grup.teslimatUcreti} ₺ Kurye)`}
              </span>
            </div>

            <div className="space-y-1 pl-4">
              {grup.elemanlar.map((item: SepetElemani) => (
                <div key={item.id} className="flex justify-between items-center text-[11px] text-gray-300">
                  <span className="truncate pr-2">
                    <strong className="text-amber-300">{item.adet}x</strong> {item.yemek?.baslik || 'Lezzet'}
                  </span>
                  <span className="font-semibold text-white shrink-0">
                    {item.adet * item.birim_fiyat} ₺
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Kupon Kodu Giriş Alanı */}
      {onKuponUygula && onKodDegis && onKuponKaldir && (
        <div className="pt-1">
          <KuponUygulamaAlani
            girilenKod={girilenKod || ''}
            onKodDegis={onKodDegis}
            onUygula={onKuponUygula}
            onKaldir={onKuponKaldir}
            kuponBilgisi={kuponBilgisi || null}
            hataMesaji={kuponHataMesaji || null}
          />
        </div>
      )}

      {/* Fiyatlandırma Çizelgesi */}
      <div className="border-t border-[#3E1646] pt-2 space-y-1 text-xs">
        <div className="flex justify-between text-gray-400">
          <span>Yemekler Ara Toplamı:</span>
          <span>{toplamUrunTutari} ₺</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>{gelAlMi ? 'Teslimat Türü:' : `Kurye Teslimat Ücreti (${gruplar.length} Nokta):`}</span>
          <span className={gelAlMi ? 'text-emerald-400 font-semibold' : ''}>
            {gelAlMi ? 'Gel Al (0 ₺)' : (toplamTeslimatUcreti === 0 ? 'Ücretsiz' : `${toplamTeslimatUcreti} ₺`)}
          </span>
        </div>
        {kuponIndirimi > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold">
            <span>Kupon İndirimi ({kuponBilgisi?.kod}):</span>
            <span>-{kuponIndirimi} ₺</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-[#3E1646]">
          <span>Genel Ödenecek Tutar:</span>
          <span className="text-[#F5D28A] text-lg">{odenecekTutar} ₺</span>
        </div>
      </div>

      {/* Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Kilidi */}
      <div className="bg-[#1A081D] p-3 rounded-xl border border-purple-900/60 space-y-1.5">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sozlesmeOnaylandi}
            onChange={(e) => onSozlesmeOnayDegis(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#DDAF53] rounded cursor-pointer shrink-0"
          />
          <div className="text-[11px] text-gray-300 leading-snug">
            <button
              type="button"
              onClick={() => setAktifSozlesmeTuru('on_bilgilendirme')}
              className="text-[#DDAF53] font-semibold underline hover:text-amber-300 cursor-pointer inline"
            >
              Ön Bilgilendirme Koşulları
            </button>
            'nı ve{' '}
            <button
              type="button"
              onClick={() => setAktifSozlesmeTuru('mesafeli_satis')}
              className="text-[#DDAF53] font-semibold underline hover:text-amber-300 cursor-pointer inline"
            >
              Mesafeli Satış Sözleşmesi
            </button>
            'ni okudum, onaylıyorum. <span className="text-rose-400 font-bold">*</span>
          </div>
        </label>
        {!sozlesmeOnaylandi && (
          <p className="text-[10px] text-amber-300/80 flex items-center gap-1 pl-6">
            <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Sipariş vermek için sözleşme onay kutusunu işaretleyiniz.</span>
          </p>
        )}
      </div>

      {/* Onay Butonu */}
      <button
        type="button"
        disabled={butonDevreDisi}
        onClick={onSiparisiTamamla}
        className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
          butonDevreDisi
            ? 'bg-purple-950/60 text-gray-500 border border-purple-900/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 via-amber-400 to-[#F5D28A] text-[#130713] hover:brightness-110 active:scale-[0.99] shadow-amber-500/20'
        }`}
      >
        {yukleniyor ? (
          <span>Siparişleriniz Oluşturuluyor...</span>
        ) : (
          <span>{gruplar.length > 1 ? `Tüm Sepeti Onayla (${odenecekTutar} ₺) 🚀` : `Siparişi Onayla (${odenecekTutar} ₺) 🚀`}</span>
        )}
      </button>

      {/* Sözleşme Görüntüleme Modalı */}
      {aktifSozlesmeTuru && (
        <SozlesmePenceresi
          tur={aktifSozlesmeTuru}
          acikMi={Boolean(aktifSozlesmeTuru)}
          onKapat={() => setAktifSozlesmeTuru(null)}
        />
      )}
    </div>
  );
};
