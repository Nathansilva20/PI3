let myLineChart5; // Variável global para armazenar a instância do gráfico

// Objeto para armazenar a precipitação selecionada
const precipitacao = {
    valor: null
};

// Função para renderizar o gráfico inicialmente
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
                            max: 200,
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

// Função para atualizar os dados do gráfico
async function updateEvapotranspiracaoChart() {
    const currentTime = new Date();
    const lastTime = currentTime.toLocaleTimeString();

    if (myLineChart5) {
        try {
            const temperaturaMedia = await buscarTemperaturaMedia(temperaturaMediaURL);

            if (temperaturaMedia !== null) {
                const evapotranspiracao = calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao.valor);

                // Atualiza os dados no gráfico
                myLineChart5.data.labels.push(lastTime);
                myLineChart5.data.datasets[0].data.push(evapotranspiracao);

                // Limita o número de pontos no gráfico a 10
                if (myLineChart5.data.labels.length > 10) {
                    myLineChart5.data.labels.shift();
                    myLineChart5.data.datasets[0].data.shift();
                }

                myLineChart5.update();
            } else {
                console.error('Não foi possível obter os dados de temperatura média.');
            }
        } catch (error) {
            console.error('Erro ao atualizar o gráfico:', error);
        }
    } else {
        console.error('myLineChart5 não está inicializado.');
    }
}

// Chamar a função para renderizar o gráfico e atualizar a evapotranspiração ao carregar a página
window.addEventListener('load', function () {
    const labels5 = [];
    const data5 = [];
    renderEvapotranspiracaoChart(labels5, data5);
    setInterval(updateEvapotranspiracaoChart, 3000);

    // Verifica se há uma região previamente selecionada e atualiza o botão do dropdown
    const regiaoSelecionada = localStorage.getItem('regiaoSelecionada');
    if (regiaoSelecionada) {
        aplicarRegra(regiaoSelecionada);
    }
});

const temperaturaMediaURL = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json?';

// Função para buscar os dados de temperatura média
async function buscarTemperaturaMedia(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados de temperatura média.');
        }
        const data = await response.json();
        return data; // Supondo que os dados já sejam um valor numérico
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Função para calcular a evapotranspiração utilizando o método de Blaney-Criddle
function calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao) {
    // Fórmula para o método de Blaney-Criddle
    const evapotranspiracao = ((temperaturaMedia * 0.46) + 8.13) * precipitacao;
    return evapotranspiracao;
}

// Função para aplicar a regra ao selecionar uma região
function aplicarRegra(regiao) {
    const regioes = {
        "Região Metropolitana": 0.41,
        "Litoral Sul": 0.4375,
        "Norte": 0.458,
        "Serrana": 0.458,
        "Central": 0.458
    };

    if (regiao in regioes) {
        precipitacao.valor = regioes[regiao];
        document.getElementById('dropdownRegioes').textContent = `Região Selecionada: ${regiao}`;

        // Armazena a região selecionada no localStorage
        localStorage.setItem('regiaoSelecionada', regiao);
    } else {
        console.error(`Região '${regiao}' não encontrada.`);
    }
}