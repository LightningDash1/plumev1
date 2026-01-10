import { Link } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { InsightCard } from '@/components/InsightCard';
import { SpendingChart } from '@/components/SpendingChart';
import { SpendingAdvisor } from '@/components/SpendingAdvisor';
import { TransactionItem } from '@/components/TransactionItem';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { 
  mockTransactions, 
  mockSubscriptions,
  formatCurrency, 
  getTodaySpending, 
  getWeeklySpending,
  generateInsight,
  getDaysUntil
} from '@/data/mockData';
import { ArrowRight, Bell } from 'lucide-react';

export const Home = () => {
  const { user } = useUser();
  const todaySpending = getTodaySpending();
  const weeklySpending = getWeeklySpending();
  const insight = generateInsight();
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = mockTransactions.filter(t => t.date === today);
  
  // Check for urgent subscriptions
  const urgentSubs = mockSubscriptions.filter(s => getDaysUntil(s.renewalDate) <= 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-muted-foreground font-medium">Good morning 👋</p>
            <h1 className="text-2xl font-bold text-foreground">{user?.name || 'Friend'}</h1>
          </div>
          {user?.streak && user.streak > 0 && (
            <div className="flex items-center gap-1 bg-accent-soft px-3 py-1.5 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-accent">{user.streak} day streak</span>
            </div>
          )}
        </div>

        {/* Today's Spending Card */}
        <div className="bg-card rounded-3xl p-6 shadow-elevated">
          <p className="text-sm text-muted-foreground font-medium mb-1">Today's Spending</p>
          <p className="text-4xl font-extrabold text-foreground mb-4">
            {formatCurrency(todaySpending)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>This week:</span>
            <span className="font-bold text-foreground">{formatCurrency(weeklySpending)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 space-y-6">
        {/* Insight Card */}
        <InsightCard text={insight.text} emoji={insight.emoji} />

        {/* Subscription Alert */}
        {urgentSubs.length > 0 && (
          <Link to="/expenses" className="block">
            <div className="bg-warning-soft rounded-2xl p-4 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {urgentSubs[0].name} renews soon!
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(urgentSubs[0].amount)} in {getDaysUntil(urgentSubs[0].renewalDate)} days
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        )}

        {/* Weekly Chart */}
        <SpendingChart />

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Today's Activity</h2>
            <Link to="/expenses">
              <Button variant="ghost" size="sm" className="text-primary">
                See all
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {todayTransactions.length > 0 ? (
              todayTransactions.slice(0, 3).map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="bg-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">No spending today yet 🎉</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SpendingAdvisor />
      <BottomNav />
    </div>
  );
};
