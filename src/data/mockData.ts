export type Category = 'food' | 'entertainment' | 'transport' | 'shopping' | 'subscription' | 'education' | 'other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  emoji: string;
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
}

// Helper to get date strings relative to today
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock transactions for the last 7 days
export const mockTransactions: Transaction[] = [
  { id: '1', description: 'McDonald\'s', amount: 249, category: 'food', date: getDateString(0), emoji: '🍔' },
  { id: '2', description: 'Uber ride', amount: 185, category: 'transport', date: getDateString(0), emoji: '🚗' },
  { id: '3', description: 'Spotify Premium', amount: 119, category: 'subscription', date: getDateString(0), emoji: '🎵' },
  { id: '4', description: 'Domino\'s Pizza', amount: 399, category: 'food', date: getDateString(1), emoji: '🍕' },
  { id: '5', description: 'Amazon Shopping', amount: 899, category: 'shopping', date: getDateString(1), emoji: '📦' },
  { id: '6', description: 'Metro Card', amount: 100, category: 'transport', date: getDateString(1), emoji: '🚇' },
  { id: '7', description: 'Starbucks', amount: 350, category: 'food', date: getDateString(2), emoji: '☕' },
  { id: '8', description: 'Movie Tickets', amount: 500, category: 'entertainment', date: getDateString(2), emoji: '🎬' },
  { id: '9', description: 'Netflix', amount: 199, category: 'subscription', date: getDateString(3), emoji: '📺' },
  { id: '10', description: 'Swiggy Order', amount: 275, category: 'food', date: getDateString(3), emoji: '🥡' },
  { id: '11', description: 'Zara T-shirt', amount: 1299, category: 'shopping', date: getDateString(4), emoji: '👕' },
  { id: '12', description: 'Auto fare', amount: 80, category: 'transport', date: getDateString(4), emoji: '🛺' },
  { id: '13', description: 'KFC', amount: 320, category: 'food', date: getDateString(5), emoji: '🍗' },
  { id: '14', description: 'YouTube Premium', amount: 129, category: 'subscription', date: getDateString(6), emoji: '▶️' },
  { id: '15', description: 'Cafe Coffee Day', amount: 180, category: 'food', date: getDateString(6), emoji: '☕' },
];

export const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Spotify', amount: 119, renewalDate: '2026-01-11', logo: '🎵', category: 'Music' },
  { id: '2', name: 'Netflix', amount: 199, renewalDate: '2026-01-15', logo: '📺', category: 'Entertainment' },
  { id: '3', name: 'YouTube Premium', amount: 129, renewalDate: '2026-01-20', logo: '▶️', category: 'Entertainment' },
  { id: '4', name: 'Discord Nitro', amount: 499, renewalDate: '2026-02-05', logo: '💬', category: 'Social' },
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
