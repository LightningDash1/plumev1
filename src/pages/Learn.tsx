import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { MoneyTermCard } from '@/components/MoneyTermCard';
import { MoneyMyths } from '@/components/MoneyMyths';
import { MiniQuiz } from '@/components/MiniQuiz';
import { financeTerms, FinanceTerm } from '@/data/mockData';
import { BookOpen, Sparkles, Brain, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'today' | 'library' | 'myths';

export const Learn = () => {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [viewedTerms, setViewedTerms] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  // Get today's term based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const todayTermIndex = dayOfYear % financeTerms.length;
  const todayTerm = financeTerms[todayTermIndex];

  useEffect(() => {
    // Load viewed terms from localStorage
    const saved = localStorage.getItem('plume_viewed_terms');
    if (saved) {
      setViewedTerms(JSON.parse(saved));
    }
  }, []);

  const markTermAsViewed = (termId: string) => {
    if (!viewedTerms.includes(termId)) {
      const newViewed = [...viewedTerms, termId];
      setViewedTerms(newViewed);
      localStorage.setItem('plume_viewed_terms', JSON.stringify(newViewed));

      // Show quiz after every 5 terms
      if (newViewed.length > 0 && newViewed.length % 5 === 0) {
        setTimeout(() => setShowQuiz(true), 500);
      }
    }
  };

  const tabs = [
    { id: 'today' as Tab, label: 'Today', icon: Sparkles },
    { id: 'library' as Tab, label: 'Library', icon: BookOpen },
    { id: 'myths' as Tab, label: 'Myths', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Learn 📚</h1>
        <p className="text-muted-foreground">Build your money knowledge, one day at a time</p>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all",
                activeTab === id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 space-y-6">
        {activeTab === 'today' && (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Word of the Day</h2>
              </div>
              <MoneyTermCard 
                term={todayTerm} 
                featured 
                onView={() => markTermAsViewed(todayTerm.id)}
              />
            </div>

            {/* Progress */}
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-muted-foreground">Your Progress</p>
                <p className="text-sm font-bold text-primary">
                  {viewedTerms.length}/{financeTerms.length} terms
                </p>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(viewedTerms.length / financeTerms.length) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'library' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Browse all finance terms - each takes under 30 seconds to read!
            </p>
            {financeTerms.map((term) => (
              <MoneyTermCard 
                key={term.id} 
                term={term}
                isViewed={viewedTerms.includes(term.id)}
                onView={() => markTermAsViewed(term.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'myths' && <MoneyMyths />}
      </main>

      {/* Quiz Modal */}
      <MiniQuiz 
        open={showQuiz} 
        onClose={() => setShowQuiz(false)} 
      />

      <BottomNav />
    </div>
  );
};