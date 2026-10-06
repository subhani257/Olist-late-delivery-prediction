import React from 'react';
import { TrendingUp, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground">Olist Risk Predictor</span>
              <span className="text-xs text-muted-foreground block font-mono">
                ML Logistics Intelligence Platform
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Zero Data Leakage Guarantee</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-muted border border-border">
              PyTorch / Scikit-Learn / FastAPI
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono gap-4">
          <p>© 2026 Olist Late Delivery Prediction Project. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <span>FastAPI: Port 8002</span>
            <span>Vite Frontend: Port 3000</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
