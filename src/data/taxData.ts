export interface TaxProduct {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
  gstRate: number; // percentage
  category: string;
}

export const taxProducts: TaxProduct[] = [
  { id: '1', name: 'Smartphone', emoji: '📱', basePrice: 15000, gstRate: 18, category: 'Electronics' },
  { id: '2', name: 'School Book', emoji: '📚', basePrice: 200, gstRate: 0, category: 'Education' },
  { id: '3', name: 'Petrol (1L)', emoji: '⛽', basePrice: 55, gstRate: 28, category: 'Fuel' },
  { id: '4', name: 'Movie Ticket', emoji: '🎬', basePrice: 200, gstRate: 18, category: 'Entertainment' },
  { id: '5', name: 'Pizza', emoji: '🍕', basePrice: 300, gstRate: 5, category: 'Food' },
  { id: '6', name: 'New Sneakers', emoji: '👟', basePrice: 3000, gstRate: 12, category: 'Clothing' },
  { id: '7', name: 'Bicycle', emoji: '🚲', basePrice: 5000, gstRate: 12, category: 'Transport' },
  { id: '8', name: 'Chocolate Bar', emoji: '🍫', basePrice: 50, gstRate: 18, category: 'Food' },
  { id: '9', name: 'Video Game', emoji: '🎮', basePrice: 2500, gstRate: 18, category: 'Entertainment' },
  { id: '10', name: 'T-Shirt', emoji: '👕', basePrice: 500, gstRate: 5, category: 'Clothing' },
  { id: '11', name: 'Cement (1 bag)', emoji: '🏗️', basePrice: 350, gstRate: 28, category: 'Construction' },
  { id: '12', name: 'Steel Rod (1kg)', emoji: '🔩', basePrice: 60, gstRate: 18, category: 'Construction' },
];

// Where tax money goes — simplified for teens
export interface TaxSpendingCategory {
  name: string;
  emoji: string;
  percentage: number;
  color: string; // HSL css variable reference
}

export const taxSpendingBreakdown: TaxSpendingCategory[] = [
  { name: 'Defence & Safety', emoji: '🛡️', percentage: 15, color: 'hsl(200, 85%, 50%)' },
  { name: 'Roads & Transport', emoji: '🛣️', percentage: 18, color: 'hsl(35, 90%, 55%)' },
  { name: 'Schools & Education', emoji: '🏫', percentage: 16, color: 'hsl(250, 70%, 60%)' },
  { name: 'Hospitals & Healthcare', emoji: '🏥', percentage: 12, color: 'hsl(145, 60%, 45%)' },
  { name: 'Government Services', emoji: '🏛️', percentage: 14, color: 'hsl(220, 15%, 60%)' },
  { name: 'Farming & Food', emoji: '🌾', percentage: 10, color: 'hsl(160, 70%, 45%)' },
  { name: 'Subsidies & Welfare', emoji: '🤝', percentage: 15, color: 'hsl(12, 85%, 65%)' },
];

export const didYouKnowFacts: string[] = [
  "India collects over ₹18 lakh crore in taxes every year — that's enough to buy 120 billion samosas! 🥟",
  "GST stands for Goods & Services Tax. It replaced 17 different taxes in 2017! 🇮🇳",
  "School textbooks have 0% GST — the government wants education to be affordable for everyone! 📚",
  "The word 'tax' comes from the Latin word 'taxo', meaning 'I estimate'. 🧮",
  "Every time you buy a ₹100 pizza, about ₹5 goes to the government as tax! 🍕",
  "India's tax system is one of the oldest in the world — even Chanakya wrote about it in 300 BC! 📜",
  "Petrol & diesel still have some of the highest tax rates in India — almost 50% of the pump price is tax! ⛽",
  "If you earn below ₹7 lakh per year, you don't have to pay income tax. That's the government looking out for you! 💰",
];

export const formatCurrencyTax = (amount: number): string => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};
