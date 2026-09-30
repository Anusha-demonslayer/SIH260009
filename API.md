# MANGANEX AI — API Specification
### REST Endpoints Reference (SIH26009)

| Method | Endpoint | Description | Sample Output |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health check and model version telemetry | Status, version, capabilities |
| `POST` | `/api/auth/login` | Officer / Evaluator JWT authentication | JWT token, officer profile |
| `GET` | `/api/mines` | List all monitored MOIL manganese mines | Array of Mine entities |
| `GET` | `/api/mines/{id}` | Retrieve individual mine specifications | Mine metadata, geology, target TPD |
| `GET` | `/api/exploration/zones` | Retrieve ranked prospective target zones | Target IDs, coordinates, scores |
| `POST` | `/api/exploration/predict` | Execute ML mineral prospectivity inference | Prospectivity score, SHAP values, hash |
| `GET` | `/api/prospectivity/map` | Geospatial layers for Leaflet GIS canvas | Targets, drill-holes, reserve blocks |
| `GET` | `/api/reserves` | UNFC-compliant reserve blocks & diamond assays | Estimated tonnage Mt, average % Mn |
| `POST` | `/api/reserves/estimate` | Execute Inverse Distance Weighting (IDW) | 2D interpolated grade grid, variance |
| `GET` | `/api/production/history` | Historical daily production and rainfall records | 365-day time-series array |
| `POST` | `/api/production/forecast` | Multi-horizon production forecast (7/30/90 days) | Quantile bounds, risk classification |
| `GET` | `/api/shortfall/risk` | Upcoming daily shortfall risk calendar | Daily risk level (LOW/MED/HIGH/CRIT) |
| `POST` | `/api/shortfall/explain` | Causal Bayesian root-cause dependency graph | Node causal weights, allocated losses |
| `GET` | `/api/equipment` | Heavy fleet telemetry and health summaries | Availability %, MTBF, MTTR |
| `POST` | `/api/equipment/predict-failure` | Predictive maintenance failure risk & RUL | Failure risk %, remaining useful hours |
| `GET` | `/api/weather` | Current weather and 14-day IMD radar forecast | Rainfall mm, road derating factor |
| `GET` | `/api/satellite/scenes` | Copernicus Sentinel-1/2 & Landsat-9 catalog | Resolution, cloud cover %, band ratios |
| `POST` | `/api/simulation/run` | What-If discrete-event mine simulator | Baseline vs Simulated TPD & ₹ Lakhs |
| `GET` | `/api/recommendations` | Active prescriptive operational directives | Directives, expected impact, trade-offs |
| `POST` | `/api/copilot/query` | Grounded mining domain conversational assistant | Grounded text response, source links |
| `POST` | `/api/data/upload` | Ingest external CSV/GeoJSON assay records | Schema validation report, outlier count |
| `GET` | `/api/evidence` | Immutable cryptographic audit ledger | SHA-256 hashes, feature snapshots |
| `POST` | `/api/reports/generate` | Generate exportable audit dossiers | Report ID, executive summary, print data |
| `GET` | `/api/models` | MLOps model monitoring and drift statistics | Version history, ROC-AUC, MAE |
