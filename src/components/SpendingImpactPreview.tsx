import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/data/mockData';
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

export const SpendingImpactPreview = ({ transactionAmount, onClose }: SpendingImpactPreviewProps) => {
  const { transactions, getLastMonthSpending, getMonthlySpending } = useTransactions();
  const { goals } = useSavingsGoals();
  const [impactMessage, setImpactMessage] = useState<ImpactMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysElapsed = Math.max(1, Math.ceil((now.getTime() - currentMonthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();

    const lastMonthTotal = getLastMonthSpending();
    const currentMonthTotal = getMonthlySpending();

    const currentDailyRate = currentMonthTotal / daysElapsed;
    const lastMonthDailyRate = lastMonthTotal / daysInLastMonth;

    // Check goal impact
    const activeGoal = goals.filter(g => g.current < g.target).sort((a, b) => (a.current / a.target) - (b.current / b.target))[0];

    if (activeGoal && lastMonthDailyRate > 0) {
      const estimatedDailySaving = lastMonthDailyRate * 0.2;
      if (estimatedDailySaving > 0) {
        const delayDays = Math.ceil(transactionAmount / estimatedDailySaving);
        if (delayDays >= 1) {
          setImpactMessage({
            type: 'goal', icon: <Target className="w-6 h-6" />,
            title: `This delays "${activeGoal.name}" ${activeGoal.emoji}`,
            subtitle: `by about ${delayDays} ${delayDays === 1 ? 'day' : 'days'}`,
            highlight: `₹${activeGoal.target - activeGoal.current} left to save`,
            variant: 'warning',
          });
          setTimeout(() => setIsVisible(true), 50);
          return;
        }
      }
    }

    // Check pace
    if (lastMonthTotal > 0) {
      const projectedSpend = currentDailyRate * daysInLastMonth;
      const diff = projectedSpend - lastMonthTotal;
      if (diff > 500) {
        setImpactMessage({
          type: 'pace', icon: <TrendingUp className="w-6 h-6" />,
          title: `At this pace, you'll spend`,
          subtitle: `${formatCurrency(Math.round(diff))} more than last month`,
          highlight: `Projected: ${formatCurrency(Math.round(projectedSpend))}`,
          variant: 'warning',
        });
      } else if (diff < -200) {
        setImpactMessage({
          type: 'pace', icon: <TrendingDown className="w-6 h-6" />,
          title: `You're on track to save`,
          subtitle: `${formatCurrency(Math.abs(Math.round(diff)))} compared to last month`,
          highlight: 'Keep it up! 🎉',
          variant: 'success',
        });
      } else {
        setImpactMessage({
          type: 'neutral', icon: <Lightbulb className="w-6 h-6" />,
          title: `${formatCurrency(transactionAmount)} logged`,
          subtitle: 'Every rupee tracked is a step toward better habits',
          highlight: 'Keep logging! 📝',
          variant: 'neutral',
        });
      }
    } else {
      setImpactMessage({
        type: 'neutral', icon: <Lightbulb className="w-6 h-6" />,
        title: `${formatCurrency(transactionAmount)} logged`,
        subtitle: 'Every rupee tracked is a step toward better habits',
        highlight: 'Keep logging! 📝',
        variant: 'neutral',
      });
    }

    setTimeout(() => setIsVisible(true), 50);
  }, [transactionAmount, transactions, goals, getLastMonthSpending, getMonthlySpending]);

  const handleClose = () => { setIsVisible(false); setTimeout(onClose, 200); };

  if (!impactMessage) return null;

  const variantStyles = { warning: 'from-warning/10 to-warning/5 border-warning/30', success: 'from-success/10 to-success/5 border-success/30', neutral: 'from-primary/10 to-primary/5 border-primary/30' };
  const iconStyles = { warning: 'bg-warning/20 text-warning', success: 'bg-success/20 text-success', neutral: 'bg-primary/20 text-primary' };

  return (
    <div className={cn("fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-200", isVisible ? "opacity-100" : "opacity-0")} onClick={handleClose}>
      <div className={cn("w-full max-w-md mx-4 mb-8 transition-all duration-300", isVisible ? "translate-y-0" : "translate-y-8")} onClick={(e) => e.stopPropagation()}>
        <div className={cn("relative rounded-3xl border-2 bg-gradient-to-br p-6 shadow-elevated", variantStyles[impactMessage.variant])}>
          <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center hover:bg-background/80 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", iconStyles[impactMessage.variant])}>{impactMessage.icon}</div>
          <h3 className="text-xl font-bold text-foreground mb-1">{impactMessage.title}</h3>
          <p className="text-2xl font-extrabold text-foreground mb-3">{impactMessage.subtitle}</p>
          {impactMessage.highlight && <p className="text-sm font-medium text-muted-foreground bg-background/50 rounded-xl px-4 py-2 inline-block">{impactMessage.highlight}</p>}
          <Button onClick={handleClose} className="w-full mt-5 h-12 text-base font-bold rounded-xl" variant="outline">Got it 👍</Button>
        </div>
      </div>
    </div>
  );
};
