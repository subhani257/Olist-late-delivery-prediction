import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Clock, 
  Box, 
  Cpu, 
  Layers, 
  TrendingUp, 
  CreditCard, 
  ShoppingBag, 
  Compass, 
  Sparkles,
  BarChart3
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Distance & Geo', 'Time Features', 'Product Specs', 'AI Model'];

  const features = [
    {
      id: 'mlp-core',
      size: 'large', // 2x2
      category: 'AI Model',
      title: 'MLP Neural Network Core',
      description: 'Multi-Layer Perceptron architecture trained on historical Olist dispatch logs, reaching 0.7766 ROC-AUC for high-precision delay detection.',
      icon: Cpu,
      callout: '0.7766 ROC-AUC Champion Model',
      svgType: 'roc',
    },
    {
      id: 'geo-engine',
      size: 'wide', // 2x1
      category: 'Distance & Geo',
      title: 'Geospatial Distance Engine',
      description: 'Haversine distance calculation between seller and customer ZIP prefixes across Brazilian states, quantifying interstate shipping friction.',
      icon: Globe,
      svgType: 'haversine',
    },
    {
      id: 'lead-time',
      size: 'small', // 1x1
      category: 'Time Features',
      title: 'Lead-Time Modelling',
      description: 'Fulfillment lag tracking between order placement and carrier dispatch to identify seller prep delays.',
      icon: Clock,
    },
    {
      id: 'volumetric',
      size: 'small', // 1x1
      category: 'Product Specs',
      title: 'Package Volumetric Analysis',
      description: 'Calculates physical package volume (cm³) and weight ratios to flag bulky cargo freight bottlenecks.',
      icon: Box,
    },
    {
      id: 'freight-ratio',
      size: 'small', // 1x1
      category: 'Product Specs',
      title: 'Freight Ratio Calculator',
      description: 'Evaluates freight cost as a percentage of item price, flagging low-margin or complex long-haul shipping.',
      icon: TrendingUp,
    },
    {
      id: 'payment-lag',
      size: 'small', // 1x1
      category: 'Time Features',
      title: 'Payment Delay Monitor',
      description: 'Tracks approval lag hours and credit card installment complexity impacting warehouse release times.',
      icon: CreditCard,
    },
    {
      id: 'seller-concentration',
      size: 'small', // 1x1
      category: 'Distance & Geo',
      title: 'Seller Concentration Index',
      description: 'Measures multi-seller order splitting risks when items must be consolidated from different regions.',
      icon: ShoppingBag,
    },
    {
      id: 'delivery-window',
      size: 'small', // 1x1
      category: 'Time Features',
      title: 'Estimated Delivery Buffer',
      description: 'Evaluates seasonal carrier buffer windows vs realistic SLA targets across 27 Brazilian regions.',
      icon: Compass,
    },
  ];

  const filteredFeatures = features.filter(
    (f) => activeFilter === 'All' || f.category === activeFilter
  );

  return (
    <section id="features" className="py-24 relative border-t border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="eyebrow-pill">KEY FEATURES</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Architected for Complete Predictive Intelligence
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            44 engineered features extracted across spatial, temporal, physical, and financial logistics dimensions.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';
            const isWide = feature.size === 'wide';

            return (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`saas-card flex flex-col justify-between ${
                  isLarge ? 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-card via-card to-indigo-500/[0.04]' : ''
                } ${isWide ? 'md:col-span-2' : ''}`}
              >
                {/* Top Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-full bg-slate-500/10 text-muted-foreground border border-slate-500/20">
                      {feature.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className={`font-bold text-foreground ${isLarge ? 'text-xl' : 'text-base'}`}>
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Visual Mini Illustrations for Large & Wide Cards */}
                {isLarge && (
                  <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {feature.callout}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">ROC Curve</span>
                    </div>
                    {/* Mini SVG ROC Curve */}
                    <div className="h-28 w-full bg-muted/30 rounded-xl p-3 border border-border/40 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        {/* Diagonal reference line */}
                        <line x1="0" y1="50" x2="100" y2="0" stroke="currentColor" strokeDasharray="3 3" className="text-muted/40" />
                        {/* ROC Curve Line */}
                        <path
                          d="M 0 50 Q 20 10, 50 8 T 100 0"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                        />
                        <circle cx="50" cy="8" r="3" fill="#6366f1" />
                      </svg>
                    </div>
                  </div>
                )}

                {isWide && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between border border-border/40">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Seller ZIP</span>
                        <span className="text-muted-foreground">---- Haversine ----&gt;</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Customer ZIP</span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        27 States Covered
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
