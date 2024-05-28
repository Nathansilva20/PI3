let myLineChart1; // Variável global para armazenar a instância do gráfico de temperatura

// Função para renderizar o gráfico de área de temperatura
function renderTemperaturaChart(labels, data) {
    const ctx = document.getElementById("TempChart");
    if (ctx) {
        myLineChart1 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Temperatura (°C)",
                    lineTension: 0.3,
                    backgroundColor: "rgba(2,117,216,0.2)",
                    borderColor: "rgba(2,117,216,1)",
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(2,117,216,1)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(2,117,216,1)",
                    pointHitRadius: 50,
                    pointBorderWidth: 2,
                    data: data,
                }],
            },
            options: {
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100,
                            maxTicksLimit: 5
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, .125)",
                        }
                    }],
                },
                legend: {
                    display: false
                }
            }
        });
    } else {
        console.error('Erro: Não foi possível encontrar o elemento canvas para renderizar o gráfico de temperatura.');
    }
}

// Função para buscar os dados de temperatura da URL JSON
async function fetchTemperatureData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de temperatura.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para atualizar os dados do gráfico de temperatura
async function updateTemperatureChart() {
    const url = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json?'; 
    const temperatureData = await fetchTemperatureData(url);
    const currentTime = new Date();
    const lastTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds(); 
    if (temperatureData !== null) {
        myLineChart1.data.labels.push(lastTime);
        myLineChart1.data.datasets[0].data.push(temperatureData);
        myLineChart1.update();
        document.getElementById('ultimo-valor-temperatura').innerText = 'Último valor de temperatura: ' + temperatureData;
    } else {
        console.error('Não foi possível obter os dados de temperatura.');
    }
}

// Adiciona o evento de carregamento da página para renderizar o gráfico de temperatura
window.addEventListener('load', function () {
    const labels = []; 
    const data = []; 
    renderTemperaturaChart(labels, data); 
    setInterval(updateTemperatureChart, 3000); 
});