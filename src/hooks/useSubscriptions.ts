import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbSubscription {
  id: string;
  name: string;
  amount: number;
  billing_frequency: string;
  renewal_date: string;
  logo: string;
  category: string;
  is_active: boolean;
}

export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<DbSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('renewal_date', { ascending: true });

    if (!error && data) {
      setSubscriptions(data.map(s => ({ ...s, amount: Number(s.amount) })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const addSubscription = async (sub: {
    name: string;
    amount: number;
    billing_frequency: string;
    renewal_date: string;
    logo: string;
    category: string;
  }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({ user_id: user.id, ...sub })
      .select()
      .single();

    if (!error && data) {
      const newSub = { ...data, amount: Number(data.amount) };
      setSubscriptions(prev => [...prev, newSub]);
      return newSub;
    }
    return null;
  };

  const updateSubscription = async (id: string, updates: Partial<DbSubscription>) => {
    const { error } = await supabase.from('subscriptions').update(updates).eq('id', id);
    if (!error) {
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  };

  const deleteSubscription = async (id: string) => {
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (!error) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
    }
  };

  const getMonthlyTotal = () => {
    return subscriptions.filter(s => s.is_active).reduce((sum, s) => {
      if (s.billing_frequency === 'yearly') return sum + s.amount / 12;
      if (s.billing_frequency === 'weekly') return sum + s.amount * 4;
      return sum + s.amount;
    }, 0);
  };

  return { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription, fetchSubscriptions, getMonthlyTotal };
};
