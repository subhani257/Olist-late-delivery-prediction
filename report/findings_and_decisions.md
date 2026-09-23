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

## Member B — Customer, Seller and Geolocation Analysis

### A. Purpose and ownership

Member B owns the customer, seller, and geolocation domains end to end: data understanding, geographic EDA, preprocessing, enrichment, feature engineering, validation, and documentation. The primary source datasets are customers, sellers, and geolocation. Raw CSVs remain read-only.

Orders and order items are used only as relationship bridges. Orders contributes `order_id` and `customer_id`; order items contributes `order_id` and `seller_id`. Member B does not preprocess Member A's order outcomes or target, Member C's item/product fields, or Member D's final integration.

### B. Source structures and grains

| Dataset | Executed structure | Grain | Key finding |
|---|---:|---|---|
| Customers | 99,441 rows x 5 columns | One order-specific record per `customer_id` | `customer_id` is unique. There are 96,096 unique `customer_unique_id` values; 2,997 repeat across 6,342 rows, with a maximum repetition of 17. |
| Sellers | 3,095 rows x 4 columns | One row per `seller_id` | `seller_id` is unique. |
| Geolocation | 1,000,163 rows x 5 columns | One observed ZIP-prefix coordinate record | ZIP prefix is intentionally non-unique and requires aggregation. |

All ZIP-prefix columns were loaded as strings. Every loaded ZIP retained five characters, including leading zeros.

Customer records are concentrated in SP (41,746), RJ (12,852), and MG (11,635). Sellers are concentrated in SP (1,849 of 3,095), followed by PR (349) and MG (244). These are descriptive representation findings, not target-related conclusions.

### C. Missingness and duplicate findings

Every audited column in the three raw source datasets has zero missing values. Source completeness does not guarantee enrichment coverage because an entity ZIP may be absent from the geolocation lookup or may lack valid centroid coordinates.

Customers and sellers contain zero exact duplicate rows. Raw geolocation contains 1,000,163 rows, including 261,831 exact duplicate rows (26.1788%). Full-row exact deduplication leaves 738,332 rows.

The raw geolocation DataFrame remains unchanged. Deduplication occurs in a separate `geolocation_deduplicated` copy before cleaning and aggregation, preventing repeated identical coordinates from receiving additional centroid weight.

### D. Coordinate validation

The accepted broad Brazilian bounds are latitude `[-34, 6]` and longitude `[-74, -34]`. After exact deduplication, observed values range from -36.6054 to 45.0659 latitude and -101.4668 to 121.1054 longitude.

Exactly 33 coordinate records across 21 ZIP prefixes have at least one coordinate outside the accepted bounds. Component checks find 4 below the latitude minimum, 23 above the latitude maximum, 4 west of the longitude minimum, and 25 east of the longitude maximum; conditions overlap.

The records are preserved for auditing, but invalid latitude and longitude values are masked before centroid calculation. They therefore do not influence median centroids and are never replaced with zero. IQR rules identify 130,286 latitude and 28,738 longitude statistical outliers, but these values are not automatically removed because statistical extremeness alone does not establish geographic invalidity.

### E. ZIP conflicts and centroid methodology

The source contains 19,015 distinct ZIP prefixes. Of these, 17,972 have multiple raw records, 17,823 have multiple unique records after exact deduplication, 15,287 lose at least one exact duplicate, 17,781 have multiple coordinate pairs, 548 have multiple normalized city labels, and 8 have multiple states.

The largest prefix has 1,146 raw records and 779 unique records. One prefix loses as many as 724 exact duplicates; the largest observed conflicts are four city labels and two state labels for one prefix.

Exact duplicates are removed before aggregation. Representative latitude and longitude are medians of valid deduplicated observations. Median coordinates use all valid unique evidence, are less sensitive than a mean to unusual observations, and are more defensible than selecting an arbitrary row.

The resulting lookup contains 19,015 rows and 19,015 unique ZIP keys. It uses 738,299 valid deduplicated coordinate records; five ZIP prefixes have no valid centroid and remain null. `geo_raw_record_count`, `geo_unique_record_count`, and `geo_exact_duplicates_removed`, along with coordinate and label-conflict counts, preserve reproducibility and source-quality evidence. One row per ZIP is required to support validated many-to-one entity enrichment without multiplying customer or seller rows.

