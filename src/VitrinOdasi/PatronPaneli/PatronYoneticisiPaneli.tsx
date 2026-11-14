import React, { useState, useEffect } from 'react';
import { Crown, LogOut, DollarSign, Building2, Store, Clock } from 'lucide-react';
import { kullaniciHafizasiKullan } from '@/src/OrtakHavuz/KullaniciHafizasi';
import { gelAlSubeleriGetir } from '@/src/MalzemeCekmeceleri/gelAlSubeleriGetir';
import { tumTedarikciHakedisleriniCanliDinle } from '@/src/MalzemeCekmeceleri/Sube/subeTedarikServisi';
import { TedarikciHakedis } from '@/src/veritabani/SubeTipleri';
import { PatronHakedisOnayMasasi } from './PatronHakedisOnayMasasi';
import { PatronOdemeYonetimi } from './PatronOdemeYonetimi';

export const PatronYoneticisiPaneli: React.FC = () => {
  const { aktifKullanici, cikisYap, panelDegistir } = kullaniciHafizasiKullan();
  const { subeler } = gelAlSubeleriGetir();
  const [hakedisler, setHakedisler] = useState<TedarikciHakedis[]>([]);

  useEffect(() => {
    const durdur = tumTedarikciHakedisleriniCanliDinle((liste) => {
      setHakedisler(liste || []);
    });
    return () => durdur();
  }, []);

  const toplamHakedis = hakedisler.reduce((t, h) => t + (h.toplam_hakedis || 0), 0);
  const bekleyenHakedis = hakedisler
    .filter((h) => h.durum === 'beklemede')
    .reduce((t, h) => t + (h.toplam_hakedis || 0), 0);
  const odenenHakedis = hakedisler
    .filter((h) => h.durum === 'odendi')
    .reduce((t, h) => t + (h.toplam_hakedis || 0), 0);

  return (
    <div className="min-h-screen bg-[#180A1F] text-white flex flex-col">
      <header className="bg-[#220E29] border-b border-[#3E1646] px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
            <Crown className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">Afyon Ev Lezzetleri — Süper Admin (Patron) Masası</h1>
            <p className="text-xs text-[#A872B5]">
              Patron: <strong className="text-white">{aktifKullanici?.ad_soyad || 'Süper Admin'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => panelDegistir('vitrin')}
            className="px-4 py-2 rounded-xl bg-[#2A102E] hover:bg-[#4D1857] text-white text-xs font-bold border border-[#521E5C] transition-colors cursor-pointer"
          >
            Müşteri Vitrinine Git
          </button>
          <button
            type="button"
            onClick={() => {
              cikisYap();
              panelDegistir('vitrin');
            }}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold border border-rose-500/50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* 4 Özet Kart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-4 space-y-1 shadow-md">
            <span className="text-[11px] text-[#A872B5] font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-[#DDAF53]" /> Toplam Tedarikçi Yükü
            </span>
            <div className="text-2xl font-bold text-white">{toplamHakedis} ₺</div>
            <p className="text-[10px] text-stone-400">Şubelere giren toplam lezzet maliyeti</p>
          </div>

          <div className="bg-[#220E29] border border-amber-500/40 rounded-2xl p-4 space-y-1 shadow-md">
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-400" /> Onay Bekleyen Hak Ediş
            </span>
            <div className="text-2xl font-bold text-amber-300">{bekleyenHakedis} ₺</div>
            <p className="text-[10px] text-amber-200/80">Patron imzasını bekleyen teslimatlar</p>
          </div>

          <div className="bg-[#220E29] border border-emerald-500/40 rounded-2xl p-4 space-y-1 shadow-md">
            <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Ödenen Hak Ediş
            </span>
            <div className="text-2xl font-bold text-emerald-300">{odenenHakedis} ₺</div>
            <p className="text-[10px] text-emerald-200/80">Ev aşçılarına transfer edilen</p>
          </div>

          <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-4 space-y-1 shadow-md">
            <span className="text-[11px] text-[#A872B5] font-semibold flex items-center gap-1">
              <Building2 className="w-4 h-4 text-purple-400" /> Aktif Şube Sayısı
            </span>
            <div className="text-2xl font-bold text-white">{subeler.length} Şube</div>
            <p className="text-[10px] text-stone-400">Canlı Gel-Al ve teslim noktaları</p>
          </div>
        </div>

        {/* Ödeme Seçenekleri ve PayTR Yönetimi */}
        <PatronOdemeYonetimi />

        {/* Hak Ediş Onay Masası */}
        <PatronHakedisOnayMasasi hakedisler={hakedisler} />

        {/* Şubeler Durumu */}
        <div className="bg-[#220E29] border border-[#521E5C] rounded-2xl p-5 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-[#DDAF53]" />
            Kayıtlı Gel-Al Şubeleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subeler.map((s) => (
              <div key={s.id} className="p-3 bg-[#180A1F] border border-[#3E1646] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{s.ad}</h4>
                  <p className="text-[11px] text-stone-400">{s.adres}</p>
                  <p className="text-[10px] text-[#A872B5] pt-0.5">Çalışma Saatleri: {s.calisma_saatleri || '09:00 - 22:00'}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${s.acik_mi ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}>
                    {s.acik_mi ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
