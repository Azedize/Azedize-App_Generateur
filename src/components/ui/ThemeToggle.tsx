import React, { useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import gsap from 'gsap';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
        // Elastic rotation and scale effect
        gsap.fromTo(iconRef.current,
            { rotation: -180, scale: 0.5, opacity: 0 },
            { rotation: 0, scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.6)" }
        );
    }
  }, [isDark]);

  return (
      <button 
        onClick={toggle}
        className="p-2 rounded-lg hover:bg-background text-foreground transition-all border border-transparent hover:border-border hover:shadow-sm group"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div ref={iconRef} className="flex items-center justify-center">
            {isDark ? (
                <Moon size={18} className="text-primary fill-primary/20" />
            ) : (
                <Sun size={18} className="text-orange-500 fill-orange-500/20" />
            )}
        </div>
      </button>
  );
};

export default ThemeToggle;
