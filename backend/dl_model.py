import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import joblib

# load dataset
df = pd.read_csv("../dataset/heart.csv")

X = df.drop("target", axis=1)
y = df["target"]

# scaling
scaler = StandardScaler()
X = scaler.fit_transform(X)

# split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# model
model = Sequential([
    Dense(32, activation='relu', input_shape=(13,)),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=20)

# save
model.save("dl_model.h5")
joblib.dump(scaler, "scaler.pkl")

print("DL model ready!")