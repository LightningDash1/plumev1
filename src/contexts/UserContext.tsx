import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUserProfile, UserProfile, Category } from '@/data/mockData';

interface OnboardingData {
  age: number;
  allowance: number;
  categories: Category[];
  parentEmail?: string;
}

interface UserContextType {
  isOnboarded: boolean;
  user: UserProfile | null;
  completeOnboarding: (data: OnboardingData) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('plume_onboarded') === 'true';
  });
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (localStorage.getItem('plume_onboarded') === 'true') {
      const saved = localStorage.getItem('plume_user');
      return saved ? JSON.parse(saved) : mockUserProfile;
    }
    return null;
  });

  const completeOnboarding = (data: OnboardingData) => {
    const newUser: UserProfile = {
      name: 'You',
      age: data.age,
      monthlyAllowance: data.allowance,
      topCategories: data.categories,
      parentEmail: data.parentEmail,
      streak: 1,
    };
    
    setUser(newUser);
    setIsOnboarded(true);
    localStorage.setItem('plume_onboarded', 'true');
    localStorage.setItem('plume_user', JSON.stringify(newUser));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('plume_user', JSON.stringify(updatedUser));
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    setUser(null);
    localStorage.removeItem('plume_onboarded');
    localStorage.removeItem('plume_user');
  };

  return (
    <UserContext.Provider value={{ isOnboarded, user, completeOnboarding, updateProfile, resetOnboarding }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
