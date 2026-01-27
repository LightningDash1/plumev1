export type Category = 'food' | 'entertainment' | 'transport' | 'shopping' | 'subscription' | 'education' | 'other';
export type SpendingType = 'need' | 'want';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  emoji: string;
  type?: SpendingType;
  note?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  renewalDate: string;
  logo: string;
  category: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  emoji: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  age: number;
  monthlyAllowance: number;
  topCategories: Category[];
  parentEmail?: string;
  streak: number;
  lastLogDate?: string;
}

// Helper to get date strings relative to today
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mutable transactions array for adding new expenses
export let mockTransactions: Transaction[] = [
  // This week
  { id: '1', description: 'Chai & Samosa', amount: 45, category: 'food', date: getDateString(0), emoji: '☕', type: 'want' },
  { id: '2', description: 'Bus Pass', amount: 150, category: 'transport', date: getDateString(0), emoji: '🚌', type: 'need' },
  { id: '3', description: 'Maggi at canteen', amount: 30, category: 'food', date: getDateString(1), emoji: '🍜', type: 'want' },
  { id: '4', description: 'Notebook & Pens', amount: 120, category: 'education', date: getDateString(1), emoji: '📓', type: 'need' },
  { id: '5', description: 'Ice cream with friends', amount: 80, category: 'food', date: getDateString(2), emoji: '🍦', type: 'want' },
  { id: '6', description: 'Auto to tuition', amount: 60, category: 'transport', date: getDateString(2), emoji: '🛺', type: 'need' },
  { id: '7', description: 'Movie with friends', amount: 250, category: 'entertainment', date: getDateString(3), emoji: '🎬', type: 'want' },
  { id: '8', description: 'Spotify', amount: 59, category: 'subscription', date: getDateString(3), emoji: '🎵', type: 'want' },
  { id: '9', description: 'Birthday gift for friend', amount: 300, category: 'shopping', date: getDateString(4), emoji: '🎁', type: 'want' },
  { id: '10', description: 'Metro fare', amount: 40, category: 'transport', date: getDateString(5), emoji: '🚇', type: 'need' },
  { id: '11', description: 'Momos', amount: 60, category: 'food', date: getDateString(5), emoji: '🥟', type: 'want' },
  { id: '12', description: 'Online course', amount: 199, category: 'education', date: getDateString(6), emoji: '💻', type: 'need' },
  // Last week (8-14 days ago)
  { id: '13', description: 'Pizza party', amount: 350, category: 'food', date: getDateString(8), emoji: '🍕', type: 'want' },
  { id: '14', description: 'New T-shirt', amount: 499, category: 'shopping', date: getDateString(9), emoji: '👕', type: 'want' },
  { id: '15', description: 'Uber to mall', amount: 120, category: 'transport', date: getDateString(10), emoji: '🚗', type: 'want' },
  { id: '16', description: 'Netflix', amount: 199, category: 'subscription', date: getDateString(11), emoji: '📺', type: 'want' },
  { id: '17', description: 'Burger King', amount: 280, category: 'food', date: getDateString(12), emoji: '🍔', type: 'want' },
  // Earlier this month (15-25 days ago)
  { id: '18', description: 'School supplies', amount: 450, category: 'education', date: getDateString(15), emoji: '📚', type: 'need' },
  { id: '19', description: 'Arcade games', amount: 200, category: 'entertainment', date: getDateString(18), emoji: '🎮', type: 'want' },
  { id: '20', description: 'Cafe with friends', amount: 180, category: 'food', date: getDateString(20), emoji: '☕', type: 'want' },
  { id: '21', description: 'Concert tickets', amount: 800, category: 'entertainment', date: getDateString(22), emoji: '🎤', type: 'want' },
  { id: '22', description: 'Sneakers', amount: 1200, category: 'shopping', date: getDateString(25), emoji: '👟', type: 'want' },
];

// Helper to get future date strings
const getFutureDateString = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

export const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Spotify', amount: 119, renewalDate: getFutureDateString(3), logo: '🎵', category: 'Music' },
  { id: '2', name: 'Netflix', amount: 199, renewalDate: getFutureDateString(8), logo: '📺', category: 'Entertainment' },
  { id: '3', name: 'YouTube Premium', amount: 129, renewalDate: getFutureDateString(15), logo: '▶️', category: 'Entertainment' },
  { id: '4', name: 'Discord Nitro', amount: 499, renewalDate: getFutureDateString(22), logo: '💬', category: 'Social' },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'New Headphones', target: 2500, current: 1800, emoji: '🎧', createdAt: '2025-12-15' },
  { id: '2', name: 'Birthday Gift', target: 1000, current: 450, emoji: '🎁', createdAt: '2025-12-28' },
];

