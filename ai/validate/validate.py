import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import confusion_matrix, classification_report
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

def preprocess_data(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"], format="%B %d, %Y at %I:%M:%S %p UTC+7")
    
    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.weekday
    df["month"] = df["timestamp"].dt.month
    df["year"] = df["timestamp"].dt.year
    df["day_of_year"] = df["timestamp"].dt.dayofyear
    
    df["time_diff"] = df["timestamp"].diff().dt.total_seconds().fillna(0)
    
    X = df[["hour", "day_of_week", "month", "year", "day_of_year", "time_diff"]]
    return X

def train_model(df):
    X = preprocess_data(df)
    
    # Train the Isolation Forest model
    model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42) 
    
    # Predict anomalies
    df["predicted_anomaly"] = model.predict(X)
    
    # Convert predictions to 1 (normal) and -1 (anomaly)
    df["predicted_anomaly"] = df["predicted_anomaly"].map({1: 1, -1: -1})
    
    return model, df

df = pd.read_csv('validate_dataset.csv')
model, test_results = train_model(df)

accuracy = (test_results["predicted_anomaly"] == test_results["label"]).mean()
print(f"Accuracy: {accuracy * 100:.2f}%")

# Confusion matrix
y_true = test_results["label"]
y_pred = test_results["predicted_anomaly"]

# Generate confusion matrix
cm = confusion_matrix(y_true, y_pred, labels=[1, -1])

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap="Blues", xticklabels=["Normal", "Anomaly"], yticklabels=["Normal", "Anomaly"])
plt.xlabel("Predicted")
plt.ylabel("True")
plt.title("Confusion Matrix")
plt.show()

labels = [1, -1] 
report = classification_report(y_true, y_pred, labels=labels, target_names=["Normal", "Anomaly"])

print(report)

