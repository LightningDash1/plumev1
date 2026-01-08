import { cn } from '@/lib/utils';

interface InsightCardProps {
  text: string;
  emoji: string;
  variant?: 'primary' | 'accent' | 'warning';
  className?: string;
}

export const InsightCard = ({ text, emoji, variant = 'primary', className }: InsightCardProps) => {
  const variantStyles = {
    primary: 'bg-primary-soft border-primary/20',
    accent: 'bg-accent-soft border-accent/20',
    warning: 'bg-warning-soft border-warning/20',
  };

  return (
    <div 
      className={cn(
        "rounded-2xl p-4 border animate-slide-up",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl animate-float">{emoji}</span>
        <p className="text-base font-medium text-foreground">{text}</p>
      </div>
    </div>
  );
};
