const ctx = document.getElementById('myChart');

const options = {
    scales: {
        y: {
            // suggestedMin: 0,
            display: false,
            // suggestedMax: 40,
            color: '#fff',
        },
        x: {
            // display: false,
            border: {
                display: false,
                width: 10,
            },
            grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
                color: '#fff',
                // display: false,
                font: {
                    family: '"Fira Sans", sans-serif',
                    weight: 600,
                    size: 15,
                },
            },
        },
    },
    responsive: true,
    plugins: {
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
                family: 'Fira Sans, sans-serif',
                size: 15,
            },
            bodyFont: {
                family: 'Fira Sans, sans-serif',
                size: 15,
            },
            padding: 20,
            caretSize: 10,
            displayColors: false,
        },
        legend: {
            display: true,
            position: 'bottom',
            title: {
                display: false,
                text: 'Yes',
                color: '#000',
            },
            strokeStyle: '#000',
            labels: {
                color: '#fff',
                padding: 20,
                font: {
                    family: '"Fira Sans", sans-serif',
                    weight: 600,
                    size: 25,
                },
                pointStyle: 'line',
                usePointStyle: true,
                pointStyleWidth: 0.001,
            },
        },
        title: {
            display: false,
            text: 'Weather Chart',
        },
    },
};

// Chart.js labels
const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
let myChart = null;
export const createChart = (data) => {
    const temps = [];

    data.hour.map((hour) => {
        temps.push(hour.temp_c);
    });
    // Filter the hourly temperature data to get the temperature every 3 hours
    const eightTemps = temps.filter((_, i) => i % 3 === 0);

    // Add the last temperature to the array
    const nineTemps = [...eightTemps, temps[temps.length - 1]];
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    fill: true,
                    tension: 0.35,
                    label: 'Temperature (°C) ',
                    data: nineTemps,
                    borderColor: 'rgba(128,197,214, 1)',
                    backgroundColor: 'rgba(128,197,214, 0.5)',
                    borderWidth: 5,
                    radius: 3,
                    hoverRadius: 10,
                    hitRadius: 100,
                    pointStyle: 'circle',
                    color: '#fff',
                },
            ],
        },
        options: {
            ...options,
        },
    });
};
