'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { Profile } from '@/schemas/profile';

type AuthState = {
  user: User | null;
  userId: string | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchProfile() {
  const res = await fetch('/api/profile', { credentials: 'include' });
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const hasInitRef = useRef(false);

  const init = async () => {
    if (hasInitRef.current) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const nextUser = data.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      const p = await fetchProfile();
      setProfile(p);
      hasInitRef.current = true;
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('인증 초기화 실패');
      }

      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 최초 1회 초기화
    init();

    // 로그인/로그아웃 등 인증 상태 변화 구독
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      hasInitRef.current = false;
      init();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      userId: user?.id ?? null,
      profile,
      isLoading,
      error,
      refresh: init,
      setProfile,
    }),
    [user, profile, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
