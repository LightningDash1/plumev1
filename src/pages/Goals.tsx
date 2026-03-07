import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { GoalCard } from '@/components/GoalCard';
import { Button } from '@/components/ui/button';
import { InsightCard } from '@/components/InsightCard';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/data/mockData';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const goalPresets = [
  { amount: 500, emoji: '🎯' },
  { amount: 1000, emoji: '💫' },
  { amount: 2500, emoji: '🚀' },
  { amount: 5000, emoji: '💎' },
];

export const Goals = () => {
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const [showCreate, setShowCreate] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState<number | null>(null);
  const [newGoalEmoji, setNewGoalEmoji] = useState('🎯');

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  const handleCreateGoal = async () => {
    if (newGoalName && newGoalAmount) {
      const result = await addGoal({ name: newGoalName, target: newGoalAmount, emoji: newGoalEmoji });
      if (result) {
        toast.success('Goal created! 🎯');
        setShowCreate(false);
        setNewGoalName('');
        setNewGoalAmount(null);
        setNewGoalEmoji('🎯');
      } else {
        toast.error('Failed to create goal');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-hero px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Savings Goals 🎯</h1>
        <div className="bg-card rounded-3xl p-6 shadow-elevated">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total Saved</p>
          <p className="text-4xl font-extrabold text-primary mb-2">{formatCurrency(totalSaved)}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Target:</span>
            <span className="font-bold text-foreground">{formatCurrency(totalTarget)}</span>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {goals.some(g => (g.current / g.target) >= 0.7) && (
          <InsightCard text="You're so close to one of your goals! Keep going! 💪" emoji="🌟" variant="accent" />
        )}

        {goals.length === 0 && !showCreate && (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🎯</p>
            <p className="text-muted-foreground">No goals yet. Create one to start saving!</p>
          </div>
        )}

        <div className="space-y-4">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
          ))}
        </div>

        {showCreate ? (
          <div className="bg-card rounded-2xl p-5 shadow-soft animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">New Goal</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="What are you saving for?"
              className="w-full p-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary outline-none transition-colors mb-4"
            />
            <p className="text-sm font-semibold text-muted-foreground mb-2">Target amount</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {goalPresets.map(preset => (
                <button
                  key={preset.amount}
                  onClick={() => { setNewGoalAmount(preset.amount); setNewGoalEmoji(preset.emoji); }}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm transition-all",
                    newGoalAmount === preset.amount ? "gradient-primary text-primary-foreground shadow-primary" : "bg-secondary text-foreground"
                  )}
                >
                  {formatCurrency(preset.amount)}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={newGoalAmount || ''}
              onChange={(e) => setNewGoalAmount(Number(e.target.value))}
              placeholder="Or enter custom amount"
              className="w-full p-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary outline-none transition-colors mb-4"
            />
            <Button className="w-full" disabled={!newGoalName || !newGoalAmount} onClick={handleCreateGoal}>
              Create Goal
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5" /> Create New Goal
          </Button>
        )}
      </main>
      <BottomNav />
    </div>
  );
};
