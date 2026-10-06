import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  TrendingUp, 
  Layers, 
  Zap, 
  Sliders, 
  ShieldCheck 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  apiStatus: 'checking' | 'online' | 'offline';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  apiStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Key Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'predict', label: 'Predict Risk', isHighlight: true },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    
    if (id === 'predict') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-subtle py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-indigo transition-transform group-hover:scale-105">
            <TrendingUp className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="text-left">
            <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Olist Risk <span className="text-indigo-600 dark:text-indigo-400">Predictor</span>
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-1 font-mono tracking-wider">
              ML LOGISTICS INTELLIGENCE
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-card/60 backdrop-blur-sm p-1.5 rounded-full border border-border">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Status, Theme Toggle & Action */}
        <div className="hidden md:flex items-center gap-3">
          {/* API Health Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              apiStatus === 'online'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : apiStatus === 'offline'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : apiStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="font-mono text-[11px]">
              {apiStatus === 'online'
                ? 'API Online: 8002'
                : apiStatus === 'offline'
                ? 'API Offline'
                : 'Connecting...'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 py-6 mt-2 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-border flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">Backend Status</span>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
                apiStatus === 'online'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {apiStatus === 'online' ? '8002 Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
