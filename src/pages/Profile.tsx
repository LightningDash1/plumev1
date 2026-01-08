import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  User, 
  Shield, 
  Moon, 
  Sun, 
  Bell, 
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const Profile = () => {
  const { user, resetOnboarding } = useUser();
  const [parentAccess, setParentAccess] = useState(!!user?.parentEmail);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>
        
        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-6 shadow-elevated flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-foreground">{user?.name || 'You'}</p>
            <p className="text-muted-foreground">{user?.age} years old</p>
          </div>
          {user?.streak && user.streak > 0 && (
            <div className="text-center">
              <p className="text-2xl">🔥</p>
              <p className="text-xs font-bold text-accent">{user.streak} days</p>
            </div>
          )}
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Monthly Budget</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(user?.monthlyAllowance || 0)}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-xl font-bold text-foreground">
              {user?.topCategories[0] || 'Food'} 🍔
            </p>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Settings
          </h2>
          
          {/* Parent Access Toggle */}
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-soft flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Parent Summary</p>
                <p className="text-sm text-muted-foreground">Share weekly read-only report</p>
              </div>
              <button
                onClick={() => setParentAccess(!parentAccess)}
                className={cn(
                  "w-12 h-7 rounded-full transition-all duration-200 relative",
                  parentAccess ? "bg-primary" : "bg-secondary"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-all duration-200",
                  parentAccess ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Spending alerts & reminders</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={cn(
                  "w-12 h-7 rounded-full transition-all duration-200 relative",
                  notifications ? "bg-primary" : "bg-secondary"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-all duration-200",
                  notifications ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </div>

          {/* Help */}
          <button className="w-full bg-card rounded-2xl p-4 shadow-soft flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Help & Support</p>
              <p className="text-sm text-muted-foreground">FAQs, tips, and contact us</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Privacy Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Privacy
          </h2>
          
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-2">Your Data is Safe</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ All data stays on your device</li>
                  <li>✓ We never sell your information</li>
                  <li>✓ You can delete anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          className="w-full text-destructive hover:bg-destructive/10"
          onClick={resetOnboarding}
        >
          <LogOut className="w-5 h-5" />
          Start Fresh
        </Button>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground">
          Plume v1.0 • Made with 💚
        </p>
      </main>

      <BottomNav />
    </div>
  );
};
