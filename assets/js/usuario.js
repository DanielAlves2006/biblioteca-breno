document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Flatpickr
    flatpickr("#data", {
        dateFormat: "Y-m-d",
        minDate: "today",
        enableTime: false
    });

    // Carregar espaços
    carregarEspacos();

    // Modal de agendamento
    const modal = new bootstrap.Modal(document.getElementById('modalAgendamento'));

    // Evento para abrir modal de agendamento
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-agendar')) {
            const espacoId = e.target.dataset.espacoId;
            document.getElementById('espaco_id').value = espacoId;
            modal.show();
        }
    });

    // Formulário de agendamento
    const formAgendamento = document.getElementById('formAgendamento');
    formAgendamento.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(formAgendamento);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        try {
            const response = await fetch('api/reservas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showSuccessMessage('Agendamento realizado com sucesso!');
                modal.hide();
                formAgendamento.reset();
                carregarEspacos(); // Atualiza a lista de espaços
            } else {
                showErrorMessage(result.message || 'Erro ao agendar');
            }
        } catch (error) {
            showErrorMessage('Erro ao agendar');
        }
    });

    // Funções auxiliares
    async function carregarEspacos() {
        try {
            const response = await fetch('api/reservas.php?espacos=true');
            const data = await response.json();
            
            if (data.success) {
                const container = document.getElementById('espacos-container');
                container.innerHTML = data.espacos.map(espaco => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${espaco.nome}</h5>
                            <p class="card-text">${espaco.descricao}</p>
                            <button class="btn btn-primary btn-agendar" data-espaco-id="${espaco.id}">
                                Agendar
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Erro ao carregar espaços:', error);
            showErrorMessage('Erro ao carregar espaços');
        }
    }

    function showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
    }

    function showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
    }
});
