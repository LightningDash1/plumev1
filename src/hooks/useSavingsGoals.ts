import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbSavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  emoji: string;
  created_at: string;
}

export const useSavingsGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<DbSavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGoals(data.map(g => ({ ...g, target: Number(g.target), current: Number(g.current) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goal: { name: string; target: number; emoji: string }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({ user_id: user.id, ...goal })
      .select()
      .single();

    if (!error && data) {
      const newGoal = { ...data, target: Number(data.target), current: Number(data.current) };
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    }
    return null;
  };

  const updateGoal = async (id: string, updates: Partial<{ name: string; target: number; current: number; emoji: string }>) => {
    const { error } = await supabase.from('savings_goals').update(updates).eq('id', id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    }
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal, fetchGoals };
};
