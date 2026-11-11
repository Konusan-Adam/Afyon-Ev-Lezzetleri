import React, { useState } from 'react';
import { X, Users, Copy, Check, Plus, Trash2, LogOut, ShoppingBag, Share2 } from 'lucide-react';
import { ortakSepetHafizasiKullan } from '@/src/OrtakHavuz/OrtakSepetHafizasi';
import { OrtakSepetElemani, OrtakSepetKatilimci } from '@/src/veritabani/VeriTipleri';

export const OrtakSepetPenceresi: React.FC = () => {
  const {
    pencereAcik,
    pencereKapat,
    aktifOrtakSepet,
    mevcutKatilimci,
    katilimciListesi,
    ortakSepetElemanlari,
    yukleniyor,
    sepetOlustur,
    sepeteKatil,
    ortakSepettenYemekSil,
    ortakSepettenCik,
  } = ortakSepetHafizasiKullan();

  const [sekme, setSekme] = useState<'olustur' | 'katil'>('olustur');
  const [olusturanAd, setOlusturanAd] = useState<string>('');
  const [katilimciAd, setKatilimciAd] = useState<string>('');
  const [girilenKod, setGirilenKod] = useState<string>('');
  const [kodKopyalandi, setKodKopyalandi] = useState<boolean>(false);

  if (!pencereAcik) return null;

  const kopyala = () => {
    if (aktifOrtakSepet) {
      navigator.clipboard.writeText(aktifOrtakSepet.sepet_kodu);
      setKodKopyalandi(true);
      setTimeout(() => setKodKopyalandi(false), 2000);
    }
  };

  const sepetOlusturGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!olusturanAd.trim()) {
      alert('Lütfen adınızı giriniz');
      return;
    }
    await sepetOlustur(olusturanAd.trim());
  };

  const sepeteKatilGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!girilenKod.trim() || !katilimciAd.trim()) {
      alert('Lütfen sepet kodunu ve adınızı giriniz');
      return;
    }
    const basarili = await sepeteKatil(girilenKod.trim(), katilimciAd.trim());
    if (!basarili) {
      alert('Ortak sepet bulunamadı veya kod geçersiz!');
    }
  };

  const toplamTutar = ortakSepetElemanlari.reduce(
    (toplam: number, el: OrtakSepetElemani) => toplam + el.fiyat * el.adet,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Üst Başlık Barı */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-base text-white">Ortak Sepet (Grup Siparişi)</h3>
          </div>
          <button
            type="button"
            onClick={pencereKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {!aktifOrtakSepet ? (
            /* Aktif Ortak Sepet Yoksa: Oluştur veya Katıl */
            <div>
              {/* Sekme Butonları */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#2A102E] border border-[#521E5C] rounded-xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSekme('olustur')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    sekme === 'olustur'
                      ? 'bg-[#6D237A] text-white shadow-md'
                      : 'text-[#A872B5] hover:text-white'
                  }`}
                >
                  Yeni Sepet Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setSekme('katil')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    sekme === 'katil'
                      ? 'bg-[#6D237A] text-white shadow-md'
                      : 'text-[#A872B5] hover:text-white'
                  }`}
                >
                  Koda Göre Katıl
                </button>
              </div>

              {sekme === 'olustur' ? (
                <form onSubmit={sepetOlusturGonder} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1">
                      Adınız / Takma Adınız
                    </label>
                    <input
                      type="text"
                      value={olusturanAd}
                      onChange={(e) => setOlusturanAd(e.target.value)}
                      placeholder="Örn: Ahmet Ustam"
                      className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className="w-full mt-3 bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#DDAF53]" />
                    <span>{yukleniyor ? 'Oluşturuluyor...' : 'Ortak Sepet Oluştur ve Başlat'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={sepeteKatilGonder} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1">
                      Sepet Kodu (Örn: AFYON-4829)
                    </label>
                    <input
                      type="text"
                      value={girilenKod}
                      onChange={(e) => setGirilenKod(e.target.value)}
                      placeholder="AFYON-XXXX"
                      className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2.5 text-white placeholder-gray-500 uppercase tracking-widest focus:outline-none focus:border-[#DDAF53]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#CFA353] font-semibold mb-1">Adınız</label>
                    <input
                      type="text"
                      value={katilimciAd}
                      onChange={(e) => setKatilimciAd(e.target.value)}
                      placeholder="Örn: Mehmet"
                      className="w-full bg-[#2A102E] border border-[#521E5C] rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#DDAF53]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={yukleniyor}
                    className="w-full mt-3 bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-[#DDAF53]" />
                    <span>{yukleniyor ? 'Katılınıyor...' : 'Gruba Katıl'}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Aktif Ortak Sepet Varsa: Kod, Katılımcılar ve Eklenen Yemekler */
            <div className="space-y-4 text-xs">
              {/* Kod Paylaşım Kartı */}
              <div className="bg-[#2A102E] border border-[#521E5C] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#A872B5] font-medium uppercase tracking-wider">
                    Ortak Sepet Kodu
                  </div>
                  <div className="text-lg font-extrabold text-[#DDAF53] tracking-widest">
                    {aktifOrtakSepet.sepet_kodu}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={kopyala}
                  className="bg-[#4D1857] hover:bg-[#6D237A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#852C94] transition-all cursor-pointer"
                >
                  {kodKopyalandi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#DDAF53]" />}
                  <span>{kodKopyalandi ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
                </button>
              </div>

              {/* Katılımcılar */}
              <div>
                <div className="text-gray-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Gruptaki Kişiler ({katilimciListesi.length})</span>
                  <span className="text-[10px] text-[#A872B5]">Canlı Senkronize</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {katilimciListesi.map((k: OrtakSepetKatilimci) => (
                    <span
                      key={k.kimlik}
                      className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] flex items-center gap-1 ${
                        mevcutKatilimci?.kimlik === k.kimlik
                          ? 'bg-[#6D237A] border-[#DDAF53] text-white'
                          : 'bg-[#2A102E] border-[#521E5C] text-gray-300'
                      }`}
                    >
                      <Users className="w-3 h-3 text-[#DDAF53]" />
                      <span>{k.katilimci_adi}</span>
                      {mevcutKatilimci?.kimlik === k.kimlik && (
                        <span className="text-[9px] text-[#DDAF53] font-bold">(Siz)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Eklenen Yemekler Listesi */}
              <div className="border-t border-[#3E1646] pt-3">
                <h4 className="font-bold text-gray-200 mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#DDAF53]" />
                  <span>Grup Sepetindeki Yemekler</span>
                </h4>

                {ortakSepetElemanlari.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-[#521E5C] rounded-xl text-gray-400">
                    Henüz kimse sepete yemek eklemedi. Menüden yemek seçerek sepete ekleyin!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ortakSepetElemanlari.map((el: OrtakSepetElemani) => (
                      <div
                        key={el.kimlik}
                        className="bg-[#2A102E]/80 border border-[#521E5C] rounded-xl p-2.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{el.yemek_basligi}</div>
                          <div className="text-[10px] text-[#A872B5]">
                            Ekleğen: <span className="text-gray-200 font-semibold">{el.katilimci_adi}</span> • {el.adet} adet
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-[#DDAF53] text-xs">
                            {(el.fiyat * el.adet).toLocaleString('tr-TR')} ₺
                          </span>
                          {(mevcutKatilimci?.kimlik === el.katilimci_kimligi || true) && (
                            <button
                              type="button"
                              onClick={() => ortakSepettenYemekSil(el.kimlik)}
                              className="p-1 text-gray-400 hover:text-red-400 cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toplam Tutar & Çıkış */}
              <div className="border-t border-[#3E1646] pt-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-[#A872B5]">Grup Toplam Tutarı</div>
                  <div className="text-lg font-extrabold text-[#DDAF53]">
                    {toplamTutar.toLocaleString('tr-TR')} ₺
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={ortakSepettenCik}
                    className="bg-[#2A102E] hover:bg-red-950/60 text-red-300 border border-[#521E5C] hover:border-red-500 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Ayrıl</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
