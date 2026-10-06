import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Cog, 
  BrainCircuit, 
  Gauge, 
  Zap, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Data Ingestion',
      icon: FileText,
      tag: 'Raw Metadata',
      description: 'Collects order timestamps, customer/seller postal codes, product weight & dimensions, freight costs, and payment installments directly at checkout.',
      detail: 'Validates 16 primary purchase parameters prior to warehouse dispatch.',
    },
    {
      number: '02',
      title: 'Feature Engineering',
      icon: Cog,
      tag: '44 Computed Features',
      description: 'Calculates spatial Haversine distance, freight-to-price ratios, volumetric parcel density, and seller fulfillment lag.',
      detail: 'Server-side feature builder executes in < 40ms.',
    },
    {
      number: '03',
      title: 'MLP Neural Network',
      icon: BrainCircuit,
      tag: 'PyTorch / Scikit-Learn',
      description: 'Feeds standardized features through a trained Multi-Layer Perceptron neural network calibrated for optimal classification performance.',
      detail: '0.7766 ROC-AUC probability scoring calibrated against 10% decision threshold.',
    },
    {
      number: '04',
      title: 'Risk Score & Action Plan',
      icon: Gauge,
      tag: 'Instant Action',
      description: 'Generates low/medium/high risk rating alongside actionable operational recommendations for warehouse dispatch teams.',
      detail: 'Provides automated carrier reassignment or priority dispatch warnings.',
      isHighlighted: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="eyebrow-pill">PROCESS FLOW</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How the Risk Engine Works
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From raw checkout payload to instant risk score in under 1 second.
          </p>
        </div>

        {/* Continuous Connecting Line & Stepper Container */}
        <div className="relative">
          
          {/* Desktop Continuous Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-border -z-10">
            <motion.div
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-indigo-500"
            />
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === idx;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`saas-card relative flex flex-col justify-between transition-all duration-300 ${
                    step.isHighlighted
                      ? 'border-indigo-500/40 bg-indigo-500/[0.04] shadow-indigo'
                      : 'bg-card'
                  } ${isHovered ? 'scale-[1.03] shadow-card-hover' : ''}`}
                >
                  <div className="space-y-4 text-left">
                    {/* Numbered Circular Node Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-sm transition-colors ${
                          step.isHighlighted
                            ? 'bg-indigo-600 text-white shadow-indigo'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {step.number}
                      </div>

                      <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-500/10 text-muted-foreground border border-slate-500/20">
                        {step.tag}
                      </span>
                    </div>

                    {/* Step Title & Icon */}
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-5 h-5 text-indigo-500 stroke-[1.75]" />
                      <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Interactive Expand Detail on Hover */}
                    <div
                      className={`text-xs p-2.5 rounded-xl transition-all duration-200 ${
                        isHovered
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 opacity-100'
                          : 'bg-muted/40 text-muted-foreground opacity-90'
                      }`}
                    >
                      <span className="font-mono text-[11px] font-semibold block mb-0.5">Runtime Spec:</span>
                      {step.detail}
                    </div>
                  </div>

                  {/* Step 4 Special Risk Badge Row */}
                  {step.isHighlighted && (
                    <div className="mt-6 pt-4 border-t border-indigo-500/20 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground block">
                        Risk Class Thresholds
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] font-bold">
                        <div className="py-1 px-1.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                          LOW &lt;30%
                        </div>
                        <div className="py-1 px-1.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/20">
                          MED 30-55%
                        </div>
                        <div className="py-1 px-1.5 rounded bg-red-500/15 text-red-500 border border-red-500/20">
                          HIGH &gt;55%
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Latency Guarantee Badge */}
        <div className="flex justify-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-xs font-mono text-muted-foreground shadow-subtle">
            <Zap className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
            <span>Sub-second Server-Side Execution (<span className="text-indigo-500 font-semibold">&lt; 100ms average inference</span>)</span>
          </div>
        </div>

      </div>
    </section>
  );
};
