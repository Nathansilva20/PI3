async function buscarTemperaturaMedia(temperaturaMediaURL) {
    try {
        const response = await fetch(temperaturaMediaURL);
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

const temperaturaMediaURL = 'https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json?'; 

const precipitacao = 7.8; 

function calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao) {
    // Formula Metodo Blaney-Criddle
    return ((temperaturaMedia * 0.46) + 8.13) * precipitacao;
}

document.addEventListener("DOMContentLoaded", async function() {
    const temperaturaMedia = await buscarTemperaturaMedia(temperaturaMediaURL);
    if (temperaturaMedia !== null) {
        const evapotranspiracao = calcularEvapotranspiracaoBlaneyCriddle(temperaturaMedia, precipitacao);
        const evp = document.getElementById("card-body");
        evp.textContent = evapotranspiracao.toFixed(2); // Rounding to 2 decimal places
    } else {
        console.error('Não foi possível obter os dados de temperatura média.');
    }
});