### F. Regional engineering

City text is normalized consistently without unsupported manual corrections. State abbreviations are stripped, uppercased, and validated against all 27 Brazilian federal units. Every state maps deterministically to North, Northeast, Central-West, Southeast, or South.

The mapping produces `customer_region` and `seller_region`, with zero missing customer, seller, or ZIP-level regions. Region is lower-cardinality and more manageable than city labels, which are high-cardinality and vulnerable to sparse categories and unstable encodings. The Southeast contains 68,266 customer records and 2,287 sellers; the North contains 1,851 customer records and 5 sellers.

### G. Customer enrichment

All 99,441 customer records are preserved and `customer_id` remains unique. Exactly 99,163 records match the ZIP-level lookup, giving 99.72% match coverage.

Exactly 278 customer records have ZIP prefixes that do not match the ZIP-level geolocation lookup. This is a count of customer records, not distinct unmatched ZIP-prefix values. One additional customer record matches a lookup row whose valid centroid coordinates are unavailable, so 279 customer records lack coordinates. Missing coordinates remain null and are represented by `customer_geolocation_missing`; they are not replaced with zero.

The ZIP enrichment join passes explicit many-to-one validation and causes no row increase.

### H. Seller enrichment

All 3,095 seller records are preserved and `seller_id` remains unique. Exactly 3,088 records match the ZIP lookup, giving 99.77% coverage. Seven sellers lack coordinates. The many-to-one enrichment join passes, row count is preserved, and missing coordinates remain null with an explicit indicator.

### I. Relationship construction

The orders bridge connects `order_id` to `customer_id`; it contains 99,441 rows and 99,441 unique order IDs. The order-items bridge connects `order_id` to `seller_id`; it contains 112,650 rows across 98,666 orders. Neither bridge contains a missing relationship identifier.

Repeated `order_id`-`seller_id` pairs are removed so one seller is not counted repeatedly merely because it supplied multiple item rows. Removing 12,640 repeated pairs leaves 100,010 unique order-seller relationships across 98,666 orders.

Orders join to customer geography with one-to-one validation, preserving 99,441 rows. Unique order-seller relationships join to seller geography and then order customer geography with many-to-one validation, preserving all 100,010 rows. Member B does not load or preprocess order status, timestamps, target fields, products, prices, freight, or item characteristics.

### J. Distance and order-level aggregation

Vectorized Haversine distance uses customer and seller ZIP-centroid latitude and longitude with Earth's mean radius. It is appropriate for reproducible great-circle separation from coordinate pairs without a road network, but it is a straight-line geographic proxy rather than route length, travel time, traffic, logistics cost, or carrier performance.

Distance is available for 99,510 of 100,010 order-seller relationships; 500 relationship rows lack at least one coordinate endpoint. Missing endpoints remain missing.

After order-seller deduplication, multiple sellers are aggregated to order level using geographic seller count, distinct seller states, distinct seller regions, nullable any/all same-state indicators, nullable any/all same-region indicators, minimum distance, average distance, maximum distance, and customer/seller missing-coordinate indicators. Nullable comparisons prevent unknown geography from being incorrectly labelled cross-state or cross-region.

### K. Final order-level output

`order_geo_features` contains 99,441 rows and 15 columns, exactly one row per unique non-missing `order_id`. There is no row change from the orders bridge.

There are 775 orders without an order-seller bridge relationship. Distance is available for 98,176 orders and missing for 1,265 orders (1.2721%). There are 279 orders with missing customer coordinates and 220 linked orders with at least one seller missing coordinates. Missing distances are never replaced with zero.

For orders with distance, average Haversine distance has mean 601.3627 km and median 433.8321 km; the maximum observed order-level distance is 3,579.2670 km. All final grains, keys, binary domains, non-negative counts, distance ordering, and distance bounds pass validation.

### L. Feature decisions

Member B's feature decisions are domain-based and provisional. Final statistical and model-based selection remains downstream and must use training data only after the chronological split.

**Provisionally retained:** customer state and region; geographic seller count; distinct seller states and regions; any/all same-state and same-region indicators; minimum, average, and maximum Haversine distance; customer and seller missing-coordinate indicators.

