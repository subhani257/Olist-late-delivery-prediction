<!--
  PRESENTATION CONTENT — Olist Late Delivery Prediction
  IT3051 Fundamentals of Data Mining — Executive Group Presentation
  Theme: Next-Gen Executive Dashboard / Dark Mode / High Contrast Modern Aesthetics
  Format: Ready for presentation deck, Gamma (gamma.app), or Slide export
-->

# 🚀 EXECUTIVE PRESENTATION DECK
## Project: Olist Late Delivery Early Warning System
**Module:** IT3051 Fundamentals of Data Mining  
**Dataset:** Olist Brazilian E-Commerce (~96,470 Orders)

---

## 📊 SLIDE DIRECTORY (13 SLIDES)

1. **Title Slide** — *Project & Team Introduction*
2. **The Business Problem** — *Cost & Impact of Delayed Orders*
3. **Objective & Key Stakeholders** — *Who Benefits & Operational Goals*
4. **Data Architecture & Source** — *The Foundation & 9 CSV Datasets*
5. **Key Findings (EDA)** — *Patterns, Geographies & Review Drop*
6. **Data Preparation & Leakage Prevention** — *Clean Pipeline & Engineering*
7. **Solution Architecture** — *End-to-End Machine Learning Pipeline*
8. **Model Performance & Evaluation** — *Comparing 4 Algorithms*
9. **What Drives Delays?** — *Top Predictive Drivers & Feature Importance*
10. **System Live Demo** — *Real-Time Order Risk Scoring Interface*
11. **Actionable Business Recommendations** — *3-Tiered Operational Strategy*
12. **Limitations & Future Roadmap** — *Model Boundaries & Next Steps*
13. **Conclusion & Q&A** — *Final Takeaways & Wrap-up*

---

# 🖼️ SLIDE-BY-SLIDE CONTENT & DESIGN SPECIFICATIONS

---

### SLIDE 1 — TITLE SLIDE
#### 🎯 *Late Delivery Early Warning System*
**Sub-title:** Predictive Analytics to Safeguard Customer Satisfaction in E-Commerce

```
┌────────────────────────────────────────────────────────────────────────┐
│                        [ 📦 OLIST E-COMMERCE ]                         │
│                                                                        │
│               LATE DELIVERY EARLY WARNING SYSTEM                       │
│           Using Data Mining to Predict Delays at Order Time            │
│                                                                        │
│  👥 Group Members:  [Member A]  |  [Member B]  |  [Member C]  | [Member D]│
│  📚 Course:         IT3051 Fundamentals of Data Mining                 │
│  📅 Date:           Academic Year 2026                                 │
└────────────────────────────────────────────────────────────────────────┘
```

* **Visual Style:** Sleek dark indigo background with glowing logistics route overlays and 🟢 🟡 🔴 status badges.
* **Speaker Note (0:15):** "Good morning/afternoon. Today we present our Data Mining solution for Olist E-commerce: an early-warning system that flags high-risk delivery delays at the exact second an order is placed."

---

### SLIDE 2 — THE BUSINESS PROBLEM
#### ⚠️ *1 in 12 Orders Arrives Late — Crushing Customer Trust*

* **Key Stats Callout Cards:**
  * 🛑 **8.1% Overall Late Rate:** ~7,826 out of 96,470 delivered orders arrived past the promised date.
  * 🗺️ **Regional Disparity:** **14.3%** late rate in the Northeast vs. **7.1%** in the South.
  * 🚚 **Distance Spike:** Orders traveling >1,500 km have a **13.1%** delay rate (vs 6.3% for <250 km).
  * 🌟 **Review Score Collapse:** Average review score drops from **4.15 / 5.0** (on-time) down to **2.25 / 5.0** (late).

```
[ CHART 1: ON-TIME VS LATE ORDERS (DONUT CHART) ]
  ├── 🟢 On-Time: 91.9% (88,644 orders)
  └── 🔴 Late:      8.1% (7,826 orders)

[ CHART 2: REVIEW SCORE IMPACT (BAR CHART) ]
  ├── On-Time Orders: ⭐⭐⭐⭐✦ (4.15 / 5)
  └── Late Orders:    ⭐⭐✦✧✧ (2.25 / 5)  <-- 46% Drop in CSAT!
```

* **Visual Style:** Split layout — Left: Stat callout cards; Right: Dual impact charts (Donut & Review Score Bar).
* **Speaker Note (0:45):** "Over 8% of Olist orders arrive late, causing a catastrophic drop in review scores from 4.15 down to 2.25. The delays are disproportionately high over long distances and regional hubs."

---

### SLIDE 3 — OBJECTIVE & WHO BENEFITS
#### 🎯 *Predict Risk at Order Time to Empower Stakeholders*

