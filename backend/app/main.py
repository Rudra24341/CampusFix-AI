
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.graph import app as campus_graph

import json
from pathlib import Path


# --------------------------------
# 1. Initialize FastAPI
# --------------------------------

app = FastAPI(
    title="CampusFix AI",
    description="Agentic AI Campus Maintenance Assistant",
    version="1.0"
)

DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "maintenance_records.json"
)


# --------------------------------
# 2. Maintenance Records Endpoint
# --------------------------------

@app.get("/api/maintenance-records")
def get_maintenance_records():

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            records = json.load(file)

        return {
            "success": True,
            "total": len(records),
            "records": records
        }

    except Exception as error:
        print("Maintenance records error:", str(error))
        raise HTTPException(
            status_code=500,
            detail="Unable to load maintenance records."
        )


# --------------------------------
# 3. Allow React Frontend Access
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------
# 4. Complaint Request Structure
# --------------------------------

class ComplaintRequest(BaseModel):
    complaint: str
    location: str = "Not specified"


# --------------------------------
# 5. Health Check Endpoint
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "CampusFix AI Backend is running!"
    }


# --------------------------------
# 6. Complaint Processing Endpoint
# --------------------------------

@app.post("/api/complaint")
def process_complaint(request: ComplaintRequest):

    if not request.complaint.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter a complaint."
        )

    try:
        full_complaint = (
            f"Location: {request.location}. "
            f"Complaint: {request.complaint}"
        )

        # Run the LangGraph workflow
        result = campus_graph.invoke({
            "complaint": full_complaint,
            "activities": []
        })

        # Return AI results and activity records
        return {
            "success": True,
            "complaint": request.complaint,
            "location": request.location,
            "diagnosis": result["diagnosis"],
            "recommendation": result["recommendation"],
            "activities": result.get("activities", []),
            "decision": result.get("decision", {})
        }

    except Exception as error:
        print("Complaint processing error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to process complaint. Please try again."
        )