export const mockUserProfile: UserProfile = {
  name: 'Alex',
  age: 16,
  monthlyAllowance: 5000,
  topCategories: ['food', 'shopping', 'entertainment'],
  streak: 7,
  lastLogDate: getDateString(0),
};

// Category display info
export const categoryInfo: Record<Category, { emoji: string; label: string; color: string }> = {
  food: { emoji: '🍔', label: 'Food & Snacks', color: 'bg-food/15 text-food' },
  entertainment: { emoji: '🎮', label: 'Entertainment', color: 'bg-entertainment/15 text-entertainment' },
  transport: { emoji: '🚌', label: 'Travel & Transport', color: 'bg-transport/15 text-transport' },
  shopping: { emoji: '🛍️', label: 'Shopping', color: 'bg-shopping/15 text-shopping' },
  subscription: { emoji: '📱', label: 'Subscriptions', color: 'bg-subscription/15 text-subscription' },
  education: { emoji: '📚', label: 'Education', color: 'bg-education/15 text-education' },
  other: { emoji: '➕', label: 'Others', color: 'bg-other/15 text-other' },
};

// Smart category suggestions based on keywords
export const categorySuggestions: Record<string, Category> = {
  // Food
  burger: 'food', pizza: 'food', coffee: 'food', starbucks: 'food', mcd: 'food', mcdonalds: 'food',
  kfc: 'food', dominos: 'food', swiggy: 'food', zomato: 'food', lunch: 'food', dinner: 'food',
  breakfast: 'food', snack: 'food', chai: 'food', tea: 'food', juice: 'food', ice: 'food',
  chocolate: 'food', chips: 'food', biryani: 'food', momos: 'food', samosa: 'food',
  // Entertainment
  movie: 'entertainment', game: 'entertainment', arcade: 'entertainment', bowling: 'entertainment',
  concert: 'entertainment', party: 'entertainment', club: 'entertainment', pvr: 'entertainment',
  inox: 'entertainment', gaming: 'entertainment', ps5: 'entertainment', xbox: 'entertainment',
  // Transport
  uber: 'transport', ola: 'transport', cab: 'transport', auto: 'transport', metro: 'transport',
  bus: 'transport', train: 'transport', petrol: 'transport', fuel: 'transport', parking: 'transport',
  rapido: 'transport', bike: 'transport', taxi: 'transport',
  // Shopping
  amazon: 'shopping', flipkart: 'shopping', myntra: 'shopping', clothes: 'shopping', shoes: 'shopping',
  shirt: 'shopping', jeans: 'shopping', zara: 'shopping', hm: 'shopping', nike: 'shopping',
  adidas: 'shopping', watch: 'shopping', bag: 'shopping', accessories: 'shopping',
  // Subscription
  netflix: 'subscription', spotify: 'subscription', youtube: 'subscription', prime: 'subscription',
  hotstar: 'subscription', discord: 'subscription', premium: 'subscription', membership: 'subscription',
  // Education
  book: 'education', course: 'education', udemy: 'education', coursera: 'education',
  tuition: 'education', class: 'education', notes: 'education', stationery: 'education',
  pen: 'education', notebook: 'education',
};

// Helper functions
export const getCategoryColor = (category: Category): string => {
  return categoryInfo[category].color;
};

export const getCategoryEmoji = (category: Category): string => {
  return categoryInfo[category].emoji;
};

