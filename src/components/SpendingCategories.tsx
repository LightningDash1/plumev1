import { Category, categoryInfo, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SpendingCategoriesProps {
  getSpendingByCategory: () => Record<Category, number>;
}

export const SpendingCategories = ({ getSpendingByCategory }: SpendingCategoriesProps) => {
  const spending = getSpendingByCategory();
  const totalSpending = Object.values(spending).reduce((sum, val) => sum + val, 0);

  const sortedCategories = (Object.entries(spending) as [Category, number][])
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Spending Categories</h2>
        <span className="text-sm text-muted-foreground">All time</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedCategories.map(([category, amount]) => {
          const info = categoryInfo[category];
          const percentage = totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0;
          return (
            <div key={category} className="bg-card rounded-2xl p-4 shadow-soft animate-fade-in hover:scale-[1.02] transition-transform">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3", info.color)}>
                {info.emoji}
              </div>
              <p className="font-semibold text-foreground text-sm truncate">{info.label}</p>
              <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(amount)}</p>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
            </div>
          );
        })}
      </div>

      {sortedCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-4xl mb-2">📊</p>
          <p>No spending yet</p>
        </div>
      )}
    </div>
  );
};
