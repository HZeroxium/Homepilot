import joblib
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import numpy as np
import pandas as pd

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

MODEL_PATH = "door_opening_anomaly_model.pkl"
model = joblib.load(MODEL_PATH)

def preprocess_timestamp(timestamp):
    timestamp = datetime.strptime(timestamp, "%B %d, %Y at %I:%M:%S %p UTC+7")
    features = {
        "hour": timestamp.hour,
        "day_of_week": timestamp.weekday(),
        "month": timestamp.month,
        "year": timestamp.year,
        "day_of_year": timestamp.timetuple().tm_yday,
        "time_diff": 0 
    }
    return pd.DataFrame([features])

class Event(BaseModel):
    timestamp: str  # Example: "November 7, 2024 at 7:42:57 PM UTC+7"

@app.post("/predict")
def predict_anomaly(request: Event):
    try:
        df = preprocess_timestamp(request.timestamp)
        
        prediction = model.predict(df)
        
        result = "anomaly" if prediction[0] == -1 else "normal"
        
        return {"timestamp": request.timestamp, "prediction": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting anomaly: {str(e)}")


@app.get("/fetch-data")
def fetch_data():
    try:
        docs = db.collection("devices").where("type", "==", "access_control").stream()
        
        data = []
        
        for doc in docs:
            device_data = doc.to_dict()

            # Initialize a dictionary for the device
            device_info = {
                "name": device_data.get("name"),
                "userId": device_data.get("userId"),
                "status": device_data.get("status"),
                "type": device_data.get("type"),
                "historicalData": []
            }

            historical_data_ref = doc.reference.collection("historicalData")
            historical_docs = historical_data_ref.stream()
            
            for historical_doc in historical_docs:
                historical_entry = historical_doc.to_dict()
                if historical_entry.get("status") == "grant":
                    device_info["historicalData"].append(historical_entry)

            data.append(device_info)

        return {"data": data, "message": "All devices fetched successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")