* **Primary Objective:** Predict whether an incoming order will be delivered late using **ONLY** data available at checkout.
* **Stakeholder Impact Grid:**

| Stakeholder | Pain Point Solved | Operational Action Enabled |
| :--- | :--- | :--- |
| 🏬 **Olist Operations** | Unseen bottleneck delays | Route high-risk shipments to express fulfillment channels |
| 🏷️ **Sellers** | Bad reviews & seller penalties | Dispatch high-risk packages with priority handling |
| 🎧 **Customer Support** | Inundated with "Where is my order?" | Send proactive status updates before complaints occur |
| 👤 **Customers** | Unrealistic delivery promises | Receive transparent, realistic delivery timeframes |

* **Visual Style:** 4-quadrant feature cards with modern icons and glowing border highlights.
* **Speaker Note (0:40):** "Our model empowers operations, sellers, and support teams to transition from reactive firefighting to proactive delay management."

---

### SLIDE 4 — DATA ARCHITECTURE & SOURCE
#### 𝌺 *96,470 Orders Integrated Across 9 Datasets*

* **Data Source:** Official Olist E-Commerce Public Dataset (Kaggle / Olist Analytics).
* **Scope:** 96,470 cleaned order records from 2016 to 2018 across Brazil.

```
[ DATA INTEGRATION PIPELINE ]
  olist_orders ────┬──> olist_customers (ZIP, City, State)
                   ├──> olist_sellers (ZIP, City, State)
                   ├──> olist_order_items (Price, Freight, Dimensions)
                   ├──> olist_order_payments (Method, Installments)
                   └──> olist_geolocation (738k Deduplicated ZIP Centroids)
                                 │
                                 ▼
                     [ 96,470 Preserved Orders x 67 Engineered Signals ]
```

* **Data Integrity & Citation:**
  * Strict leakage controls: Excluded post-checkout features (carrier scan dates, actual delivery timestamps, review text).
  * Citation: *Olist Brazilian E-Commerce Dataset (2016–2018), Published on Kaggle.*

* **Visual Style:** Sleek flow diagram mapping input tables into the master dataset.
* **Speaker Note (0:45):** "We unified 9 distinct relational tables into 96,470 validated orders, generating 67 predictive features without introducing post-checkout data leakage."

---

### SLIDE 5 — KEY FINDINGS (EDA)
#### 📈 *Data Signals: Where & When Delays Happen*

```
[ CHART 3: DELAY RATE BY CUSTOMER REGION (BAR CHART) ]
  Northeast      ████████████████ 14.3%
  North          ██████████████ 12.5%
  Central-West   ██████████ 9.2%
  Southeast      ███████ 7.3%
  South          ██████ 7.1%

[ CHART 4: DISTANCE vs LATE RATE (BOXPLOT / BUCKETS) ]
  0 - 250 km     ██████ 6.3%
  250 - 500 km   ███████ 7.2%
  500 - 1000 km  █████████ 8.8%
  1500+ km       ███████████████ 13.1%

[ CHART 5: MONTHLY DELAY TREND & SEASONALITY (LINE CHART) ]
  Spikes observed during peak shopping events (Black Friday / Nov-Dec holiday rush).
```

* **Key Takeaway ("So What?"):**
  * Geography + Distance account for >50% of delay variance.
  * Cross-state orders carry a **9.3%** late rate vs. **6.0%** for same-state orders.

* **Visual Style:** 3-chart grid layout with key takeaways highlighted in amber callout banners.
* **Speaker Note (1:00):** "EDA reveals clear structural patterns: Northeast deliveries and long-haul distances (>1500 km) double the risk of late arrival, exacerbated by holiday volume surges."

---

### SLIDE 6 — DATA PREPARATION & LEAKAGE PREVENTION
#### 🧹 *Turning Raw Noise into Clean Predictive Signals*

* **3-Step Engineering Pipeline:**
  1. **Data Cleaning & Geolocation:**
     * Resolved 1M+ geolocation rows to median ZIP-prefix centroids.
     * Calculated exact **Haversine Distance (km)** between seller & customer.
  2. **Feature Engineering (67 Features Created):**
     * `freight_to_price_ratio`: High freight ratio signals heavy/complex logistics.
     * `estimated_delivery_days`: Promised turnaround time window.
     * `approval_lag_hours`: Processing time prior to warehouse release.
     * `distance_x_items`: Cross-interaction between item count and shipping distance.
  3. **Strict Leakage Prevention Guarantee:**
     * Chronological 70% Train / 15% Validation / 15% Test split (no future data bleeding into past).

