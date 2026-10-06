import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Package, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

interface HeroSectionProps {
  onStartPredict: () => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPredict,
  onExploreFeatures,
}) => {
  const [simulatedDistance, setSimulatedDistance] = useState(1420);
  const [simulatedRisk, setSimulatedRisk] = useState(78);

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Inline Eyebrow Pill */}
            <div className="eyebrow-pill">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED LOGISTICS INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Predict Late Deliveries{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600">
                Before Dispatch
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Real-time ML risk scoring trained on 99,000+ Brazilian e-commerce orders. Catch shipping bottlenecks, optimize fulfillment lead-times, and protect customer satisfaction.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartPredict}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-indigo transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Run Risk Prediction</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="px-6 py-3.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-semibold transition-all duration-200 hover:border-indigo-500/30 flex items-center gap-2"
              >
                <span>Explore Features</span>
              </button>
            </div>

            {/* Micro Badge Row */}
            <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>0.7766 ROC-AUC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Leakage-Free Architecture</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Animated Product Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <div className="saas-card border-indigo-500/20 bg-card/90 backdrop-blur-xl shadow-2xl p-6 md:p-8 space-y-6">
              
              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Live Order Risk Monitor</h3>
                    <p className="text-xs text-muted-foreground font-mono">Order #OLIST-8842-BR</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-xs font-mono text-muted-foreground">
                  SIMULATION
                </div>
              </div>

              {/* Main Risk Gauge + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                
                {/* SVG Circular Risk Arc Gauge */}
                <div className="relative flex flex-col items-center justify-center py-2">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-muted"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-red-500 transition-all duration-700 ease-out"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - simulatedRisk / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold font-mono text-red-500">{simulatedRisk}%</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full mt-0.5">
                      HIGH RISK
                    </span>
                  </div>
                </div>

                {/* Delivery Route Line SVG */}
                <div className="space-y-4">
                  <div className="bg-muted/40 rounded-xl p-3.5 border border-border/50 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Seller → Customer</span>
                      <span className="font-mono text-indigo-500">{simulatedDistance} km</span>
                    </div>

                    {/* Animated Route Graphic */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-1.5 z-10">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                        <span className="text-[11px] font-mono font-medium">SP (01000)</span>
                      </div>

                      {/* Connecting Line */}
                      <div className="absolute left-4 right-4 h-0.5 bg-border z-0">
                        <div className="h-full bg-indigo-500 w-3/4 animate-pulse-slow" />
                      </div>

                      <div className="flex items-center gap-1.5 z-10">
                        <span className="text-[11px] font-mono font-medium">RJ (20000)</span>
                        <div className="w-3 h-3 rounded-full bg-slate-400 ring-4 ring-slate-400/20" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Interactive Slider for Demo */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Simulate Distance</span>
                      <span>{simulatedDistance} km</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="2800"
                      step="50"
                      value={simulatedDistance}
                      onChange={(e) => {
                        const dist = Number(e.target.value);
                        setSimulatedDistance(dist);
                        setSimulatedRisk(Math.min(95, Math.max(15, Math.round((dist / 2800) * 85 + 10))));
                      }}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Top Risk Factors Callout */}
              <div className="border-t border-border/60 pt-4 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase block">
                  Top Risk Factor Contributions
                </span>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 stroke-[1.75]" />
                      <span className="font-medium text-foreground">Extreme Interstate Distance</span>
                    </div>
                    <span className="font-mono text-red-500 font-semibold">+38% Risk</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 stroke-[1.75]" />
                      <span className="font-medium text-foreground">Approval Lag Hours</span>
                    </div>
                    <span className="font-mono text-amber-500 font-semibold">+22% Risk</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border text-xs">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-500 stroke-[1.75]" />
                      <span className="font-medium text-foreground">Heavy Freight Ratio (28%)</span>
                    </div>
                    <span className="font-mono text-indigo-500 font-semibold">+18% Risk</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
