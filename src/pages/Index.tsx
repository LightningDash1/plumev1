import { useAuth } from '@/contexts/AuthContext';
import { Auth } from './Auth';
import { Onboarding } from './Onboarding';
import { Home } from './Home';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-float">🪶</div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!profile?.is_onboarded) {
    return <Onboarding />;
  }

  return <Home />;
};

export default Index;
