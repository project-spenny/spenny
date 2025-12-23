'use client'

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes'

const ModeToggle = () => {
    const {theme, setTheme} = useTheme();
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
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 border rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition-all"
        >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    )
}

export default ModeToggle