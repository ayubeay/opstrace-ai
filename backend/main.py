from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import uuid

app = FastAPI(title="AI-Governed Service Operations PoW")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INCIDENTS = []

class Incident(BaseModel):
    title: str
    description: str

def mock_ai_analysis(description: str):
    text = description.lower()

    if "calibration" in text or "firmware" in text or "diagnostic" in text:
        return {
            "category": "Device / Diagnostics Support",
            "severity": "HIGH",
            "confidence": 0.89,
            "recommended_action": "ESCALATE_TO_ENGINEERING"
        }

    if "delay" in text or "workflow" in text or "slow" in text:
        return {
            "category": "Service Operations",
            "severity": "MEDIUM",
            "confidence": 0.78,
            "recommended_action": "SUPERVISOR_REVIEW_REQUIRED"
        }

    return {
        "category": "General Support",
        "severity": "LOW",
        "confidence": 0.67,
        "recommended_action": "AI_RECOMMENDATION_ALLOWED"
    }

@app.post("/analyze")
def analyze_incident(incident: Incident):
    analysis = mock_ai_analysis(incident.description)

    receipt = {
        "receipt_id": str(uuid.uuid4()),
        "incident_title": incident.title,
        "category": analysis["category"],
        "severity": analysis["severity"],
        "confidence": analysis["confidence"],
        "governance_decision": analysis["recommended_action"],
        "human_review_required": analysis["severity"] in ["MEDIUM", "HIGH"],
        "status": "PENDING_REVIEW" if analysis["severity"] in ["MEDIUM", "HIGH"] else "APPROVED",
        "review_decision": None,
        "reviewed_at": None,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    INCIDENTS.append(receipt)

    return {"incident": incident, "analysis": analysis, "receipt": receipt}

@app.get("/incidents")
def get_incidents():
    return INCIDENTS[::-1]

@app.post("/incidents/{receipt_id}/review/{decision}")
def review_incident(receipt_id: str, decision: str):
    allowed = ["approve", "escalate", "reject"]

    if decision not in allowed:
        return {"error": "Invalid decision"}

    for incident in INCIDENTS:
        if incident["receipt_id"] == receipt_id:
            incident["review_decision"] = decision.upper()
            incident["reviewed_at"] = datetime.utcnow().isoformat() + "Z"

            if decision == "approve":
                incident["status"] = "APPROVED_BY_HUMAN"
            elif decision == "escalate":
                incident["status"] = "ESCALATED"
            elif decision == "reject":
                incident["status"] = "REJECTED"

            return incident

    return {"error": "Incident not found"}

@app.get("/")
def health():
    return {"status": "running"}