'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // React 19의 cascading renders 에러 방지를 위한 지연 처리
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-secondary text-secondary-foreground rounded-md border px-4 py-2 transition-all hover:opacity-80"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ModeToggle;
