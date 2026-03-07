import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ArrowRight, Shield } from 'lucide-react';
import plumeLogo from '@/assets/plume-logo.png';
import { toast } from 'sonner';

const ageOptions = [13, 14, 15, 16, 17, 18, 19];
const allowanceOptions = [
  { value: 2000, label: '₹2,000' },
  { value: 5000, label: '₹5,000' },
  { value: 10000, label: '₹10,000' },
  { value: 15000, label: '₹15,000+' },
];
const categoryOptions: { value: Category; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food & Drinks', emoji: '🍔' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'subscription', label: 'Subscriptions', emoji: '📱' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎮' },
];

export const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [allowance, setAllowance] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentEmail, setParentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCategory = (cat: Category) => {
    setCategories(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const handleComplete = async () => {
    if (age && allowance && categories.length > 0 && name.trim()) {
      setLoading(true);
      try {
        await completeOnboarding({
          name: name.trim(),
          age,
          monthly_allowance: allowance,
          top_categories: categories,
          parent_email: parentEmail || undefined,
        });
        navigate('/');
      } catch {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return name.trim().length > 0;
      case 2: return age !== null;
      case 3: return allowance !== null;
      case 4: return categories.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Progress */}
      <div className="p-4">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                i <= step ? "gradient-primary" : "bg-primary/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <img src={plumeLogo} alt="Plume Logo" className="w-48 h-48 object-contain mb-6 animate-float" />
            <p className="text-lg text-muted-foreground max-w-xs">
              Your friendly money companion. Let's set things up in under a minute! ⚡
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">What's your name? 👋</h2>
            <p className="text-muted-foreground mb-6">So we know what to call you</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-4 rounded-xl bg-card border-2 border-border focus:border-primary outline-none transition-colors text-lg font-semibold"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">How old are you? 🎂</h2>
            <p className="text-muted-foreground mb-6">This helps us personalize your experience</p>
            <div className="grid grid-cols-4 gap-3">
              {ageOptions.map(a => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={cn(
                    "py-4 rounded-xl font-bold text-lg transition-all",
                    age === a
                      ? "gradient-primary text-primary-foreground shadow-primary"
                      : "bg-card text-foreground shadow-soft hover:bg-secondary"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">Monthly money? 💰</h2>
            <p className="text-muted-foreground mb-6">Your allowance or pocket money range</p>
            <div className="grid grid-cols-2 gap-3">
              {allowanceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAllowance(opt.value)}
                  className={cn(
                    "py-5 rounded-xl font-bold text-lg transition-all",
                    allowance === opt.value
                      ? "gradient-primary text-primary-foreground shadow-primary"
                      : "bg-card text-foreground shadow-soft hover:bg-secondary"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">Where does your money go? 🛒</h2>
            <p className="text-muted-foreground mb-6">Pick your top spending areas</p>
            <div className="space-y-3">
              {categoryOptions.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl font-semibold transition-all",
                    categories.includes(cat.value)
                      ? "gradient-primary text-primary-foreground shadow-primary"
                      : "bg-card text-foreground shadow-soft hover:bg-secondary"
                  )}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-success-soft flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your privacy matters 🔒</h2>
            <div className="bg-card rounded-2xl p-4 shadow-soft mb-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-success">✓</span><span>Your data is securely stored</span></li>
                <li className="flex items-start gap-2"><span className="text-success">✓</span><span>We never sell your information</span></li>
                <li className="flex items-start gap-2"><span className="text-success">✓</span><span>You control what to share</span></li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Parent's email (optional)</p>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full p-4 rounded-xl bg-card border-2 border-border focus:border-primary outline-none transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              They'll get a weekly summary (read-only) if you add their email
            </p>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="p-6 pb-8">
        <Button
          size="xl"
          className="w-full"
          disabled={!canProceed() || loading}
          onClick={() => {
            if (step < 5) {
              setStep(step + 1);
            } else {
              handleComplete();
            }
          }}
        >
          {step === 0 ? "Let's go!" : step === 5 ? (loading ? 'Setting up...' : 'Start using Plume') : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
