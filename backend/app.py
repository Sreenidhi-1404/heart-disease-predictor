from flask import Flask, request, jsonify
import joblib
import pandas as pd
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("heart_model.pkl")

# ---------------- USERS ----------------
users = {
    "doctor": "123",
    "nurse": "123",
    "admin": "123"
}

# ---------------- LOGIN ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if username in users and users[username] == password:
        return {"status": "success", "user": username}

    return {"status": "fail"}

# ---------------- DATABASE ----------------
def init_db():
    conn = sqlite3.connect('database.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age REAL, sex REAL, cp REAL, trestbps REAL,
            chol REAL, fbs REAL, restecg REAL,
            thalach REAL, exang REAL, oldpeak REAL,
            slope REAL, ca REAL, thal REAL,
            result INTEGER
        )
    ''')
    conn.close()

init_db()

# ---------------- LOAD DATASET (RUN ONCE) ----------------
def load_dataset():
    df = pd.read_csv("../dataset/heart.csv")
    conn = sqlite3.connect('database.db')

    for _, row in df.iterrows():
        conn.execute('INSERT INTO patients VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                     (*row[:-1], row['target']))

    conn.commit()
    conn.close()

# Uncomment once
# load_dataset()

# ---------------- GET PATIENTS ----------------
@app.route('/patients')
def patients():
    conn = sqlite3.connect('database.db')
    df = pd.read_sql_query("SELECT * FROM patients", conn)
    conn.close()

    return df.to_json(orient='records')

# ---------------- PREDICT ----------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    cols = ['age','sex','cp','trestbps','chol','fbs',
            'restecg','thalach','exang','oldpeak',
            'slope','ca','thal']

    values = [float(data[c]) for c in cols]

    sample = pd.DataFrame([values], columns=cols)

    pred = model.predict(sample)[0]
    prob = model.predict_proba(sample)[0][1]

    if prob > 0.7:
        risk = "HIGH"
        advice = "Consult doctor immediately"
    elif prob > 0.4:
        risk = "MEDIUM"
        advice = "Lifestyle changes needed"
    else:
        risk = "LOW"
        advice = "Healthy"

    score = int((1 - prob) * 100)

    return jsonify({
        "risk": risk,
        "score": score,
        "probability": prob,
        "advice": advice
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)