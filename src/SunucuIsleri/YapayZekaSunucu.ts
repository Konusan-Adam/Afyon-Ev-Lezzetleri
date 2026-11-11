import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { afyonLezzetCevabiUret } from '../MalzemeCekmeceleri/YapayZekaDanismani/AfyonLezzetZekasi';

const router = Router();

let aiIstemcisi: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const anahtar = process.env.GEMINI_API_KEY?.trim();
  if (!aiIstemcisi && anahtar) {
    try {
      aiIstemcisi = new GoogleGenAI({
        apiKey: anahtar,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('[Gemini Başlatma Uyarısı]:', e);
      return null;
    }
  }
  return aiIstemcisi;
}

// Afyon Lezzet Danışmanı Yapay Zeka Sunucu Uç Noktası
router.post('/lezzet-danismani', async (req, res) => {
  const { mesaj, gecmis = [], mevcutYemekler = [] } = req.body;
  if (!mesaj || typeof mesaj !== 'string') {
    return res.status(400).json({ basarili: false, hata: 'Mesaj metni gereklidir.' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const apiAnahtariGecerliMi = Boolean(
    geminiApiKey &&
    geminiApiKey.length > 10 &&
    !geminiApiKey.includes('TODO') &&
    !geminiApiKey.includes('your_') &&
    !geminiApiKey.includes('PLACEHOLDER')
  );

  if (!apiAnahtariGecerliMi) {
    return res.json({
      basarili: true,
      cevap: afyonLezzetCevabiUret(mesaj, mevcutYemekler)
    });
  }

  try {
    const saat = new Date().getHours();
    let vakit = 'gündüz';
    if (saat >= 7 && saat < 11.5) vakit = 'sabah kahvaltısı';
    else if (saat >= 11.5 && saat < 15.5) vakit = 'öğle tencere yemekleri';
    else if (saat >= 15.5 && saat < 18) vakit = 'ikindi çayı ve fırın lezzetleri';
    else if (saat >= 18 && saat < 21.5) vakit = 'akşam sofrası ziyafeti';
    else vakit = 'gece servisi';

    const menuMetni = Array.isArray(mevcutYemekler) && mevcutYemekler.length > 0
      ? mevcutYemekler.map((y: any) => `- ${y.baslik} (${y.kategori || 'Genel'}, ${y.fiyat} ₺${typeof y.kalan_stok === 'number' ? ', Kalan Stok: ' + y.kalan_stok : ''})`).join('\n')
      : 'Şu an sistemde güncellenen taze fırın yemekleri';

    const sistemTalimati = `Sen "Afyon Ev Lezzetleri" dükkanının kırk yıllık tecrübeye sahip, hürmetkâr ve dürüst başgarsonusun.
Şu anki vakit: ${vakit}.

KESİN KURALLAR:
1. Müşteriye hitap ederken, SAKIN "Hayırlı geceler", "İyi günler" gibi sistem tarafından dayatılan veya daha önce duyduğun kalıplaşmış, ruhsuz selamlamaları kullanma.
2. Müşteriyi tanıdığına dair hafızayı (varsa ismen hitap) kullan ve o ana özel, sanki o an dükkanın kapısından içeri girmiş birine dertleşir gibi doğal, taze bir selam ver.
3. "Şu an mutfakta şunlar var" diyerek canlı menüyü dürüstçe sun. 
4. ASLA SİSTEMDEN GELEN HAZIR METİNLERİ KULLANMA, KENDİ DOĞAL CÜMLELERİNİ KUR.

MUTFAKTAKİ CANLI AKTİF YEMEKLERİMİZ LİSTESİ:
${menuMetni}

KESİN KURALLAR VE AKILLI ESNAF UZMANLIĞIN:
1. SADECE VE SADECE yukarıdaki listede yer alan yemekleri önerebilirsin. Listede OLMAYAN hiçbir yemeği asla menüde var gibi söyleme veya uydurma!
2. Müşteri menüde OLMAYAN bir yemek sorduğunda, dürüstçe olmadığını belirtip şeffaf ol.
3. Müşteri diyet, hafif, kalori, vegan, vejetaryen veya gluten sorduğunda ürün içeriklerine göre akıllı ve dürüst teknik bilgi ver.
4. Müşteri tarif veya içindekiler sorduğunda dükkanın ev yapımı hakiki malzemelerini iştah kabartıcı bir dille anlat.
5. Cevabın 2-3 cümleyi geçmesin, net, dürüst ve iştah açıcı olsun.`;

    const icerikListesi: any[] = [];
    if (Array.isArray(gecmis)) {
      for (const item of gecmis.slice(-6)) {
        if (item && item.icerik) {
          icerikListesi.push({
            role: item.rol === 'asistan' ? 'model' : 'user',
            parts: [{ text: item.icerik }]
          });
        }
      }
    }
    icerikListesi.push({
      role: 'user',
      parts: [{ text: mesaj }]
    });

    const istemci = getAiClient();
    if (!istemci) {
      return res.json({
        basarili: true,
        cevap: afyonLezzetCevabiUret(mesaj, mevcutYemekler)
      });
    }

    const yanit = await istemci.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: icerikListesi,
      config: {
        systemInstruction: sistemTalimati,
        temperature: 0.7,
      }
    });

    const cevapMetni = yanit.text || 'Değerli Misafirimiz, şu an sistemde bir yoğunluk var, lütfen tekrar deneyin.';

    return res.json({
      basarili: true,
      cevap: cevapMetni
    });
  } catch (hata: any) {
    console.warn('[Lezzet Danışmanı]: Dinamik veritabanı motoru devreye girdi.');
    return res.json({
      basarili: true,
      cevap: afyonLezzetCevabiUret(mesaj, mevcutYemekler)
    });
  }
});

export default router;
