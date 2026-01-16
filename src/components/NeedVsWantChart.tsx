import { getNeedVsWantSpending, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const NeedVsWantChart = () => {
  const { needs, wants } = getNeedVsWantSpending();
  const total = needs + wants;
  
  if (total === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-soft">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Need vs Want</h3>
        <p className="text-center text-muted-foreground py-4">No data yet this week</p>
      </div>
    );
  }

  const needPercent = Math.round((needs / total) * 100);
  const wantPercent = 100 - needPercent;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">Need vs Want</h3>
      
      {/* Progress Bar */}
      <div className="h-4 bg-secondary rounded-full overflow-hidden flex mb-4">
        <div 
          className="bg-primary transition-all duration-500"
          style={{ width: `${needPercent}%` }}
        />
        <div 
          className="bg-accent transition-all duration-500"
          style={{ width: `${wantPercent}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Needs 🎯</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(needs)} ({needPercent}%)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">Wants 🎮</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(wants)} ({wantPercent}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};