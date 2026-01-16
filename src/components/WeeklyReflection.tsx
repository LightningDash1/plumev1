import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getTopCategoryThisWeek,
  categoryInfo,
  formatCurrency,
  reflectionQuestions,
} from '@/data/mockData';

export const WeeklyReflection = () => {
  const [show, setShow] = useState(false);
  const topCategory = getTopCategoryThisWeek();

  useEffect(() => {
    // Check if we should show the weekly reflection
    const lastShown = localStorage.getItem('plume_last_reflection');
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Show on Sunday (0) if not shown this week
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

  // Get a consistent reflection question for the week
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
          {/* Top Category */}
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

          {/* Reflection Question */}
          <div className="bg-accent-soft rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-2">Time to reflect 💭</p>
            <p className="text-lg font-semibold text-foreground">{reflectionQuestion}</p>
          </div>

          {/* Encouragement */}
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