// ---------------- GLOBAL ----------------
let allPatients = [];
let selectedPatient = null;

// ---------------- LOAD PATIENTS ----------------
async function loadPatients() {
    try {
        let res = await fetch("http://127.0.0.1:5000/patients");
        allPatients = await res.json();

        // show first 50 initially
        showPatients(allPatients.slice(0, 50));

    } catch (err) {
        console.error(err);
        alert("Backend not running!");
    }
}

window.onload = loadPatients;

// ---------------- SHOW PATIENTS ----------------
function showPatients(list) {
    let dropdown = document.getElementById("patientList");
    dropdown.innerHTML = "<option>Select Patient</option>";

    list.forEach(p => {
        let option = document.createElement("option");
        option.value = JSON.stringify(p);
        option.text = `ID:${p.id} | Age:${p.age} | Chol:${p.chol}`;
        dropdown.appendChild(option);
    });
}

// ---------------- SEARCH ----------------
function searchPatient() {
    let value = document.getElementById("searchBox").value.toLowerCase();

    let filtered = allPatients.filter(p =>
        p.id.toString().includes(value) ||
        p.age.toString().includes(value) ||
        p.chol.toString().includes(value)
    );

    showPatients(filtered.slice(0, 50));
}

// ---------------- AUTO FILL ----------------
function fillPatient() {
    let dropdown = document.getElementById("patientList");

    if (dropdown.value === "Select Patient") return;

    let p = JSON.parse(dropdown.value);
    selectedPatient = p;

    document.getElementById("age").value = p.age;
    document.getElementById("sex").value = p.sex;
    document.getElementById("cp").value = p.cp;
    document.getElementById("trestbps").value = p.trestbps;
    document.getElementById("chol").value = p.chol;
    document.getElementById("fbs").value = p.fbs;
    document.getElementById("restecg").value = p.restecg;
    document.getElementById("thalach").value = p.thalach;
    document.getElementById("exang").value = p.exang;
    document.getElementById("oldpeak").value = p.oldpeak;
    document.getElementById("slope").value = p.slope;
    document.getElementById("ca").value = p.ca;
    document.getElementById("thal").value = p.thal;
}

// ---------------- GET FORM DATA ----------------
function getData() {
    return {
        age: document.getElementById("age").value,
        sex: document.getElementById("sex").value,
        cp: document.getElementById("cp").value,
        trestbps: document.getElementById("trestbps").value,
        chol: document.getElementById("chol").value,
        fbs: document.getElementById("fbs").value,
        restecg: document.getElementById("restecg").value,
        thalach: document.getElementById("thalach").value,
        exang: document.getElementById("exang").value,
        oldpeak: document.getElementById("oldpeak").value,
        slope: document.getElementById("slope").value,
        ca: document.getElementById("ca").value,
        thal: document.getElementById("thal").value
    };
}

// ---------------- PREDICT ----------------
async function predict() {

    let data = getData();

    // validation
    for (let key in data) {
        if (data[key] === "") {
            alert("Please fill all fields!");
            return;
        }
    }

    try {
        let res = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        let result = await res.json();

        // 🎨 COLOR BASED ON RISK
        let color = result.risk === "HIGH" ? "#ff4d4d" :
                    result.risk === "MEDIUM" ? "#ffa500" : "#28a745";

        let box = document.getElementById("result");
        box.style.display = "block";
        box.style.background = color;
        box.style.color = "white";

        box.innerHTML = `
            <h2>${result.risk} RISK</h2>
            <h3>Health Score: ${result.score}/100</h3>
            <p>Probability: ${(result.probability * 100).toFixed(2)}%</p>
            <p><b>Advice:</b> ${result.advice}</p>

            <hr>

            <h3>Patient Details</h3>
            <p>ID: ${selectedPatient ? selectedPatient.id : "Manual Entry"}</p>
            <p>Age: ${data.age}</p>
            <p>Cholesterol: ${data.chol}</p>
            <p>Blood Pressure: ${data.trestbps}</p>
        `;

    } catch (err) {
        console.error(err);
        alert("Prediction failed! Check backend.");
    }
}

// ---------------- USER SYSTEM ----------------
document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");

    if (user) {
        let name = document.getElementById("username");
        if (name) name.innerText = user;
    }
});

// ---------------- LOGOUT ----------------
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ---------------- DASHBOARD ----------------
function goDashboard() {
    window.location.href = "dashboard.html";
}