export const getCategoryLabel = (category: Category): string => {
  return categoryInfo[category].label;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getDaysUntil = (dateString: string): number => {
  const today = new Date();
  const target = new Date(dateString);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTodaySpending = (): number => {
  const today = new Date().toISOString().split('T')[0];
  return mockTransactions
    .filter(t => t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getWeeklySpending = (): number => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return mockTransactions
    .filter(t => new Date(t.date) >= weekAgo)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getMonthlySpending = (): number => {
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  return mockTransactions
    .filter(t => new Date(t.date) >= monthAgo)
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getSpendingByCategory = (): Record<Category, number> => {
  const spending: Record<Category, number> = {
    food: 0,
    entertainment: 0,
    transport: 0,
    shopping: 0,
    subscription: 0,
    education: 0,
    other: 0,
  };
  
  mockTransactions.forEach(t => {
    spending[t.category] += t.amount;
  });
  
  return spending;
};

export const getNeedVsWantSpending = (): { needs: number; wants: number } => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  let needs = 0;
  let wants = 0;
  
  mockTransactions
    .filter(t => new Date(t.date) >= weekAgo)
    .forEach(t => {
      if (t.type === 'need') {
        needs += t.amount;
      } else {
        wants += t.amount;
      }
    });
  
  return { needs, wants };
};

export const getTopCategoryThisWeek = (): { category: Category; amount: number } | null => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const spending: Record<Category, number> = {
    food: 0,
    entertainment: 0,
    transport: 0,
    shopping: 0,
    subscription: 0,
    education: 0,
    other: 0,
  };
  
  mockTransactions
    .filter(t => new Date(t.date) >= weekAgo)
    .forEach(t => {
      spending[t.category] += t.amount;
    });
  
  const entries = Object.entries(spending) as [Category, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  if (sorted[0][1] > 0) {
    return { category: sorted[0][0], amount: sorted[0][1] };
  }
  return null;
};

export const suggestCategory = (note: string): Category | null => {
  const lowerNote = note.toLowerCase();
  for (const [keyword, category] of Object.entries(categorySuggestions)) {
    if (lowerNote.includes(keyword)) {
      return category;
    }
  }
  return null;
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  mockTransactions = [newTransaction, ...mockTransactions];
  return newTransaction;
};

export const generateInsight = (): { text: string; emoji: string } => {
  const todaySpending = getTodaySpending();
  const today = new Date().toISOString().split('T')[0];
  const foodSpending = mockTransactions
    .filter(t => t.date === today && t.category === 'food')
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (foodSpending > 200) {
    return { text: `You spent ${formatCurrency(foodSpending)} on food today`, emoji: '🍔' };
  }
  if (todaySpending === 0) {
    return { text: 'No spending today - great job saving!', emoji: '🎉' };
  }
  return { text: `Today's total: ${formatCurrency(todaySpending)}`, emoji: '💰' };
};

export const generateMicroInsights = (): string[] => {
  const insights: string[] = [];
  const topCategory = getTopCategoryThisWeek();
  const { needs, wants } = getNeedVsWantSpending();
  const weeklySpending = getWeeklySpending();
  const today = new Date();
  const lastWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastWeekEnd = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const lastWeekSpending = mockTransactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= lastWeekStart && date < lastWeekEnd;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (topCategory) {
    insights.push(`You spent most on ${categoryInfo[topCategory.category].label.toLowerCase()} this week`);
  }
  
  if (wants > 0 && needs > 0) {
    const wantPercent = Math.round((wants / (wants + needs)) * 100);
    if (wantPercent < 50) {
      insights.push(`Nice balance! ${wantPercent}% wants, ${100 - wantPercent}% needs`);
    }
  }
  
  if (lastWeekSpending > 0 && weeklySpending < lastWeekSpending) {
    insights.push("You're spending less than last week 📉");
  }
  
  if (insights.length === 0) {
    insights.push("Nice job staying consistent!");
  }
  
  return insights;
};

// Financial literacy content
export interface FinanceTerm {
  id: string;
  term: string;
  definition: string;
  whyItMatters: string;
  example: string;
  emoji: string;
}

export const financeTerms: FinanceTerm[] = [
  {
    id: '1',
    term: 'Budget',
    definition: 'A plan for how you\'ll spend your money.',
    whyItMatters: 'Helps you avoid running out of money before month-end.',
    example: 'If you get ₹5000 monthly, budgeting means deciding ₹2000 for food, ₹1000 for transport, etc.',
    emoji: '📊',
  },
  {
    id: '2',
    term: 'Saving',
    definition: 'Setting aside money for later instead of spending it now.',
    whyItMatters: 'Lets you buy bigger things or handle emergencies.',
    example: 'Saving ₹500 each month means ₹6000 for new headphones in a year!',
    emoji: '🐷',
  },
  {
    id: '3',
    term: 'Expense',
    definition: 'Money you spend on things or services.',
    whyItMatters: 'Tracking expenses shows where your money actually goes.',
    example: 'That ₹200 Starbucks coffee? That\'s an expense.',
    emoji: '💸',
  },
  {
    id: '4',
    term: 'Need vs Want',
    definition: 'Needs are essentials; wants are nice-to-haves.',
    whyItMatters: 'Knowing the difference helps you prioritize spending.',
    example: 'Metro fare is a need. That extra gaming skin? Probably a want.',
    emoji: '🤔',
  },
  {
    id: '5',
    term: 'Interest',
    definition: 'Extra money earned on savings or charged on loans.',
    whyItMatters: 'It can grow your money or make borrowing expensive.',
    example: 'A savings account pays you interest - free money for keeping your money there!',
    emoji: '📈',
  },
  {
    id: '6',
    term: 'EMI',
    definition: 'Equal Monthly Installment - paying for something in parts.',
    whyItMatters: 'Makes big purchases affordable but watch out for extra charges.',
    example: 'Buying a ₹50,000 phone in 12 monthly payments of ₹4,500 each.',
    emoji: '📱',
  },
  {
    id: '7',
    term: 'Inflation',
    definition: 'When prices go up over time and money buys less.',
    whyItMatters: 'Your savings need to grow faster than inflation to keep value.',
    example: 'A samosa that cost ₹10 five years ago might cost ₹20 now.',
    emoji: '📉',
  },
  {
    id: '8',
    term: 'Investment',
    definition: 'Putting money into something hoping it grows over time.',
    whyItMatters: 'Helps your money grow faster than just saving.',
    example: 'Buying stocks means owning a tiny piece of a company.',
    emoji: '🌱',
  },
  {
    id: '9',
    term: 'Emergency Fund',
    definition: 'Money saved for unexpected situations.',
    whyItMatters: 'Covers you when your phone breaks or you have an urgent expense.',
    example: 'Having ₹10,000 set aside for emergencies = peace of mind.',
    emoji: '🆘',
  },
];

export interface MoneyMyth {
  id: string;
  myth: string;
  reality: string;
  emoji: string;
}

export const moneyMyths: MoneyMyth[] = [
  {
    id: '1',
    myth: "I don't earn enough to save",
    reality: "Even ₹50/week adds up to ₹2,600/year. Start small!",
    emoji: '🪙',
  },
  {
    id: '2',
    myth: "Credit cards are free money",
    reality: "It's borrowed money you'll pay back with interest. Use wisely!",
    emoji: '💳',
  },
  {
    id: '3',
    myth: "I'll start saving when I earn more",
    reality: "Building the habit now is more important than the amount.",
    emoji: '⏰',
  },
  {
    id: '4',
    myth: "Investing is only for rich people",
    reality: "You can start investing with as little as ₹100 these days!",
    emoji: '📊',
  },
  {
    id: '5',
    myth: "I'm too young to think about money",
    reality: "Learning now gives you a huge advantage. Time is your superpower!",
    emoji: '⚡',
  },
  {
    id: '6',
    myth: "All debt is bad",
    reality: "Education loans or home loans can be good investments in your future.",
    emoji: '🏠',
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is a budget?',
    options: ['A type of bank account', 'A plan for spending money', 'A loan from parents'],
    correctIndex: 1,
    explanation: 'A budget is simply a plan that helps you decide how to spend your money wisely!',
  },
  {
    id: '2',
    question: 'Which is a "need"?',
    options: ['New gaming headphones', 'School bus fare', 'Movie tickets'],
    correctIndex: 1,
    explanation: 'Transportation to school is essential - that makes it a need!',
  },
  {
    id: '3',
    question: 'What happens to your money during inflation?',
    options: ['It grows automatically', 'It can buy less over time', 'Nothing changes'],
    correctIndex: 1,
    explanation: 'Inflation means prices go up, so the same money buys fewer things.',
  },
  {
    id: '4',
    question: 'Why is an emergency fund important?',
    options: ['To buy games', 'To handle unexpected expenses', 'To impress friends'],
    correctIndex: 1,
    explanation: 'Emergency funds protect you from stress when unexpected expenses pop up!',
  },
  {
    id: '5',
    question: 'What is interest on savings?',
    options: ['A fee you pay', 'Money the bank gives you for saving', 'A type of tax'],
    correctIndex: 1,
    explanation: 'Banks pay you interest as a reward for keeping your money with them!',
  },
];

// Reflection questions
export const reflectionQuestions: string[] = [
  "Was this spending worth it?",
  "Did this purchase make you happy?",
  "Would you spend this way again?",
  "What could you do differently next week?",
  "Are you saving for something special?",
  "Did you spend on experiences or things?",
  "How did your spending align with your goals?",
];