**Key-only:** `order_id`, entity identifiers, and raw ZIP prefixes. `order_id` is a downstream merge key, not a predictor.

**Excluded from the baseline order output:** high-cardinality city labels, raw seller labels at multi-seller order grain, and raw latitude/longitude. Direct city or ZIP modelling risks sparse rare levels, memorization, unstable encodings, and false numeric ordinality for ZIP values.

**Diagnostic-only:** geolocation raw, unique, and duplicate counts; coordinate-validity and out-of-bounds counts; and city/state conflict counts. These remain in the ZIP lookup for audit and do not enter `order_geo_features`.

State, region, distance summaries, agreement indicators, and seller-diversity counts may overlap. They are retained provisionally and should be reviewed with training-only correlation, stability, and model evidence rather than deleted automatically.

### M. Prediction point and leakage controls

The intended prediction point is **after the order and its items are confirmed, but before delivery occurs**. Seller count and seller geographic-diversity features are safe only because associated sellers are known at that point.

Actual customer or carrier delivery dates may be used only by Member A to construct the approved target; they must not be predictors. Actual delivery duration, late-day counts, post-delivery reviews, cancellation outcomes, later lifecycle fields, and other future information are prohibited.

Full-dataset target-derived geographic aggregates, such as regional late-delivery rates calculated using every row, are prohibited because they expose validation and future outcomes. Encoders, imputers, scalers, resampling procedures, target encoders, and model-based feature selectors must be fitted on training data only. Member B does not perform the chronological split or construct the target.

### N. Limitations

- Geolocation coverage is incomplete for a small number of entity ZIPs.
- Five ZIP prefixes lack a valid centroid after coordinate validation.
- ZIP-prefix centroids approximate locations and do not represent exact addresses.
- Haversine distance is not road-network distance, route time, traffic, or carrier performance.
- Missing coordinate endpoints leave 1,265 orders without distance.
- State, region, distance, and agreement fields may be correlated or redundant.
- Target-related geographic differences are observational associations and do not establish causality.
- Small state, multi-seller, and missing-coordinate groups have less stable late-rate estimates.
- The full-sample statistical tests support description only; feature stability must be checked after the chronological split.
- Final statistical and model-based feature selection remains downstream.

### O. Processed outputs

All four Member B outputs have been created, reloaded, and validated:

1. `data/processed/geolocation_zip_clean.csv` - 19,015 rows x 13 columns; one row per ZIP prefix.
2. `data/processed/customers_geo_clean.csv` - 99,441 rows x 9 columns; one row per `customer_id`.
3. `data/processed/sellers_geo_clean.csv` - 3,095 rows x 8 columns; one row per `seller_id`.
4. `data/processed/order_geo_features.csv` - 99,441 rows x 15 columns; one row per `order_id`.

`order_geo_features.csv` is Member B's primary downstream order-level feature file. Reload validation confirms expected shapes and schemas, unique non-missing keys, zero exact output duplicates, five-character ZIP prefixes, no unnamed index columns, and no target or post-delivery columns.

### P. Target-related geographic EDA

Member B used Member A's approved `data/processed/orders_clean.csv` without recreating or changing its target. Only `order_id` and `is_late_delivery` were read. The target population contains **96,470 unique eligible orders**, with **88,644 on time (91.8876%)** and **7,826 late (8.1124%)**, an **11.3269:1** majority-to-minority ratio.

The diagnostic outer comparison found **96,470 shared orders**, zero Member A-only orders, and **2,971 Member B-only orders**. This follows Member A's documented eligibility rules: non-delivered orders and eight delivered rows without a known actual delivery timestamp are not labelled. The temporary inner merge is validated one-to-one and is not saved; `is_late_delivery` remains absent from all Member B processed outputs.

Customer region shows a descriptive contrast: Northeast is **14.3299% late (1,296 / 9,044)**, compared with North 9.7996%, Central-West 7.9659%, Southeast 7.4509%, and South 7.0513%. State-level rates are reported with counts, and small groups are not used for strong conclusions.

