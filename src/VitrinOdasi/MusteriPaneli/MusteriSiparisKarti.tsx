import React from 'react';
import { Store, MessageCircle, Bike, QrCode, Ban, CheckCircle2, Star } from 'lucide-react';
import { TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { MutfakTipi } from '@/src/veritabani/VeriTipleri';
import { siparisDegerlendirildiMi } from '@/src/MalzemeCekmeceleri/Degerlendirme/degerlendirmeDeposu';
import { SiparisDurumCubugu } from './SiparisDurumCubugu';
import { TekrarSiparisButonu } from './TekrarSiparisButonu';

interface MusteriSiparisKartiOzellikleri {
  siparis: TestSiparis;
  mutfak?: MutfakTipi;
  sepeteEkle: (mutfakId: string, yemekId: string, adet: number, fiyat: number) => Promise<void>;
  sepetPaneliAc: () => void;
  onTakipEt: (kod: string) => void;
  onQrAc: (kod: string) => void;
  onIptalEt: (bilgi: { id: string; kodu: string }) => void;
  onDegerlendir: (bilgi: { siparisKimligi: string; mutfakId: string; mutfakAdi: string; yemekler: string[] }) => void;
}

export const MusteriSiparisKarti: React.FC<MusteriSiparisKartiOzellikleri> = ({
  siparis: sip,
  mutfak,
  sepeteEkle,
  sepetPaneliAc,
  onTakipEt,
  onQrAc,
  onIptalEt,
  onDegerlendir,
}) => {
  const iptalEdilebilir = sip.durum === 'beklemede' || sip.durum === 'hazirlaniyor';
  const yolda = sip.durum === 'yolda';
  const tamamlandi = sip.durum === 'teslim_edildi';
  const iptal = sip.durum === 'iptal';
  const aktifSiparisMi = !tamamlandi && !iptal;
  const puanlandi = siparisDegerlendirildiMi(sip.id);

  const whatsappLink = `https://wa.me/905423334455?text=${encodeURIComponent(
    `Merhaba, #${sip.siparis_kodu} kodlu siparişim ile ilgili bilgi ve destek almak istiyorum.`
  )}`;

  const noktaRengi = yolda
    ? 'bg-blue-400 animate-pulse'
    : iptal
    ? 'bg-red-400'
    : tamamlandi
    ? 'bg-emerald-400'
    : 'bg-amber-400 animate-ping';

  return (
    <div className="p-4 rounded-2xl bg-[#1C0922] border border-amber-500/40 shadow-lg space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${noktaRengi}`} />
          <span className="font-bold text-white text-xs">#{sip.siparis_kodu}</span>
          <span className="text-[10px] text-purple-300">({sip.olusturma_tarihi})</span>
        </div>
        <span className="text-xs font-extrabold text-amber-400">{sip.toplam_tutar} ₺</span>
      </div>

      <div className="text-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>{mutfak?.ad || 'Afyon Ev Mutfağı'}</span>
          </div>
          {aktifSiparisMi && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-emerald-300 hover:text-white flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900 px-3 py-1 rounded-xl border border-emerald-700/60 shadow-sm cursor-pointer transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-950" />
              <span>WhatsApp Destek</span>
            </a>
          )}
        </div>
        <div className="text-gray-300 pl-5">
          {sip.elemanlar && sip.elemanlar.length > 0 ? (
            sip.elemanlar.map((e: { adet?: number; yemek_baslik?: string; baslik?: string }, i: number) => (
              <span key={i} className="inline-block mr-2">{e.adet}x {e.yemek_baslik || e.baslik}</span>
            ))
          ) : (
            <span className="text-gray-400 italic">Sipariş detayları hazırlanıyor</span>
          )}
        </div>
      </div>

      <SiparisDurumCubugu
        durum={sip.durum || 'beklemede'}
        durumAciklamasi={sip.durum_aciklamasi}
        tahminiTeslimat={sip.tahmini_teslimat}
      />

      <div className="pt-2 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {yolda && (
            <button
              type="button"
              onClick={() => onTakipEt(sip.siparis_kodu || sip.id)}
              className="text-xs font-black text-[#130713] bg-gradient-to-r from-amber-400 to-[#F5D28A] hover:brightness-110 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Bike className="w-4 h-4 stroke-[2.5]" />
              <span>Kuryeyi Canlı Takip Et 🛵</span>
            </button>
          )}
          {aktifSiparisMi && (
            <button
              type="button"
              onClick={() => onQrAc(sip.siparis_kodu || sip.id)}
              className="text-xs font-bold text-white bg-[#2A102E] hover:bg-[#3E1646] border border-purple-700/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Teslimat QR Kodum 📱</span>
            </button>
          )}
        </div>

        {iptalEdilebilir && (
          <button
            type="button"
            onClick={() => onIptalEt({ id: sip.id, kodu: sip.siparis_kodu || sip.id })}
            className="text-[11px] text-rose-300 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Ban className="w-3 h-3 text-rose-400" />
            <span>Siparişi İptal Et</span>
          </button>
        )}

        {(tamamlandi || iptal) && (
          <TekrarSiparisButonu
            mutfakId={sip.mutfak_id || ''}
            elemanlar={sip.elemanlar}
            sepeteEkleFonksiyonu={sepeteEkle}
            sepetPaneliAc={sepetPaneliAc}
          />
        )}

        {tamamlandi && (
          puanlandi ? (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-700/60 px-2.5 py-1 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Değerlendirildi</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onDegerlendir({
                siparisKimligi: sip.id,
                mutfakId: sip.mutfak_id || '',
                mutfakAdi: mutfak?.ad || 'Afyon Ev Mutfağı',
                yemekler: (sip.elemanlar || []).map((e: { yemek_baslik?: string; baslik?: string }) => e.yemek_baslik || e.baslik || ''),
              })}
              className="bg-amber-500 hover:bg-amber-400 text-[#130713] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Star className="w-3.5 h-3.5 fill-[#130713]" />
              <span>Lezzeti & Kuryeyi Puanla</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
