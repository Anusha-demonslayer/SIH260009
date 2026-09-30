# MANGANEX AI — AI-Powered Manganese Exploration & Production Intelligence
### Smart India Hackathon 2026 • Problem Statement ID: SIH26009
**Organization:** MOIL Limited (Ministry of Steel / Ministry of Mines, Govt. of India)  
**Title:** *“Using AI/ML and Space Technology to Identify Manganese Reserves and Overcome Production Shortfalls.”*

---

## 1. Executive Summary

MANGANEX AI is an industrial-grade Mining Intelligence Command Center built to solve India's strategic manganese resource challenges. It fuses space-borne satellite remote sensing (Copernicus Sentinel-2 multispectral, Sentinel-1 SAR), digital elevation terrain (SRTM 30m), structural geology (Geological Survey of India 1:50k Sausar Group maps), verified diamond-core drill hole assays, and high-frequency SCADA equipment telemetry into a real-time operational decision system.

### Key Tenet: Scientific Mineral Exploration Integrity
> **Notice:** Satellite imagery alone does **not** directly prove underground manganese reserves. MANGANEX AI identifies high-confidence **Prospectivity Target Zones** through verified multispectral and radar alteration anomalies. Certification of Proved/Probable reserves mandates ground geological validation and diamond core drilling in accordance with **UNFC-1997 / JORC** codes.

---

## 2. Core Capabilities

| Capability | Technical Mechanism | Operational Benefit |
| :--- | :--- | :--- |
| **Mineral Prospectivity Mapping** | Sentinel-2 SWIR band ratios (B11/B12 hydroxyl, B04/B02 iron oxide) + Sentinel-1 SAR dual-pol surface roughness + Sausar Group fold hinge proximity. | Accelerates greenfield and brownfield manganese discovery by up to 60%. |
| **SHAP AI Explainability & Audit Trail** | SHAP feature contribution waterfall decomposition + SHA-256 cryptographic evidence hashes on every inference. | Full regulatory traceability for Indian Bureau of Mines (IBM) and evaluators. |
| **Reserve Intelligence (IDW Interpolation)** | Geostatistical Inverse Distance Weighting 2D/3D spatial interpolation with kriging variance bounds over diamond-core assays. | Rigorous resource tonnage & grade modeling with High/Med/Low confidence bands. |
| **Production Shortfall Radar** | 7-day, 30-day, and 90-day LightGBM time-series ensemble integrating IMD Doppler rainfall feeds and equipment availability deratings. | Anticipates severe haulage & crushing deficits up to 14 days in advance. |
| **Root-Cause Causal Bayesian Graph** | Dependency chain: Weather ➔ Haul Road Slipperiness ➔ Blasting Delay ➔ Fleet Breakdown ➔ Ore Movement ➔ Production Loss. | Isolates root drivers and quantifies exact loss allocation in Tonnes and ₹ Lakhs. |
| **Equipment Fleet Intelligence (PdM)** | Isolation Forest anomaly detection on CAN-bus telemetry (engine temp, pump pressure, tri-axial vibration). | Predicts catastrophic failure (e.g. EXC-014 overheat) with 72-hour warning window. |
| **What-If Mine Digital Simulator** | Discrete-event operational simulation with interactive sliders for rainfall, active dumpers, shovels, and shift hours. | Enables mine agents to simulate mitigation scenarios and evaluate ₹ Lakh revenue impact. |
| **Manganex AI Copilot** | Domain-grounded natural language assistant answering queries on prospectivity targets, fleet health, and shortfall mitigations. | Instant conversational intelligence for mine managers and Ministry evaluators. |
| **One-Click Executive Decision Mode** | Synthesizes top opportunity, top production risk, root causes, and simulated recovery into an executive decision matrix. | Instant briefing for Directors and Ministry evaluation panels. |

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Leaflet GIS Engine, Lucide Icons, Motion.
- **Backend Server:** Express.js full-stack engine with Vite middleware (Node.js/TypeScript) + Python FastAPI microservice architecture.
- **Geospatial & ML:** Python, NumPy, Pandas, Scikit-learn, XGBoost, LightGBM, Rasterio/GDAL integration.
- **Database:** PostgreSQL with PostGIS extension support.
- **Containerization:** Docker & Docker Compose (`docker-compose.yml`).

---

## 4. Demo Credentials & Quick Access

- **Platform URL:** Running live on port `3000`
- **Demo Officer Email:** `admin@manganex.demo`
- **Demo Password:** `Demo@123`
- *Or click **"Instant Evaluator Demo Access"** on the login splash screen.*

---

## 5. Seed Mine Coverage (Central India Manganese Belt)

1. **Dongri Buzurg Mine (Bhandara, Maharashtra):** Premier open cast manganese dioxide mine producing battery and chemical grade ore from the Sausar Group Mansar Formation.
2. **Balaghat / Bharweli Mine (Balaghat, Madhya Pradesh):** Asia's deepest underground manganese mine reaching beyond 435m depth, extracting massive crystalline braunite.
3. **Chikla-Mansar Mine Cluster (Nagpur/Bhandara, Maharashtra):** Complex synclinal folded gondite manganese horizons.
