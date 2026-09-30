# MANGANEX AI — Machine Learning Pipelines & Explainability
### SIH26009 • MOIL Limited

## 1. Mineral Prospectivity Model (`ProspectXGB-v3.2.1`)
- **Objective:** Compute probability of manganese gossan alteration across unmined concession sectors.
- **Model Architecture:** Gradient Boosted Trees (XGBoost) combined with Spatial Random Forest ensemble.
- **Feature Vector:**
  1. *Spectral:* Band ratios $B11/B12$ (hydroxyl absorption index), $B04/B02$ (iron oxide ratio), $B12/B08$ (ferrous mineral index), and $NDVI$ canopy mask.
  2. *SAR Texture:* Sentinel-1 $VV$, $VH$, $VV/VH$ depolarization ratio, and Gray-Level Co-occurrence Matrix (GLCM) roughness.
  3. *Geological Stratigraphy:* Proximity to Sausar Group Mansar Formation host schist horizon and major fault lineaments.
  4. *Topographic:* Elevation, slope gradient, and Topographic Position Index ($TPI$).
- **Explainability:** SHAP (SHapley Additive exPlanations) values decompose positive drivers (e.g. $+26\%$ SWIR anomaly) and negative suppressors (e.g. $-8\%$ dense vegetation obstruction).
- **Validation Mandate:** Predictions are strictly tagged as **"Prospectivity Target Zones"** requiring diamond-core drilling before resource declaration.

## 2. Production Shortfall Forecaster (`MineForecastEnsemble-v2.8`)
- **Objective:** Predict daily manganese ore production (Tonnes/day) over 7, 30, and 90-day forward horizons.
- **Model Architecture:** LightGBM time-series regression with quantile regression bounds (10th, 50th, 90th percentiles).
- **Exogenous Drivers:**
  - IMD Doppler radar 72-hour precipitation forecast ($mm$).
  - Fleet availability index (from equipment CAN-bus telemetry).
  - Blasting schedule delays and explosive loading lead times.
  - Crusher feed bin inventory buffer levels.

## 3. Heavy Equipment Predictive Maintenance (`EquipmentRUL-v1.9`)
- **Objective:** Predict unplanned mechanical breakdown and Remaining Useful Life (RUL) within 72-hour horizon.
- **Model Architecture:** Isolation Forest anomaly detection coupled with Weibull Survival hazard estimation.
- **Telemetry Monitored:** Main hydraulic pump pressure ($PSI$), engine cooling fluid temperature ($^\circ C$), bearing tri-axial RMS vibration ($mm/s$), and cumulative operating hours.
