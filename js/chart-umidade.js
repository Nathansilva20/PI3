let myLineChart3; // Variável global para armazenar a instância do gráfico de umidade

// Função para renderizar o gráfico de umidade
function renderUmidadeChart(labels, data) {
    const ctx = document.getElementById("UmidadeChart");
    if (ctx) {
        myLineChart3 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Umidade",
                    lineTension: 0.3,
                    backgroundColor: "rgba(46, 139, 87, 0.2)", // Cor de fundo da área (verde escuro)
                    borderColor: "rgba(46, 139, 87, 1)", // Cor da linha (verde escuro)
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(46, 139, 87, 1)", // Cor dos pontos (verde escuro)
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(46, 139, 87, 1)", // Cor dos pontos ao passar o mouse (verde escuro)
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

// Restante do código mantido igual...

async function fetchUmidadeData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de umidade.');
        }
        const data = await response.json();
        return data; // Retornar os dados JSON
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}


async function updateUmidadeChart() {
    const url = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/umidade.json?'; // Substitua pela sua URL real
    const umidadeData = await fetchUmidadeData(url);
    const currentTime = new Date();
    const lastTime = currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds(); // Defina como preferir
    if (umidadeData !== null) {
        // Adicionar novo ponto de dados ao gráfico
        myLineChart3.data.labels.push(lastTime);
        myLineChart3.data.datasets[0].data.push(umidadeData);
        // Atualizar o gráfico
        myLineChart3.update();
        
        document.getElementById('ultimo-valor-umidade').innerText = 'Último valor de umidade: ' + umidadeData;
    } else {
        console.error('Não foi possível obter os dados de radiação.');
    }
}

// Chamar a função para renderizar o gráfico ao carregar a página
window.addEventListener('load', function () {
    const labels3 = [];
    const data3 = [];
    renderUmidadeChart(labels3, data3);
    setInterval(updateUmidadeChart, 3000);
});