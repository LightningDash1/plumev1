import { Lightbulb } from 'lucide-react';
import { Category, categoryInfo, formatCurrency } from '@/data/mockData';
import { DbTransaction } from '@/hooks/useTransactions';

interface MicroInsightsProps {
  transactions: DbTransaction[];
  getNeedVsWant: () => { needs: number; wants: number };
  getSpendingByCategory: () => Record<Category, number>;
  getWeeklySpending: () => number;
}

export const MicroInsights = ({ transactions, getNeedVsWant, getSpendingByCategory, getWeeklySpending }: MicroInsightsProps) => {
  const insights: string[] = [];
  const spending = getSpendingByCategory();
  const { needs, wants } = getNeedVsWant();
  const weeklySpending = getWeeklySpending();

  // Top category
  const entries = Object.entries(spending) as [Category, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  if (sorted[0] && sorted[0][1] > 0) {
    insights.push(`You spent most on ${categoryInfo[sorted[0][0]].label.toLowerCase()} this week`);
  }

  // Need vs want balance
  if (wants > 0 && needs > 0) {
    const wantPercent = Math.round((wants / (wants + needs)) * 100);
    if (wantPercent < 50) {
      insights.push(`Nice balance! ${wantPercent}% wants, ${100 - wantPercent}% needs`);
    }
  }

  // Compare to last week
  const today = new Date();
  const lastWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekSpending = transactions
    .filter(t => { const d = new Date(t.date); return d >= lastWeekStart && d < lastWeekEnd; })
    .reduce((sum, t) => sum + t.amount, 0);

  if (lastWeekSpending > 0 && weeklySpending < lastWeekSpending) {
    insights.push("You're spending less than last week 📉");
  }

  if (insights.length === 0) {
    insights.push("Start logging expenses to see insights!");
  }

  return (
    <div className="bg-primary-soft rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground">Quick Insights</h3>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <p key={index} className="text-sm font-medium text-foreground">• {insight}</p>
        ))}
      </div>
    </div>
  );
};
