import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import plumeLogo from '@/assets/plume-logo.png';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please verify your email first. Check your inbox.');
          } else {
            toast.error(error.message);
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) {
          toast.error(error.message);
        } else {
          setShowVerifyMessage(true);
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link sent! Check your email.');
        setResetMode(false);
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (showVerifyMessage) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Check your email!</h2>
        <p className="text-muted-foreground mb-6 max-w-xs">
          We've sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
        </p>
        <Button variant="outline" onClick={() => { setShowVerifyMessage(false); setIsLogin(true); }}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <img src={plumeLogo} alt="Plume" className="w-24 h-24 object-contain mb-4 animate-float" />
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {resetMode ? 'Reset Password' : isLogin ? 'Welcome back! 👋' : 'Join Plume 🌱'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {resetMode ? 'Enter your email to reset' : isLogin ? 'Log in to continue tracking' : 'Start your money journey'}
        </p>

        <div className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {resetMode ? (
            <>
              <Button onClick={handleResetPassword} disabled={loading} className="w-full h-12 text-base font-bold rounded-xl gradient-primary shadow-primary">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setResetMode(false)}>
                Back to Login
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuth} disabled={loading} className="w-full h-12 text-base font-bold rounded-xl gradient-primary shadow-primary">
                {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </Button>

              {isLogin && (
                <button onClick={() => setResetMode(true)} className="w-full text-sm text-primary font-medium">
                  Forgot password?
                </button>
              )}

              <div className="text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className="text-primary font-semibold">{isLogin ? 'Sign Up' : 'Log In'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
