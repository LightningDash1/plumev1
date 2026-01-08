import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { TransactionItem } from '@/components/TransactionItem';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { InsightCard } from '@/components/InsightCard';
import { SpendingCategories } from '@/components/SpendingCategories';
import { 
  mockTransactions, 
  mockSubscriptions,
  Category,
  getSpendingByCategory,
  formatCurrency,
  getCategoryLabel
} from '@/data/mockData';
import { cn } from '@/lib/utils';

type Tab = 'transactions' | 'subscriptions' | 'categories';
type Filter = 'all' | 'today' | 'week';

const filterLabels: Record<Filter, string> = {
  all: 'All',
  today: 'Today',
  week: 'This Week',
};

export const Expenses = () => {
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [filter, setFilter] = useState<Filter>('all');
  
  const categorySpending = getSpendingByCategory();
  const topCategory = Object.entries(categorySpending).reduce((a, b) => 
    a[1] > b[1] ? a : b
  );

  const filteredTransactions = mockTransactions.filter(t => {
    if (filter === 'all') return true;
    const today = new Date('2026-01-08');
    const txDate = new Date(t.date);
    if (filter === 'today') {
      return t.date === '2026-01-08';
    }
    if (filter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= weekAgo;
    }
    return true;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = tx.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, typeof mockTransactions>);

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2026-01-08');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const totalMonthlySubscriptions = mockSubscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Spending</h1>
        
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card rounded-xl shadow-soft">
          <button
            onClick={() => setActiveTab('transactions')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all",
              activeTab === 'transactions' 
                ? "gradient-primary text-primary-foreground shadow-primary" 
                : "text-muted-foreground"
            )}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all",
              activeTab === 'categories' 
                ? "gradient-primary text-primary-foreground shadow-primary" 
                : "text-muted-foreground"
            )}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all",
              activeTab === 'subscriptions' 
                ? "gradient-primary text-primary-foreground shadow-primary" 
                : "text-muted-foreground"
            )}
          >
            Subscriptions
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {activeTab === 'transactions' ? (
          <>
            {/* Insight */}
            <InsightCard 
              text={`Most spent on ${getCategoryLabel(topCategory[0] as Category)}: ${formatCurrency(topCategory[1])}`}
              emoji={topCategory[0] === 'food' ? '🍔' : topCategory[0] === 'entertainment' ? '🎮' : '🛍️'}
              variant="accent"
            />

            {/* Filters */}
            <div className="flex gap-2">
              {(Object.keys(filterLabels) as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                    filter === f 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card text-muted-foreground shadow-soft"
                  )}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {Object.entries(groupedTransactions)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, transactions]) => (
                  <div key={date}>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      {formatDateLabel(date)}
                    </p>
                    <div className="space-y-2">
                      {transactions.map(tx => (
                        <TransactionItem key={tx.id} transaction={tx} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : activeTab === 'categories' ? (
          <SpendingCategories />
        ) : (
          <>
            {/* Subscriptions Summary */}
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">Monthly subscriptions</p>
              <p className="text-3xl font-extrabold text-foreground">
                {formatCurrency(totalMonthlySubscriptions)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {mockSubscriptions.length} active subscriptions
              </p>
            </div>

            {/* Subscriptions List */}
            <div className="space-y-3">
              {mockSubscriptions.map(sub => (
                <SubscriptionCard key={sub.id} subscription={sub} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
