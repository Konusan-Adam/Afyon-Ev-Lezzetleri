import React, { useState } from 'react';
import { ShoppingBag, X, UtensilsCrossed, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { sepetHafizasiKullan } from '@/src/OrtakHavuz/SepetHafizasi';
import { MutfakSepetGrubu } from '@/src/MalzemeCekmeceleri/Sepet/sepetGruplayici';
import { MutfakSepetKarti } from '@/src/VitrinOdasi/Bilesenler';
import { TeslimatTipiSecici } from '@/src/VitrinOdasi/Bilesenler';
import { OdemeEkraniPenceresi } from '@/src/VitrinOdasi/Bilesenler';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz';
import { KuryeUcretBilgiKarti } from '@/src/VitrinOdasi/Bilesenler';

export const CokluSepetVitrini: React.FC = () => {
  const {
    sepetPaneliAcik,
    sepetPaneliKapat,
    mutfakGruplari,
    toplamUrunSayisi,
    toplamSepetTutari,
    toplamTeslimatUcreti,
    genelToplamTutar,
  } = sepetHafizasiKullan();

  const { teslimatTipi, seciliAdres } = teslimatHafizasiKullan();
  const [topluOdemeAcik, setTopluOdemeAcik] = useState<boolean>(false);

  if (!sepetPaneliAcik) return null;

  const gelAlMi = teslimatTipi === 'gel_al';
  const gercekTeslimatUcreti = gelAlMi ? 0 : toplamTeslimatUcreti;
  const nihaiGenelToplam = toplamSepetTutari + gercekTeslimatUcreti;

  // Tüm mutfakların minimum tutar şartı sağlandı mı?
  const tumMinTutarlarUygun = mutfakGruplari.every((g) => g.minTutarUlasildi);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Arka Plan Karartması */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={sepetPaneliKapat}
      />

      {/* Kayar Panel */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:inset-y-0 sm:right-0 flex justify-end z-50 pointer-events-none">
        <div className="pointer-events-auto w-full sm:max-w-md bg-[#130713] border-t sm:border-t-0 sm:border-l border-[#3E1646] rounded-t-3xl sm:rounded-none text-white flex flex-col shadow-2xl max-h-[92vh] sm:max-h-full animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
          {/* Mobilde çekmece tutamağı */}
          <div className="sm:hidden flex justify-center pt-2.5 pb-1">
            <div className="w-12 h-1.5 bg-purple-800/60 rounded-full" />
          </div>

          {/* Üst Bar */}
          <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#DDAF53]">
              <ShoppingBag className="w-5 h-5 text-[#E0B25B]" />
              <h2 className="font-bold text-base">
                Sepetim ({mutfakGruplari.length} Mutfak, {toplamUrunSayisi} Ürün)
              </h2>
            </div>
            <button
              type="button"
              onClick={sepetPaneliKapat}
              className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
              title="Sepeti Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Teslimat Tipi Seçimi (Gel Al / Kurye) */}
          <div className="px-4 py-2.5 bg-[#1F0C24] border-b border-[#3E1646]">
            <TeslimatTipiSecici />
          </div>

          {/* İçerik / Mutfaklar Listesi */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mutfakGruplari.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-[#2A102E] border border-[#521E5C] flex items-center justify-center mb-4 text-[#DDAF53]">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Sepetiniz Henüz Boş</h3>
                <p className="text-xs text-[#9866A3] max-w-xs">
                  Afyon ev lezzetlerinden dilediğiniz mutfağın yemeklerini sepete ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <>
                {mutfakGruplari.map((grup: MutfakSepetGrubu) => (
                  <MutfakSepetKarti key={grup.mutfakId} grup={grup} />
                ))}

                {/* 🌟 AKILLI KURYE & ROTA BİLGİ KARTI */}
                {!gelAlMi && (
                  <KuryeUcretBilgiKarti
                    mutfakSayisi={mutfakGruplari.length}
                    sepetToplamTutari={toplamSepetTutari}
                    teslimatMahallesi={seciliAdres?.mahalle}
                  />
                )}
              </>
            )}
          </div>

          {/* 🌟 TEK TIKLA TÜM SEPETİ SATIN ALMA ALT ÇUBUĞU (MASTER CHECKOUT FOOTER) */}
          {mutfakGruplari.length > 0 && (
            <div className="p-4 bg-[#1C0922] border-t border-[#3E1646] space-y-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <div>
                  <span className="text-gray-400">Sepet Toplamı: </span>
                  <strong className="text-white">{toplamSepetTutari} ₺</strong>
                </div>
                <div>
                  <span className="text-gray-400">Kurye ({mutfakGruplari.length} Mutfak): </span>
                  <strong className={gelAlMi ? 'text-emerald-400' : 'text-amber-300'}>
                    {gelAlMi ? 'Gel Al (0 ₺)' : (gercekTeslimatUcreti === 0 ? 'Ücretsiz' : `${gercekTeslimatUcreti} ₺`)}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-black border-t border-purple-900/40 pt-2">
                <span className="text-gray-200">Genel Ödenecek Tutar:</span>
                <span className="text-xl font-extrabold text-amber-400">{nihaiGenelToplam} ₺</span>
              </div>

              <button
                type="button"
                disabled={!tumMinTutarlarUygun}
                onClick={() => setTopluOdemeAcik(true)}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-98 ${
                  tumMinTutarlarUygun
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-[#F5D28A] text-[#130713] hover:brightness-110 shadow-amber-500/25'
                    : 'bg-purple-950/60 text-gray-500 border border-purple-900/40 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 fill-[#130713]" />
                <span>
                  {mutfakGruplari.length > 1
                    ? `Tüm ${mutfakGruplari.length} Mutfağı Tek Seferde Satın Al (${nihaiGenelToplam} ₺) 🚀`
                    : `Siparişi Tamamla (${nihaiGenelToplam} ₺) 🚀`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!tumMinTutarlarUygun && (
                <p className="text-[10px] text-amber-300/80 text-center">
                  * Lütfen her mutfağın minimum sepet tutarını tamamlayınız.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toplu Ödeme Modalı */}
      {topluOdemeAcik && (
        <OdemeEkraniPenceresi
          gruplar={mutfakGruplari}
          onKapat={() => setTopluOdemeAcik(false)}
        />
      )}
    </div>
  );
};
