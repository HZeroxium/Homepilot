import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import joblib

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_data_from_firestore():
    try:
        docs = db.collection("devices").where("type", "==", "access_control").stream()
        
        data = []
        
        for doc in docs:
            device_data = doc.to_dict()

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

        if not data:
            print("No valid data found in Firestore.")  
        return pd.DataFrame(data)
    
    except Exception as e:
        print(f"Error fetching data: {e}")
        return pd.DataFrame()

def preprocess_data(df):
    historical_data = []
    for _, row in df.iterrows():
        for entry in row['historicalData']:
            historical_data.append({
                "device_name": row["name"],
                "userId": row["userId"],
                "status": row["status"],
                "type": row["type"],
                "timestamp": entry.get("timestamp"),
                "status_entry": entry.get("status")
            })
    
    historical_df = pd.DataFrame(historical_data)

    # Preprocess data
    historical_df["timestamp"] = pd.to_datetime(historical_df["timestamp"])
    historical_df["hour"] = historical_df["timestamp"].dt.hour
    historical_df["day_of_week"] = historical_df["timestamp"].dt.weekday
    historical_df["month"] = historical_df["timestamp"].dt.month
    historical_df["year"] = historical_df["timestamp"].dt.year
    historical_df["day_of_year"] = historical_df["timestamp"].dt.dayofyear
    historical_df["time_diff"] = historical_df["timestamp"].diff().dt.total_seconds().fillna(0)

    return historical_df

def train_model():
    df = fetch_data_from_firestore()
    if df.empty:
        print("No data available for training.")
        return

    df = preprocess_data(df)
    X = df[["hour", "day_of_week", "month", "year", "day_of_year", "time_diff"]]

    # Using Isolation Forest for unsupervised anomaly detection
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42) 
    model.fit(X)

    # Predicting anomalies (1 = normal, -1 = anomaly)
    predictions = model.predict(X)
    df["anomaly"] = predictions

    # Identifying the anomalies
    anomalies = df[df["anomaly"] == -1]
    print(f"Number of anomalies detected: {len(anomalies)}")

    joblib.dump(model, "door_opening_anomaly_model.pkl")
    print("Model trained and saved!")

def predict_anomaly(model, timestamp):
    timestamp = datetime.strptime(timestamp, "%B %d, %Y at %I:%M:%S %p UTC+7")
    features = {
        "hour": timestamp.hour,
        "day_of_week": timestamp.weekday(),
        "month": timestamp.month,
        "year": timestamp.year,
        "day_of_year": timestamp.timetuple().tm_yday,
        "time_diff": 0
    }
    df = pd.DataFrame([features])
    return model.predict(df)[0]

train_model()
