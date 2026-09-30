# MANGANEX AI — Data Sources & Sensor Specifications
### SIH26009 • MOIL Limited

| Source Name | Provider | Purpose in Manganex AI | Revisit / Frequency | Resolution / Scale |
| :--- | :--- | :--- | :--- | :--- |
| **Copernicus Sentinel-2** | European Space Agency (ESA) | Multispectral surface reflectance for iron oxide (B04/B02) and hydroxyl/clay (B11/B12) mineral alteration mapping. | 5 Days | 10m / 20m GSD |
| **Copernicus Sentinel-1** | European Space Agency (ESA) | Dual-polarization SAR C-band interferometry for surface roughness, fault scarps, and structural lineaments. | 6 - 12 Days | 10m GRD |
| **USGS / NASA Landsat-8/9** | USGS Earth Resources Observation | Long-wave thermal infrared (TIRS Band 10) for Land Surface Temperature (LST) and gossan verification. | 16 Days | 30m / 100m Thermal |
| **SRTM DEM 30m** | NASA JPL / NGA | Slope angle, Topographic Position Index (TPI), Terrain Ruggedness (TRI), drainage stream flow accumulation. | Static Archive | 30m 1-Arcsecond |
| **ISRO Bhuvan Geo-Portal** | Indian Space Research Organisation | High-resolution optical Cartosat ortho-imagery and opencast mine bench geometry profiling. | On-demand / Seasonal | 2.5m Panchromatic |
| **IMD Doppler Radar Feeds** | India Meteorological Department | 72-hour quantitative precipitation forecasting (QPF) for in-pit haul road slip modeling. | Hourly / Real-time | Regional Radar Mesh |
| **MOIL SCADA Telemetry** | MOIL Mines (Dongri Buzurg / Balaghat) | High-frequency CAN-bus sensor streams (hydraulic pressure, engine temp, vibration) for fleet health. | 10 Hz / Streamed | Fleet Equipment Telemetry |
| **GSI Geological Maps** | Geological Survey of India | 1:50,000 Sausar Group lithostratigraphy (Mansar quartz-muscovite schist, Sitasaongi phyllite, Tirodi gneiss). | Regional Archive | 1:50,000 Scale |
| **Borehole Assay Logs** | MOIL Central Geology Laboratory | Verified diamond core drilling assays (% Mn, % Fe, % P, % SiO2) for IDW geostatistical ground modeling. | Campaign-based | Drill-hole Assay Certified |
