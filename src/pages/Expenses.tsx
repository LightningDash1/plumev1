import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { TransactionItem } from '@/components/TransactionItem';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { InsightCard } from '@/components/InsightCard';
import { SpendingCategories } from '@/components/SpendingCategories';
import { AddSubscriptionSheet } from '@/components/AddSubscriptionSheet';
import { useTransactions } from '@/hooks/useTransactions';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Category, getCategoryLabel, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tab = 'transactions' | 'subscriptions' | 'categories';
type Filter = 'all' | 'today' | 'week';

const filterLabels: Record<Filter, string> = {
  all: 'All',
  today: 'Today',
  week: 'This Week',
};

export const Expenses = () => {
  const { transactions, getSpendingByCategory, loading: txLoading } = useTransactions();
  const { subscriptions, getMonthlyTotal, addSubscription, deleteSubscription, loading: subLoading } = useSubscriptions();
  const [activeTab, setActiveTab] = useState<Tab>('transactions');
  const [filter, setFilter] = useState<Filter>('all');
  const [showAddSub, setShowAddSub] = useState(false);

  const categorySpending = getSpendingByCategory();
  const topCategory = Object.entries(categorySpending).reduce((a, b) => a[1] > b[1] ? a : b, ['other', 0] as [string, number]);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    const today = new Date();
    const txDate = new Date(t.date);
    if (filter === 'today') return t.date === today.toISOString().split('T')[0];
    if (filter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= weekAgo;
    }
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = tx.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, typeof filteredTransactions>);

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const loading = txLoading || subLoading;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-hero px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Your Spending</h1>
        <div className="flex gap-1 p-1 bg-card rounded-xl shadow-soft">
          {(['transactions', 'categories', 'subscriptions'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all capitalize",
                activeTab === tab ? "gradient-primary text-primary-foreground shadow-primary" : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : activeTab === 'transactions' ? (
          <>
            {topCategory[1] > 0 && (
              <InsightCard
                text={`Most spent on ${getCategoryLabel(topCategory[0] as Category)}: ${formatCurrency(topCategory[1] as number)}`}
                emoji={topCategory[0] === 'food' ? '🍔' : topCategory[0] === 'entertainment' ? '🎮' : '🛍️'}
                variant="accent"
              />
            )}

            <div className="flex gap-2">
              {(Object.keys(filterLabels) as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-semibold text-sm transition-all",
                    filter === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-soft"
                  )}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">📝</p>
                <p className="text-muted-foreground">No transactions yet. Add your first expense!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedTransactions)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, txs]) => (
                    <div key={date}>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">{formatDateLabel(date)}</p>
                      <div className="space-y-2">
                        {txs.map(tx => <TransactionItem key={tx.id} transaction={tx} />)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : activeTab === 'categories' ? (
          <SpendingCategories getSpendingByCategory={getSpendingByCategory} />
        ) : (
          <>
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">Monthly subscriptions</p>
              <p className="text-3xl font-extrabold text-foreground">{formatCurrency(Math.round(getMonthlyTotal()))}</p>
              <p className="text-sm text-muted-foreground mt-1">{subscriptions.filter(s => s.is_active).length} active subscriptions</p>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">📱</p>
                <p className="text-muted-foreground">No subscriptions yet. Add your recurring expenses!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map(sub => (
                  <SubscriptionCard key={sub.id} subscription={sub} onDelete={deleteSubscription} />
                ))}
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => setShowAddSub(true)}>
              <Plus className="w-5 h-5" /> Add Subscription
            </Button>

            <AddSubscriptionSheet open={showAddSub} onOpenChange={setShowAddSub} onAdd={addSubscription} />
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
};
