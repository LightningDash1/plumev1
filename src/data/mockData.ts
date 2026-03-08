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
  burger: 'food', pizza: 'food', coffee: 'food', starbucks: 'food', mcd: 'food', mcdonalds: 'food',
  kfc: 'food', dominos: 'food', swiggy: 'food', zomato: 'food', lunch: 'food', dinner: 'food',
  breakfast: 'food', snack: 'food', chai: 'food', tea: 'food', juice: 'food', ice: 'food',
  chocolate: 'food', chips: 'food', biryani: 'food', momos: 'food', samosa: 'food',
  movie: 'entertainment', game: 'entertainment', arcade: 'entertainment', bowling: 'entertainment',
  concert: 'entertainment', party: 'entertainment', club: 'entertainment', pvr: 'entertainment',
  inox: 'entertainment', gaming: 'entertainment', ps5: 'entertainment', xbox: 'entertainment',
  uber: 'transport', ola: 'transport', cab: 'transport', auto: 'transport', metro: 'transport',
  bus: 'transport', train: 'transport', petrol: 'transport', fuel: 'transport', parking: 'transport',
  rapido: 'transport', bike: 'transport', taxi: 'transport',
  amazon: 'shopping', flipkart: 'shopping', myntra: 'shopping', clothes: 'shopping', shoes: 'shopping',
  shirt: 'shopping', jeans: 'shopping', zara: 'shopping', hm: 'shopping', nike: 'shopping',
  adidas: 'shopping', watch: 'shopping', bag: 'shopping', accessories: 'shopping',
  netflix: 'subscription', spotify: 'subscription', youtube: 'subscription', prime: 'subscription',
  hotstar: 'subscription', discord: 'subscription', premium: 'subscription', membership: 'subscription',
  book: 'education', course: 'education', udemy: 'education', coursera: 'education',
  tuition: 'education', class: 'education', notes: 'education', stationery: 'education',
  pen: 'education', notebook: 'education',
};

// Helper functions
export const getCategoryColor = (category: Category): string => {
  return categoryInfo[category]?.color || categoryInfo.other.color;
};

export const getCategoryEmoji = (category: Category): string => {
  return categoryInfo[category]?.emoji || '💰';
};

export const getCategoryLabel = (category: Category): string => {
  return categoryInfo[category]?.label || 'Other';
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
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
    term: 'Compound Interest',
    definition: 'Interest earned on both your money AND previous interest.',
    whyItMatters: 'It\'s the reason starting to save early matters so much.',
    example: '₹1000 at 10% becomes ₹1100 in year 1, then ₹1210 in year 2 - growing faster each year!',
    emoji: '🚀',
  },
  {
    id: '7',
    term: 'Inflation',
    definition: 'When prices go up over time, so your money buys less.',
    whyItMatters: 'If your money isn\'t growing, it\'s actually losing value.',
    example: 'A samosa that cost ₹10 five years ago might cost ₹20 now. That\'s inflation!',
    emoji: '📉',
  },
  {
    id: '8',
    term: 'UPI',
    definition: 'Unified Payments Interface - India\'s instant payment system.',
    whyItMatters: 'Makes digital payments easy, but can also make overspending easier.',
    example: 'When you pay via Google Pay or PhonePe, that\'s UPI! Easy but watch your spending.',
    emoji: '📱',
  },
  {
    id: '9',
    term: 'EMI',
    definition: 'Equated Monthly Installment - paying for something in monthly parts.',
    whyItMatters: 'Makes big purchases affordable but you pay extra as interest.',
    example: 'A ₹60,000 phone on 12-month EMI = ₹5,500/month (you pay ₹66,000 total).',
    emoji: '💳',
  },
  {
    id: '10',
    term: 'GST',
    definition: 'Goods and Services Tax - a tax on things you buy.',
    whyItMatters: 'Part of every purchase price goes to the government.',
    example: 'That ₹100 Netflix subscription? ₹18 of it is GST going to the government.',
    emoji: '🏛️',
  },
];

// Money myths for the Learn section
export interface MoneyMyth {
  id: string;
  myth: string;
  reality: string;
  emoji: string;
}

export const moneyMyths: MoneyMyth[] = [
  {
    id: '1',
    myth: 'You need a lot of money to start saving.',
    reality: 'Even ₹10/day adds up to ₹3,650/year. Start small!',
    emoji: '🐣',
  },
  {
    id: '2',
    myth: 'Credit cards are free money.',
    reality: 'Credit cards are borrowed money. If you don\'t pay on time, interest rates can be 36-42% per year!',
    emoji: '💳',
  },
  {
    id: '3',
    myth: 'Investing is only for adults.',
    reality: 'You can start learning about investing now. Some apps let you invest from ₹100!',
    emoji: '🌱',
  },
  {
    id: '4',
    myth: 'You should spend less on everything.',
    reality: 'It\'s about spending smartly, not spending less. Focus on value, not just price.',
    emoji: '🧠',
  },
  {
    id: '5',
    myth: 'More income = more wealth.',
    reality: 'It\'s not how much you earn, it\'s how much you keep and grow. Many high earners are broke!',
    emoji: '💰',
  },
];

// Quiz questions
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
    question: 'What is compound interest?',
    options: [
      'Interest on your original amount only',
      'Interest on your original amount AND accumulated interest',
      'A type of bank fee',
      'Interest charged on credit cards only',
    ],
    correctIndex: 1,
    explanation: 'Compound interest means you earn interest on your interest too! It\'s like a snowball effect for your money.',
  },
  {
    id: '2',
    question: 'Which is a "need" expense?',
    options: ['New gaming headset', 'Movie tickets', 'Bus fare to school', 'Starbucks coffee'],
    correctIndex: 2,
    explanation: 'Bus fare to school is essential - you need transportation for education. The others are wants!',
  },
  {
    id: '3',
    question: 'What does GST stand for?',
    options: ['General Sales Tax', 'Goods and Services Tax', 'Government Service Tax', 'Global Standard Tax'],
    correctIndex: 1,
    explanation: 'GST (Goods and Services Tax) is India\'s indirect tax on goods and services you buy.',
  },
  {
    id: '4',
    question: 'What is the 50-30-20 rule?',
    options: [
      '50% save, 30% needs, 20% wants',
      '50% needs, 30% wants, 20% savings',
      '50% wants, 30% save, 20% needs',
      '50% invest, 30% save, 20% spend',
    ],
    correctIndex: 1,
    explanation: 'The 50-30-20 rule suggests: 50% for needs, 30% for wants, and 20% for savings.',
  },
  {
    id: '5',
    question: 'What happens to your money during inflation?',
    options: [
      'It grows automatically',
      'It buys less over time',
      'Nothing changes',
      'Banks add more money',
    ],
    correctIndex: 1,
    explanation: 'Inflation means prices go up, so your money buys less. That\'s why saving alone isn\'t enough - you need to beat inflation!',
  },
];
