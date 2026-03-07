import { formatCurrency } from '@/data/mockData';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DbSubscription } from '@/hooks/useSubscriptions';

interface SubscriptionCardProps {
  subscription: DbSubscription;
  onDelete?: (id: string) => Promise<void>;
}

export const SubscriptionCard = ({ subscription, onDelete }: SubscriptionCardProps) => {
  const [reminded, setReminded] = useState(false);

  const getDaysUntil = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntil(subscription.renewal_date);
  const isUrgent = daysUntil <= 3 && daysUntil >= 0;

  return (
    <div className={cn("bg-card rounded-2xl p-4 shadow-soft animate-slide-up", isUrgent && "ring-2 ring-warning/50")}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-subscription/15 flex items-center justify-center text-2xl">
          {subscription.logo}
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">{subscription.name}</p>
          <p className="text-sm text-muted-foreground">{subscription.category} • {subscription.billing_frequency}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-foreground">{formatCurrency(subscription.amount)}</p>
          <p className={cn("text-xs font-medium", isUrgent ? "text-warning" : "text-muted-foreground")}>
            {isUrgent ? `⚠️ ${daysUntil} days` : `in ${daysUntil} days`}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {isUrgent && (
          <Button variant={reminded ? "secondary" : "outline"} size="sm" className="flex-1" onClick={() => setReminded(!reminded)}>
            {reminded ? <><BellOff className="w-4 h-4" /> Reminder set ✓</> : <><Bell className="w-4 h-4" /> Remind me</>}
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(subscription.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
