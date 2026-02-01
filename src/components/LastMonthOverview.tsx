import { Card } from '@/components/ui/card';
import { 
  mockTransactions, 
  categoryInfo, 
  formatCurrency,
  Category
} from '@/data/mockData';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Helper to get last month's date range
const getLastMonthRange = () => {
  const now = new Date();
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start: firstDayLastMonth, end: lastDayLastMonth };
};

// Helper to get current month's date range
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start: firstDayThisMonth, end: now };
};

// Get transactions for a date range
const getTransactionsInRange = (start: Date, end: Date) => {
  return mockTransactions.filter(t => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });
};

// Get spending by category for transactions
const getSpendingByCategory = (transactions: typeof mockTransactions): Record<Category, number> => {
  const spending: Record<Category, number> = {
    food: 0,
    entertainment: 0,
    transport: 0,
    shopping: 0,
    subscription: 0,
    education: 0,
    other: 0,
  };
  
  transactions.forEach(t => {
    spending[t.category] += t.amount;
  });
  
  return spending;
};

// Category colors for the pie chart
const categoryColors: Record<Category, string> = {
  food: 'hsl(25, 95%, 53%)',
  entertainment: 'hsl(280, 80%, 60%)',
  transport: 'hsl(200, 90%, 50%)',
  shopping: 'hsl(330, 80%, 55%)',
  subscription: 'hsl(170, 70%, 45%)',
  education: 'hsl(45, 90%, 50%)',
  other: 'hsl(0, 0%, 60%)',
};

export const LastMonthOverview = () => {
  const lastMonthRange = getLastMonthRange();
  const currentMonthRange = getCurrentMonthRange();
  
  const lastMonthTransactions = getTransactionsInRange(lastMonthRange.start, lastMonthRange.end);
  const currentMonthTransactions = getTransactionsInRange(currentMonthRange.start, currentMonthRange.end);
  
  const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const lastMonthSpending = getSpendingByCategory(lastMonthTransactions);
  
  // Get top 3 categories
  const topCategories = Object.entries(lastMonthSpending)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Prepare pie chart data
  const chartData = Object.entries(lastMonthSpending)
    .filter(([_, amount]) => amount > 0)
    .map(([cat, amount]) => ({
      name: categoryInfo[cat as Category].label,
      value: amount,
      category: cat as Category,
      fill: categoryColors[cat as Category],
    }));
  
  // Calculate difference
  const difference = currentMonthTotal - lastMonthTotal;
  const percentChange = lastMonthTotal > 0 
    ? Math.round((difference / lastMonthTotal) * 100)
    : 0;
  
  // Format month name
  const lastMonthName = lastMonthRange.start.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const currentMonthName = currentMonthRange.start.toLocaleDateString('en-IN', { month: 'long' });

  const chartConfig: ChartConfig = {
    value: { label: 'Amount' },
  };

  // Empty state
  if (lastMonthTransactions.length === 0) {
    return (
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Last Month Overview</h3>
        </div>
        <div className="bg-muted/50 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-muted-foreground font-medium">No spending data for {lastMonthName}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Keep logging your expenses and check back next month!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">Last Month Overview</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {lastMonthName}
        </span>
      </div>

      {/* Total Spending & Comparison */}
      <div className="bg-muted/50 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(lastMonthTotal)}</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
            difference > 0 
              ? 'bg-warning-soft text-warning' 
              : difference < 0 
                ? 'bg-success-soft text-success'
                : 'bg-muted text-muted-foreground'
          }`}>
            {difference > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : difference < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            {Math.abs(percentChange)}%
          </div>
        </div>
        
        {/* Comparison */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{currentMonthName} so far:</span>
            <span className="font-semibold text-foreground">{formatCurrency(currentMonthTotal)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {difference > 0 
              ? `You're spending ${formatCurrency(Math.abs(difference))} more this month`
              : difference < 0
                ? `You're spending ${formatCurrency(Math.abs(difference))} less this month 🎉`
                : 'On track with last month'}
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Where it went</p>
          <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => (
                      <span className="font-medium">{formatCurrency(value as number)}</span>
                    )}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {chartData.slice(0, 4).map((item) => (
              <div key={item.category} className="flex items-center gap-1.5 text-xs">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground">{categoryInfo[item.category].label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Categories */}
      {topCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Top Spending</p>
          <div className="space-y-2">
            {topCategories.map(([cat, amount], index) => {
              const category = cat as Category;
              const info = categoryInfo[category];
              const percent = Math.round((amount / lastMonthTotal) * 100);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground flex items-center gap-1.5">
                        {info.emoji} {info.label}
                      </span>
                      <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percent}%`,
                          backgroundColor: categoryColors[category]
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Insight */}
      <div className="bg-primary/10 rounded-xl p-3 text-center">
        <p className="text-sm text-primary font-medium">
          {topCategories.length > 0 
            ? `💡 ${categoryInfo[topCategories[0][0] as Category].label} was your biggest expense last month`
            : '📝 Start tracking to see insights!'}
        </p>
      </div>
    </Card>
  );
};
