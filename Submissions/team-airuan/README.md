**Diabetes Readmission Data Preprocessing**

*Overview*

This project focuses on cleaning and preprocessing the Diabetes 130-US hospitals dataset to prepare it for machine learning. The dataset contains medical, demographic, and medication information for diabetic patients, with the goal of predicting hospital readmission.

*Data Cleaning Steps*

Handled Missing Values

Removed rows with missing diagnosis like values with(?).

Dropped rows with excessive null values where columns cant be dropped

Replaced missing categorical data where necessary.

Processed Diagnosis Columns

Cleaned special ICD-9 codes (V, E).

Grouped diagnosis codes (diag_1, diag_2, diag_3) into broader disease categories:

Circulatory, Respiratory, Digestive, Diabetes, Injury, Musculoskeletal, Genitourinary, Neoplasms, Other.

Converted Age Range to Numeric using mid point logic like [30-40) → 35.

Converted race, gender, and other categorical columns to numeric form using label encoding or mapping.

Transformed Medication Columns

Converted drug usage columns (metformin, glipizide, glyburide, etc.) into numerical format:

No → 0, Down → -1, Steady → 1, Up → 2

Converted All Numeric Columns

Ensured all columns were properly converted to integer (int64) data types for modeling.

🧩 *Feature and Target Split*

Features (X): All columns except readmitted

Target (y): readmitted (patient readmission status)

Used train_test_split() from scikit-learn to divide data into:

80% Training set

20% Testing set

*Model Used*:

Logistic Regression with acc of 89%

Random Forest with acc of 89%

