let myLineChart2; // Variável global para armazenar a instância do gráfico de radiação

// Função para renderizar o gráfico de área
function renderRadiacaoChart(labels, data) {
    const ctx = document.getElementById("RadiChart");
    if (ctx) {
        myLineChart2 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Radiação",
                    lineTension: 0.3,
                    backgroundColor: "rgba(255,193,7,0.2)", // Cor de fundo da área
                    borderColor: "rgba(255,193,7,1)", // Cor da linha
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(255,193,7,1)", // Cor dos pontos
                    pointBorderColor: "rgba(255,255,255,0.8)", // Cor da borda dos pontos
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255,193,7,1)", // Cor dos pontos ao passar o mouse
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
                            max: 100, // Defina um valor máximo para o eixo y (ajuste conforme necessário)
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

// Função para buscar os dados de radiação da URL JSON
async function fetchRadiationData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de radiação.');
        }
        const data = await response.json();
        return data; // Retornar os dados JSON
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para atualizar os dados do gráfico de radiação
async function updateAreaChart() {
    const url = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/radiacao.json?'; // Substitua pela sua URL real
    const radiationData = await fetchRadiationData(url);
    const currentTime = new Date();
    const lastTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds(); // Defina como preferir
    if (radiationData !== null) {
        // Adicionar novo ponto de dados ao gráfico
        myLineChart2.data.labels.push(lastTime);
        myLineChart2.data.datasets[0].data.push(radiationData);
        // Atualizar o gráfico
        myLineChart2.update();
        // Exibir o último valor abaixo da palavra "Radiação"
        document.getElementById('ultimo-valor').innerText = 'Último valor: ' + radiationData;
    } else {
        console.error('Não foi possível obter os dados de radiação.');
    }
}

// Chamar a função para renderizar o gráfico ao carregar a página
window.onload = function() {
    const labels = []; // Inicializa as labels vazias
    const data = []; // Inicializa os dados vazios
    renderRadiacaoChart(labels, data); // Renderiza o gráfico com os dados vazios
    // Configurar um intervalo para atualizar o gráfico periodicamente
    setInterval(updateAreaChart, 3000); // Atualizar a cada minuto
};