import { generateMicroInsights } from '@/data/mockData';
import { Lightbulb } from 'lucide-react';

export const MicroInsights = () => {
  const insights = generateMicroInsights();

  return (
    <div className="bg-primary-soft rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground">Quick Insights</h3>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <p key={index} className="text-sm font-medium text-foreground">
            • {insight}
          </p>
        ))}
      </div>
    </div>
  );
};