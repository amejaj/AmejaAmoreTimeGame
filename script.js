const TARGET_TIME = 3000; // milliseconds

let startTime = null;
let attempts = [];
let chart = null;

const btn = document.getElementById("startStopBtn");
const result = document.getElementById("result");
const log = document.getElementById("attemptsLog");
const stats = document.getElementById("statsSummary");
const chartCanvas = document.getElementById("chartCanvas");

btn.addEventListener("click", () => {
    if (!startTime) {
        startTime = new Date();
        btn.textContent = "Stop";
        result.textContent = "";
    } else {
        const stopTime = new Date();
        const elapsed = stopTime - startTime;
        const seconds = (elapsed / 1000).toFixed(3);
        showResult(seconds);
        addAttempt(startTime, stopTime, elapsed);
        startTime = null;
        btn.textContent = "Start";
    }
});

function showResult(seconds) {
    let className = "red";
    const diff = Math.abs(seconds - 3.000);
    if (diff === 0) className = "green";
    else if (diff <= 0.2) className = "blue";
    else if (diff <= 0.5) className = "yellow";

    result.innerHTML = `Your time: <span class="${className}">${seconds} sec</span>`;
}

function addAttempt(start, stop, ms) {
    const attemptNum = attempts.length + 1;
    const startTime = start.toLocaleTimeString();
    const stopTime = stop.toLocaleTimeString();
    const seconds = (ms / 1000).toFixed(3);
    attempts.push({ attemptNum, startTime, stopTime, ms: +seconds });

    updateLog();
    updateStats();
    updateChart();
}

function updateLog() {
    log.innerHTML = attempts.map(a =>
        `<div>Attempt ${a.attemptNum}: Start: ${a.startTime}, Stop: ${a.stopTime}, Time: ${a.ms}s</div>`
    ).join("");
}

function updateStats() {
    if (attempts.length === 0) return;
    const times = attempts.map(a => a.ms);
    const total = times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const avg = (times.reduce((a, b) => a + b) / total).toFixed(3);

    stats.innerHTML = `
    <p>Total Attempts: ${total}</p>
    <p>Min Time: ${min}s</p>
    <p>Max Time: ${max}s</p>
    <p>Average Time: ${avg}s</p>
  `;
}

function updateChart() {
    const labels = attempts.map(a => `#${a.attemptNum}`);
    const data = attempts.map(a => a.ms);

    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Attempt Times (s)",
                data,
                borderColor: "blue",
                backgroundColor: "lightblue",
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    suggestedMin: 2.0,
                    suggestedMax: 4.0
                }
            }
        }
    });
}

function toggleDetails() {
    const box = document.getElementById("details");
    box.classList.toggle("d-none");
}