* **Visual Style:** Clean step-by-step horizontal roadmap with badges for each step.
* **Speaker Note (0:45):** "We engineered 67 signals like Haversine distance and freight ratios, while strictly splitting data chronologically to ensure realistic model evaluation."

---

### SLIDE 7 — SOLUTION ARCHITECTURE
#### ⚙️ *End-to-End Machine Learning Pipeline*

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        ML ARCHITECTURE PIPELINE                           │
├──────────────┬──────────────────┬──────────────────┬──────────────────────┤
│  1. INGEST   │  2. PREPROCESS   │    3. PREDICT    │      4. ACTION       │
│  Order Specs │ Scaling & Target │ Deep Neural Net  │ Risk Score & Badge   │
│  at Checkout │     Encoding     │    (MLP Model)   │  🟢 Low | 🟡 Med | 🔴 High│
└──────────────┴──────────────────┴──────────────────┴──────────────────────┘
```

* **Multi-Model Benchmark Strategy:** Tested 4 distinct machine learning approaches:
  1. Deep Neural Network (MLP)
  2. Logistic Regression (Baseline Linear Model)
  3. LightGBM / Gradient Boosting Trees
  4. Random Forest Classifier

* **Visual Style:** High-tech modular workflow diagram with directional vector arrows.
* **Speaker Note (0:40):** "Our architecture transforms raw checkout attributes through a neural model to output instant risk classifications."

---

### SLIDE 8 — MODEL RESULTS & COMPARISON
#### 🏆 *Evaluating the 4 Contenders*

```
[ CHART 6: MODEL COMPARISON (PR-AUC & ROC-AUC BAR CHART) ]

  Model                 Val PR-AUC 🛈     Val ROC-AUC     Rank
  ────────────────────────────────────────────────────────────
  ⭐ Neural Net (MLP)    0.1773            0.7766          #1 (Champion)
  Logistic Regression   0.1606            0.7718          #2
  LightGBM              0.1508            0.7408          #3
  Random Forest         0.1505            0.7389          #4
```

```
[ CHART 7: UNSEEN TEST CONFUSION MATRIX HEATMAP (MLP AT OPTIMAL THRESHOLD) ]

                   Predicted On-Time       Predicted Late
  Actual On-Time   11,110 (True Neg)       2,404 (False Alarm)
  Actual Late         709 (Missed)           248 (Caught Late! ⭐)
```

* **Plain-English Business Impact:**
  * Out of 957 truly late orders in the unseen test set, the system successfully catches **248 late orders (26% Recall)** at checkout time!

* **Visual Style:** Left: Comparative Model Bar Chart; Right: Clean 2x2 Confusion Matrix Heatmap.
* **Speaker Note (1:10):** "The Neural Network achieved the highest PR-AUC of 0.1773. On unseen test orders, it successfully flags 1 out of 4 late orders before they even ship."

---

### SLIDE 9 — WHAT DRIVES LATE DELIVERIES
#### 🔑 *Top 10 Delay Drivers Identified by Model*

```
[ CHART 8: TOP 10 FEATURE IMPORTANCES / WEIGHTS (HORIZONTAL BAR CHART) ]

  Haversine Distance (km)          ████████████████████ 100%
  Promised Delivery Days Window    █████████████████ 85%
  Freight-to-Price Ratio           ██████████████ 70%
  Customer State Risk Score        ████████████ 60%
  Seller Approval Lag (Hours)      ██████████ 50%
  Product Weight (g)               ████████ 40%
  Freight Value (R$)               ███████ 35%
  Seller Region                    ██████ 30%
  Item Count in Order              █████ 25%
  Payment Installment Count        ████ 20%
```

* **Executive Insights:**
  1. **Geographic Distance** is the #1 single determinant of delivery failure.
  2. **Unrealistic Promises:** Unusually tight `estimated_delivery_days` set at checkout trigger high risk.
  3. **High Freight Ratio:** Items with heavy freight relative to price reflect complex cargo handling.

* **Visual Style:** Sleek horizontal progress bars with percentage impact scale.
* **Speaker Note (0:50):** "Distance, tight delivery windows, and freight-to-price ratios are the top predictors driving delay risk in our model."

---

### SLIDE 10 — SYSTEM LIVE DEMO
#### 🖥️ *Real-Time Order Risk Scoring Interface*

* **Interactive Demo Overview (App Running on Port 3000 / API Port 8002):**

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OLIST EARLY WARNING DASHBOARD                   │
├──────────────────────────────────┬─────────────────────────────────────┤
│  INPUT ORDER DETAILS             │  PREDICTION RESULT                  │
│  Customer ZIP: 69000 (Amazonas)  │  ┌───────────────────────────────┐  │
│  Estimated Days: 7 Days (Tight!) │  │  🔴 HIGH RISK (Probability:64%)│  │
│  Freight: R$ 80.00 | Weight: 8kg │  └───────────────────────────────┘  │
│                                  │  RECOMMENDED ACTION:                │
│  [ PREDICT DELIVERY RISK ]       │  • Contact express carrier          │
│                                  │  • Notify customer proactively      │
└──────────────────────────────────┴─────────────────────────────────────┤
```

