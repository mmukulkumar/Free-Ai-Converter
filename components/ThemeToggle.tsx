
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl transition-colors duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <Sun
                    className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0`}
                />
                <Moon
                    className={`absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
