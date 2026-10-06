import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck2, 
  Database, 
  Cpu, 
  Gauge, 
  CheckCircle2 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { value: '99,441+', label: 'Real Olist Orders Evaluated' },
    { value: '44', label: 'Engineered ML Features' },
    { value: '0.7766', label: 'Champion Model ROC-AUC' },
    { value: '100%', label: 'Leakage-Free Strict Guarantee' },
  ];

  const storySteps = [
    {
      step: '01',
      title: 'The Challenge',
      subtitle: 'Post-Dispatch Blindspot',
      description: 'E-commerce logistics suffer from hidden late delivery penalties. By the time a carrier updates tracking, delays have already angered customers and increased support costs.',
      icon: AlertTriangle,
      tint: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      step: '02',
      title: 'Our Solution',
      subtitle: 'Pre-Dispatch Neural Scoring',
      description: 'Our Multi-Layer Perceptron (MLP) model analyzes purchase parameters at order placement, calculating delay risk before packages even leave seller warehouses.',
      icon: Lightbulb,
      tint: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      step: '03',
      title: 'The Guarantee',
      subtitle: 'Strict Leakage-Free Design',
      description: 'Trained exclusively on zero-future-leakage attributes. We exclude post-dispatch tracking events so predictions are mathematically valid at checkout.',
      icon: ShieldCheck,
      tint: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      isSpecial: true,
    },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Two-Column Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="eyebrow-pill">ABOUT THE SYSTEM</div>
            
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built for Real-World Logistics Intelligence
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed">
              Standard logistics tools rely on reactive tracking updates. The Olist Risk Predictor transforms raw checkout metadata into proactive delay forecasting. By leveraging geographic Haversine distance, carrier volumetric ratios, and seller fulfillment lag, we empower operations managers to intervene before delays happen.
            </p>

            <div>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors group"
              >
                <span>View the 4-step pipeline</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right Side: Mini Pipeline Graphic (Order -> Features -> Model -> Risk) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="saas-card bg-card p-6 space-y-6 border-indigo-500/20">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
                  Data Flow Pipeline
                </span>
                <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ACTIVE PIPELINE
                </span>
              </div>

              {/* Compact Pipeline Nodes */}
              <div className="grid grid-cols-4 gap-2 items-center text-center py-2">
                
                {/* Node 1: Order */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400">
                    <Database className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Order</span>
                  <span className="text-[10px] text-muted-foreground font-mono">16 Inputs</span>
                </div>

                {/* Node 2: Features */}
                <div className="flex flex-col items-center gap-2 relative">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <FileCheck2 className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Engine</span>
                  <span className="text-[10px] text-muted-foreground font-mono">44 Features</span>
                </div>

                {/* Node 3: Model */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-indigo">
                    <Cpu className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">MLP Net</span>
                  <span className="text-[10px] text-muted-foreground font-mono">PyTorch / Scikit</span>
                </div>

                {/* Node 4: Risk */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Gauge className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Risk Score</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Action Plan</span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Animated Large Stat Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-subtle grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className={`space-y-2 text-center ${idx !== 0 ? 'pt-6 sm:pt-0' : ''}`}>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Story Flow: Problem -> Solution -> Guarantee */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="eyebrow-pill">STORY FLOW</div>
            <h3 className="text-2xl font-bold text-foreground">Engineered with Purpose</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`saas-card relative space-y-4 ${
                    step.isSpecial ? 'border-indigo-500/40 bg-indigo-500/[0.03]' : ''
                  }`}
                >
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${step.tint}`}>
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground font-semibold">
                      {step.step}
                    </span>
                  </div>

                  {/* Verified Badge if Special */}
                  {step.isSpecial && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Zero-Data-Leakage</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 font-mono">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
