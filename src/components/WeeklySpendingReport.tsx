import { Card } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { categoryInfo, formatCurrency, Category } from '@/data/mockData';
import { TrendingUp, TrendingDown, PiggyBank, ShoppingBag } from 'lucide-react';

export const WeeklySpendingReport = () => {
  const { transactions, getWeeklySpending, getNeedVsWant, getSpendingByCategory } = useTransactions();

  const weeklySpending = getWeeklySpending();
  const { needs, wants } = getNeedVsWant();
  const spending = getSpendingByCategory();

  const today = new Date();
  const lastWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const lastWeekSpending = transactions
    .filter(t => { const d = new Date(t.date); return d >= lastWeekStart && d < lastWeekEnd; })
    .reduce((sum, t) => sum + t.amount, 0);

  const spendingChange = lastWeekSpending > 0
    ? ((weeklySpending - lastWeekSpending) / lastWeekSpending * 100).toFixed(0)
    : 0;

  const isSpendingUp = Number(spendingChange) > 0;

  const topCategories = Object.entries(spending)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const total = needs + wants;
  const wantsPercent = total > 0 ? Math.round((wants / total) * 100) : 0;
  const needsPercent = 100 - wantsPercent;

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">📊 Weekly Report</h3>
        <span className="text-xs text-muted-foreground">This week</span>
      </div>

      <div className="bg-muted/50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(weeklySpending)}</p>
          </div>
          {lastWeekSpending > 0 && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isSpendingUp ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success'}`}>
              {isSpendingUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(Number(spendingChange))}%
            </div>
          )}
        </div>
        {lastWeekSpending > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{isSpendingUp ? 'More than' : 'Less than'} last week</p>
        )}
      </div>

      {total > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Need vs Want</p>
          <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-muted">
            <div className="bg-primary rounded-full transition-all duration-500" style={{ width: `${needsPercent}%` }} />
            <div className="bg-accent rounded-full transition-all duration-500" style={{ width: `${wantsPercent}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1 text-primary"><PiggyBank className="w-3 h-3" /> Needs {needsPercent}%</span>
            <span className="flex items-center gap-1 text-accent"><ShoppingBag className="w-3 h-3" /> Wants {wantsPercent}%</span>
          </div>
        </div>
      )}

      {topCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Top Categories</p>
          <div className="space-y-2">
            {topCategories.map(([cat, amount]) => {
              const category = cat as Category;
              const info = categoryInfo[category];
              const percent = weeklySpending > 0 ? Math.round((amount / weeklySpending) * 100) : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg">{info.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{info.label}</span>
                      <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary/60 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-success-soft rounded-xl p-3 text-center">
        <p className="text-sm text-success font-medium">
          {weeklySpending === 0
            ? "📝 Start logging expenses to see your weekly report!"
            : needsPercent >= 50
            ? "🌟 Great balance! You're prioritizing needs well."
            : wantsPercent > 70
            ? "💡 Try shifting a bit more towards needs this week!"
            : "👍 You're doing great! Keep it up!"}
        </p>
      </div>
    </Card>
  );
};
