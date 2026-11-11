import { auth } from './FirebaseIstemcisi';

export enum IslemTipi {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreHataBilgisi {
  error: string;
  operationType: IslemTipi;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function firestoreHatasiniYonet(
  hata: unknown,
  islemTipi: IslemTipi,
  yol: string | null
): never {
  const aktifKullanici = auth?.currentUser;
  const hataDetayi: FirestoreHataBilgisi = {
    error: hata instanceof Error ? hata.message : String(hata),
    authInfo: {
      userId: aktifKullanici?.uid ?? null,
      email: aktifKullanici?.email ?? null,
      emailVerified: aktifKullanici?.emailVerified ?? null,
      isAnonymous: aktifKullanici?.isAnonymous ?? null,
      tenantId: aktifKullanici?.tenantId ?? null,
      providerInfo: aktifKullanici?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType: islemTipi,
    path: yol,
  };

  const hataMetni = JSON.stringify(hataDetayi);
  console.error('Firestore Error: ', hataMetni);
  throw new Error(hataMetni);
}
