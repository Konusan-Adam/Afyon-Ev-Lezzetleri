import React from 'react';
import { TemaSaglayici } from './OrtakHavuz/TemaHafizasi';
import { AramaVeFiltreSaglayici } from './OrtakHavuz/AramaVeFiltreHafizasi';
import { KullaniciSaglayici } from './OrtakHavuz/KullaniciHafizasi';
import { FavoriSaglayici } from './OrtakHavuz/FavoriHafizasi';
import { SepetSaglayici } from './OrtakHavuz/SepetHafizasi';
import { OrtakSepetSaglayici } from './OrtakHavuz/OrtakSepetHafizasi';
import { SepetSaglayici as OrtakHavuzSepetSaglayici } from './OrtakHavuz/SepetHavuzu';
import { TeslimatSaglayici } from './OrtakHavuz/TeslimatHafizasi';
import { OzelOzelliklerSaglayici } from './OrtakHavuz/OzelOzelliklerHafizasi';
import { OnSiparisSaglayici } from './OrtakHavuz/OnSiparisHafizasi';
import { OtomatikYedeklemeServisi } from './OrtakHavuz/OtomatikYedeklemeServisi';
import { OturumZamanlayicisiServisi } from './OrtakHavuz/OturumZamanlayicisiServisi';
import { AnaSayfaVitrini } from './VitrinOdasi/AnaSayfaVitrini';

export default function App() {
  return (
    <TemaSaglayici>
      <AramaVeFiltreSaglayici>
        <KullaniciSaglayici>
          <FavoriSaglayici>
            <OrtakHavuzSepetSaglayici>
              <SepetSaglayici>
                <TeslimatSaglayici>
                  <OrtakSepetSaglayici>
                    <OzelOzelliklerSaglayici>
                      <OnSiparisSaglayici>
                        <OtomatikYedeklemeServisi />
                        <OturumZamanlayicisiServisi />
                        <AnaSayfaVitrini />
                      </OnSiparisSaglayici>
                    </OzelOzelliklerSaglayici>
                  </OrtakSepetSaglayici>
                </TeslimatSaglayici>
              </SepetSaglayici>
            </OrtakHavuzSepetSaglayici>
          </FavoriSaglayici>
        </KullaniciSaglayici>
      </AramaVeFiltreSaglayici>
    </TemaSaglayici>
  );
}
