import { formatCurrency } from '@/data/mockData';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target: number;
    current: number;
    emoji: string;
  };
  onUpdate?: (id: string, updates: Partial<{ current: number }>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const GoalCard = ({ goal, onUpdate, onDelete }: GoalCardProps) => {
  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;
  const isAlmostDone = progress >= 70;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft animate-slide-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-success-soft flex items-center justify-center text-2xl animate-float">
          {goal.emoji}
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">{goal.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(goal.id)}
            className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <Progress value={progress} className="h-3 mb-2" />

      <p className={cn("text-sm font-medium text-center", isAlmostDone ? "text-success" : "text-muted-foreground")}>
        {isAlmostDone ? "Almost there! 🎯" : `${formatCurrency(remaining)} to go`}
      </p>
    </div>
  );
};
