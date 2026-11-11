import React from 'react';
import { X, MapPin, Plus, Check, Trash2, Home, Briefcase, Compass } from 'lucide-react';
import { teslimatHafizasiKullan } from '@/src/OrtakHavuz/TeslimatHafizasi';
import { MusteriAdresi } from '@/src/veritabani/VeriTipleri';

export const AdresSecimPenceresi: React.FC = () => {
  const {
    adresSecimPenceresiAcik,
    adresSecimPenceresiKapat,
    seciliAdres,
    adresListesi,
    yukleniyor,
    seciliAdresAyarla,
    haritaPenceresiAc,
    adresSil,
  } = teslimatHafizasiKullan();

  const [silinenAdresId, setSilinenAdresId] = React.useState<string | null>(null);

  if (!adresSecimPenceresiAcik) return null;

  const adresSimgesiGetir = (baslik: string) => {
    if (baslik.toLowerCase().includes('ev')) return <Home className="w-4 h-4 text-[#DDAF53]" />;
    if (baslik.toLowerCase().includes('iş') || baslik.toLowerCase().includes('is'))
      return <Briefcase className="w-4 h-4 text-[#DDAF53]" />;
    return <MapPin className="w-4 h-4 text-[#DDAF53]" />;
  };

  const adresiSecVeKapat = async (adres: MusteriAdresi) => {
    await seciliAdresAyarla(adres);
    adresSecimPenceresiKapat();
  };

  const adresiSil = async (e: React.MouseEvent, adresKimligi: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!adresKimligi || silinenAdresId === adresKimligi) return;

    setSilinenAdresId(adresKimligi);
    try {
      await adresSil(adresKimligi);
    } catch (hata) {
      console.error('Adres silme hatası:', hata);
    } finally {
      setSilinenAdresId(null);
    }
  };

  const yeniAdresHaritadanEkle = () => {
    adresSecimPenceresiKapat();
    haritaPenceresiAc();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#180A1F] border border-[#521E5C] text-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Üst Başlık Barı */}
        <div className="p-4 border-b border-[#3E1646] bg-[#1A0A1D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#DDAF53]" />
            <h3 className="font-bold text-base text-white">Teslimat Adresi Seçin</h3>
          </div>
          <button
            type="button"
            onClick={adresSecimPenceresiKapat}
            className="w-8 h-8 rounded-full bg-[#2A102E] hover:bg-[#4D1857] text-[#CFA353] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#521E5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Adres Listesi */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {yukleniyor ? (
            <div className="text-center py-8 text-xs text-[#A872B5]">
              Kayıtlı adresleriniz Firebase veritabanından getiriliyor...
            </div>
          ) : adresListesi.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-[#521E5C] rounded-xl bg-[#2A102E]/40">
              <Compass className="w-10 h-10 text-[#DDAF53] mx-auto mb-2 opacity-80" />
              <h4 className="font-bold text-sm text-white mb-1">Kayıtlı Adresiniz Bulunmuyor</h4>
              <p className="text-xs text-[#A872B5] mb-4">
                Sipariş verebilmek için lütfen haritadan ilk adresinizi ekleyin.
              </p>
            </div>
          ) : (
            adresListesi.map((adres: MusteriAdresi) => {
              const aktif = seciliAdres?.kimlik === adres.kimlik;
              return (
                <div
                  key={adres.kimlik}
                  onClick={() => adresiSecVeKapat(adres)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    aktif
                      ? 'bg-[#3D1843] border-[#DDAF53] shadow-md'
                      : 'bg-[#2A102E]/80 border-[#521E5C] hover:bg-[#321338] hover:border-[#6D237A]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 rounded-lg bg-[#180A1F] border border-[#521E5C]">
                      {adresSimgesiGetir(adres.adres_basligi || adres.baslik || 'Ev')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{adres.adres_basligi || adres.baslik}</span>
                        {aktif && (
                          <span className="bg-[#DDAF53] text-[#130713] text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                            SEÇİLİ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                        {adres.mahalle} {adres.cadde_sokak} No:{adres.bina_no} D:{adres.daire_no} {adres.ilce}/{adres.il}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {aktif && <Check className="w-4 h-4 text-[#DDAF53]" />}
                    <button
                      type="button"
                      onClick={(e) => adresiSil(e, adres.kimlik || adres.id || '')}
                      disabled={silinenAdresId === (adres.kimlik || adres.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-all cursor-pointer"
                      title="Adresi Sil"
                    >
                      {silinenAdresId === (adres.kimlik || adres.id) ? (
                        <span className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Alt Buton: Haritadan Yeni Adres Ekle */}
        <div className="p-4 border-t border-[#3E1646] bg-[#1A0A1D]">
          <button
            type="button"
            onClick={yeniAdresHaritadanEkle}
            className="w-full bg-[#6D237A] hover:bg-[#852C94] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#9633A7] shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#DDAF53]" />
            <span>+ Haritadan Yeni Adres Ekle</span>
          </button>
        </div>

      </div>
    </div>
  );
};