* **Demo Walkthrough Scenarios:**
  * 🟢 **Scenario 1 (Low Risk):** Local SP order, 26-day delivery window → **Result: 🟢 Low Risk (12%)**.
  * 🔴 **Scenario 2 (High Risk):** Long-distance to Manaus (AM), 7-day window, heavy parcel → **Result: 🔴 High Risk (64%)**.

* **Visual Style:** Side-by-side app UI screenshots or live browser toggle.
* **Speaker Note (1:30):** "Here is our live system in action. By inputting order specs, the system instantly outputs a color-coded risk badge and actionable intervention steps."

---

### SLIDE 11 — BUSINESS RECOMMENDATIONS
#### 💡 *3-Tier Operational Strategy for Olist*

```
┌────────────────────────────────────────────────────────────────────────┐
│                      OPERATIONAL RISK MATRIX                           │
├───────────────┬──────────────────────┬─────────────────────────────────┤
│ RISK TIER     │ TRIGGER CONDITION    │ MANDATED BUSINESS ACTION        │
├───────────────┼──────────────────────┼─────────────────────────────────┤
│ 🔴 HIGH RISK  │ Risk Prob > 55%      │ • Reroute to priority carriers  │
│               │                      │ • Send proactive delay notice   │
├───────────────┼──────────────────────┼─────────────────────────────────┤
│ 🟡 MEDIUM RISK│ Risk Prob 30% - 55%  │ • Monitor dispatch queue       │
│               │                      │ • Flag seller for 24h dispatch  │
├───────────────┼──────────────────────┼─────────────────────────────────┤
│ 🟢 LOW RISK   │ Risk Prob < 30%      │ • Standard fulfillment flow     │
└───────────────┴──────────────────────┴─────────────────────────────────┤
```

* **3 Strategic Business Pillars:**
  1. **Dynamic Delivery Estimates:** Adjust checkout delivery promises for high-risk ZIP codes (Northeast/North).
  2. **Proactive Customer Messaging:** Send early SMS/Email notifications before the customer files a complaint.
  3. **Seller SLA Enforcement:** Partner with sellers exhibiting high approval lag to optimize warehouse dispatch.

* **Visual Style:** Clear 3-tier action table with color-coded risk badges.
* **Speaker Note (1:00):** "We recommend a 3-tier operational response: High-risk orders trigger priority shipping and proactive messaging, drastically cutting customer dissatisfaction."

---

### SLIDE 12 — LIMITATIONS & FUTURE ROADMAP
#### 🔮 *Honest Boundaries & Continuous Improvement*

* **Current Model Limitations:**
  * 📅 **Static Historical Dataset:** Trained on 2016–2018 data (post-COVID carrier dynamics not captured).
  * ⚖️ **Imbalanced Target Class:** Only 8.1% positive class rate limits maximum precision without high false alarms.
  * 🌦️ **External Variables Excluded:** Real-time carrier traffic, weather disruptions, and strike data unavailable at order time.

* **Future Roadmap:**

```
[ FUTURE ENHANCEMENTS ROADMAP ]
  ├── 1. Live Weather & Traffic API Integration
  ├── 2. Real-Time Carrier Performance Tracking
  └── 3. Automated Reinforcement Retraining Pipeline
```

* **Visual Style:** Split layout — Left: Warning card for limits; Right: Step-by-step roadmap arrows.
* **Speaker Note (0:40):** "While highly effective, the model relies on historical data. Integrating real-time weather and carrier APIs will be our next phase."

---

### SLIDE 13 — CONCLUSION & Q&A
#### 🎉 *Transforming Delivery Risks into Customer Trust*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KEY TAKEAWAYS                                   │
│                                                                        │
│  1. 8.1% of orders arrive late, causing a 46% drop in customer review. │
│  2. Our Neural Network catches 26% of late deliveries at order time.   │
│  3. Proactive actions safeguard customer loyalty & reduce support costs.│
│                                                                        │
│                      THANK YOU FOR YOUR TIME!                          │
│                         Questions & Answers                            │
└────────────────────────────────────────────────────────────────────────┘
```

* **Visual Style:** Elegant high-contrast summary card with team contact info & Q&A prompt.
* **Speaker Note (0:15):** "In conclusion, early risk detection turns potential delivery failures into customer touchpoints. Thank you, and we welcome your questions!"

---
