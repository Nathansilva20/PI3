let myLineChart5; // Variável global para armazenar a instância do quarto gráfico

// Função para renderizar o quarto gráfico
function renderEvapotranspiracaoChart(labels, data) {
    const ctx = document.getElementById("EvapoChart");
    if (ctx) {
        myLineChart5 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Evapotranspiração",
                    lineTension: 0.3,
                    backgroundColor: "rgba(153, 102, 255, 0.2)", // Cor de fundo roxa
                    borderColor: "rgba(153, 102, 255, 1)", // Cor da borda roxa
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(153, 102, 255, 1)", // Cor de fundo dos pontos roxa
                    pointBorderColor: "rgba(255, 255, 255, 0.8)", // Cor da borda dos pontos branca
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(153, 102, 255, 1)", // Cor de fundo dos pontos ao passar o mouse roxa
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
async function fetchEvapotranspiracaoData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de temperatura média.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para atualizar os dados do quarto gráfico
async function updateEvapotranspiracaoChart() {
    const url = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json?'; // Substitua pela sua URL real
    const quintoGraficoData = await fetchEvapotranspiracaoData(url);
    if (quintoGraficoData !== null) {
        const currentTime = new Date();
        const lastTime = currentTime.toLocaleTimeString();

        if (myLineChart5) {
            myLineChart5.data.labels.push(lastTime);
            myLineChart5.data.datasets[0].data.push(quintoGraficoData);
            // Limitar o número de pontos no gráfico a 10
            if (myLineChart5.data.labels.length > 10) {
                myLineChart5.data.labels.shift();
                myLineChart5.data.datasets[0].data.shift();
            }
            myLineChart5.update();
            document.getElementById('ultimo-valor-evapo').innerText = 'Último valor da evapotranspiracao: ' + quintoGraficoData;
        } else {
            console.error('myLineChart5 não está inicializado.');
        }
    } else {
        console.error('Não foi possível obter os dados do quarto gráfico.');
    }
}

// Função para buscar os dados de temperatura média da URL JSON
async function buscarTemperaturaMedia(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de temperatura média.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para calcular a evapotranspiração usando o método Blaney-Criddle
function calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao) {
    // Fórmula Método Blaney-Criddle
    return ((temperaturaMedia * 0.46) + 8.13) * precipitacao;
}

// Função para atualizar a evapotranspiração
async function updateEvapotranspiracao() {
    const temperaturaMediaURL = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json?';
    const precipitacao = 7.8;

    const temperaturaMedia = await buscarTemperaturaMedia(temperaturaMediaURL);
    if (temperaturaMedia !== null) {
        const evapotranspiracao = calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao);
        const evp = document.getElementById("ultimo-valor-evapo");
        evp.textContent = 'Evapotranspiração atual: ' + evapotranspiracao.toFixed(2); // Arredondar para 2 casas decimais
    } else {
        console.error('Não foi possível obter os dados de temperatura média.');
    }
}

// Chamar a função para renderizar o quarto gráfico e atualizar a evapotranspiração ao carregar a página
window.addEventListener('load', function () {
    const labels5 = [];
    const data5 = [];
    renderEvapotranspiracaoChart(labels5, data5);
    setInterval(updateEvapotranspiracaoChart, 3000);
    updateEvapotranspiracao();
});
