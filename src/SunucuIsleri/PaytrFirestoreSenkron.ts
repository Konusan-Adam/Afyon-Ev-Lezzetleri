import fs from 'fs';
import path from 'path';
import { PaytrIslemDurumu, PaytrOturumKaydi } from './PaytrDurumDeposu';

interface FirebaseRestAyar {
  projectId: string;
  firestoreDatabaseId: string;
  apiKey: string;
}

let onbellekAyar: FirebaseRestAyar | null = null;

function firebaseAyarOku(): FirebaseRestAyar | null {
  if (onbellekAyar) return onbellekAyar;
  try {
    const dosya = path.resolve(process.cwd(), 'firebase-applet-config.json');
    const icerik = JSON.parse(fs.readFileSync(dosya, 'utf8'));
    if (icerik?.projectId && icerik?.firestoreDatabaseId && icerik?.apiKey) {
      onbellekAyar = icerik;
      return onbellekAyar;
    }
  } catch {
    return null;
  }
  return null;
}

function belgeUrlOlustur(merchantOid: string): string | null {
  const ayar = firebaseAyarOku();
  if (!ayar) return null;
  const oid = encodeURIComponent(merchantOid);
  return `https://firestore.googleapis.com/v1/projects/${ayar.projectId}/databases/${ayar.firestoreDatabaseId}/documents/paytr_oturumlari/${oid}?key=${ayar.apiKey}`;
}

export async function paytrFirestoreKaydet(kayit: PaytrOturumKaydi): Promise<void> {
  const url = belgeUrlOlustur(kayit.merchantOid);
  if (!url) return;
  try {
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          merchantOid: { stringValue: kayit.merchantOid },
          durum: { stringValue: kayit.durum },
          tutarKurus: { integerValue: String(kayit.tutarKurus || 0) },
          demoMod: { booleanValue: Boolean(kayit.demoMod) },
          hataMesaji: { stringValue: kayit.hataMesaji || '' },
          guncellemeZamani: { integerValue: String(kayit.guncellemeZamani) },
        },
      }),
    });
  } catch {
    // Ağ veya kural hatasında yerel disk deposu devrede kalır
  }
}

export async function paytrFirestoreOku(merchantOid: string): Promise<PaytrOturumKaydi | null> {
  const url = belgeUrlOlustur(merchantOid);
  if (!url) return null;
  try {
    const yanit = await fetch(url);
    if (!yanit.ok) return null;
    const veri = await yanit.json();
    const f = veri?.fields;
    if (!f?.durum?.stringValue) return null;
    return {
      merchantOid: f.merchantOid?.stringValue || merchantOid,
      durum: f.durum.stringValue as PaytrIslemDurumu,
      tutarKurus: Number(f.tutarKurus?.integerValue || 0),
      demoMod: Boolean(f.demoMod?.booleanValue),
      hataMesaji: f.hataMesaji?.stringValue || undefined,
      guncellemeZamani: Number(f.guncellemeZamani?.integerValue || Date.now()),
    };
  } catch {
    return null;
  }
}
