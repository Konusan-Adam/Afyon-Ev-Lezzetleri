import React, { useState } from 'react';
import { Ban, CheckCircle, PackageCheck, Bike, Clock, AlertCircle, Send } from 'lucide-react';
import { MutfakSureSecici } from '@/src/VitrinOdasi/Bilesenler/Mutfak/MutfakSureSecici';
import { mutfakSiparisDurumuGuncelle } from '@/src/MalzemeCekmeceleri/Mutfak/MutfakSiparisIslemleri';
import { icerikGuvenlikKontrolu } from '@/src/MalzemeCekmeceleri';

interface Props {
  siparis: any;
  onYenile: () => void;
  onIptalAc: (bilgi: { id: string; kodu: string }) => void;
}

export const MutfakTekliSiparisKarti: React.FC<Props> = ({ siparis, onYenile, onIptalAc }) => {
  const [dakika, setDakika] = useState<number>(siparis.hazirlanmaSuresiDakika || (siparis.durum === 'beklemede' ? 0 : 25));
  const [durum, setDurum] = useState<any>(siparis.durum || 'beklemede');
  const [not, setNot] = useState(siparis.durumAciklamasi || (siparis.durum === 'beklemede' ? 'Sipariş alındı, hazırlık süresi bekleniyor.' : 'Mutfakta özenle pişiriliyor.'));
  const [islemSuruyor, setIslemSuruyor] = useState(false);
  const [hataUyarisi, setHataUyarisi] = useState<string | null>(null);

  const guvenlik = icerikGuvenlikKontrolu(not);

  const dogrudanDurumGuncelle = async (yeniDurum: any, ozelNot?: string) => {
    if ((yeniDurum === 'hazirlaniyor' || yeniDurum === 'paketlendi') && (!dakika || dakika <= 0)) {
      setHataUyarisi('⚠️ Lütfen önce hazırlık süresi (dakika) seçin veya girin!');
      setTimeout(() => setHataUyarisi(null), 4000);
      return;
    }

    setIslemSuruyor(true);
    setHataUyarisi(null);
    setDurum(yeniDurum);
    const guncelNot = ozelNot || not;
    if (ozelNot) setNot(ozelNot);

    await mutfakSiparisDurumuGuncelle(
      siparis.id, 
      yeniDurum, 
      dakika, 
      guncelNot, 
      siparis.siparis_kodu || siparis.siparisKodu
    );

    setIslemSuruyor(false);
    onYenile();
  };

  const beklemedeMi = durum === 'beklemede' || !durum;
  const hazirlaniyorMu = durum === 'hazirlaniyor';
  const paketlendiMi = durum === 'paketlendi';
  const yoldaMi = durum === 'yolda' || durum === 'kuryede';

  return (
    <div className={`border rounded-2xl p-4 space-y-3 shadow-md transition-all ${
      paketlendiMi 
        ? 'bg-[#151a14] border-emerald-500/60 ring-1 ring-emerald-500/30' 
        : yoldaMi 
        ? 'bg-[#181024] border-blue-500/60 ring-1 ring-blue-500/30'
        : beklemedeMi
        ? 'bg-[#210B29] border-amber-500/80 ring-1 ring-amber-500/30'
        : 'bg-[#1C0922] border-amber-500/40'
    }`}>
      {/* Kart Başlığı */}
      <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-white text-sm">#{siparis.siparis_kodu || siparis.id}</span>
          <span className="text-[10px] text-purple-300/80 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
            {siparis.musteri_adi ? siparis.musteri_adi : 'Müşteri'}
          </span>
          {beklemedeMi && (
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
              🔔 YENİ SİPARİŞ (Dakika Bekleniyor)
            </span>
          )}
          {hazirlaniyorMu && (
            <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
              🔥 PİŞİYOR ({dakika} Dk)
            </span>
          )}
          {paketlendiMi && (
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 animate-pulse">
              🚴‍♂️ KURYE ÇAĞRILDI (Bekleniyor)
            </span>
          )}
          {yoldaMi && (
            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/40">
              🛵 KURYEYE TESLİM EDİLDİ (Yolda)
            </span>
          )}
        </div>
        <span className="text-sm font-black text-amber-400">{siparis.toplam_tutar || siparis.tutar || 0} ₺</span>
      </div>

      {/* Sipariş Elemanları */}
      <div className="py-1 space-y-1 text-xs">
        {siparis.elemanlar?.map((e: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-gray-200">
            <span>• {e.yemek_baslik || e.baslik || (e.yemek && e.yemek.baslik)}</span>
            <span className="font-semibold text-purple-300">
              {e.adet} Adet ({((e.birim_fiyat || e.fiyat || 0) * e.adet)} ₺)
            </span>
          </div>
        ))}
      </div>

      {/* Hata Uyarısı */}
      {hataUyarisi && (
        <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-bold flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{hataUyarisi}</span>
        </div>
      )}

      {/* Süre Seçici (Sadece beklemede veya hazırlanıyor aşamasında aktif) */}
      {(beklemedeMi || hazirlaniyorMu) && (
        <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Adım 1: Hazırlık Süresi Girin (Zorunlu)
            </span>
            {!dakika || dakika <= 0 ? (
              <span className="text-[10px] text-rose-400 font-bold">⚠️ Süre seçilmeden başlatılamaz!</span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-bold">✅ Süre: {dakika} Dk</span>
            )}
          </div>
          <MutfakSureSecici seciliDakika={dakika} onSureDegisti={setDakika} />
        </div>
      )}

      {/* Net Durum Notu Inputu */}
      <div className="space-y-1">
        <input
          type="text"
          value={not}
          onChange={(e) => setNot(e.target.value)}
          placeholder="Müşteriye özel durum notu..."
          className="w-full bg-purple-950/80 border border-purple-800 rounded-xl px-3 py-1.5 text-white placeholder-purple-400/60 text-xs focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* KRONOLOJİK AKSİYON BUTONLARI (Net & Karışıksız) */}
      <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onIptalAc({ id: siparis.id, kodu: siparis.siparis_kodu || siparis.id })}
          className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Ban className="w-3.5 h-3.5" />
          <span>İptal</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 1. ADIM: BEKLEMEDEN -> PİŞİYOR BAŞLAT */}
          {beklemedeMi && (
            <button
              type="button"
              disabled={islemSuruyor || !dakika || dakika <= 0}
              onClick={() => dogrudanDurumGuncelle('hazirlaniyor', `Sipariş onaylandı, tahmini hazırlanma süresi ${dakika} dakika.`)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95 ${
                !dakika || dakika <= 0
                  ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white border border-amber-400/50 shadow-purple-950/50'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-amber-200" />
              <span>{islemSuruyor ? 'İşleniyor...' : `🔥 HAZIRLIĞI BAŞLAT (${dakika || 0} Dk)`}</span>
            </button>
          )}

          {/* 2. ADIM: PİŞİYOR -> KURYE GELSİN (PAKETLE) */}
          {hazirlaniyorMu && (
            <button
              type="button"
              disabled={islemSuruyor || !dakika || dakika <= 0}
              onClick={() => dogrudanDurumGuncelle('paketlendi', `Sipariş paketlendi, kurye çağrıldı (${dakika} dk sürdü).`)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer transition-all border border-emerald-400/50 active:scale-95"
            >
              <PackageCheck className="w-4 h-4 text-emerald-200" />
              <span>{islemSuruyor ? 'İşleniyor...' : '🚴‍♂️ KURYE GELSİN (Paketlendi)'}</span>
            </button>
          )}

          {/* 3. ADIM: PAKETLENDİ (KURYE ÇAĞRILDI) -> KURYEYE TESLİM EDİLDİ (YOLA ÇIKTI) */}
          {paketlendiMi && (
            <button
              type="button"
              disabled={islemSuruyor}
              onClick={() => dogrudanDurumGuncelle('yolda', 'Sipariş kuryeye teslim edildi, sıcak şekilde yola çıktı!')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-950/50 cursor-pointer transition-all border border-blue-400/50 active:scale-95 animate-pulse"
            >
              <Send className="w-4 h-4 text-blue-200" />
              <span>{islemSuruyor ? 'İşleniyor...' : '🛵 KURYEYE TESLİM EDİLDİ (Yola Çıktı)'}</span>
            </button>
          )}

          {yoldaMi && (
            <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-950/80 px-3 py-2 rounded-xl border border-blue-500/50 font-bold">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Kuryeye teslim edildi, adresi kurye ekranına açıldı!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
