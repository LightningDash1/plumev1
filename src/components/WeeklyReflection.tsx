import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  categoryInfo,
  formatCurrency,
  Category,
} from '@/data/mockData';
import { useTransactions } from '@/hooks/useTransactions';

const reflectionQuestions = [
  "Was there any spending this week you wish you could undo?",
  "What's one thing you're proud of this week money-wise?",
  "Did you spend on something that made you truly happy?",
  "Is there something you wanted to buy but decided to wait?",
  "What would you do differently next week?",
];

export const WeeklyReflection = () => {
  const { transactions, getWeeklySpending, getSpendingByCategory } = useTransactions();
  const [show, setShow] = useState(false);

  const spending = getSpendingByCategory();
  const entries = Object.entries(spending) as [Category, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0] && sorted[0][1] > 0 ? { category: sorted[0][0], amount: sorted[0][1] } : null;

  useEffect(() => {
    const lastShown = localStorage.getItem('plume_last_reflection');
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) {
      if (!lastShown) {
        setShow(true);
      } else {
        const lastDate = new Date(lastShown);
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 7) {
          setShow(true);
        }
      }
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('plume_last_reflection', new Date().toISOString());
  };

  const questionIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % reflectionQuestions.length;
  const reflectionQuestion = reflectionQuestions[questionIndex];

  if (!show || !topCategory) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Weekly Check-in 🌟
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary-soft rounded-2xl p-5 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your top spending this week</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{categoryInfo[topCategory.category].emoji}</span>
              <div className="text-left">
                <p className="font-bold text-lg text-foreground">
                  {categoryInfo[topCategory.category].label}
                </p>
                <p className="text-2xl font-extrabold text-primary">
                  {formatCurrency(topCategory.amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-accent-soft rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-2">Time to reflect 💭</p>
            <p className="text-lg font-semibold text-foreground">{reflectionQuestion}</p>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            No right or wrong answers - just awareness! 🧘
          </p>

          <Button
            onClick={handleDismiss}
            className="w-full h-12 font-bold rounded-2xl gradient-primary"
          >
            Got it! ✓
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
