import { useState, useEffect } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Category,
  categoryInfo,
  suggestCategory,
  addTransaction,
  formatCurrency,
  getCategoryEmoji,
} from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QuickAddExpenseProps {
  onExpenseAdded?: () => void;
}

export const QuickAddExpense = ({ onExpenseAdded }: QuickAddExpenseProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [isWant, setIsWant] = useState(true);
  const [suggestedCategory, setSuggestedCategory] = useState<Category | null>(null);

  // Smart category suggestion based on note
  useEffect(() => {
    if (note.length > 2) {
      const suggestion = suggestCategory(note);
      if (suggestion && suggestion !== category) {
        setSuggestedCategory(suggestion);
      } else {
        setSuggestedCategory(null);
      }
    } else {
      setSuggestedCategory(null);
    }
  }, [note, category]);

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const transaction = addTransaction({
      description: note || categoryInfo[category].label,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      emoji: getCategoryEmoji(category),
      type: isWant ? 'want' : 'need',
      note,
    });

    toast.success(
      `${formatCurrency(transaction.amount)} added to ${categoryInfo[category].label} ${getCategoryEmoji(category)}`,
      { duration: 2000 }
    );

    // Reset form
    setAmount('');
    setNote('');
    setCategory('other');
    setIsWant(true);
    setSuggestedCategory(null);
    setOpen(false);
    onExpenseAdded?.();
  };

  const applySuggestion = () => {
    if (suggestedCategory) {
      setCategory(suggestedCategory);
      setSuggestedCategory(null);
    }
  };

  const categories: Category[] = ['food', 'entertainment', 'transport', 'shopping', 'subscription', 'education', 'other'];

  return (
    <>
      {/* Floating Quick Add Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full gradient-primary shadow-primary flex items-center justify-center animate-pulse-soft hover:scale-110 transition-transform">
            <Plus className="w-7 h-7 text-primary-foreground" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Log Expense 💸</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold text-muted-foreground">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="pl-10 text-3xl font-bold h-16 rounded-2xl border-2 focus:border-primary"
                  autoFocus
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-muted-foreground">Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-xl transition-all",
                      category === cat
                        ? "bg-primary text-primary-foreground scale-105"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    <span className="text-xl mb-1">{categoryInfo[cat].emoji}</span>
                    <span className="text-xs font-medium truncate w-full text-center">
                      {categoryInfo[cat].label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input with Smart Suggestion */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-semibold text-muted-foreground">
                Note (optional)
              </Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., burger, netflix, cab 🍔"
                className="rounded-xl"
              />
              {suggestedCategory && (
                <button
                  onClick={applySuggestion}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-soft rounded-xl text-sm animate-fade-in"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    Suggest: <strong>{categoryInfo[suggestedCategory].label}</strong>
                  </span>
                  <span className="text-primary font-semibold ml-auto">Apply</span>
                </button>
              )}
            </div>

            {/* Need vs Want Toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-2xl">
              <div>
                <p className="font-semibold text-foreground">
                  {isWant ? 'Want 🎮' : 'Need 🎯'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isWant ? 'Nice to have' : 'Essential expense'}
                </p>
              </div>
              <Switch
                checked={!isWant}
                onCheckedChange={(checked) => setIsWant(!checked)}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-14 text-lg font-bold rounded-2xl gradient-primary shadow-primary"
            >
              Add Expense ✓
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};