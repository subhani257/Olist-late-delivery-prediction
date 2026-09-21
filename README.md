# Late Delivery Prediction — Olist E-Commerce (IT3051 Mini Project)

Predicting whether a newly placed order is at risk of being delivered later
than its promised estimated delivery date, using order-time features only.

## Setup

1. Download the dataset from Kaggle:
   https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce
2. Extract all CSV files into `data/raw/`
3. Create a virtual environment and install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Folder structure

```
data/raw/          original Kaggle CSVs (not tracked in git — download yourself)
data/processed/    each member's cleaned output table
notebooks/         one notebook per member, numbered by merge order
src/               reusable helper functions (optional, later)
models/            saved trained models (Stage 6-7)
app/               backend + frontend (Stage 9-10)
report/            shared findings and decisions log
```

## Team & ownership

| Member | Notebook                                     | Tables owned                                       | Output file                          |
|--------|-----------------------------------------------|------------------------------------------------------|----------------------------------------|
| A      | `01_orders_target_eda_preprocessing.ipynb`    | orders, target engineering                          | `orders_clean.csv`                     |
| B      | `02_customer_seller_geo_eda_preprocessing.ipynb` | customers, sellers, geolocation                   | `customers_sellers_geo_clean.csv`      |
| C      | `03_products_items_eda_preprocessing.ipynb`   | order_items, products, category translation         | `products_items_clean.csv`             |
| D      | `04_payments_eda_preprocessing.ipynb`         | order_payments                                       | `payments_clean.csv`                   |
| D      | `05_final_merge_train_test_split.ipynb`       | merges all four processed files                      | final modelling-ready dataset          |

## Target variable

`is_late_delivery` — 1 if `order_delivered_customer_date` is later than
`order_estimated_delivery_date`, else 0. Computed only for delivered orders.
Full definition, leakage rules, and preprocessing decisions are documented in
`report/findings_and_decisions.md`.

## Workflow

- Don't commit directly to `main` — create a branch per member (e.g. `member-a-eda`)
- Push your branch and open a Pull Request into `main` when your notebook is ready
- Merge order: A, B, C first — D merges last since `05_final_merge` depends on
  the other three's processed CSVs
- Update `report/findings_and_decisions.md` as part of your PR, not at the end
