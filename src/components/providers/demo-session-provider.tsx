'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile } from '@/types';
import { DEMO_USERS } from '@/lib/demo-data';

const DEMO_SESSION_KEY = 'secureexam_demo_session';

interface DemoSessionContextValue {
  user: UserProfile;
  isDemoMode: boolean;
  setDemoUser: (email: string) => void;
  clearDemoSession: () => void;
  isLoading: boolean;
}

const DEFAULT_USER = DEMO_USERS['admin@secureexam.demo'] as UserProfile;

const DemoSessionContext = createContext<DemoSessionContextValue>({
  user: DEFAULT_USER,
  isDemoMode: true,
  setDemoUser: () => {},
  clearDemoSession: () => {},
  isLoading: false,
});

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEMO_SESSION_KEY);
      const email = stored ? JSON.parse(stored).email : 'admin@secureexam.demo';
      const demoUser = DEMO_USERS[email] || DEFAULT_USER;
      setUser(demoUser as UserProfile);
    } catch {
      setUser(DEFAULT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDemoUser = useCallback((email: string) => {
    const demoUser = DEMO_USERS[email];
    if (demoUser) {
      try {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email }));
      } catch {}
      setUser(demoUser as UserProfile);
    }
  }, []);

  const clearDemoSession = useCallback(() => {
    try {
      localStorage.removeItem(DEMO_SESSION_KEY);
    } catch {}
    setUser(DEFAULT_USER);
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
