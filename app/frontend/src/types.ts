export interface PredictFormData {
  purchase_datetime: string;
  estimated_delivery_date: string;
  customer_zip_prefix: number;
  seller_zip_prefix: number;
  product_category: string;
  price: number;
  freight_value: number;
  weight_g: number;
  length_cm: number;
  height_cm: number;
  width_cm: number;
  payment_type: string;
  installments: number;
  item_count: number;
  seller_count: number;
  approval_lag_hours: number;
}

export interface PredictionResponse {
  predicted_class: number;
  probability: number;
  risk_level: 'Low' | 'Medium' | 'High';
  recommendation: string;
  thresholds?: {
    low: number;
    high: number;
  };
  features_used?: Record<string, any>;
  features_available?: number;
}
