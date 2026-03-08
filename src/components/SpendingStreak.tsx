import { useAuth } from '@/contexts/AuthContext';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendingStreakProps {
  className?: string;
}

export const SpendingStreak = ({ className }: SpendingStreakProps) => {
  const { profile } = useAuth();
  const streak = profile?.streak || 0;

  if (streak === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-1.5 bg-accent-soft px-3 py-1.5 rounded-full",
      className
    )}>
      <Flame className="w-4 h-4 text-accent animate-pulse-soft" />
      <span className="font-bold text-accent text-sm">{streak} day streak</span>
    </div>
  );
};
