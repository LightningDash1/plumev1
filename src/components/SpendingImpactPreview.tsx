import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  mockTransactions,
  mockSavingsGoals,
  formatCurrency,
  SavingsGoal,
} from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SpendingImpactPreviewProps {
  transactionAmount: number;
  onClose: () => void;
}

interface ImpactMessage {
  type: 'pace' | 'goal' | 'neutral';
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: string;
  variant: 'warning' | 'success' | 'neutral';
}

// Get date ranges
const getLastMonthRange = () => {
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start: lastMonthStart, end: lastMonthEnd };
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start: currentMonthStart, end: now };
};

// Calculate spending for a date range
const getSpendingInRange = (start: Date, end: Date): number => {
  return mockTransactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

// Get days elapsed in a month
const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getDaysElapsed = (start: Date, end: Date): number => {
  const diffTime = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
};

export const SpendingImpactPreview = ({ transactionAmount, onClose }: SpendingImpactPreviewProps) => {
  const [impactMessage, setImpactMessage] = useState<ImpactMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const message = calculateImpact(transactionAmount);
    setImpactMessage(message);
    
    // Animate in
    setTimeout(() => setIsVisible(true), 50);
  }, [transactionAmount]);

  const calculateImpact = (amount: number): ImpactMessage => {
    const lastMonthRange = getLastMonthRange();
    const currentMonthRange = getCurrentMonthRange();

    const lastMonthTotal = getSpendingInRange(lastMonthRange.start, lastMonthRange.end);
    const currentMonthTotal = getSpendingInRange(currentMonthRange.start, currentMonthRange.end);
    const daysInLastMonth = getDaysInMonth(lastMonthRange.start);
    const daysElapsedThisMonth = getDaysElapsed(currentMonthRange.start, currentMonthRange.end);

    // Calculate daily run rates
    const lastMonthDailyRate = lastMonthTotal / daysInLastMonth;
    const currentMonthDailyRate = currentMonthTotal / daysElapsedThisMonth;

    // Find active savings goal (one with lowest progress %)
    const activeGoal = mockSavingsGoals
      .filter(g => g.current < g.target)
      .sort((a, b) => (a.current / a.target) - (b.current / b.target))[0];

    // Priority 1: Check savings goal impact
    if (activeGoal) {
      const goalImpact = calculateGoalDelay(activeGoal, amount, lastMonthDailyRate);
      if (goalImpact.delayDays > 0) {
        return {
          type: 'goal',
          icon: <Target className="w-6 h-6" />,
          title: `This delays "${activeGoal.name}" ${activeGoal.emoji}`,
          subtitle: `by about ${goalImpact.delayDays} ${goalImpact.delayDays === 1 ? 'day' : 'days'}`,
          highlight: `₹${activeGoal.target - activeGoal.current} left to save`,
          variant: 'warning',
        };
      }
    }

    // Priority 2: Check spending pace
    if (lastMonthTotal > 0) {
      const projectedMonthlySpend = currentMonthDailyRate * daysInLastMonth;
      const difference = projectedMonthlySpend - lastMonthTotal;

      if (difference > 500) {
        return {
          type: 'pace',
          icon: <TrendingUp className="w-6 h-6" />,
          title: `At this pace, you'll spend`,
          subtitle: `${formatCurrency(Math.round(difference))} more than last month`,
          highlight: `Projected: ${formatCurrency(Math.round(projectedMonthlySpend))}`,
          variant: 'warning',
        };
      } else if (difference < -200) {
        return {
          type: 'pace',
          icon: <TrendingDown className="w-6 h-6" />,
          title: `You're on track to save`,
          subtitle: `${formatCurrency(Math.abs(Math.round(difference)))} compared to last month`,
          highlight: `Keep it up! 🎉`,
          variant: 'success',
        };
      }
    }

    // Fallback: Neutral message
    return {
      type: 'neutral',
      icon: <Lightbulb className="w-6 h-6" />,
      title: `${formatCurrency(amount)} logged`,
      subtitle: 'Every rupee tracked is a step toward better habits',
      highlight: 'Keep logging! 📝',
      variant: 'neutral',
    };
  };

  const calculateGoalDelay = (
    goal: SavingsGoal, 
    spendAmount: number, 
    dailySavingRate: number
  ): { delayDays: number } => {
    // Assume user saves ~20% of what they spend (simple heuristic)
    const estimatedDailySaving = dailySavingRate * 0.2;
    
    if (estimatedDailySaving <= 0) {
      return { delayDays: 0 };
    }

    // How many days does this spend represent in potential savings?
    const delayDays = Math.ceil(spendAmount / estimatedDailySaving);
    
    // Only show if meaningful delay (more than half a day)
    return { delayDays: delayDays >= 1 ? delayDays : 0 };
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!impactMessage) return null;

  const variantStyles = {
    warning: 'from-warning/10 to-warning/5 border-warning/30',
    success: 'from-success/10 to-success/5 border-success/30',
    neutral: 'from-primary/10 to-primary/5 border-primary/30',
  };

  const iconStyles = {
    warning: 'bg-warning/20 text-warning',
    success: 'bg-success/20 text-success',
    neutral: 'bg-primary/20 text-primary',
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "w-full max-w-md mx-4 mb-8 transition-all duration-300",
          isVisible ? "translate-y-0" : "translate-y-8"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "relative rounded-3xl border-2 bg-gradient-to-br p-6 shadow-elevated",
            variantStyles[impactMessage.variant]
          )}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center hover:bg-background/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Icon */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
              iconStyles[impactMessage.variant]
            )}
          >
            {impactMessage.icon}
          </div>

          {/* Main message */}
          <h3 className="text-xl font-bold text-foreground mb-1">
            {impactMessage.title}
          </h3>
          <p className="text-2xl font-extrabold text-foreground mb-3">
            {impactMessage.subtitle}
          </p>

          {/* Highlight */}
          {impactMessage.highlight && (
            <p className="text-sm font-medium text-muted-foreground bg-background/50 rounded-xl px-4 py-2 inline-block">
              {impactMessage.highlight}
            </p>
          )}

          {/* Action button */}
          <Button
            onClick={handleClose}
            className="w-full mt-5 h-12 text-base font-bold rounded-xl"
            variant="outline"
          >
            Got it 👍
          </Button>
        </div>
      </div>
    </div>
  );
};
