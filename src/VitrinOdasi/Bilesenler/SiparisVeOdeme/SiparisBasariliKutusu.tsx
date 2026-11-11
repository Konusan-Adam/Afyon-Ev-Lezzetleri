import React, { useState } from 'react';
import {
  CheckCircle2,
  ChefHat,
  ArrowRight,
  Copy,
  Zap,
  ShoppingBag,
  Bike,
  Home,
  Store
} from 'lucide-react';
import { TestSiparis } from '@/src/veritabani/CanliVeriYardimcisi';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';

interface SiparisBasariliKutusuOzellikleri {
  siparis?: TestSiparis;
  siparisler?: TestSiparis[];
  onKapat: () => void;
}

export const SiparisBasariliKutusu: React.FC<SiparisBasariliKutusuOzellikleri> = ({
  siparis,
  siparisler = [],
  onKapat,
}) => {
  const { panelDegistir } = kullaniciHafizasiKullan();
  const [kopyalananKod, setKopyalananKod] = useState<string | null>(null);

  const tumSiparisler = siparisler.length > 0 ? siparisler : (siparis ? [siparis] : []);

  const koduKopyala = (kod: string) => {
    navigator.clipboard.writeText(kod);
    setKopyalananKod(kod);
    setTimeout(() => setKopyalananKod(null), 2000);
  };

  const siparisTakibineGit = () => {
    onKapat();
    panelDegistir('musteri');
  };

  const toplamOdeme = tumSiparisler.reduce((acc, s) => acc + s.toplam_tutar, 0);

  return (
    <div className="text-center py-2 px-1 sm:px-3 space-y-4 animate-fadeIn">
      {/* 1. BÜYÜK GÖRSEL BAŞARI ANİMASYONU */}
      <div className="relative flex justify-center items-center my-2">
        <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-950/60 border-2 border-emerald-300 transform transition-transform hover:scale-105">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      {/* 2. BAŞLIK VE AÇIKLAMA */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-inner">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{tumSiparisler.length > 1 ? `${tumSiparisler.length} AYRI MUTFAĞA SİPARİŞ İLETİLDİ! 🎉` : 'SİPARİŞİNİZ MUTFAĞA İLETİLDİ! 🎉'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#F5D28A]">Afiyet Olsun!</h3>
        <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
          Tüm mutfaklara siparişleriniz ayrı ayrı iletildi. Aşçılarımız taze malzemelerle yemeğinizi hazırlamaya başladı.
        </p>
      </div>

      {/* 3. DÖRT AŞAMALI SİPARİŞ DURUM ÇUBUĞU */}
      <div className="bg-[#240C28] border border-[#521E5C] rounded-2xl p-3.5 space-y-3 shadow-md">
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-1">
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 1. Alındı
          </span>
          <span className="text-amber-400 flex items-center gap-1 animate-pulse">
            <ChefHat className="w-3 h-3" /> 2. Hazırlanıyor
          </span>
          <span className="flex items-center gap-1">
            <Bike className="w-3 h-3" /> 3. Yolda
          </span>
          <span className="flex items-center gap-1">
            <Home className="w-3 h-3" /> 4. Teslim
          </span>
        </div>
        <div className="w-full bg-purple-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-purple-900/60">
          <div className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full w-[45%] transition-all duration-700 animate-pulse" />
        </div>
      </div>

      {/* 4. OLUŞAN SİPARİŞLER LİSTESİ */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {tumSiparisler.map((sip, idx) => (
          <div key={sip.id || idx} className="bg-[#1D0A20] border border-amber-500/40 rounded-2xl p-3 text-left space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-400" />
                <span className="font-black text-white text-xs">Sipariş #{idx + 1}</span>
              </div>
              <span className="font-extrabold text-amber-400 text-xs">{sip.toplam_tutar} ₺</span>
            </div>

            <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-purple-900/40 text-xs">
              <span className="text-purple-300 font-mono text-[11px]">Kod: <strong className="text-white">#{sip.siparis_kodu || sip.id}</strong></span>
              <button
                type="button"
                onClick={() => koduKopyala(sip.siparis_kodu || sip.id)}
                className="text-[10px] text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
              >
                <Copy className="w-3 h-3" />
                <span>{kopyalananKod === (sip.siparis_kodu || sip.id) ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-300 pl-1">
              {Array.isArray(sip.elemanlar) && sip.elemanlar.map((e: any, i: number) => (
                <span key={i} className="inline-block mr-2">
                  {e.adet}x {e.yemek_baslik || e.baslik}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 5. TOPLAM VE YÖNLENDİRME BUTONU */}
      <div className="pt-2 border-t border-[#3E1646] space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-gray-300 px-2">
          <span>Toplam Ödenen / Ödenecek:</span>
          <span className="text-base text-amber-400">{toplamOdeme} ₺</span>
        </div>

        <button
          type="button"
          onClick={siparisTakibineGit}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-[#F5D28A] text-[#130713] font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Siparişlerimi Panelden Canlı Takip Et</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
