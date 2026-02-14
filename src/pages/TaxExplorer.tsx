import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Search, Lightbulb, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  taxProducts,
  taxSpendingBreakdown,
  didYouKnowFacts,
  formatCurrencyTax,
  TaxProduct,
} from '@/data/taxData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const TaxExplorer = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<TaxProduct>(taxProducts[0]);
  const [customPrice, setCustomPrice] = useState<number>(taxProducts[0].basePrice);
  const [searchQuery, setSearchQuery] = useState('');

  // Random "Did You Know" fact
  const [factIndex] = useState(() => Math.floor(Math.random() * didYouKnowFacts.length));

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return taxProducts;
    const q = searchQuery.toLowerCase();
    return taxProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectProduct = (product: TaxProduct) => {
    setSelectedProduct(product);
    setCustomPrice(product.basePrice);
    setSearchQuery('');
  };

  // Tax calculations
  const taxAmount = (customPrice * selectedProduct.gstRate) / 100;
  const finalPrice = customPrice + taxAmount;

  // Max slider value relative to base price
  const sliderMax = Math.max(selectedProduct.basePrice * 3, 1000);

  // Spending breakdown scaled to tax amount
  const spendingData = taxSpendingBreakdown.map((cat) => ({
    ...cat,
    amount: (taxAmount * cat.percentage) / 100,
  }));

  // Plain language explanation
  const taxPer100 = selectedProduct.gstRate;
  const explanationText =
    selectedProduct.gstRate === 0
      ? `Good news! There's no tax on ${selectedProduct.name.toLowerCase()}. The government keeps these tax-free so everyone can afford them. 🎉`
      : `Out of every ₹100 you pay for ${selectedProduct.name.toLowerCase()}, ₹${taxPer100} goes to the government. That money is used to build roads, run schools, and pay doctors. 💡`;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-hero px-6 pt-8 pb-6">
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center gap-1 text-muted-foreground mb-3 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-1">Tax Explorer 🧾</h1>
        <p className="text-muted-foreground text-sm">See where your money really goes</p>
      </header>

      <main className="px-6 space-y-5 mt-4">
        {/* Search & Product Selection */}
        <section className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(searchQuery ? filteredProducts : taxProducts).map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all border',
                  selectedProduct.id === product.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-primary'
                    : 'bg-card text-foreground border-border hover:border-primary/40'
                )}
              >
                <span>{product.emoji}</span>
                {product.name}
              </button>
            ))}
            {searchQuery && filteredProducts.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">No products found. Try a different search!</p>
            )}
          </div>
        </section>

        {/* Tax Breakdown Card */}
        <section className="bg-card rounded-2xl p-5 shadow-soft space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{selectedProduct.emoji}</span>
            <h2 className="text-lg font-bold text-foreground">{selectedProduct.name}</h2>
            <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-lg bg-primary-soft text-primary">
              {selectedProduct.gstRate}% GST
            </span>
          </div>

          {/* Price rows */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Base price</span>
              <span className="text-sm font-bold text-foreground">{formatCurrencyTax(customPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tax ({selectedProduct.gstRate}%)</span>
              <span className={cn('text-sm font-bold', taxAmount > 0 ? 'text-accent' : 'text-success')}>
                {taxAmount > 0 ? `+ ${formatCurrencyTax(taxAmount)}` : 'Free! ✨'}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">You pay</span>
              <span className="text-lg font-extrabold text-foreground">{formatCurrencyTax(finalPrice)}</span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-muted-foreground">Adjust the price 👇</p>
            <Slider
              value={[customPrice]}
              onValueChange={([val]) => setCustomPrice(val)}
              min={10}
              max={sliderMax}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹10</span>
              <span>{formatCurrencyTax(sliderMax)}</span>
            </div>
          </div>
        </section>

        {/* Teen-Friendly Explanation */}
        <section className="bg-primary-soft rounded-2xl p-4 flex gap-3 items-start animate-slide-up">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-foreground leading-relaxed">{explanationText}</p>
        </section>

        {/* Where Tax Goes */}
        {taxAmount > 0 && (
          <section className="bg-card rounded-2xl p-5 shadow-soft space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-foreground">Where does your ₹{Math.round(taxAmount)} go? 🏛️</h3>

            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={35}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                      fontFamily: 'Nunito',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Bars */}
            <div className="space-y-2.5">
              {spendingData.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-foreground">
                      {cat.emoji} {cat.name}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {formatCurrencyTax(cat.amount)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Did You Know */}
        <section className="bg-accent-soft rounded-2xl p-4 flex gap-3 items-start animate-slide-up">
          <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-accent mb-1">Did You Know? 🤓</p>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {didYouKnowFacts[factIndex]}
            </p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
