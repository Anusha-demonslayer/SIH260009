# MANGANEX AI — System Architecture
### SIH26009 • MOIL Limited

```
+-----------------------------------------------------------------------------------+
|                            SPACE OBSERVATION SENSORS                              |
|  [Copernicus Sentinel-2]     [Sentinel-1 SAR Dual-Pol]    [USGS Landsat-9 OLI-2]  |
|  (B02, B04, B08, B11, B12)    (VV, VH Backscatter, Rough)   (LST Thermal Band 10) |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            GEOSPATIAL & SATELLITE ENGINE                          |
|  - Bottom-Of-Atmosphere (BOA) Level-2A Surface Reflectance Calibration            |
|  - Multi-spectral Mineral Indices (Iron Oxide B4/B2, Hydroxyl/Clay B11/B12)       |
|  - Polarimetric Radar Surface Roughness Decomposition                             |
|  - SRTM 30m Hydro-Enforced DEM (Elevation, Slope, TPI, Drainage Stream Buffers)   |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             DATA FUSION & AI/ML CORE                              |
|  1. Mineral Prospectivity Model (XGBoost & Spatial Random Forest)                 |
|  2. SHAP Explainability Engine (Feature Impact Waterfalls & Attributions)         |
|  3. Inverse Distance Weighting (IDW) 2D/3D Geostatistical Interpolator            |
|  4. Production Shortfall Forecaster (LightGBM Multi-Horizon Time-Series)          |
|  5. Causal Bayesian Root-Cause Graph (Weather ➔ Haul Road ➔ Fleet ➔ Crusher)      |
|  6. Heavy Equipment Predictive Maintenance (Isolation Forest CAN-bus Telemetry)   |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            OPERATIONAL APPLICATION LAYER                          |
|  - Real-Time Command Center (8 Key Performance Indicators)                        |
|  - Interactive GIS Leaflet Geospatial Viewport (Layer Toggling, Inspections)      |
|  - Production Shortfall Radar (Daily Timeline Risk & Gap Analysis)                |
|  - What-If Mine Digital Twin Simulator (Interactive Levers & Revenue Deltas)      |
|  - Manganex AI Copilot (Domain-Grounded Natural Language Assistant)               |
|  - Cryptographic Evidence Ledger (SHA-256 Signatures for IBM/UNFC Compliance)     |
+-----------------------------------------------------------------------------------+
```

## Data Connectors Architecture

Every connector adheres to standard operational lifecycle methods:
- `fetch()`: Authenticated retrieval from space or SCADA endpoints.
- `validate()`: Schema sanitization, outlier filtering, and EPSG coordinate validation.
- `normalize()`: Radiometric calibration, cloud masking, and unit normalization.
- `cache()`: Local Redis / file cache with TTL eviction.
- `status()`: Live latency and telemetry health monitoring.
