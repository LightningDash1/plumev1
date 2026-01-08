import { Transaction, getCategoryColor, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-secondary/50 transition-colors animate-fade-in">
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
        getCategoryColor(transaction.category)
      )}>
        {transaction.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{transaction.description}</p>
        <p className="text-sm text-muted-foreground capitalize">{transaction.category}</p>
      </div>
      <p className="font-bold text-foreground">-{formatCurrency(transaction.amount)}</p>
    </div>
  );
};
