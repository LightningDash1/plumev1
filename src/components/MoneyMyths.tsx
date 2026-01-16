import { moneyMyths } from '@/data/mockData';
import { XCircle, CheckCircle } from 'lucide-react';

export const MoneyMyths = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Let's bust some common money myths! 💪
      </p>
      
      {moneyMyths.map((myth) => (
        <div 
          key={myth.id}
          className="bg-card rounded-2xl p-4 shadow-soft space-y-3"
        >
          {/* Myth */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Myth</p>
              <p className="font-semibold text-foreground">"{myth.myth}"</p>
            </div>
          </div>

          {/* Reality */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs font-semibold text-success uppercase tracking-wider">Reality</p>
              <p className="text-sm text-muted-foreground">{myth.reality}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl">{myth.emoji}</span>
          </div>
        </div>
      ))}
    </div>
  );
};