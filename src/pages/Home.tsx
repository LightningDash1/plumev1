import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { InsightCard } from '@/components/InsightCard';
import { SpendingChart } from '@/components/SpendingChart';
import { SpendingAdvisor } from '@/components/SpendingAdvisor';
import { QuickAddExpense } from '@/components/QuickAddExpense';
import { NeedVsWantChart } from '@/components/NeedVsWantChart';
import { MicroInsights } from '@/components/MicroInsights';
import { SpendingStreak } from '@/components/SpendingStreak';
import { TransactionItem } from '@/components/TransactionItem';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatCurrency } from '@/data/mockData';
import { ArrowRight, Bell, User } from 'lucide-react';

export const Home = () => {
  const { profile } = useAuth();
  const { transactions, getTodaySpending, getWeeklySpending, getMonthlySpending, addTransaction, getNeedVsWant, getSpendingByCategory, getLastMonthSpending, loading } = useTransactions();
  const { subscriptions } = useSubscriptions();
  const [refreshKey, setRefreshKey] = useState(0);

  const todaySpending = getTodaySpending();
  const weeklySpending = getWeeklySpending();
  const monthlySpending = getMonthlySpending();

  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);

  const getDaysUntil = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const urgentSubs = subscriptions.filter(s => s.is_active && getDaysUntil(s.renewal_date) <= 3 && getDaysUntil(s.renewal_date) >= 0);

  const generateInsight = () => {
    const foodToday = todayTransactions.filter(t => t.category === 'food').reduce((s, t) => s + t.amount, 0);
    if (foodToday > 200) return { text: `You spent ${formatCurrency(foodToday)} on food today`, emoji: '🍔' };
    if (todaySpending === 0) return { text: 'No spending today - great job saving!', emoji: '🎉' };
    return { text: `Today's total: ${formatCurrency(todaySpending)}`, emoji: '💰' };
  };

  const insight = generateInsight();

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground font-medium">Good morning 👋</p>
            <h1 className="text-2xl font-bold text-foreground">{profile?.name || 'Friend'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <SpendingStreak key={refreshKey} />
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full bg-card/50">
                <User className="w-5 h-5 text-foreground" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-elevated">
          <p className="text-sm text-muted-foreground font-medium mb-1">Today's Spending</p>
          <p className="text-4xl font-extrabold text-foreground mb-4">{formatCurrency(todaySpending)}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div><span>This week: </span><span className="font-bold text-foreground">{formatCurrency(weeklySpending)}</span></div>
            <div><span>This month: </span><span className="font-bold text-foreground">{formatCurrency(monthlySpending)}</span></div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        <MicroInsights
          key={refreshKey}
          transactions={transactions}
          getNeedVsWant={getNeedVsWant}
          getSpendingByCategory={getSpendingByCategory}
          getWeeklySpending={getWeeklySpending}
        />

        <InsightCard text={insight.text} emoji={insight.emoji} />

        {urgentSubs.length > 0 && (
          <Link to="/expenses" className="block">
            <div className="bg-warning-soft rounded-2xl p-4 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{urgentSubs[0].name} renews soon!</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(urgentSubs[0].amount)} in {getDaysUntil(urgentSubs[0].renewal_date)} days</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        )}

        <NeedVsWantChart key={refreshKey} getNeedVsWant={getNeedVsWant} />

        <SpendingChart transactions={transactions} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Today's Activity</h2>
            <Link to="/expenses">
              <Button variant="ghost" size="sm" className="text-primary">See all <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="space-y-2">
            {todayTransactions.length > 0 ? todayTransactions.slice(0, 3).map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            )) : (
              <div className="bg-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">No spending today yet 🎉</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickAddExpense onExpenseAdded={handleExpenseAdded} addTransaction={addTransaction} />
      <SpendingAdvisor />
      <BottomNav />
    </div>
  );
};