Orders with at least one cross-state seller are **9.2817% late**, versus **6.0422%** when at least one seller shares the customer state. The corresponding all-seller comparison is 9.2463% versus 6.0824%. Region-agreement differences are smaller. All agreement indicators are available for the eligible target population.

Late orders have a higher average Haversine-distance mean (**737.4032 km** versus **588.4166 km**) and median (**511.7607 km** versus **426.7138 km**). The average-distance rank-biserial effect is small at **0.1252**. Fixed exploratory bands rise from **6.3029% late below 250 km** to **13.0688% at 1,500+ km**. These documented bands are descriptive rather than universal logistics thresholds, and Haversine distance is not road distance.

Multi-seller and multi-region orders are rare, so their low observed rates are not treated as robust evidence. Missing customer coordinates cover 265 eligible orders, missing seller coordinates 217, and missing average distance 477; their target-rate differences are documented without causal interpretation.

Two-sided Mann-Whitney U tests find small positive distance shifts, with rank-biserial effects from **0.1235 to 0.1271**. Chi-square expected counts are adequate for the reported comparisons, but Cramer's V remains small: **0.0745** for customer region, at most **0.0569** for agreement indicators, and **0.0064** for distance availability. Statistical significance is not used alone to select features.

Geographic features remain provisional. Downstream work must use a chronological split; evaluate precision, recall, F1-score, ROC-AUC, and especially PR-AUC; review correlated geographic fields; and fit resampling, class weighting, imputation, encoding, scaling, and model-based feature selection on training data only. Member C retains item/product ownership, and Member D retains final-merge ownership.

### Q. Viva questions and concise answers

#### 1. Why are ZIP prefixes used?

They are the shared geographic key across customers, sellers, and geolocation. Loading them as five-character strings preserves leading zeros and supports reproducible enrichment.

#### 2. Why does geolocation contain repeated ZIP prefixes?

Its grain is an observed coordinate record, not one row per ZIP. Of 19,015 prefixes, 17,972 have multiple raw records and 17,781 have multiple coordinate pairs.

#### 3. Why were exact duplicates removed?

The 261,831 exact duplicates would give identical observations additional weight. A separate deduplicated copy is used before centroid calculation while raw counts and the raw DataFrame are preserved.

#### 4. Why were median coordinates used?

The median represents all valid unique coordinate observations while reducing sensitivity to unusual points. It is more robust and reproducible than selecting an arbitrary row.

#### 5. Why were orders and order items required?

Orders links `customer_id` to `order_id`; order items links sellers to orders. Member B reads only the relationship columns needed to create order-level geography.

#### 6. Why do many-to-one and one-to-one validations matter?

They enforce the intended grain. A malformed lookup or duplicate key raises an error instead of silently multiplying rows and corrupting counts or distances.

#### 7. Why use Haversine distance?

It efficiently provides reproducible straight-line separation from latitude and longitude without road-network data. Its route-distance limitation is stated explicitly.

#### 8. How are multiple sellers aggregated?

Repeated order-seller pairs are removed, then sellers are summarized with counts, geographic diversity, nullable any/all state and region comparisons, and minimum, average, and maximum distance.

#### 9. How is leakage prevented?

Only information available after item and seller confirmation but before delivery is used. Post-outcome fields and full-dataset target aggregates are excluded, and learned preprocessing must be fitted on training data only.

#### 10. Why was Member A's target used instead of recreating it?

Member A owns the approved target and eligibility rules. Reading only `order_id` and `is_late_delivery` preserves one authoritative label and prevents inconsistent filtering or accidental outcome leakage.

#### 11. What did Member B contribute personally?

Member B audited and cleaned customer, seller, and geolocation data; removed exact-duplicate weighting; investigated coordinates and ZIP conflicts; built robust ZIP centroids and regions; enriched customers and sellers; engineered and validated order-level geographic features; and documented feature decisions, leakage controls, validation, and limitations.

#### 12. What class imbalance was observed?

There are 88,644 on-time and 7,826 late eligible orders, or 91.8876% versus 8.1124%. The 11.3269:1 ratio means accuracy alone is insufficient.

#### 13. How were unmatched orders handled?

All Member A target orders match Member B. The 2,971 Member B-only orders remain unlabelled under Member A's documented eligibility rules and are excluded from target-related EDA.

