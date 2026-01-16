import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpendingStreakProps {
  className?: string;
}

export const SpendingStreak = ({ className }: SpendingStreakProps) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Get streak from localStorage
    const savedStreak = localStorage.getItem('plume_logging_streak');
    const lastLogDate = localStorage.getItem('plume_last_log_date');
    const today = new Date().toISOString().split('T')[0];

    if (lastLogDate === today) {
      // Already logged today
      setStreak(savedStreak ? parseInt(savedStreak) : 1);
    } else if (lastLogDate) {
      const lastDate = new Date(lastLogDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day - this will be updated when they log
        setStreak(savedStreak ? parseInt(savedStreak) : 0);
      } else if (diffDays > 1) {
        // Streak broken
        setStreak(0);
        localStorage.setItem('plume_logging_streak', '0');
      }
    }
  }, []);

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

export const updateLoggingStreak = () => {
  const today = new Date().toISOString().split('T')[0];
  const lastLogDate = localStorage.getItem('plume_last_log_date');
  const savedStreak = localStorage.getItem('plume_logging_streak');
  
  if (lastLogDate === today) {
    // Already logged today, don't increment
    return parseInt(savedStreak || '1');
  }

  let newStreak = 1;

  if (lastLogDate) {
    const lastDate = new Date(lastLogDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      newStreak = (savedStreak ? parseInt(savedStreak) : 0) + 1;
    }
    // If diffDays > 1, streak resets to 1
  }

  localStorage.setItem('plume_logging_streak', newStreak.toString());
  localStorage.setItem('plume_last_log_date', today);
  
  return newStreak;
};