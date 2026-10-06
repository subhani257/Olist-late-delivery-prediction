import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PredictSection } from './components/PredictSection';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Health check polling against FastAPI backend on port 8002
  const checkHealth = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8002/health', { method: 'GET' });
      if (res.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartPredict = () => {
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const predictEl = document.getElementById('predict');
    if (predictEl) {
      predictEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreFeatures = () => {
    setActiveTab('features');
    const featuresEl = document.getElementById('features');
    if (featuresEl) {
      featuresEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500/20 selection:text-indigo-400">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        apiStatus={apiStatus}
      />

      <main className="flex-1">
        <HeroSection
          onStartPredict={handleStartPredict}
          onExploreFeatures={handleExploreFeatures}
        />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PredictSection
          apiStatus={apiStatus}
          onRetryApi={checkHealth}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
