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
