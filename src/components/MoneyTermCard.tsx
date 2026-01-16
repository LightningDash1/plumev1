import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { FinanceTerm } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface MoneyTermCardProps {
  term: FinanceTerm;
  featured?: boolean;
  isViewed?: boolean;
  onView?: () => void;
}

export const MoneyTermCard = ({ term, featured, isViewed, onView }: MoneyTermCardProps) => {
  const [expanded, setExpanded] = useState(featured);

  const handleExpand = () => {
    if (!expanded) {
      onView?.();
    }
    setExpanded(!expanded);
  };

  return (
    <div 
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        featured 
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20" 
          : "bg-card shadow-soft"
      )}
    >
      <button
        onClick={handleExpand}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <span className="text-3xl">{term.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground">{term.term}</h3>
            {isViewed && (
              <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-success" />
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{term.definition}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-slide-up">
          <div className="pl-12 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Definition
              </p>
              <p className="text-sm text-foreground">{term.definition}</p>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Why it matters
              </p>
              <p className="text-sm text-foreground">{term.whyItMatters}</p>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Real-life example
              </p>
              <p className="text-sm text-foreground">{term.example}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};