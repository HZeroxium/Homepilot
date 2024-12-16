import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import seaborn as sns
import holidays

vietnam_holidays = holidays.Vietnam(years=[2024])

def is_vietnamese_holiday(date):
    return date in vietnam_holidays

def preprocess_data(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"], format="%B %d, %Y at %I:%M:%S %p UTC+7")
    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.weekday
    df["month"] = df["timestamp"].dt.month
    df["year"] = df["timestamp"].dt.year
    df["day_of_year"] = df["timestamp"].dt.dayofyear
    df["time_diff"] = df["timestamp"].diff().dt.total_seconds().fillna(0)
    df["is_holiday"] = df["timestamp"].apply(is_vietnamese_holiday)
    X = df[["hour", "day_of_week", "month", "year", "day_of_year", "time_diff", "is_holiday"]]
    y = df["label"]
    return X, y

def train_model(X_train, y_train):
    model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    model.fit(X_train) 
    y_pred_train = model.predict(X_train)
    y_pred_train = pd.Series(y_pred_train).map({1: 1, -1: -1})
    return model, y_pred_train

df = pd.read_csv('validate_dataset.csv')
X, y = preprocess_data(df)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model, y_pred_train = train_model(X_train, y_train)

y_pred_test = model.predict(X_test)
y_pred_test = pd.Series(y_pred_test).map({1: 1, -1: -1})
y_test = y_test.reset_index(drop=True)

accuracy = (y_pred_test == y_test).mean()
print(f"Accuracy on Test Data: {accuracy * 100:.2f}%")

cm = confusion_matrix(y_test, y_pred_test, labels=[1, -1])

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap="Blues", xticklabels=["Normal", "Anomaly"], yticklabels=["Normal", "Anomaly"])
plt.xlabel("Predicted")
plt.ylabel("True")
plt.title("Confusion Matrix")
plt.show()

labels = [1, -1]
report = classification_report(y_test, y_pred_test, labels=labels, target_names=["Normal", "Anomaly"])
print(report)
