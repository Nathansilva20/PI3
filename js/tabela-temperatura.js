document.addEventListener('DOMContentLoaded', function() {
    fetch('https://fertirrigacao-0324-default-rtdb.firebaseio.com/Fazenda/temperatura.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#temperatureTable tbody');

            // Verifica se há dados retornados
            if (!data) {
                console.error('Nenhum dado encontrado.');
                return;
            }

            Object.keys(data).forEach(key => {
                const row = document.createElement('tr');
                const dateCell = document.createElement('td');
                const tempCell = document.createElement('td');

                // Verifica se a chave é um timestamp válido
                const timestamp = parseInt(key);
                if (isNaN(timestamp)) {
                    console.error('Chave inválida:', key);
                    return;
                }

                dateCell.textContent = new Date(timestamp).toLocaleString();
                tempCell.textContent = data[key];

                row.appendChild(dateCell);
                row.appendChild(tempCell);
                tableBody.appendChild(row);
            });

            // Inicializa a tabela como DataTable usando simple-datatables
            new simpleDatatables.DataTable('#temperatureTable');
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});
