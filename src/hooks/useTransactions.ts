import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Category, SpendingType } from '@/data/mockData';

export interface DbTransaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  emoji: string;
  type: SpendingType;
  note: string | null;
  created_at: string;
}

export const useTransactions = () => {
  const { user, updateProfile, profile } = useAuth();
  const [transactions, setTransactions] = useState<DbTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data.map(t => ({
        ...t,
        amount: Number(t.amount),
        category: t.category as Category,
        type: (t.type || 'want') as SpendingType,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateStreak = useCallback(async () => {
    if (!user || !profile) return;
    const today = new Date().toISOString().split('T')[0];
    const lastLog = profile.last_log_date;

    if (lastLog === today) return; // Already logged today

    let newStreak = 1;
    if (lastLog) {
      const lastDate = new Date(lastLog);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = (profile.streak || 0) + 1;
      }
      // If diffDays > 1, streak resets to 1
    }

    await updateProfile({ streak: newStreak, last_log_date: today });
  }, [user, profile, updateProfile]);

  const addTransaction = async (tx: {
    description: string;
    amount: number;
    category: Category;
    date: string;
    emoji: string;
    type: SpendingType;
    note?: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
        date: tx.date,
        emoji: tx.emoji,
        type: tx.type,
        note: tx.note || null,
      })
      .select()
      .single();

    if (!error && data) {
      const newTx: DbTransaction = {
        ...data,
        amount: Number(data.amount),
        category: data.category as Category,
        type: (data.type || 'want') as SpendingType,
      };
      setTransactions(prev => [newTx, ...prev]);
      // Update streak
      await updateStreak();
      return newTx;
    }
    return null;
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Helper calculations
  const getTodaySpending = () => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.filter(t => t.date === today).reduce((sum, t) => sum + t.amount, 0);
  };

  const getWeeklySpending = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return transactions.filter(t => new Date(t.date) >= weekAgo).reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlySpending = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.filter(t => new Date(t.date) >= monthStart).reduce((sum, t) => sum + t.amount, 0);
  };

  const getLastMonthSpending = () => {
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getSpendingByCategory = () => {
    const spending: Record<Category, number> = {
      food: 0, entertainment: 0, transport: 0, shopping: 0, subscription: 0, education: 0, other: 0,
    };
    transactions.forEach(t => { spending[t.category] += t.amount; });
    return spending;
  };

  const getNeedVsWant = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let needs = 0, wants = 0;
    transactions.filter(t => new Date(t.date) >= weekAgo).forEach(t => {
      if (t.type === 'need') needs += t.amount; else wants += t.amount;
    });
    return { needs, wants };
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    fetchTransactions,
    getTodaySpending,
    getWeeklySpending,
    getMonthlySpending,
    getLastMonthSpending,
    getSpendingByCategory,
    getNeedVsWant,
  };
};
