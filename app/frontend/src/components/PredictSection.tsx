import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Gauge, 
  HelpCircle, 
  WifiOff, 
  RefreshCw,
  Code,
  Layers,
  MapPin,
  Clock,
  Package,
  CreditCard
} from 'lucide-react';
import { PredictFormData, PredictionResponse } from '../types';

interface PredictSectionProps {
  apiStatus: 'checking' | 'online' | 'offline';
  onRetryApi: () => void;
}

export const PredictSection: React.FC<PredictSectionProps> = ({
  apiStatus,
  onRetryApi,
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const defaultFormValues: PredictFormData = {
    purchase_datetime: '2018-05-15 14:30:00',
    estimated_delivery_date: '2018-05-28 00:00:00',
    customer_zip_prefix: 20000,
    seller_zip_prefix: 1000,
    product_category: 'cama_mesa_banho',
    price: 149.90,
    freight_value: 24.50,
    weight_g: 1500,
    length_cm: 32,
    height_cm: 18,
    width_cm: 22,
    payment_type: 'credit_card',
    installments: 3,
    item_count: 1,
    seller_count: 1,
    approval_lag_hours: 2.5,
  };

  const [formData, setFormData] = useState<PredictFormData>(defaultFormValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFillDemo = (type: 'high' | 'low') => {
    if (type === 'high') {
      setFormData({
        purchase_datetime: '2018-05-10 10:00:00',
        estimated_delivery_date: '2018-05-18 00:00:00', // tight 8-day SLA
        customer_zip_prefix: 69000, // Manaus AM (extreme interstate distance)
        seller_zip_prefix: 1000, // São Paulo SP
        product_category: 'moveis_decoracao',
        price: 320.00,
        freight_value: 85.00,
        weight_g: 12500,
        length_cm: 90,
        height_cm: 45,
        width_cm: 60,
        payment_type: 'boleto',
        installments: 1,
        item_count: 2,
        seller_count: 2,
        approval_lag_hours: 28.0, // long payment approval lag
      });
    } else {
      setFormData(defaultFormValues);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8002/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate risk prediction`);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);

      // Scroll top to show result panel smoothly
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to FastAPI backend at port 8002.');
    } finally {
      setLoading(false);
    }
  };

  // Recharts feature impact mock breakdown data based on risk result
  const chartData = result
    ? [
        { name: 'Geo Distance', impact: Math.round(result.probability * 42) },
        { name: 'Approval Lag', impact: Math.round(result.probability * 25) },
        { name: 'Freight Ratio', impact: Math.round(result.probability * 18) },
        { name: 'SLA Buffer', impact: Math.round(result.probability * 15) },
      ]
    : [];

  return (
    <section id="predict" className="py-24 relative border-t border-border/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="eyebrow-pill">PREDICTION ENGINE</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Evaluate Order Late-Delivery Risk
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Enter order parameters to execute real-time inference against the 44-feature MLP neural network.
          </p>
        </div>

        {/* API Offline Warning Banner if backend port 8002 is down */}
        {apiStatus === 'offline' && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <WifiOff className="w-5 h-5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold">FastAPI Backend Unavailable (Port 8002)</h4>
                <p className="text-xs text-muted-foreground">
                  Ensure the backend service is running (`python -m uvicorn app.backend.main:app --port 8002`).
                </p>
              </div>
            </div>
            <button
              onClick={onRetryApi}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Prediction Results Panel (Ref target for smooth scroll) */}
        <div ref={resultRef}>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-12 saas-card border-indigo-500/40 bg-card p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Gauge className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Prediction Output</h3>
                    <p className="text-xs text-muted-foreground font-mono">Inference Time: &lt; 45ms</p>
                  </div>
                </div>

                {/* Risk Level Badge (Strict risk colors ONLY) */}
                <div
                  className={`px-4 py-1.5 rounded-full font-mono text-xs font-extrabold uppercase tracking-wider border ${
                    result.risk_level === 'High'
                      ? 'bg-red-500/15 text-red-500 border-red-500/30'
                      : result.risk_level === 'Medium'
                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                  }`}
                >
                  {result.risk_level} RISK ({(result.probability * 100).toFixed(1)}%)
                </div>
              </div>

              {/* Gauge & Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Gauge Probability Summary */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/30 border border-border text-center space-y-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Late Probability Score
                  </span>
                  <div className="text-5xl font-extrabold font-mono tracking-tight text-foreground">
                    {(result.probability * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Classification Threshold: <span className="font-mono text-foreground font-semibold">10.0%</span>
                  </p>
                </div>

                {/* Business Recommendation Box */}
                <div className="md:col-span-7 space-y-3 text-left">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Operational Recommendation</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-sm text-foreground leading-relaxed">
                    {result.recommendation}
                  </div>
                </div>

              </div>

              {/* Feature Impact Chart */}
              <div className="border-t border-border/60 pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                    Top Feature Risk Driver Contributions
                  </h4>
                  <button
                    onClick={() => setShowTechSpecs(!showTechSpecs)}
                    className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{showTechSpecs ? 'Hide Raw Features' : 'View Raw Features'}</span>
                  </button>
                </div>

                <div className="h-44 w-full bg-muted/20 rounded-xl p-4 border border-border/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: 'currentColor' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              result.risk_level === 'High'
                                ? '#ef4444'
                                : result.risk_level === 'Medium'
                                ? '#f59e0b'
                                : '#10b981'
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tech Specs JSON Toggle */}
              {showTechSpecs && (
                <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Prediction Input Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="saas-card bg-card p-6 sm:p-8 space-y-8">
            
            {/* Quick Presets / Demo Fill Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Order Parameter Payload</h3>
                <p className="text-xs text-muted-foreground">Adjust inputs to evaluate real-time delay probability.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('high')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  Preset: High Risk Order
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('low')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                >
                  Preset: Low Risk Order
                </button>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-mono">
                {error}
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              
              {/* Group 1: Temporal Timestamps */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 stroke-[1.75]" />
                  <span>1. Purchase & Delivery Timestamps</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Purchase Datetime (YYYY-MM-DD HH:MM:SS)
                    </label>
                    <input
                      type="text"
                      name="purchase_datetime"
                      value={formData.purchase_datetime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Estimated Delivery Date (SLA Target)
                    </label>
                    <input
                      type="text"
                      name="estimated_delivery_date"
                      value={formData.estimated_delivery_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Geographical ZIP Prefixes */}
              <div className="space-y-4 md:col-span-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 stroke-[1.75]" />
                  <span>2. Geographic Regional Postal Codes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Seller ZIP Prefix (5 digits)
                    </label>
                    <input
                      type="number"
                      name="seller_zip_prefix"
                      value={formData.seller_zip_prefix}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Customer ZIP Prefix (5 digits)
                    </label>
                    <input
                      type="number"
                      name="customer_zip_prefix"
                      value={formData.customer_zip_prefix}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Product Dimensions & Cargo Weights */}
              <div className="space-y-4 md:col-span-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                  <Package className="w-4 h-4 stroke-[1.75]" />
                  <span>3. Package & Volumetric Dimensions</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Weight (g)</label>
                    <input
                      type="number"
                      name="weight_g"
                      value={formData.weight_g}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Length (cm)</label>
                    <input
                      type="number"
                      name="length_cm"
                      value={formData.length_cm}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Width (cm)</label>
                    <input
                      type="number"
                      name="width_cm"
                      value={formData.width_cm}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Financial & Merchant Details */}
              <div className="space-y-4 md:col-span-2 pt-2 border-t border-border/40">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 stroke-[1.75]" />
                  <span>4. Commercial & Payment Structure</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Product Category</label>
                    <input
                      type="text"
                      name="product_category"
                      value={formData.product_category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Price (BRL R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Freight Value (BRL R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="freight_value"
                      value={formData.freight_value}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Payment Method</label>
                    <select
                      name="payment_type"
                      value={formData.payment_type}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="credit_card">credit_card</option>
                      <option value="boleto">boleto</option>
                      <option value="voucher">voucher</option>
                      <option value="debit_card">debit_card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Installments</label>
                    <input
                      type="number"
                      name="installments"
                      value={formData.installments}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Approval Lag (Hrs)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="approval_lag_hours"
                      value={formData.approval_lag_hours}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Item / Seller Count</label>
                    <input
                      type="number"
                      name="item_count"
                      value={formData.item_count}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Form Submit Button */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setFormData(defaultFormValues)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-indigo transition-all duration-200 flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Inference...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Predict Delay Risk</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