#### 14. What target-related geographic relationships were observed?

Northeast, cross-state, and longer-distance groups have higher observed late rates, but distributions overlap and effect sizes are small. These are associations, not causal conclusions.

#### 15. Why is the target absent from `order_geo_features.csv`?

Keeping the reusable predictor table target-free prevents leakage and preserves Member A's ownership. The target is attached only in the temporary EDA dataset or in downstream modelling data.

#### 16. Why are the findings associative rather than causal?

The data are observational. Geography correlates with routes, seller mix, infrastructure, season, and other factors, so a rate difference does not prove geography caused lateness.

#### 17. Which downstream metrics are appropriate?

Precision, recall, F1-score, ROC-AUC, and especially PR-AUC should supplement accuracy because late deliveries are the minority class.

#### 18. Where may imbalance handling and learned preprocessing occur?

Only after the chronological split and only on training data. Validation and test outcomes must not influence weighting, resampling, imputation, encoding, scaling, or feature selection.

#### 19. Did these comparisons select geographic features?

No. Final selection requires training-only evidence from stability, redundancy, practical effect size, and model performance.

---

## Member C — Products & Order Items

### EDA findings
-

### Preprocessing decisions and justification
-

---

## Member D — Payments & Final Merge

### EDA findings
- **Data Quality**: No missing values, no duplicate payment records, no negative values detected
- **Payment Type Distribution**: Credit card dominant (73.9%), followed by boleto (19.0%), voucher (5.6%), debit card (1.5%), and 3 records with 'not_defined' (negligible)
- **Installments**: Range 0-24, with most orders having 1 installment (no installments). Credit cards show highest installment counts, boleto typically has 0 installments
- **Payment Values**: Highly right-skewed distribution, most values under R$500, significant number of high-value outliers present
- **Multiple Payment Methods**: ~5% of orders have multiple payment methods, most common combination is credit_card + voucher
- **Payment Sequential**: Most orders have sequential value of 1, with higher values indicating multiple payment methods per order

### Preprocessing decisions and justification
- **'not_defined' Handling**: 3 records with 'not_defined' payment type were replaced with 'other' category due to negligible count
- **Aggregation Strategy**: Multiple payment records per order were aggregated using sum for total value, max for installments, and primary payment type determination (highest value payment method)
- **Outlier Handling**: Used IQR method to flag payment value outliers (created outlier_payment_count feature). Kept raw values as they may represent legitimate high-value transactions
- **Binary Flags Fix**: Used pd.get_dummies() instead of apply(lambda x: pd.Series()) to create payment type flags, avoiding the stacking bug that would cause 5× row multiplication
- **Feature Engineering**: Created 16 order-level features including payment method count, transaction count, binary flags for each payment type, max/total installments, and derived features like average payment value per transaction
- **Feature Refinements**: 
  - Added payment_transaction_count to distinguish between distinct payment types vs actual transaction count
  - Fixed average_payment_value to divide by transaction count (not distinct types) for accurate "per payment" calculation
  - Removed installment_ratio feature due to unclear business meaning
- **High-Value Orders**: Created is_high_value_order flag (above 75th percentile) to capture premium orders that may have different delivery patterns

**Final Payment Features (16 total):**
1. order_id - Unique identifier
2. total_payment_value - Sum of all payment values
3. payment_method_count - Number of distinct payment methods (e.g., credit_card + boleto = 2)
4. max_installments - Maximum installments across payment methods
5. total_installments - Sum of installments across payment methods
6. outlier_payment_count - Number of outlier payment records
7. payment_transaction_count - Actual number of payment transaction records
8. has_credit_card - Binary flag for credit card usage
9. has_boleto - Binary flag for boleto usage
10. has_voucher - Binary flag for voucher usage
11. has_debit_card - Binary flag for debit card usage
12. has_other - Binary flag for 'other' payment type
13. primary_payment_type - Payment type with highest value
14. average_payment_value - Average value per transaction (total_payment_value / payment_transaction_count)
15. is_high_value_order - Flag for orders above 75th percentile

### Merge validation (row counts before/after each join)
- To be completed after Members A, B, C finish their preprocessing
