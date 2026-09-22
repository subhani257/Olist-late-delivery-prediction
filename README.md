# 📦 Late Delivery Risk Prediction — Olist Brazilian E-Commerce

> Predicting, at order-placement time, whether a newly placed order is at risk of arriving later than its promised delivery date — so marketplace operations and sellers can intervene before a customer is disappointed.

**Course:** IT3051 — Fundamentals of Data Mining (SLIIT, 2026) · **Team size:** 4 · **Status:** 🚧 In progress (dataset validated, EDA/preprocessing underway)

---

## Table of Contents

- [Problem statement](#problem-statement)
- [Dataset](#dataset)
- [Target variable](#target-variable)
- [Project structure](#project-structure)
- [Setup](#setup)
- [Team & ownership](#team--ownership)
- [Workflow](#workflow)
- [Roadmap](#roadmap)
- [Tech stack](#tech-stack)
- [License](#license)

---

## Problem statement

Olist connects small and medium-sized Brazilian businesses to major online marketplaces, then ships orders to customers through third-party carriers. A meaningful share of orders arrive after the delivery date promised at checkout — driving complaints, refunds, and lost trust — and the risk varies by seller, product, and destination region.

This project builds an early-warning classifier that estimates the probability a new order will be **late**, using only information available **before dispatch**, and surfaces it as a simple risk category (Low / Medium / High) that operations and support teams can act on.

## Dataset

**[Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)** — ~99,000 real, anonymised orders (2016–2018) across 9 relational CSV files covering orders, items, products, customers, sellers, payments, reviews, and geolocation.

License: CC BY-NC-SA 4.0. See [`report/findings_and_decisions.md`](report/findings_and_decisions.md) for the full dataset proposal, data-quality notes, and licensing details.

## Target variable

```
is_late_delivery = 1  if order_delivered_customer_date > order_estimated_delivery_date
                  = 0  otherwise
```

Computed only for orders with `order_status == 'delivered'`. Non-delivered orders (cancelled, lost, in transit) are handled as a separate, explicitly documented category — not silently dropped or mislabeled.

⚠️ **Leakage note:** post-dispatch fields (`order_delivered_carrier_date`, `order_delivered_customer_date`, `order_status`, review fields) are excluded from the feature set — they either define the target or only exist after the outcome is known. Full leakage rules are documented in [`report/findings_and_decisions.md`](report/findings_and_decisions.md).

## Project structure

```
├── data/
│   ├── raw/                # original Kaggle CSVs — not tracked in git, download yourself
│   └── processed/          # cleaned, order-level tables produced by each notebook
├── notebooks/
│   ├── 01_orders_target_eda_preprocessing.ipynb
│   ├── 02_customer_seller_geo_eda_preprocessing.ipynb
│   ├── 03_products_items_eda_preprocessing.ipynb
│   ├── 04_payments_eda_preprocessing.ipynb
│   └── 05_final_merge_train_test_split.ipynb
├── src/                     # reusable helper functions
├── models/                  # saved trained models (Stage 6-7)
├── app/                     # backend + frontend prediction system (Stage 9-10)
├── report/
│   └── findings_and_decisions.md   # shared EDA/preprocessing log — feeds the Technical Report
├── requirements.txt
└── README.md
```

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/IT3051-late-delivery-prediction.git
cd IT3051-late-delivery-prediction

# 2. Download the dataset
# https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
# extract all CSVs into data/raw/

# 3. Create an environment and install dependencies
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 4. Launch Jupyter
jupyter notebook
```

## Team & ownership

Each member owns their tables end-to-end — EDA, preprocessing, and feature engineering together, not split by stage — so every person can defend their own decisions independently.

| Member | Tables owned | Notebook | Output |
|---|---|---|---|
| **A** | Orders, target engineering | `01_orders_target_eda_preprocessing.ipynb` | `orders_clean.csv` |
| **B** | Customers, sellers, geolocation | `02_customer_seller_geo_eda_preprocessing.ipynb` | See Member B output contract below |
| **C** | Order items, products, category translation | `03_products_items_eda_preprocessing.ipynb` | `products_items_clean.csv` |
| **D** | Payments + final merge | `04_payments_eda_preprocessing.ipynb`, `05_final_merge_train_test_split.ipynb` | `payments_clean.csv` → merged dataset |

### Member B output contract

1. `data/processed/geolocation_zip_clean.csv`
   - Grain: one row per ZIP prefix
   - Purpose: cleaned ZIP-level lookup containing representative coordinates, location labels, and approved quality diagnostics
2. `data/processed/customers_geo_clean.csv`
   - Grain: one row per `customer_id`
   - Purpose: cleaned and geographically enriched customer records
3. `data/processed/sellers_geo_clean.csv`
   - Grain: one row per `seller_id`
   - Purpose: cleaned and geographically enriched seller records
4. `data/processed/order_geo_features.csv`
   - Grain: one row per `order_id`
   - Purpose: primary Member B feature dataset for downstream order-level integration

Member B's findings and decisions are maintained under **Member B — Customer, Seller and Geolocation Analysis** in [`report/findings_and_decisions.md`](report/findings_and_decisions.md).

## Workflow

1. Work on your own branch (`git checkout -b member-a-eda`) — never commit directly to `main`
2. Commit early and often inside your own notebook and output file
3. Open a Pull Request into `main` when your piece is ready
4. **Merge order matters:** A, B, C merge first — D merges last, since the final-merge notebook depends on all three processed files existing
5. Update `report/findings_and_decisions.md` as part of your PR, not at the end — it's your viva prep and it feeds the Technical Report directly

## Roadmap

- [x] Problem scenario defined
- [x] Dataset selected and validated
- [ ] EDA & preprocessing (Progress Evaluation 1)
- [ ] Feature engineering & baseline models
- [ ] Hyperparameter tuning & model comparison (Progress Evaluation 2)
- [ ] Backend prediction service
- [ ] Frontend interface
- [ ] Technical report & final presentation

## Tech stack

`Python` · `pandas` · `scikit-learn` · `XGBoost` · `imbalanced-learn` · `matplotlib` / `seaborn` · `Jupyter`

## License

Dataset: CC BY-NC-SA 4.0 (Olist, via Kaggle). Project code: for academic use as part of IT3051 coursework.
