
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme after component mounts (client-side only)
  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldBeDark = false;
    if (savedTheme === 'dark') shouldBeDark = true;
    else if (savedTheme === 'light') shouldBeDark = false;
    else shouldBeDark = prefersDark;
    
    setIsDarkMode(shouldBeDark);
    
    // Apply theme immediately
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Apply theme changes after initial mount
  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Toggle theme"
      >
        <Moon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
