"""
Backend test suite for Manganex AI FastAPI server.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "MANGANEX AI" in data["system"]

def test_auth_login_demo():
    res = client.post("/api/auth/login", json={"email": "admin@manganex.demo", "password": "Demo@123"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "token" in data

def test_mines_list():
    res = client.get("/api/mines")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["data"]) >= 2

def test_prospectivity_predict():
    res = client.post("/api/exploration/predict", json={
        "mineId": "mine-dongri-buzurg",
        "targetName": "Unit Test Target Anomaly",
        "spectralWeight": 0.4,
        "radarWeight": 0.2,
        "terrainWeight": 0.2,
        "geologyWeight": 0.2
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "prospectivityScore" in data["data"]
    assert "evidenceHash" in data["data"]

def test_simulation_run():
    res = client.post("/api/simulation/run", json={
        "mineId": "mine-dongri-buzurg",
        "equipmentAvailabilityPct": 85.0,
        "rainfallIntensityMm": 15.0,
        "blastingDelayDays": 1,
        "activeExcavators": 4,
        "activeDumpers": 16,
        "shiftHoursPerDay": 16,
        "maintenanceDelayHours": 4,
        "feedGradeMnPct": 44.2,
        "miningRateTonnesPerHr": 220
    })
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "simulatedProductionTonnes" in data["result"]
    assert "dailyRevenueImpactInrLakhs" in data["result"]
