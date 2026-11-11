import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { hukukiSozlesmeleriGetir } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/hukukDeposu';
import { SozlesmeTuru } from '@/src/MalzemeCekmeceleri/HukukVeSozlesmeler/tipler';

interface SozlesmePenceresiProps {
  tur: SozlesmeTuru | null;
  acikMi: boolean;
  onKapat: () => void;
  onOnayla?: (tur: SozlesmeTuru) => void;
  onayButonuGoster?: boolean;
}

export const SozlesmePenceresi: React.FC<SozlesmePenceresiProps> = ({
  tur,
  acikMi,
  onKapat,
  onOnayla,
  onayButonuGoster = true
}) => {
  const [kaydirildiMi, setKaydirildiMi] = useState(false);

  if (!acikMi || !tur) return null;

  const tumSozlesmeler = hukukiSozlesmeleriGetir();
  const sozlesme = tumSozlesmeler[tur];

  if (!sozlesme) return null;

  const kaydirmaKontrol = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Kullanıcı en az %80 aşağı kaydırdıysa onay butonunu parlat
    if (scrollTop + clientHeight >= scrollHeight - 40) {
      setKaydirildiMi(true);
    }
  };

  const onaylaVeKapat = () => {
    if (onOnayla) {
      onOnayla(tur);
    }
    onKapat();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A081D] border border-[#521E5C] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Başlık Barı */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D1445] bg-[#240C28]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#521E5C]/60 flex items-center justify-center border border-[#7B258B]">
              <FileText className="w-5 h-5 text-[#DDAF53]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{sozlesme.baslik}</h3>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                <span className="text-[#DDAF53]">Versiyon {sozlesme.versiyon}</span>
                <span>•</span>
                <span>Son Güncelleme: {sozlesme.guncellenmeTarihi}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onKapat}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sözleşme Metni (Kaydırılabilir Alan) */}
        <div
          onScroll={kaydirmaKontrol}
          className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-gray-300 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-[#521E5C] scrollbar-track-transparent select-text"
        >
          <div className="bg-[#2A0F30]/60 p-3.5 rounded-2xl border border-[#521E5C]/50 text-[11px] text-amber-200/90 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              6502 Sayılı Tüketicinin Korunması Kanunu ve KVKK mevzuatına uygun olarak hazırlanmış resmi sözleşme metnidir.
            </span>
          </div>

          <div className="whitespace-pre-line font-mono text-[11.5px] text-gray-200 bg-[#120514] p-4 rounded-2xl border border-[#3D1445]">
            {sozlesme.icerik}
          </div>
        </div>

        {/* Alt Butonlar ve Onay Barı */}
        <div className="p-4 border-t border-[#3D1445] bg-[#240C28] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <ChevronDown className="w-3.5 h-3.5 text-[#DDAF53] animate-bounce" />
            <span>Sözleşmeyi okuyup onaylayarak işleme devam edebilirsiniz.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onKapat}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 text-xs font-semibold cursor-pointer"
            >
              Kapat
            </button>
            {onayButonuGoster && (
              <button
                onClick={onaylaVeKapat}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Okudum, Kabul Ediyorum</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
