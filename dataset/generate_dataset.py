import pandas as pd
import random

data = []

for i in range(2000):
    row = [
        random.randint(30,80),   # age
        random.randint(0,1),
        random.randint(0,3),
        random.randint(100,180),
        random.randint(150,300),
        random.randint(0,1),
        random.randint(0,2),
        random.randint(90,200),
        random.randint(0,1),
        round(random.uniform(0,4),1),
        random.randint(0,2),
        random.randint(0,3),
        random.randint(1,3),
        random.randint(0,1)
    ]
    data.append(row)

cols = ['age','sex','cp','trestbps','chol','fbs',
        'restecg','thalach','exang','oldpeak',
        'slope','ca','thal','target']

df = pd.DataFrame(data, columns=cols)
df.to_csv("heart.csv", index=False)