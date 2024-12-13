import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_random_timestamp(start, end):
    delta = end - start
    random_second = random.randint(0, int(delta.total_seconds()))  # Convert to integer
    return start + timedelta(seconds=random_second)


def generate_synthetic_data(n_samples=1000, anomaly_fraction=0.1, noise_fraction=0.05):
    new_years_normal_times = [
        datetime(2023, 1, 1, 17, 0), 
        datetime(2023, 1, 1, 20, 0), 
        datetime(2023, 1, 1, 23, 0), 
    ]
    
    new_years_day = datetime(2023, 1, 1)

    normal_samples = []
    noisy_samples = []
    for _ in range(n_samples - int(n_samples * anomaly_fraction)):
        base_time = datetime(2023, random.randint(1, 12), random.randint(1, 28), 19, 0) 
        if random.random() > 0.5:
            base_time = datetime(2023, random.randint(1, 12), random.randint(1, 28), 22, 0)  
        
        if random.random() < noise_fraction:
            noise_minutes = random.choice([-120, -90, 90, 120]) 
            noisy_time = base_time + timedelta(minutes=noise_minutes)
            noisy_samples.append(noisy_time)
        else:
            normal_samples.append(generate_random_timestamp(base_time, base_time + timedelta(minutes=30)))

    # Generate weekend timestamps (random but within the weekend time frame)
    weekend_samples = []
    for _ in range(int(n_samples * anomaly_fraction // 2)):
        weekend_date = datetime(2023, random.randint(1, 12), random.randint(1, 28), random.randint(10, 18), random.randint(0, 59))  
        weekend_samples.append(generate_random_timestamp(weekend_date, weekend_date + timedelta(hours=3)))

    # Generate holiday timestamps (randomly distributed throughout the day)
    holiday_samples = []
    holidays = [
        datetime(2023, 12, 25), 
        datetime(2023, 7, 4),   
    ]
    for holiday in holidays:
        for _ in range(int(n_samples * anomaly_fraction // 2)):
            random_hour = random.randint(0, 23)
            random_minute = random.randint(0, 59)
            timestamp = holiday.replace(hour=random_hour, minute=random_minute)
            holiday_samples.append(timestamp)

    new_years_samples = []
    for time in new_years_normal_times:
        for _ in range(int(n_samples * 0.02)):  
            jitter = random.randint(-5, 5) 
            new_years_samples.append(time + timedelta(minutes=jitter))

    new_years_anomalies = []
    for _ in range(int(n_samples * 0.01)):  
        random_hour = random.choice([random.randint(0, 16), random.randint(23, 23)])
        random_minute = random.randint(0, 59)
        new_years_anomalies.append(new_years_day.replace(hour=random_hour, minute=random_minute))

    timestamps = normal_samples + noisy_samples + weekend_samples + holiday_samples + new_years_samples + new_years_anomalies
    random.shuffle(timestamps)

    timestamps = timestamps[:n_samples]

    data = []
    labels = []
    for timestamp in timestamps:
        features = {
            "timestamp": timestamp.strftime("%B %d, %Y at %I:%M:%S %p UTC+7"),
            "hour": timestamp.hour,
            "day_of_week": timestamp.weekday(),
            "month": timestamp.month,
            "year": timestamp.year,
            "day_of_year": timestamp.timetuple().tm_yday,
            "time_diff": 0, 
        }
        data.append(features)

        # Labeling logic:
        if timestamp in new_years_samples:
            labels.append(1)  
        elif timestamp in new_years_anomalies or timestamp in noisy_samples or timestamp in weekend_samples or timestamp in holiday_samples:
            labels.append(-1)  
        else:
            labels.append(1) 

    df = pd.DataFrame(data)
    df['label'] = labels
    
    return df

test_data = generate_synthetic_data(n_samples=1000, anomaly_fraction=0.1, noise_fraction=0.05)
test_data.to_csv("validate_dataset.csv", index=False)
print(test_data.head())
