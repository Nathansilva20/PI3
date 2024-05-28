let myLineChart4; // Variável global para armazenar a instância do quarto gráfico

// Função para renderizar o quarto gráfico
function renderVentoChart(labels, data) {
    const ctx = document.getElementById("VentoChart");
    if (ctx) {
        myLineChart4 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Velocidade do Vento",
                    lineTension: 0.3,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255,99,132,1)",
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
        console.error('Erro: Não foi possível encontrar o elemento canvas para renderizar o gráfico.');
    }
}

// Função para buscar os dados do quarto gráfico da URL JSON
async function fetchVentoData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de velocidade do vento.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para atualizar os dados do quarto gráfico
async function updateVentoChart() {
    const url = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/velocidadedovento.json?'; // Substitua pela sua URL real
    const quartoGraficoData = await fetchVentoData(url);
    const currentTime = new Date();
    const lastTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    if (quartoGraficoData !== null) {
        myLineChart4.data.labels.push(lastTime);
        myLineChart4.data.datasets[0].data.push(quartoGraficoData);
        myLineChart4.update();
        document.getElementById('ultimo-valor-vento').innerText = 'Último valor da velocidade do vento: ' + quartoGraficoData;
    } else {
        console.error('Não foi possível obter os dados do quarto gráfico.');
    }
}

// Chamar a função para renderizar o quarto gráfico ao carregar a página
window.addEventListener('load', function () {
    const labels4 = [];
    const data4 = [];
    renderVentoChart(labels4, data4);
    setInterval(updateVentoChart, 3000);
});
