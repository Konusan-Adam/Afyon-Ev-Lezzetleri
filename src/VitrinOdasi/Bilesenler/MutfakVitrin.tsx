import React from 'react';
import { ChefHat } from 'lucide-react';
import { useMutfaklar } from '@/src/MalzemeCekmeceleri/MutfakCekmecesi';
import { MutfakKarti } from './MutfakKarti';

export const MutfakVitrin: React.FC = () => {
  const { mutfaklar, yukleniyor } = useMutfaklar();

  if (yukleniyor) {
    return <div className="text-center py-8 text-stone-500 text-sm">Mutfaklar yükleniyor...</div>;
  }

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <ChefHat className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-bold text-stone-900">Usta Karahisar Ev Mutfakları</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mutfaklar.map((mutfak) => (
          <MutfakKarti key={mutfak.id} mutfak={mutfak} />
        ))}
      </div>
    </section>
  );
};
