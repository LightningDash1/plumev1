import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { WeeklySpendingReport } from '@/components/WeeklySpendingReport';
import { EditProfileSheet } from '@/components/EditProfileSheet';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Pencil, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = () => {
  const { profile, updateProfile, signOut } = useAuth();
  const [parentAccess, setParentAccess] = useState(!!profile?.parent_email);
  const [notifications, setNotifications] = useState(true);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const handleParentAccessToggle = () => {
    const newValue = !parentAccess;
    setParentAccess(newValue);
    if (newValue && !profile?.parent_email) {
      toast.info('Add parent email in Edit Profile to enable sharing');
      setShowEditSheet(true);
    } else if (newValue) {
      toast.success('Weekly reports will be shared with parent');
    } else {
      toast.success('Parent sharing disabled');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="gradient-hero px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Account</h1>
          <Button variant="ghost" size="icon" onClick={() => setShowEditSheet(true)} className="text-primary">
            <Pencil className="w-5 h-5" />
          </Button>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-elevated">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-foreground">{profile?.name || 'You'}</p>
              <p className="text-muted-foreground">{profile?.age} years old</p>
            </div>
            {profile?.streak && profile.streak > 0 && (
              <div className="text-center">
                <p className="text-2xl">🔥</p>
                <p className="text-xs font-bold text-accent">{profile.streak} days</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Budget</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(profile?.monthly_allowance || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Favorite Category</p>
              <p className="text-lg font-bold text-foreground capitalize">{profile?.top_categories?.[0] || 'Food'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        <WeeklySpendingReport />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-4 h-4" /> Parent Controls
          </h2>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-soft flex items-center justify-center">
                <Mail className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Share Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.parent_email ? `Sending to ${profile.parent_email}` : 'Add parent email to enable'}
                </p>
              </div>
              <button onClick={handleParentAccessToggle} className={cn("w-12 h-7 rounded-full transition-all duration-200 relative", parentAccess && profile?.parent_email ? "bg-primary" : "bg-secondary")}>
                <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-all duration-200", parentAccess && profile?.parent_email ? "left-6" : "left-1")} />
              </button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm mb-1">What parents can see:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>✓ Total weekly spending</li>
                  <li>✓ Category breakdown</li>
                  <li>✗ Individual transactions</li>
                  <li>✗ Notes or details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Settings</h2>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Spending alerts & reminders</p>
              </div>
              <button onClick={() => { setNotifications(!notifications); toast.success(notifications ? 'Notifications off' : 'Notifications on'); }} className={cn("w-12 h-7 rounded-full transition-all duration-200 relative", notifications ? "bg-primary" : "bg-secondary")}>
                <div className={cn("absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-all duration-200", notifications ? "left-6" : "left-1")} />
              </button>
            </div>
          </div>

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

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Privacy</h2>
          <div className="bg-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-2">Your Data is Safe</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Your data is securely stored</li>
                  <li>✓ We never sell your information</li>
                  <li>✓ You can delete anytime</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
          <LogOut className="w-5 h-5" /> Sign Out
        </Button>

        <p className="text-center text-sm text-muted-foreground">Plume v1.0 • Made with 💚 BUILT FOR THE WORLD, FROM RANCHI, INDIA</p>
      </main>

      <EditProfileSheet open={showEditSheet} onOpenChange={setShowEditSheet} />
      <BottomNav />
    </div>
  );
};
