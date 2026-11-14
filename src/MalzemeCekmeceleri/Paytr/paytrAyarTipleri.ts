export interface PaytrCanliAyarlari {
  onlineOdemeAktif: boolean;
  testModu: boolean;
  taksitAktif: boolean;
  maksimumTaksit: number;
  demoSimulasyonAktif: boolean;
}

export const VARSAYILAN_PAYTR_AYARLARI: PaytrCanliAyarlari = {
  onlineOdemeAktif: true,
  testModu: true,
  taksitAktif: false,
  maksimumTaksit: 3,
  demoSimulasyonAktif: true,
};
