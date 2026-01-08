import { Subscription, formatCurrency, getDaysUntil } from '@/data/mockData';
import { Bell, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const [reminded, setReminded] = useState(false);
  const daysUntil = getDaysUntil(subscription.renewalDate);
  const isUrgent = daysUntil <= 3;

  return (
    <div className={cn(
      "bg-card rounded-2xl p-4 shadow-soft animate-slide-up",
      isUrgent && "ring-2 ring-warning/50"
    )}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-subscription/15 flex items-center justify-center text-2xl">
          {subscription.logo}
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">{subscription.name}</p>
          <p className="text-sm text-muted-foreground">{subscription.category}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-foreground">{formatCurrency(subscription.amount)}</p>
          <p className={cn(
            "text-xs font-medium",
            isUrgent ? "text-warning" : "text-muted-foreground"
          )}>
            {isUrgent ? `⚠️ ${daysUntil} days` : `in ${daysUntil} days`}
          </p>
        </div>
      </div>
      
      {isUrgent && (
        <Button
          variant={reminded ? "secondary" : "soft"}
          size="sm"
          className="w-full mt-3"
          onClick={() => setReminded(!reminded)}
        >
          {reminded ? (
            <>
              <BellOff className="w-4 h-4" />
              Reminder set ✓
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Remind me to cancel
            </>
          )}
        </Button>
      )}
    </div>
  );
};
