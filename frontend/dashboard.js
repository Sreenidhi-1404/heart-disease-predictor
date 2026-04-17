async function loadDashboard() {
    try {
        let res = await fetch("http://127.0.0.1:5000/patients");
        let data = await res.json();

        console.log("DATA:", data); // debug

        // total patients
        document.getElementById("total").innerText = data.length;

        let high = 0, medium = 0, low = 0;

        data.forEach(p => {
            // handle both 'result' or 'target'
            let val = p.result !== undefined ? p.result : p.target;

            if (val == 1) {
                high++;   // disease → high risk
            } else {
                low++;    // no disease → low risk
            }
        });

        // simple demo medium calculation
        medium = Math.floor(data.length * 0.2);

        // update UI
        document.getElementById("high").innerText = high;
        document.getElementById("medium").innerText = medium;
        document.getElementById("low").innerText = low;

        // chart
        new Chart(document.getElementById("chart"), {
            type: 'pie', // 🔥 looks better than bar
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    label: 'Risk Distribution',
                    data: [high, medium, low],
                    backgroundColor: [
                        '#ff4d4d',   // red
                        '#ffa500',   // orange
                        '#28a745'    // green
                    ]
                }]
            }
        });

    } catch (err) {
        console.error(err);
        alert("Error loading dashboard!");
    }
}

window.onload = loadDashboard;