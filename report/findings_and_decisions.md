# Findings and Decisions Log

Shared log — each member adds their own section as they go. This feeds
directly into the Technical Report and your individual viva prep, so keep
it updated per PR, not all at once at the end.

---

## Member A — Orders & Target

### EDA findings
-

### Preprocessing decisions and justification
-

### Target definition
-

### Leakage rules identified
-

---

## Member B — Customers, Sellers, Geolocation

### EDA findings
-

### Preprocessing decisions and justification
-

---

## Member C — Products & Order Items

### EDA findings

*   **Multiple item rows can belong to one order**
*   **Item counts vary between orders**
*   **Some orders contain multiple sellers**
*   **Price/freight are skewed**
*   **Product fields contain missing values**
*   **Categories are high-cardinality and long-tailed**
*   **Extreme physical values exist**
*   **`shipping_limit_date` is available at order time**
*   **Post-delivery fields exist elsewhere in the dataset**

### Preprocessing decisions and justification

*   **Aggregation Strategy:** Aggregate to one row per order for `item_count` and `distinct_seller_count`.
*   **Price/Freight Skew:** Flag outliers instead of deleting; keep raw totals (referencing Section 7.5 of the notebook).
*   **Missing Product Fields:** Impute weight/dimensions by category median; flag missingness (referencing Section 7.3 of the notebook).
*   **Category Handling:** Group rare categories into "other" before counting/choosing a dominant one (referencing Section 7.6 of the notebook).
*   **Extreme Physical Values:** Investigate; treat only demonstrably invalid values as errors.
*   **Shipping Limit Date:** Carry min/max through per order for Member D (referencing Section 7.7 of the notebook).
*   **Leakage Prevention:** Do not create leakage features from post-delivery fields.


## Member D — Payments & Final Merge

### EDA findings
-

### Preprocessing decisions and justification
-

### Merge validation (row counts before/after each join)
-
