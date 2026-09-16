'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USERS } from '@/lib/demo-data';

const DEMO_SESSION_KEY = 'secureexam_demo_session';

interface DemoSessionContextValue {
  user: UserProfile | null;
  isDemoMode: boolean;
  setDemoUser: (email: string) => void;
  clearDemoSession: () => void;
  isLoading: boolean;
}

const DemoSessionContext = createContext<DemoSessionContextValue>({
  user: null,
  isDemoMode: false,
  setDemoUser: () => {},
  clearDemoSession: () => {},
  isLoading: true,
});

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isDemoMode) {
      setIsLoading(false);
      return;
    }
    try {
      const stored = localStorage.getItem(DEMO_SESSION_KEY);
      const email = stored ? JSON.parse(stored).email : 'admin@secureexam.demo';
      const demoUser = DEMO_USERS[email] || DEMO_USERS['admin@secureexam.demo'];
      setUser(demoUser as UserProfile);
    } catch {
      setUser(DEMO_USERS['admin@secureexam.demo'] as UserProfile);
    }
    setIsLoading(false);
  }, [isDemoMode]);

  const setDemoUser = useCallback((email: string) => {
    const demoUser = DEMO_USERS[email];
    if (demoUser) {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email }));
      setUser(demoUser as UserProfile);
    }
  }, []);

  const clearDemoSession = useCallback(() => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <DemoSessionContext.Provider value={{ user, isDemoMode, setDemoUser, clearDemoSession, isLoading }}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  return useContext(DemoSessionContext);
}
