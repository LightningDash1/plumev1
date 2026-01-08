import { mockTransactions } from '@/data/mockData';
import { cn } from '@/lib/utils';

export const SpendingChart = () => {
  // Get last 7 days of spending
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  
  const dailySpending = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const total = mockTransactions
      .filter(t => t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      day: days[date.getDay()],
      amount: total,
      isToday: i === 6,
    };
  });

  const maxSpending = Math.max(...dailySpending.map(d => d.amount), 1);

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">This Week</h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {dailySpending.map((day, index) => {
          const height = day.amount > 0 ? Math.max((day.amount / maxSpending) * 100, 8) : 8;
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div 
                className={cn(
                  "w-full rounded-lg transition-all duration-300",
                  day.isToday 
                    ? "gradient-primary" 
                    : day.amount > 0 
                      ? "bg-primary/30" 
                      : "bg-secondary"
                )}
                style={{ height: `${height}%` }}
              />
              <span className={cn(
                "text-xs font-medium",
                day.isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
