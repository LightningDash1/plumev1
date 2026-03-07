import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddSubscriptionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (sub: {
    name: string;
    amount: number;
    billing_frequency: string;
    renewal_date: string;
    logo: string;
    category: string;
  }) => Promise<unknown>;
}

const logoOptions = ['🎵', '📺', '▶️', '💬', '🎮', '📱', '☁️', '📰'];
const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
];
const categoryOptions = ['Music', 'Entertainment', 'Social', 'Gaming', 'Productivity', 'Other'];

export const AddSubscriptionSheet = ({ open, onOpenChange, onAdd }: AddSubscriptionSheetProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [logo, setLogo] = useState('📱');
  const [category, setCategory] = useState('Other');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) { toast.error('Enter subscription name'); return; }
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    if (!renewalDate) { toast.error('Enter next renewal date'); return; }

    setLoading(true);
    const result = await onAdd({
      name: name.trim(),
      amount: parseFloat(amount),
      billing_frequency: frequency,
      renewal_date: renewalDate,
      logo,
      category,
    });
    setLoading(false);

    if (result) {
      toast.success('Subscription added! 📱');
      setName(''); setAmount(''); setRenewalDate(''); setLogo('📱'); setCategory('Other');
      onOpenChange(false);
    } else {
      toast.error('Failed to add subscription');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl">Add Subscription</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Netflix, Spotify" className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="199" className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>Billing Frequency</Label>
            <div className="flex gap-2">
              {frequencyOptions.map(f => (
                <button key={f.value} onClick={() => setFrequency(f.value)}
                  className={cn("flex-1 py-2 rounded-xl font-semibold text-sm transition-all",
                    frequency === f.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Next Renewal Date</Label>
            <Input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} className="h-12 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {logoOptions.map(l => (
                <button key={l} onClick={() => setLogo(l)}
                  className={cn("w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all",
                    logo === l ? "bg-primary text-primary-foreground scale-110" : "bg-secondary"
                  )}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-all",
                    category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAdd} disabled={loading} className="w-full h-12 rounded-xl">
            {loading ? 'Adding...' : 'Add Subscription'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
